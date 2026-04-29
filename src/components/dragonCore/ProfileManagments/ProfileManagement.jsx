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
import useProfileManagement from '../../../hooks/useProfileManagement';
import ProfileList from './ProfileList';
import ProfileDialog from './ProfileDialog';
import DeleteDialog from './DeleteDialog';

const ProfileManagement = () => {
    const {
        profiles,
        loading,
        openProfileDialog,
        profileEditMode,
        currentProfile,
        successMessage,
        errorMessage,
        setSuccessMessage,
        setErrorMessage,
        profileFormData,
        openDeleteDialog,
        profileToDelete,
        profileAnchorEl,
        selectedProfileForMenu,
        handleOpenProfileDialog,
        handleCloseProfileDialog,
        handleProfileInputChange,
        handleProfileSubmit,
        handleOpenDeleteDialog,
        handleCloseDeleteDialog,
        handleConfirmDelete,
        handleProfileMenuOpen,
        handleProfileMenuClose,
        handleProfileEdit
    } = useProfileManagement();

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h5" fontWeight={600} color="#111827">
                    Profiles
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<FiPlus />}
                    onClick={() => handleOpenProfileDialog()}
                    disabled={loading}
                    sx={{
                        bgcolor: '#ff9800',
                        '&:hover': { bgcolor: '#f57c00' },
                        textTransform: 'none',
                    }}
                >
                    + Add Profile
                </Button>
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

            <ProfileList
                loading={loading}
                profiles={profiles}
                handleProfileMenuOpen={handleProfileMenuOpen}
            />

            <Menu
                anchorEl={profileAnchorEl}
                open={Boolean(profileAnchorEl)}
                onClose={handleProfileMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleProfileEdit}>
                    <FiEdit2 style={{ marginRight: 8 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => handleOpenDeleteDialog(selectedProfileForMenu)}>
                    <FiTrash2 style={{ marginRight: 8, color: '#f44336' }} /> Delete
                </MenuItem>
            </Menu>

            <DeleteDialog
                open={openDeleteDialog}
                itemToDelete={profileToDelete}
                loading={loading}
                handleClose={handleCloseDeleteDialog}
                handleConfirmDelete={handleConfirmDelete}
            />

            <ProfileDialog
                open={openProfileDialog}
                editMode={profileEditMode}
                formData={profileFormData}
                loading={loading}
                handleClose={handleCloseProfileDialog}
                handleSubmit={handleProfileSubmit}
                handleInputChange={handleProfileInputChange}
            />
        </Box>
    );
};

export default ProfileManagement;
