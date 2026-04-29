import React from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import AppFormField from '../../../common/fromField.jsx';
import AppButton from '../../../common/AppButton.jsx';

const DesignationDialog = ({
    open,
    editMode,
    formData,
    loading,
    handleClose,
    handleSubmit,
    handleInputChange
}) => {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{editMode ? 'Update Designation' : 'Add Designation'}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    <AppFormField
                        title="Designation Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        sx={{ mb: 2 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <AppButton onClick={handleClose} disabled={loading} label="Cancel" />
                <AppButton
                    onClick={handleSubmit}
                    disabled={loading}
                    label={loading ? <CircularProgress
                        size={24} /> : editMode ? 'Update Designation' : 'Add Designation'}
                />
            </DialogActions>
        </Dialog>
    );
};

export default DesignationDialog;
