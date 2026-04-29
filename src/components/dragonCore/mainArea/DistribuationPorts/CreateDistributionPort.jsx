import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    useTheme,
} from '@mui/material';
import { GoogleMap, MarkerF, PolygonF } from "@react-google-maps/api";
import AppFormField from '../../../../common/fromField.jsx';
import AppButton from '../../../../common/AppButton.jsx';
import { useDistributionPortForm } from '@/hooks/useDistributionPortForm.js';
import { useMemo } from 'react';
import {reduceLatLng} from "../../../../helper/formaters.jsx";

const CreateDistributionPort = (props) => {
    const theme = useTheme();
    const {
        loading,
        mapCenter,
        markerPosition,
        formData,
        handleInputChange,
        handleMapClick,
        handleSubmit,
        selectedSubArea,
        selectedMainArea,
    } = useDistributionPortForm(props);

    const { open, onClose, editMode, isLoaded } = props;

    // Parse main area coordinates
    const mainAreaCoords = useMemo(() => {
        if (selectedMainArea?.areaBoundingBox) {
            try {
                return selectedMainArea.areaBoundingBox.split(';').map(coord => {
                    const [lat, lng] = coord.split(',');
                    return { lat: reduceLatLng(parseFloat(lat)), lng: reduceLatLng(parseFloat(lng)) };
                });
            } catch (e) {
                console.error("Error parsing main area bounding box:", e);
                return [];
            }
        }
        return [];
    }, [selectedMainArea]);

    // Parse sub area coordinates
    const subAreaCoords = useMemo(() => {
        if (selectedSubArea?.subAreaBoundingBox) {
            try {
                return selectedSubArea.subAreaBoundingBox.split(';').map(coord => {
                    const [lat, lng] = coord.split(',');
                    return { lat: reduceLatLng(parseFloat(lat)), lng: reduceLatLng(parseFloat(lng)) };
                });
            } catch (e) {
                console.error("Error parsing sub area bounding box:", e);
                return [];
            }
        }
        return [];
    }, [selectedSubArea]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {editMode ? 'Edit DP' : 'Add DP'}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {selectedMainArea?.areaName} / {selectedSubArea?.name}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    <AppFormField
                        title="DP Name"
                        name="dpName"
                        value={formData.dpName}
                        onChange={handleInputChange}
                        required
                        readOnly={true}
                    />


                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <AppFormField
                                title="Dp Latitude"
                                name="lat"
                                value={reduceLatLng(formData.lat)}
                                onChange={handleInputChange}
                                required
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <AppFormField
                                title="Dp Longitude"
                                name="lng"
                                value={reduceLatLng(formData.lng)}
                                onChange={handleInputChange}
                                required
                            />
                        </Box>
                    </Box>

                    <AppFormField
                        title="Remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                        multiline
                        rows={2}
                    />
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="600" mb={1}>
                            Select Location on Map
                        </Typography>
                        <Box
                            sx={{
                                width: '100%',
                                height: '300px',
                                border: '2px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                overflow: 'hidden',
                                mb: 2,
                            }}
                        >
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '100%' }}
                                    center={mapCenter}
                                    zoom={14}
                                    onClick={handleMapClick}
                                >
                                    {/* Main Area Polygon */}
                                    {mainAreaCoords.length > 2 && (
                                        <PolygonF
                                            paths={mainAreaCoords}
                                            options={{
                                                fillColor: theme.palette.primary.main,
                                                fillOpacity: 0.1,
                                                strokeColor: theme.palette.primary.main,
                                                strokeOpacity: 0.5,
                                                strokeWeight: 2,
                                                clickable: false
                                            }}
                                        />
                                    )}

                                    {/* Sub Area Polygon */}
                                    {subAreaCoords.length > 2 && (
                                        <PolygonF
                                            paths={subAreaCoords}
                                            options={{
                                                fillColor: theme.palette.secondary.main,
                                                fillOpacity: 0.1,
                                                strokeColor: theme.palette.secondary.main,
                                                strokeOpacity: 0.8,
                                                strokeWeight: 2,
                                                clickable: false
                                            }}
                                        />
                                    )}

                                    {markerPosition && (
                                        <MarkerF position={markerPosition} />
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
                <AppButton onClick={onClose} disabled={loading} label="Cancel" />
                <AppButton
                    onClick={handleSubmit}
                    disabled={loading}
                    label={loading ? <CircularProgress size={24} /> : (editMode ? 'Update DP' : 'Create DP')}
                />
            </DialogActions>
        </Dialog>
    );
};

export default CreateDistributionPort;
