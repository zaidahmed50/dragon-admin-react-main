import React from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import AppFormField from '../../../common/fromField.jsx';
import AppButton from '../../../common/AppButton.jsx';

const ProfileDialog = ({
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
            <DialogTitle>{editMode ? 'Update Profile' : 'Add Profile'}</DialogTitle>
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
                        title="Data (MB)"
                        name="dataInMb"
                        value={formData.dataInMb}
                        onChange={handleInputChange}
                        required
                    />

                    <AppFormField
                        title="Download Speed"
                        name="dSpeed"
                        value={formData.dSpeed}
                        onChange={handleInputChange}
                        required
                    />

                    <AppFormField
                        title="Upload Speed"
                        name="uSpeed"
                        value={formData.uSpeed}
                        onChange={handleInputChange}
                        required
                    />

                    <AppFormField
                        title="Unit Price"
                        name="unitPrice"
                        value={formData.unitPrice}
                        onChange={handleInputChange}
                        required
                        type="number"
                    />

                    <AppFormField
                        title="Download Rate"
                        name="downloadRate"
                        value={formData.downloadRate}
                        onChange={handleInputChange}
                        required
                        type="number"
                    />

                    <AppFormField
                        title="Upload Rate"
                        name="uploadRate"
                        value={formData.uploadRate}
                        onChange={handleInputChange}
                        required
                        type="number"
                    />

                    <AppFormField
                        title="Profile Type"
                        name="types"
                        value={formData.types}
                        onChange={handleInputChange}
                        required
                        readOnly
                    />

                    <AppFormField
                        title="Description"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        required
                        multiline
                        rows={2}
                    />

                    <AppFormField
                        title="VAT"
                        name="valueAddedTax_VAT"
                        value={formData.valueAddedTax_VAT}
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
                    label={loading ? <CircularProgress size={24} /> : editMode ? 'Update Profile' : '+ Add Profile'}
                />
            </DialogActions>
        </Dialog>
    );
};

export default ProfileDialog;
