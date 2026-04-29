import React from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    CircularProgress,
} from '@mui/material';
import AppFormField from "../../../common/fromField.jsx";
import AppDropDownField from "../../../common/dropdownField.jsx";

const FIELD_HEIGHT = 56;

const fields = [
    { label: 'Username', name: 'username', type: 'text', required: true },
    { label: 'Password', name: 'password', type: 'password', required: true },
    { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: true },
    { label: 'First Name', name: 'firstname', type: 'text', required: true },
    { label: 'Last Name', name: 'lastname', type: 'text', required: true },
    { label: 'Company', name: 'company', type: 'text', required: true },
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Phone', name: 'phone', type: 'text', required: true },
    { label: 'City', name: 'city', type: 'text', required: true },
    { label: 'Address', name: 'address', type: 'text', required: true },
    { label: 'Notes', name: 'notes', type: 'text', required: false },
    { label: 'Max Users', name: 'maxUsers', type: 'number', required: true },
    { label: 'Debt Limit', name: 'debtLimit', type: 'number', required: true },
    { label: 'Discount Rate', name: 'discountRate', type: 'number', required: true },
];

const AddManagerDialog = ({
    open,
    onClose,
    onSubmit,
    loading,
    formData,
    permissionGroups,
    managers,
    onChange,
}) => (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Manager</DialogTitle>

        <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {fields.map(({ label, name, type, required }) => (
                    <Grid item xs={12} md={6} key={name}>
                        <AppFormField
                            fullWidth
                            title={label}
                            type={type}
                            value={formData[name] ?? ''}
                            onChange={onChange(name)}
                            required={required}
                            InputLabelProps={{ shrink: true }}
                            sx={{ minHeight: FIELD_HEIGHT }}
                        />
                    </Grid>
                ))}

                {/* Status */}
                <Grid item xs={12} md={6}>
                    <AppDropDownField
                        fullWidth
                        title="Status"
                        required
                        value={formData.enabled ?? ''}
                        onChange={onChange('enabled')}
                        options={[
                            { label: 'Active', value: 1 },
                            { label: 'Inactive', value: 0 },
                        ]}
                        sx={{ minHeight: FIELD_HEIGHT }}
                    />
                </Grid>


                {/* ACL Group */}
                <Grid item xs={12} md={6}>
                    <AppDropDownField
                        fullWidth
                        title="ACL Group"
                        required
                        value={formData.aclGroupId ?? ''}
                        InputLabelProps={{ shrink: true }}

                        onChange={onChange('aclGroupId')}
                        options={permissionGroups.map((g) => ({
                            label: g.name,
                            value: g.id,
                        }))}
                        sx={{ minHeight: FIELD_HEIGHT }}
                    />
                </Grid>


                {/* Parent Manager */}
                <Grid item xs={12} md={6}>
                    <AppDropDownField
                        fullWidth
                        title="Parent Manager"
                        required
                        value={formData.parentId ?? ''}
                        onChange={onChange('parentId')}
                        options={managers.map((m) => ({
                            label: `${m.firstname} ${m.lastname}`,
                            value: m.id,
                        }))}
                        sx={{ minHeight: FIELD_HEIGHT }}
                    />
                </Grid>

            </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} variant="outlined">
                Cancel
            </Button>

            <Button
                onClick={onSubmit}
                variant="contained"
                disabled={loading}
                sx={{ minWidth: 150 }}
            >
                {loading ? <CircularProgress size={22} /> : 'Add Manager'}
            </Button>
        </DialogActions>
    </Dialog>
);

export default AddManagerDialog;
