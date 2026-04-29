import { useEffect } from 'react';
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    FormControlLabel,
    Switch
} from '@mui/material';
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import AppFormField from '../../../common/fromField.jsx';
import AppButton from '../../../common/AppButton.jsx';
import AppDropDownField from "../../../common/dropdownField.jsx";

const OfficeDialog = ({
    open,
    editMode,
    formData,
    loading,
    isLoaded,
    officeTypes,
    officeRoles,
    dialogMapCenter,
    dialogMarker,
    handleClose,
    handleSubmit,
    handleInputChange,
    handleDialogMapClick,
    setFormData,
    setDialogMapCenter,
    setDialogMarker
}) => {

    useEffect(() => {
        if (editMode) {
            const selectedOfficeType = officeTypes.find(type => type.id == formData.officeTypeId);
            console.log('selectedOfficeType', formData);

            if (selectedOfficeType && formData.officeTypeId !== selectedOfficeType.id) {
                setFormData(prev => ({
                    ...prev,
                    officeTypeId: selectedOfficeType.id
                }));
            }
        }
    }, [editMode, formData.officeTypeId, setFormData, officeTypes]);


    useEffect(() => {
        if (editMode) {
            const selectedRole = officeRoles.find(role => role.id == formData.officeRoleId);
            console.log('selectedRole', formData);

            if (selectedRole && formData.officeRoleId !== selectedRole.id) {
                setFormData(prev => ({
                    ...prev,
                    officeRoleId: selectedRole.id
                }));
            }
        }
    }, [editMode, formData.officeRoleId, setFormData, officeRoles]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{editMode ? 'Update Office Location' : 'Add Office Location'}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2, display: 'flex', gap: 2 }}>
                    <Box flex={1}>

                        <AppDropDownField
                            title="Office Type"
                            name="officeTypeId"
                            options={officeTypes}
                            value={formData.officeTypeId}
                            onChange={(e) => {
                                setFormData(prev => ({
                                    ...prev,
                                    officeTypeId: e.target.value
                                }));
                            }}
                            optionLabel="title"
                            optionValue="id"
                            required
                        />
                        <AppDropDownField
                            title="Office Role "
                            name="officeRoleId"
                            options={officeRoles} 
                            value={formData.officeRoleId}
                            onChange={(e) => {

                             setFormData(prev => ({
                                  ...prev,
                                    officeRoleId: e.target.value
                                }));
                            }}
                            optionLabel="roleName" 
                            optionValue="id"
                            required
                        />
                        
                        

                        <AppFormField
                            title="Name"
                            name="officeName"
                            value={formData.officeName}
                            onChange={handleInputChange}
                            required
                        />

                        <AppFormField
                            title="GPS Location"
                            name="gpsLocation"
                            value={formData.gpsLocation}
                            onChange={(e) => {
                                const gpsLocation = e.target.value;
                                handleInputChange(e);
                                if (gpsLocation.trim()) {
                                    const [lat, lng] = gpsLocation.split(',').map(coord => parseFloat(coord.trim()));
                                    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                                        const newPosition = { lat, lng };
                                        setDialogMapCenter(newPosition);
                                        setDialogMarker(newPosition);
                                    }
                                }
                            }}
                            required
                            helperText="Format: latitude, longitude (e.g., 31.5204, 74.3587)"
                        />
                        <AppFormField
                            title="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />

                        <AppDropDownField
                            title={"Owned By"}
                            options={[
                                { label: "WellNetworks", value: "WellNetworks" },
                                { label: "Others", value: "Others" },

                            ]}
                            value={formData.ownBy}
                            onChange={(e) => {
                                setFormData(prev => ({
                                    ...prev,
                                    ownBy: e.target.value
                                }));
                            }
                            }
                            required={true}

                        />

                        <AppFormField
                            title="Capacity"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleInputChange}
                        />

                        <AppFormField
                            title="Remarks"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleInputChange}
                            multiline
                            rows={2}
                        />

                        <Box display="flex" gap={2} mt={1}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.wireless}
                                        onChange={handleInputChange}
                                        name="wireless"
                                        size="small"
                                    />
                                }
                                label={<Typography variant="caption">Wireless</Typography>}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.redundant}
                                        onChange={handleInputChange}
                                        name="redundant"
                                        size="small"
                                    />
                                }
                                label={<Typography variant="caption">Redundant</Typography>}
                            />
                        </Box>
                    </Box>

                    <Box flex={1}>
                        <Typography variant="caption" color="text.secondary" mb={1} display="block">
                            Map Preview
                        </Typography>
                        <Box
                            sx={{
                                width: '100%',
                                height: '400px',
                                border: '2px solid #e0e0e0',
                                borderRadius: 2,
                                overflow: 'hidden',
                                mb: 1,
                            }}
                        >
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '100%' }}
                                    center={dialogMapCenter}
                                    zoom={14}
                                    onClick={handleDialogMapClick}
                                >
                                    {dialogMarker && (
                                        <MarkerF position={dialogMarker} />
                                    )}
                                </GoogleMap>
                            ) : (
                                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                    <CircularProgress />
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <AppButton onClick={handleClose} disabled={loading} label="Cancel" />
                <AppButton
                    onClick={handleSubmit}
                    disabled={loading}
                    label={loading ?
                        <CircularProgress size={24} /> : editMode ? 'Update Office' : 'Add Office'}
                />
            </DialogActions>
        </Dialog>
    );
};

export default OfficeDialog;
