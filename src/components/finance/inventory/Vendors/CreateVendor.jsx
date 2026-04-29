import React from 'react';
import {
    Box,
    Typography,
    Button,
    Alert,
    Snackbar,
    CircularProgress,
    Paper,
    Grid,
    Card,
    CardContent,
    InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import SearchIcon from '@mui/icons-material/Search';
import { useVendorForm } from '@/hooks/useVendorForm.js';
import AppFormField from '../../../../common/fromField.jsx';
import AppButton from '../../../../common/AppButton.jsx';

const containerStyle = { width: '100%', height: '400px' };

const CreateVendor = () => {
    const navigate = useNavigate();
    const {
        isEditMode,
        isLoaded,
        loading,
        successMessage,
        errorMessage,
        formData,
        mapCenter,
        markerPosition,
        setSuccessMessage,
        setErrorMessage,
        handleInputChange,
        handleMapClick,
        handlePlacesChanged,
        onSearchBoxLoad,
        handleSubmit,
    } = useVendorForm();

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={600} color="#111827">
                    {isEditMode ? 'Edit Vendor' : 'Create New Vendor'}
                </Typography>
            </Box>

            <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="success" onClose={() => setSuccessMessage('')}>{successMessage}</Alert>
            </Snackbar>
            <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="error" onClose={() => setErrorMessage('')}>{errorMessage}</Alert>
            </Snackbar>

            <Paper sx={{ p: 3, boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)', borderRadius: 3 }}>
                
                {/* Vendor Details Section */}
                <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: 'primary.main' }}>Vendor Details</Typography>
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={6}><AppFormField title="Vendor Code *" name="vendorCode" value={formData.vendorCode} onChange={handleInputChange} required /></Grid>
                    <Grid item xs={6}><AppFormField title="Vendor Name *" name="name" value={formData.name} onChange={handleInputChange} required /></Grid>
                    <Grid item xs={6}><AppFormField title="Tax Number" name="taxNumber" value={formData.taxNumber} onChange={handleInputChange} /></Grid>
                    <Grid item xs={6}><AppFormField title="Payment Terms" name="paymentTerms" value={formData.paymentTerms} onChange={handleInputChange} /></Grid>
                    <Grid item xs={12}><AppFormField title="Bank Name" name="bankName" value={formData.bankName} onChange={handleInputChange} /></Grid>
                    <Grid item xs={6}><AppFormField title="Bank Account Number" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleInputChange} /></Grid>
                    <Grid item xs={6}><AppFormField title="IBAN" name="iban" value={formData.iban} onChange={handleInputChange} /></Grid>
                </Grid>

                {/* Contact Information Section */}
                <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: 'primary.main' }}>Contact Information</Typography>
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12}><AppFormField title="Contact Person *" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} required /></Grid>
                    <Grid item xs={6}><AppFormField title="Email" name="email" value={formData.email} onChange={handleInputChange} /></Grid>
                    <Grid item xs={6}><AppFormField title="Phone" name="phone" value={formData.phone} onChange={handleInputChange} /></Grid>
                    <Grid item xs={6}><AppFormField title="Mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} /></Grid>
                    <Grid item xs={6}><AppFormField title="Website" name="website" value={formData.website} onChange={handleInputChange} /></Grid>
                </Grid>

                {/* Location Section */}
                <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: 'primary.main' }}>Location</Typography>
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={12}><AppFormField title="Address *" name="addressLine" value={formData.addressLine} onChange={handleInputChange} required /></Grid>
                    <Grid item xs={12}><AppFormField title="City *" name="city" value={formData.city} onChange={handleInputChange} required /></Grid>
                </Grid>

                <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        {isLoaded ? (
                            <>
                                {/* Location search box */}
                                <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={handlePlacesChanged}>
                                    <Box sx={{ position: 'relative', mb: 1.5 }}>
                                        <Box sx={{
                                            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                                            color: 'text.secondary', display: 'flex', alignItems: 'center', zIndex: 1,
                                        }}>
                                            <SearchIcon fontSize="small" />
                                        </Box>
                                        <input
                                            type="text"
                                            placeholder="Search for a location..."
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px 10px 38px',
                                                fontSize: '14px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                fontFamily: 'inherit',
                                                color: '#111827',
                                                backgroundColor: '#fff',
                                            }}
                                            onFocus={e => e.target.style.borderColor = '#6366f1'}
                                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                                        />
                                    </Box>
                                </StandaloneSearchBox>

                                {/* Map */}
                                <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={13} onClick={handleMapClick}>
                                    {markerPosition && <Marker position={markerPosition} />}
                                </GoogleMap>

                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    Search for a location above, or click anywhere on the map to place the marker.
                                </Typography>
                            </>
                        ) : (
                            <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>
                        )}
                    </CardContent>
                </Card>

                <Grid container spacing={2}>
                    <Grid item xs={6}><AppFormField title="Latitude" name="latitude" value={formData.latitude} onChange={handleInputChange} disabled /></Grid>
                    <Grid item xs={6}><AppFormField title="Longitude" name="longitude" value={formData.longitude} onChange={handleInputChange} disabled /></Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={() => navigate('/finance/inventory/vendors')} disabled={loading}>Cancel</Button>
                    <AppButton onClick={handleSubmit} disabled={loading} label={loading ? <CircularProgress size={24} /> : isEditMode ? 'Update Vendor' : 'Create Vendor'} />
                </Box>
            </Paper>
        </Box>
    );
};

export default CreateVendor;
