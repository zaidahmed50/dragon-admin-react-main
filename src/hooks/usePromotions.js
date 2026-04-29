import { useState, useEffect } from 'react';
import { PromotionService } from '../services/index.js';

const usePromotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openPromotionDialog, setOpenPromotionDialog] = useState(false);
    const [promotionEditMode, setPromotionEditMode] = useState(false);
    const [currentPromotion, setCurrentPromotion] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [promotionFormData, setPromotionFormData] = useState({
        promotionName: '',
        promotionDescription: '',
        totalMonths: '',
        monthToWave: '',
    });

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [promotionToDelete, setPromotionToDelete] = useState(null);

    // Menu states
    const [promotionAnchorEl, setPromotionAnchorEl] = useState(null);
    const [selectedPromotionForMenu, setSelectedPromotionForMenu] = useState(null);

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const response = await PromotionService.getAllPromotions();
            if (response?.data) {
                setPromotions(response.data);
            }
        } catch (error) {
            console.error('Error fetching promotions:', error);
            setErrorMessage('Failed to load promotions');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPromotionDialog = (promotion = null) => {
        if (promotion) {
            setPromotionEditMode(true);
            setCurrentPromotion(promotion);
            setPromotionFormData({
                promotionName: promotion.promotionName || '',
                promotionDescription: promotion.promotionDescription || '',
                totalMonths: promotion.totalMonths || '',
                monthToWave: promotion.monthToWave || '',
            });
        } else {
            setPromotionEditMode(false);
            setCurrentPromotion(null);
            setPromotionFormData({
                promotionName: '',
                promotionDescription: '',
                totalMonths: '',
                monthToWave: '',
            });
        }
        setOpenPromotionDialog(true);
    };

    const handleClosePromotionDialog = () => {
        setOpenPromotionDialog(false);
        setPromotionEditMode(false);
        setCurrentPromotion(null);
        setPromotionFormData({
            promotionName: '',
            promotionDescription: '',
            totalMonths: '',
            monthToWave: '',
        });
    };

    const handlePromotionInputChange = (e) => {
        const { name, value } = e.target;
        setPromotionFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePromotionSubmit = async () => {
        if (!promotionFormData.promotionName.trim()) {
            setErrorMessage('Name is required');
            return;
        }

        if (!promotionFormData.promotionDescription.trim()) {
            setErrorMessage('Details are required');
            return;
        }

        if (!promotionFormData.totalMonths.trim()) {
            setErrorMessage('Total months are required');
            return;
        }

        if (!promotionFormData.monthToWave.trim()) {
            setErrorMessage('Free months are required');
            return;
        }

        setLoading(true);
        try {
            const dataToSubmit = {
                promotionName: promotionFormData.promotionName.trim(),
                promotionDescription: promotionFormData.promotionDescription.trim(),
                totalMonths: promotionFormData.totalMonths.trim(),
                monthToWave: promotionFormData.monthToWave.trim(),
            };

            if (promotionEditMode && currentPromotion) {
                const response = await PromotionService.updatePromotion(currentPromotion.id, dataToSubmit);
                if (response?.data) {
                    setSuccessMessage('Promotion updated successfully');
                    await fetchPromotions();
                    handleClosePromotionDialog();
                }
            } else {
                const response = await PromotionService.addPromotion(dataToSubmit);
                if (response?.data) {
                    setSuccessMessage('Promotion created successfully');
                    await fetchPromotions();
                    handleClosePromotionDialog();
                }
            }
        } catch (error) {
            console.error('Error saving promotion:', error);
            setErrorMessage(error.message || 'Failed to save promotion');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDeleteDialog = (promotion) => {
        setPromotionToDelete(promotion);
        setOpenDeleteDialog(true);
        handlePromotionMenuClose();
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setPromotionToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!promotionToDelete || !promotionToDelete.id) {
            setErrorMessage('Invalid promotion selected for deletion');
            handleCloseDeleteDialog();
            return;
        }

        setLoading(true);
        try {
            await PromotionService.deletePromotion(promotionToDelete.id);
            setSuccessMessage('Promotion deleted successfully');
            await fetchPromotions();
            handleCloseDeleteDialog();
        } catch (error) {
            console.error('Error deleting promotion:', error);
            setErrorMessage('Failed to delete promotion');
        } finally {
            setLoading(false);
        }
    };

    const handlePromotionMenuOpen = (event, promotion) => {
        event.stopPropagation();
        setPromotionAnchorEl(event.currentTarget);
        setSelectedPromotionForMenu(promotion);
    };

    const handlePromotionMenuClose = () => {
        setPromotionAnchorEl(null);
        setSelectedPromotionForMenu(null);
    };

    const handlePromotionEdit = () => {
        if (selectedPromotionForMenu) handleOpenPromotionDialog(selectedPromotionForMenu);
        handlePromotionMenuClose();
    };

    return {
        promotions,
        loading,
        openPromotionDialog,
        promotionEditMode,
        currentPromotion,
        successMessage,
        errorMessage,
        setSuccessMessage,
        setErrorMessage,
        promotionFormData,
        openDeleteDialog,
        promotionToDelete,
        promotionAnchorEl,
        selectedPromotionForMenu,
        handleOpenPromotionDialog,
        handleClosePromotionDialog,
        handlePromotionInputChange,
        handlePromotionSubmit,
        handleOpenDeleteDialog,
        handleCloseDeleteDialog,
        handleConfirmDelete,
        handlePromotionMenuOpen,
        handlePromotionMenuClose,
        handlePromotionEdit
    };
};

export default usePromotions;
