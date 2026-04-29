import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    CircularProgress,
} from '@mui/material';
import AppFormField from '../../common/fromField.jsx';

/**
 * GroupDialog Component
 * Dialog for creating or editing an Access Group
 */
const GroupDialog = ({
    open,
    onClose,
    formData,
    onChange,
    onSubmit,
    loading,
    isEditMode,
}) => {
    const handleFieldChange = (field) => (e) => {
        onChange({
            ...formData,
            [field]: e.target.value,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditMode ? 'Edit Access Group' : 'Create New Access Group'}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <AppFormField
                        fullWidth
                        title="Group Name"
                        value={formData.groupName}
                        onChange={handleFieldChange('groupName')}
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    disabled={loading || !formData.groupName.trim()}
                >
                    {loading ? <CircularProgress size={22} /> : (isEditMode ? 'Update Group' : 'Create Group')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GroupDialog;
