import { useState, useEffect } from 'react';
import { DepartmentDesignationService } from '../services/index.js';

const useDepartmentDesignation = () => {
    const [departments, setDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [filteredDesignations, setFilteredDesignations] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDesignation, setSelectedDesignation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [designationLoading, setDesignationLoading] = useState(false);
    const [openDepartmentDialog, setOpenDepartmentDialog] = useState(false);
    const [openDesignationDialog, setOpenDesignationDialog] = useState(false);
    const [departmentEditMode, setDepartmentEditMode] = useState(false);
    const [designationEditMode, setDesignationEditMode] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState(null);
    const [currentDesignation, setCurrentDesignation] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [departmentSearch, setDepartmentSearch] = useState('');
    const [designationSearch, setDesignationSearch] = useState('');

    const [departmentFormData, setDepartmentFormData] = useState({
        name: '',
    });

    const [designationFormData, setDesignationFormData] = useState({
        name: '',
    });

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState('');

    // Menu states
    const [departmentAnchorEl, setDepartmentAnchorEl] = useState(null);
    const [selectedDeptForMenu, setSelectedDeptForMenu] = useState(null);
    const [designationAnchorEl, setDesignationAnchorEl] = useState(null);
    const [selectedDesigForMenu, setSelectedDesigForMenu] = useState(null);

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (departmentSearch.trim() === '') {
            setFilteredDepartments(departments);
        } else {
            const filtered = departments.filter(dept =>
                dept.name?.toLowerCase().includes(departmentSearch.toLowerCase())
            );
            setFilteredDepartments(filtered);
        }
    }, [departmentSearch, departments]);

    useEffect(() => {
        if (designationSearch.trim() === '') {
            setFilteredDesignations(designations);
        } else {
            const filtered = designations.filter(desig =>
                desig.name?.toLowerCase().includes(designationSearch.toLowerCase())
            );
            setFilteredDesignations(filtered);
        }
    }, [designationSearch, designations]);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const response = await DepartmentDesignationService.getDepartments();
            if (response?.data) {
                setDepartments(response.data);
                setFilteredDepartments(response.data);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
            setErrorMessage('Failed to load departments');
        } finally {
            setLoading(false);
        }
    };

    const fetchDesignationsByDepartment = async (departmentId) => {
        setDesignationLoading(true);
        try {
            const response = await DepartmentDesignationService.getDesignationsByDepartment(departmentId);
            if (response?.data) {
                setDesignations(response.data);
                setFilteredDesignations(response.data);
            } else {
                setDesignations([]);
                setFilteredDesignations([]);
            }
        } catch (error) {
            console.error('Error fetching designations:', error);
            setErrorMessage('Failed to load designations');
            setDesignations([]);
            setFilteredDesignations([]);
        } finally {
            setDesignationLoading(false);
        }
    };

    const handleDepartmentClick = (dept) => {
        setSelectedDepartment(dept);
        setSelectedDesignation(null);
        setDesignationSearch('');
        fetchDesignationsByDepartment(dept.id);
    };

    const handleDesignationClick = (desig) => {
        setSelectedDesignation(desig);
    };

    const handleOpenDepartmentDialog = (dept = false) => {
        if (dept) {
            setDepartmentEditMode(true);
            setCurrentDepartment(dept);
            setDepartmentFormData({
                name: dept.name || '',
            });
        } else {
            setDepartmentEditMode(false);
            setCurrentDepartment(null);
            setDepartmentFormData({
                name: ''
            });
        }
        setOpenDepartmentDialog(true);
    };

    const handleCloseDepartmentDialog = () => {
        setOpenDepartmentDialog(false);
        setDepartmentEditMode(false);
        setCurrentDepartment(null);
        setDepartmentFormData({
            name: '',
        });
    };

    const handleOpenDesignationDialog = (desig = null) => {
        if (desig) {
            setDesignationEditMode(true);
            setCurrentDesignation(desig);
            setDesignationFormData({
                name: desig.name || '',
            });
        } else {
            setDesignationEditMode(false);
            setCurrentDesignation(null);
            setDesignationFormData({
                name: '',
            });
        }
        setOpenDesignationDialog(true);
    };

    const handleCloseDesignationDialog = () => {
        setOpenDesignationDialog(false);
        setDesignationEditMode(false);
        setCurrentDesignation(null);
        setDesignationFormData({
            name: '',
        });
    };

    const handleDepartmentInputChange = (e) => {
        const { name, value } = e.target;
        setDepartmentFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDesignationInputChange = (e) => {
        const { name, value } = e.target;
        setDesignationFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDepartmentSubmit = async () => {
        if (!departmentFormData.name.trim()) {
            setErrorMessage('Department name is required');
            return;
        }
        setLoading(true);
        try {
            const dataToSubmit = {
                name: departmentFormData.name.trim(),
            };

            if (departmentEditMode && currentDepartment) {
                const response = await DepartmentDesignationService.updateDepartment(currentDepartment.id, dataToSubmit);
                if (response?.data) {
                    setSuccessMessage('Department updated successfully');
                    await fetchDepartments();
                    handleCloseDepartmentDialog();
                    if (selectedDepartment?.id === currentDepartment.id) {
                        const updatedDept = departments.find(d => d.id === currentDepartment.id);
                        if (updatedDept) {
                            setSelectedDepartment({ ...updatedDept, ...dataToSubmit });
                        }
                    }
                }
            } else {
                const response = await DepartmentDesignationService.addDepartment(dataToSubmit);
                if (response?.data) {
                    setSuccessMessage('Department created successfully');
                    await fetchDepartments();
                    handleCloseDepartmentDialog();
                }
            }
        } catch (error) {
            console.error('Error saving department:', error);
            setErrorMessage(error.message || 'Failed to save department');
        } finally {
            setLoading(false);
        }
    };

    const handleDesignationSubmit = async () => {
        if (!designationFormData.name.trim()) {
            setErrorMessage('Designation name is required');
            return;
        }

        if (!selectedDepartment) {
            setErrorMessage('Please select a department first');
            return;
        }

        setDesignationLoading(true);
        try {
            const dataToSend = {
                name: designationFormData.name.trim(),
                departmentId: selectedDepartment.id.toString(),
            };

            if (designationEditMode && currentDesignation) {
                const response = await DepartmentDesignationService.updateDesignation(currentDesignation.id, dataToSend);
                if (response?.data) {
                    setSuccessMessage('Designation updated successfully');
                    await fetchDesignationsByDepartment(selectedDepartment.id);
                    handleCloseDesignationDialog();
                }
            } else {
                const response = await DepartmentDesignationService.addDesignation(dataToSend);
                if (response?.data) {
                    setSuccessMessage('Designation created successfully');
                    await fetchDesignationsByDepartment(selectedDepartment.id);
                    handleCloseDesignationDialog();
                }
            }
        } catch (error) {
            console.error('Error saving designation:', error);
            setErrorMessage(error.message || 'Failed to save designation');
        } finally {
            setDesignationLoading(false);
        }
    };

    const handleOpenDeleteDialog = (item, type) => {
        setItemToDelete(item);
        setDeleteType(type);
        setOpenDeleteDialog(true);
        handleDepartmentMenuClose();
        handleDesignationMenuClose();
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setItemToDelete(null);
        setDeleteType('');
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete || !itemToDelete.id) {
            setErrorMessage('Invalid item selected for deletion');
            handleCloseDeleteDialog();
            return;
        }

        if (deleteType === 'department') {
            setLoading(true);
        } else {
            setDesignationLoading(true);
        }

        try {
            let response;
            if (deleteType === 'department') {
                response = await DepartmentDesignationService.deleteDepartment(itemToDelete.id);
            } else {
                response = await DepartmentDesignationService.deleteDesignation(itemToDelete.id);
            }

            setSuccessMessage(`${deleteType === 'department' ? 'Department' : 'Designation'} deleted successfully`);

            if (deleteType === 'department') {
                await fetchDepartments();
                if (selectedDepartment?.id === itemToDelete.id) {
                    setSelectedDepartment(null);
                    setDesignations([]);
                    setFilteredDesignations([]);
                }
            } else {
                await fetchDesignationsByDepartment(selectedDepartment.id);
            }

            handleCloseDeleteDialog();
        } catch (error) {
            console.error(`Error deleting ${deleteType}:`, error);
            setErrorMessage(`Failed to delete ${deleteType}`);
        } finally {
            if (deleteType === 'department') {
                setLoading(false);
            } else {
                setDesignationLoading(false);
            }
        }
    };

    const handleDepartmentMenuOpen = (event, dept) => {
        event.stopPropagation();
        setDepartmentAnchorEl(event.currentTarget);
        setSelectedDeptForMenu(dept);
    };

    const handleDepartmentMenuClose = () => {
        setDepartmentAnchorEl(null);
        setSelectedDeptForMenu(null);
    };

    const handleDepartmentEdit = () => {
        if (selectedDeptForMenu) handleOpenDepartmentDialog(selectedDeptForMenu);
        handleDepartmentMenuClose();
    };

    const handleDesignationMenuOpen = (event, desig) => {
        event.stopPropagation();
        setDesignationAnchorEl(event.currentTarget);
        setSelectedDesigForMenu(desig);
    };

    const handleDesignationMenuClose = () => {
        setDesignationAnchorEl(null);
        setSelectedDesigForMenu(null);
    };

    const handleDesignationEdit = () => {
        if (selectedDesigForMenu) handleOpenDesignationDialog(selectedDesigForMenu);
        handleDesignationMenuClose();
    };

    return {
        departments,
        filteredDepartments,
        designations,
        filteredDesignations,
        selectedDepartment,
        selectedDesignation,
        loading,
        designationLoading,
        openDepartmentDialog,
        openDesignationDialog,
        departmentEditMode,
        designationEditMode,
        currentDepartment,
        currentDesignation,
        successMessage,
        errorMessage,
        setSuccessMessage,
        setErrorMessage,
        departmentSearch,
        setDepartmentSearch,
        designationSearch,
        setDesignationSearch,
        departmentFormData,
        designationFormData,
        openDeleteDialog,
        itemToDelete,
        deleteType,
        departmentAnchorEl,
        selectedDeptForMenu,
        designationAnchorEl,
        selectedDesigForMenu,
        handleDepartmentClick,
        handleDesignationClick,
        handleOpenDepartmentDialog,
        handleCloseDepartmentDialog,
        handleOpenDesignationDialog,
        handleCloseDesignationDialog,
        handleDepartmentInputChange,
        handleDesignationInputChange,
        handleDepartmentSubmit,
        handleDesignationSubmit,
        handleOpenDeleteDialog,
        handleCloseDeleteDialog,
        handleConfirmDelete,
        handleDepartmentMenuOpen,
        handleDepartmentMenuClose,
        handleDepartmentEdit,
        handleDesignationMenuOpen,
        handleDesignationMenuClose,
        handleDesignationEdit
    };
};

export default useDepartmentDesignation;
