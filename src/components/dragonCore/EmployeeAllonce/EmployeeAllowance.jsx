import React from 'react';
import {
    Box,
    Typography,
    Button,
    Alert,
    Snackbar,
    MenuItem,
    Menu,
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import useEmployeeAllowance from '../../../hooks/useEmployeeAllowance';
import AllowanceList from './AllowanceList';
import AllowanceDialog from './AllowanceDialog';
import DeleteDialog from './DeleteDialog';
import AppButton from "../../../common/AppButton.jsx";

const EmployeeAllowance = () => {
    const {
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
    } = useEmployeeAllowance();

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h5" fontWeight={600} color="#111827">
                    Allowance
                </Typography>
                <AppButton
                    variant="contained"
                    startIcon={<FiPlus />}
                    onClick={() => handleOpenAllowanceDialog()}
                    disabled={loading}
                    label={"Add Allowance"}
                >

                </AppButton>
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

            <AllowanceList
                loading={loading}
                allowances={allowances}
                handleAllowanceMenuOpen={handleAllowanceMenuOpen}
            />

            <Menu
                anchorEl={allowanceAnchorEl}
                open={Boolean(allowanceAnchorEl)}
                onClose={handleAllowanceMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleAllowanceEdit}>
                    <FiEdit2 style={{ marginRight: 8 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => handleOpenDeleteDialog(selectedAllowanceForMenu)}>
                    <FiTrash2 style={{ marginRight: 8, color: '#f44336' }} /> Delete
                </MenuItem>
            </Menu>

            <DeleteDialog
                open={openDeleteDialog}
                itemToDelete={allowanceToDelete}
                loading={loading}
                handleClose={handleCloseDeleteDialog}
                handleConfirm={handleConfirmDelete}
            />

            <AllowanceDialog
                open={openAllowanceDialog}
                editMode={allowanceEditMode}
                formData={allowanceFormData}
                loading={loading}
                handleClose={handleCloseAllowanceDialog}
                handleSubmit={handleAllowanceSubmit}
                handleInputChange={handleAllowanceInputChange}
            />
        </Box>
    );
};

export default EmployeeAllowance;
