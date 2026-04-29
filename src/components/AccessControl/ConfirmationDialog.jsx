import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress
} from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message, loading }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained" autoFocus disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
