import { useState, useEffect } from 'react';
import { AllowanceService } from '../services/index.js';

const useEmployeeAllowance = () => {
    const [allowances, setAllowances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openAllowanceDialog, setOpenAllowanceDialog] = useState(false);
    const [allowanceEditMode, setAllowanceEditMode] = useState(false);
    const [currentAllowance, setCurrentAllowance] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [allowanceFormData, setAllowanceFormData] = useState({
        name: '',
        details: '',
        allowanceAmount: '',
    });

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [allowanceToDelete, setAllowanceToDelete] = useState(null);

    // Menu states
    const [allowanceAnchorEl, setAllowanceAnchorEl] = useState(null);
    const [selectedAllowanceForMenu, setSelectedAllowanceForMenu] = useState(null);

    useEffect(() => {
        fetchAllowances();
    }, []);

    const fetchAllowances = async () => {
        setLoading(true);
        try {
            const response = await AllowanceService.getAllAllowances();
            if (response?.data) {
                setAllowances(response.data);
            }
        } catch (error) {
            console.error('Error fetching allowances:', error);
            setErrorMessage('Failed to load allowances');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAllowanceDialog = (allowance = null) => {
        if (allowance) {
            setAllowanceEditMode(true);
            setCurrentAllowance(allowance);
            setAllowanceFormData({
                name: allowance.name || '',
                details: allowance.details || '',
                allowanceAmount: allowance.allowanceAmount?.toString() || '',
            });
        } else {
            setAllowanceEditMode(false);
            setCurrentAllowance(null);
            setAllowanceFormData({
                name: '',
                details: '',
                allowanceAmount: '',
            });
        }
        setOpenAllowanceDialog(true);
    };

    const handleCloseAllowanceDialog = () => {
        setOpenAllowanceDialog(false);
        setAllowanceEditMode(false);
        setCurrentAllowance(null);
        setAllowanceFormData({
            name: '',
            details: '',
            allowanceAmount: '',
        });
    };

    const handleAllowanceInputChange = (e) => {
        const { name, value } = e.target;
        setAllowanceFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAllowanceSubmit = async () => {
        if (!allowanceFormData.name.trim()) {
            setErrorMessage('Name is required');
            return;
        }

        if (!allowanceFormData.details.trim()) {
            setErrorMessage('Details are required');
            return;
        }

        if (!allowanceFormData.allowanceAmount.trim()) {
            setErrorMessage('Allowance amount is required');
            return;
        }

        setLoading(true);
        try {
            const dataToSubmit = {
                name: allowanceFormData.name.trim(),
                details: allowanceFormData.details.trim(),
                allowanceAmount: allowanceFormData.allowanceAmount.trim(),
            };

            if (allowanceEditMode && currentAllowance) {
                const response = await AllowanceService.updateAllowance(currentAllowance.id, dataToSubmit);
                if (response?.data) {
                    setSuccessMessage('Allowance updated successfully');
                    await fetchAllowances();
                    handleCloseAllowanceDialog();
                }
            } else {
                const response = await AllowanceService.addAllowance(dataToSubmit);
                if (response?.data) {
                    setSuccessMessage('Allowance created successfully');
                    await fetchAllowances();
                    handleCloseAllowanceDialog();
                }
            }
        } catch (error) {
            console.error('Error saving allowance:', error);
            setErrorMessage(error.message || 'Failed to save allowance');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDeleteDialog = (allowance) => {
        setAllowanceToDelete(allowance);
        setOpenDeleteDialog(true);
        handleAllowanceMenuClose();
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setAllowanceToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!allowanceToDelete || !allowanceToDelete.id) {
            setErrorMessage('Invalid allowance selected for deletion');
            handleCloseDeleteDialog();
            return;
        }

        setLoading(true);
        try {
            await AllowanceService.deleteAllowance(allowanceToDelete.id);
            setSuccessMessage('Allowance deleted successfully');
            await fetchAllowances();
            handleCloseDeleteDialog();
        } catch (error) {
            console.error('Error deleting allowance:', error);
            setErrorMessage('Failed to delete allowance');
        } finally {
            setLoading(false);
        }
    };

    const handleAllowanceMenuOpen = (event, allowance) => {
        event.stopPropagation();
        setAllowanceAnchorEl(event.currentTarget);
        setSelectedAllowanceForMenu(allowance);
    };

    const handleAllowanceMenuClose = () => {
        setAllowanceAnchorEl(null);
        setSelectedAllowanceForMenu(null);
    };

    const handleAllowanceEdit = () => {
        if (selectedAllowanceForMenu) handleOpenAllowanceDialog(selectedAllowanceForMenu);
        handleAllowanceMenuClose();
    };

    return {
        allowances,
        loading,
        openAllowanceDialog,
        allowanceEditMode,
        currentAllowance,
        successMessage,
        errorMessage,
        setSuccessMessage,
        setErrorMessage,
        allowanceFormData,
        openDeleteDialog,
        allowanceToDelete,
        allowanceAnchorEl,
        selectedAllowanceForMenu,
        handleOpenAllowanceDialog,
        handleCloseAllowanceDialog,
        handleAllowanceInputChange,
        handleAllowanceSubmit,
        handleOpenDeleteDialog,
        handleCloseDeleteDialog,
        handleConfirmDelete,
        handleAllowanceMenuOpen,
        handleAllowanceMenuClose,
        handleAllowanceEdit
    };
};

export default useEmployeeAllowance;
