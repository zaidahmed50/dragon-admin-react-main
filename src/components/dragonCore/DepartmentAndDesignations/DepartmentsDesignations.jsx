import React from 'react';
import {
    Box,
    Typography,
    Alert,
    Snackbar,
    MenuItem,
    Menu,
} from '@mui/material';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import useDepartmentDesignation from '../../../hooks/useDepartmentDesignation';
import DepartmentList from './DepartmentList';
import DesignationList from './DesignationList';
import DepartmentDialog from './DepartmentDialog';
import DesignationDialog from './DesignationDialog';
import DeleteDialog from './DeleteDialog';

const DepartmentsDesignations = () => {
    const {
        departments,
        filteredDepartments,
        filteredDesignations,
        selectedDepartment,
        selectedDesignation,
        loading,
        designationLoading,
        openDepartmentDialog,
        openDesignationDialog,
        departmentEditMode,
        designationEditMode,
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
    } = useDepartmentDesignation();

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h5" fontWeight={600} color="text.primary">
                    View Departments & Designations
                </Typography>
            </Box>

            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="success" onClose={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="error" onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            <Box
                height="75vh"
                display="flex"
                border={1}
                borderColor="divider"
                borderRadius={3}
                bgcolor="background.paper"
                overflow="hidden"
            >
                <DepartmentList
                    loading={loading}
                    departments={departments}
                    filteredDepartments={filteredDepartments}
                    selectedDepartment={selectedDepartment}
                    departmentSearch={departmentSearch}
                    setDepartmentSearch={setDepartmentSearch}
                    handleDepartmentClick={handleDepartmentClick}
                    handleOpenDepartmentDialog={handleOpenDepartmentDialog}
                    handleDepartmentMenuOpen={handleDepartmentMenuOpen}
                />

                <DesignationList
                    designationLoading={designationLoading}
                    filteredDesignations={filteredDesignations}
                    selectedDepartment={selectedDepartment}
                    selectedDesignation={selectedDesignation}
                    designationSearch={designationSearch}
                    setDesignationSearch={setDesignationSearch}
                    handleDesignationClick={handleDesignationClick}
                    handleOpenDesignationDialog={handleOpenDesignationDialog}
                    handleDesignationMenuOpen={handleDesignationMenuOpen}
                />
            </Box>

            <Menu
                anchorEl={departmentAnchorEl}
                open={Boolean(departmentAnchorEl)}
                onClose={handleDepartmentMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleDepartmentEdit}>
                    <FiEdit2 style={{ marginRight: 8 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => handleOpenDeleteDialog(selectedDeptForMenu, 'department')}>
                    <FiTrash2 style={{ marginRight: 8, color: '#f44336' }} /> Delete
                </MenuItem>
            </Menu>

            <Menu
                anchorEl={designationAnchorEl}
                open={Boolean(designationAnchorEl)}
                onClose={handleDesignationMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleDesignationEdit}>
                    <FiEdit2 style={{ marginRight: 8 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => handleOpenDeleteDialog(selectedDesigForMenu, 'designation')}>
                    <FiTrash2 style={{ marginRight: 8, color: '#f44336' }} /> Delete
                </MenuItem>
            </Menu>

            <DeleteDialog
                open={openDeleteDialog}
                itemToDelete={itemToDelete}
                deleteType={deleteType}
                loading={loading || designationLoading}
                handleClose={handleCloseDeleteDialog}
                handleConfirm={handleConfirmDelete}
            />

            <DepartmentDialog
                open={openDepartmentDialog}
                editMode={departmentEditMode}
                formData={departmentFormData}
                loading={loading}
                handleClose={handleCloseDepartmentDialog}
                handleSubmit={handleDepartmentSubmit}
                handleInputChange={handleDepartmentInputChange}
            />

            <DesignationDialog
                open={openDesignationDialog}
                editMode={designationEditMode}
                formData={designationFormData}
                loading={designationLoading}
                handleClose={handleCloseDesignationDialog}
                handleSubmit={handleDesignationSubmit}
                handleInputChange={handleDesignationInputChange}
            />
        </Box>
    );
};

export default DepartmentsDesignations;
