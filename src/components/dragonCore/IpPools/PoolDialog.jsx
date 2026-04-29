import React from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import AppFormField from '../../../common/fromField.jsx';
import AppButton from '../../../common/AppButton.jsx';

const PoolDialog = ({
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
            <DialogTitle>{editMode ? 'Update Pool' : 'Add Pool'}</DialogTitle>
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
                        title="Lease Time"
                        name="leaseTime"
                        value={formData.leaseTime}
                        onChange={handleInputChange}
                        required
                    />
                    <AppFormField
                        title="IP Address"
                        name="ipAddress"
                        value={formData.ipAddress}
                        onChange={handleInputChange}
                        required
                    />
                    <AppFormField
                        title="Start IP"
                        name="startIp"
                        value={formData.startIp}
                        onChange={handleInputChange}
                        required
                    />
                    <AppFormField
                        title="End IP"
                        name="endIp"
                        value={formData.endIp}
                        onChange={handleInputChange}
                        required
                    />
                    <AppFormField
                        title="IP Cutting"
                        name="ipCutting"
                        value={formData.ipCutting}
                        onChange={handleInputChange}
                        required
                        type="number"
                    />
                    <AppFormField
                        title="IP Status ID"
                        name="ipStatusId"
                        value={formData.ipStatusId}
                        onChange={handleInputChange}
                        required
                        type="number"
                    />
                    <AppFormField
                        title="IP Description"
                        name="ipDescription"
                        value={formData.ipDescription}
                        onChange={handleInputChange}
                        required
                        multiline
                        rows={2}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <AppButton onClick={handleClose} disabled={loading} label="Cancel" />
                <AppButton
                    onClick={handleSubmit}
                    disabled={loading}
                    label={loading ? <CircularProgress size={24} /> : editMode ? 'Update' : 'Create IP Pool'}
                />
            </DialogActions>
        </Dialog>
    );
};

export default PoolDialog;
