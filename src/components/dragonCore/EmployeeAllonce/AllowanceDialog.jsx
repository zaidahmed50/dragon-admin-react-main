import React from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import AppFormField from '../../../common/fromField.jsx';
import AppButton from '../../../common/AppButton.jsx';

const AllowanceDialog = ({
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
            <DialogTitle>{editMode ? 'Update Allowance' : 'Add Allowance'}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    <AppFormField
                        title="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />

                    <AppFormField
                        title="Details"
                        name="details"
                        value={formData.details}
                        onChange={handleInputChange}
                        required
                        multiline
                        rows={3}
                    />

                    <AppFormField
                        title="Allowance Amount"
                        name="allowanceAmount"
                        value={formData.allowanceAmount}
                        onChange={handleInputChange}
                        required
                        type="number"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <AppButton onClick={handleClose} disabled={loading} label="Cancel" />
                <AppButton
                    onClick={handleSubmit}
                    disabled={loading}
                    label={loading ? <CircularProgress size={24} /> : editMode ? 'Update Allowance' : '+ Add Allowance'}
                />
            </DialogActions>
        </Dialog>
    );
};

export default AllowanceDialog;
