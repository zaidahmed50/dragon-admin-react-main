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
import usePromotions from '../../../hooks/usePromotions';
import PromotionsList from './PromotionsList';
import PromotionDialog from './PromotionDialog';
import DeleteDialog from './DeleteDialog';
import AppButton from "../../../common/AppButton.jsx";

const Promotions = () => {
    const {
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
    } = usePromotions();

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h5" fontWeight={600} color="#111827">
                    Promotions
                </Typography>
                <AppButton
                    variant="contained"
                    startIcon={<FiPlus />}
                    onClick={() => handleOpenPromotionDialog()}
                    disabled={loading}
                    label={"Add Promotion"}
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

            <PromotionsList
                loading={loading}
                promotions={promotions}
                handlePromotionMenuOpen={handlePromotionMenuOpen}
            />

            <Menu
                anchorEl={promotionAnchorEl}
                open={Boolean(promotionAnchorEl)}
                onClose={handlePromotionMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handlePromotionEdit}>
                    <FiEdit2 style={{ marginRight: 8 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => handleOpenDeleteDialog(selectedPromotionForMenu)}>
                    <FiTrash2 style={{ marginRight: 8, color: '#f44336' }} /> Delete
                </MenuItem>
            </Menu>

            <DeleteDialog
                open={openDeleteDialog}
                itemToDelete={promotionToDelete}
                loading={loading}
                handleClose={handleCloseDeleteDialog}
                handleConfirmDelete={handleConfirmDelete}
            />

            <PromotionDialog
                open={openPromotionDialog}
                editMode={promotionEditMode}
                formData={promotionFormData}
                loading={loading}
                handleClose={handleClosePromotionDialog}
                handleSubmit={handlePromotionSubmit}
                handleInputChange={handlePromotionInputChange}
            />
        </Box>
    );
};

export default Promotions;
