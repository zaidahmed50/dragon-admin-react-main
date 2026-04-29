import {useEffect} from 'react';
import {Box, Grid, Snackbar, Alert, CircularProgress} from '@mui/material';
import AppFormField from '../../common/fromField';
import AppButton from '../../common/AppButton';
import useSubAdminForm from '../../hooks/useSubAdminForm';
import AppDropDownField from '../../common/dropdownField';

const SubAdminCreate = ({onSuccess, editData}) => {
    const {
        formData,
        accessGroups,
        loading,
        submitSuccess,
        submitError,
        validationError,
        handleInputChange,
        resetForm,
        setSubmitSuccess,
        setSubmitError,
        setValidationError,
        setFormData,
        submitForm,
    } = useSubAdminForm();

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name,
                email: editData.email,
                password: '',
                accessGroupId: editData.accessGroup?.id || '',
            });
        } else {
            resetForm();
        }
    }, [editData, setFormData, resetForm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        submitForm(editData, onSuccess);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{p: 2}}>
            <Snackbar
                open={submitSuccess}
                autoHideDuration={6000}
                onClose={() => setSubmitSuccess(false)}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <Alert severity="success" onClose={() => setSubmitSuccess(false)}>
                    Sub-admin {editData ? 'updated' : 'registered'} successfully!
                </Alert>
            </Snackbar>
            <Snackbar
                open={!!validationError}
                autoHideDuration={6000}
                onClose={() => setValidationError(null)}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <Alert severity="warning" onClose={() => setValidationError(null)}>
                    {validationError}
                </Alert>
            </Snackbar>
            <Snackbar
                open={!!submitError}
                autoHideDuration={6000}
                onClose={() => setSubmitError(null)}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <Alert severity="error" onClose={() => setSubmitError(null)}>
                    {submitError}
                </Alert>
            </Snackbar>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <AppFormField
                        title="Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <AppFormField
                        title="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        disabled={!!editData}
                    />
                </Grid>
                <Grid item xs={12}>
                    <AppFormField
                        title="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required={!editData}
                    />
                </Grid>
                <Grid item xs={12}>
                    <AppDropDownField
                        title="Access Group"
                        options={accessGroups}
                        value={formData.accessGroupId}
                        onChange={(e) => handleInputChange('accessGroupId', e.target.value)}
                        required
                    />
                </Grid>
            </Grid>

            <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2}}>
                <AppButton
                    label="Reset"
                    type="button"
                    onClick={resetForm}
                    disabled={loading}
                    color="red"
                />
                <AppButton
                    label={loading ? <CircularProgress size={20} color="inherit"/> : (editData ? 'Update Sub-Admin' : 'Save Sub-Admin')}
                    type="submit"
                    disabled={loading}
                />
            </Box>
        </Box>
    );
};

export default SubAdminCreate;
