import React from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { FiTrash2 } from 'react-icons/fi';
import AppButton from '../../../common/AppButton.jsx';

const DeleteDialog = ({
    open,
    itemToDelete,
    loading,
    handleClose,
    handleConfirm
}) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <FiTrash2 style={{ color: '#f44336' }} />
                    <Typography variant="h6">Confirm Delete</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    Are you sure you want to delete this IP pool?
                </Typography>
                {itemToDelete && (
                    <Box mt={2} p={2} bgcolor="rgba(244, 67, 54, 0.1)" borderRadius={1}>
                        <Typography variant="body2" fontWeight="600" color="error">
                            {itemToDelete.ipAddress}/{itemToDelete.ipCutting}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {itemToDelete.ipDescription || 'No description'}
                        </Typography>
                    </Box>
                )}
                <Typography variant="body2" color="text.secondary" mt={2}>
                    This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions>
                <AppButton
                    onClick={handleClose}
                    disabled={loading}
                    label="Cancel"
                />
                <AppButton
                    onClick={handleConfirm}
                    disabled={loading}
                    label={loading ? <CircularProgress size={20} /> : 'Delete'}
                    color="#f44336"
                />
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
