import  { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert,
    CircularProgress,
    IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import apiService from '../../../services/apiService';
import { ApiUrls } from '../../../services';

// ---------------- Initial Form Builder ----------------
const buildInitialForm = (manager) => ({
    username: manager?.username || '',
    password: '',
    confirmPassword: '',
    firstname: manager?.firstname || '',
    lastname: manager?.lastname || '',
    company: manager?.company || '',
    email: manager?.email || '',
    phone: manager?.phone || '',
    city: manager?.city || '',
    address: manager?.address || '',
    notes: manager?.notes || '',
    maxUsers: manager?.maxUsers || '1000000',
    debtLimit: manager?.debtLimit ||0,
    discountRate: manager?.discountRate || 0,
    aclGroupId: manager?.aclGroupId || '',
    parentId: manager?.parentId || '',
    enabled: manager?.enabled ?? 1,
});

const ManagerEdit = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const manager = state?.manager;

    const [formData, setFormData] = useState(buildInitialForm(manager));
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (!manager) navigate(-1);
    }, [manager, navigate]);

    // ---------------- Handlers ----------------
    const handleChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleClear = () => {
        setFormData(buildInitialForm(manager));
    };

    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
    };

    const handleSubmit = async () => {
        if (formData.password && formData.password !== formData.confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...manager, // keep untouched backend fields
                ...formData,
                password: formData.password || undefined,
                confirmPassword: formData.confirmPassword || undefined,
            };

            await apiService.put(ApiUrls.editManager, payload);
            showNotification('Manager updated successfully');
            setTimeout(() => navigate(-1), 1200);
        } catch (error) {
            console.error(error);
            showNotification('Failed to update manager', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!manager) return null;

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Edit Manager
                </Typography>
                <Box sx={{ flex: 1 }} />
                <IconButton onClick={handleClear}>
                    <ClearIcon />
                </IconButton>
            </Box>

            {/* ---------- BASIC INFORMATION ---------- */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Basic Information
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Username *" value={formData.username} onChange={handleChange('username')} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Email *" value={formData.email} onChange={handleChange('email')} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="First Name *" value={formData.firstname} onChange={handleChange('firstname')} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Last Name *" value={formData.lastname} onChange={handleChange('lastname')} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Phone" value={formData.phone} onChange={handleChange('phone')} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Company" value={formData.company} onChange={handleChange('company')} />
                    </Grid>
                </Grid>
            </Paper>

            {/* ---------- LOCATION ---------- */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Location
                </Typography>
                <TextField fullWidth label="City" value={formData.city} onChange={handleChange('city')} sx={{ mb: 2 }} />
                <TextField fullWidth multiline rows={3} label="Address" value={formData.address} onChange={handleChange('address')} />
            </Paper>

            {/* ---------- BUSINESS ---------- */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Business
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth label="Max Users" type="number" value={formData.maxUsers} onChange={handleChange('maxUsers')} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth label="Debt Limit" type="number" value={formData.debtLimit} onChange={handleChange('debtLimit')} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth label="Discount Rate" type="number" value={formData.discountRate} onChange={handleChange('discountRate')} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select value={formData.enabled} label="Status" onChange={handleChange('enabled')}>
                                <MenuItem value={1}>Enabled</MenuItem>
                                <MenuItem value={0}>Disabled</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* ---------- PASSWORD ---------- */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6">Password</Typography>
                <Typography variant="caption" color="text.secondary">
                    Leave blank to keep current password
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="New Password" type="password" value={formData.password} onChange={handleChange('password')} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange('confirmPassword')} />
                    </Grid>
                </Grid>
            </Paper>

            {/* ---------- NOTES ---------- */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Notes
                </Typography>
                <TextField fullWidth multiline rows={3} value={formData.notes} onChange={handleChange('notes')} />
            </Paper>

            {/* ---------- ACTIONS ---------- */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={22} /> : 'Update Manager'}
                </Button>
            </Box>

            {/* Snackbar */}
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={() => setNotification({ ...notification, open: false })}>
                <Alert severity={notification.severity}>{notification.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default ManagerEdit;
