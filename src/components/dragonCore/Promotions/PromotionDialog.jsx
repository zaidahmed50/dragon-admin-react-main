import React from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import AppFormField from '../../../common/fromField.jsx';
import AppButton from '../../../common/AppButton.jsx';

const PromotionDialog = ({
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
            <DialogTitle>{editMode ? 'Update Promotion' : 'Add Promotion'}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    <AppFormField
                        title="Name"
                        name="promotionName"
                        value={formData.promotionName}
                        onChange={handleInputChange}
                        required
                    />

                    <AppFormField
                        title="Details"
                        name="promotionDescription"
                        value={formData.promotionDescription}
                        onChange={handleInputChange}
                        required
                        multiline
                        rows={3}
                    />

                    <AppFormField
                        title="Total Months"
                        name="totalMonths"
                        value={formData.totalMonths}
                        onChange={handleInputChange}
                        required
                    />

                    <AppFormField
                        title="Free Months"
                        name="monthToWave"
                        value={formData.monthToWave}
                        onChange={handleInputChange}
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <AppButton onClick={handleClose} disabled={loading} label="Cancel" />
                <AppButton
                    onClick={handleSubmit}
                    disabled={loading}
                    label={loading ? <CircularProgress size={24} /> : editMode ? 'Update Promotion' : '+ Add Promotion'}
                />
            </DialogActions>
        </Dialog>
    );
};

export default PromotionDialog;
