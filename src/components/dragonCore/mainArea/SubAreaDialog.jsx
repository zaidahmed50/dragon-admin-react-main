import React, { useMemo } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Typography, Chip, useTheme } from '@mui/material';
import { FiX } from 'react-icons/fi';
import { GoogleMap, MarkerF, PolygonF } from "@react-google-maps/api";
import AppFormField from '../../../common/fromField.jsx';
import AppButton from '../../../common/AppButton.jsx';
import {reduceLatLng} from "../../../helper/formaters.jsx";

const SubAreaDialog = ({
    open,
    editMode,
    formData,
    loading,
    isLoaded,
    dialogMapCenter,
    boundingBoxCoords,
    handleClose,
    handleSubmit,
    handleInputChange,
    handleMapClick,
    handleRemoveCoord,
    selectedMainArea
}) => {
    const theme = useTheme();

    // Parse main area coordinates
    const mainAreaCoords = useMemo(() => {
        if (selectedMainArea?.areaBoundingBox) {
            try {
                return selectedMainArea.areaBoundingBox.split(';').map(coord => {
                    const [lat, lng] = coord.split(',');
                    return { lat: parseFloat(lat), lng: parseFloat(lng) };
                });
            } catch (e) {
                console.error("Error parsing main area bounding box:", e);
                return [];
            }
        }
        return [];
    }, [selectedMainArea]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{editMode ? 'Edit Sub Area' : 'Add New Sub Area'}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    {/* Form Fields */}
                    <Box sx={{ mb: 3 }}>
                        <AppFormField
                            title="Sub Area Name"
                            name="subAreaName"
                            value={formData.subAreaName}
                            onChange={handleInputChange}
                            required
                            sx={{ mb: 2 }}
                        />
                        <AppFormField
                            title="Short Name"
                            name="shortName"
                            value={formData.shortName}
                            onChange={handleInputChange}
                            multiline
                            rows={2}
                            required={true}
                        />
                    </Box>

                    {/* Map Section */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="600" mb={1}>
                            Select Bounding Box Coordinates
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                            Click on the map to add coordinates for the sub area bounding box.
                        </Typography>

                        {/* Map Container */}
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
                                    center={dialogMapCenter}
                                    zoom={12}
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

                                    {boundingBoxCoords.map((coord, index) => (
                                        <MarkerF key={index} position={coord} />
                                    ))}
                                    
                                    {boundingBoxCoords.length > 2 && (
                                        <PolygonF
                                            paths={boundingBoxCoords}
                                            options={{
                                                fillColor: theme.palette.secondary.main,
                                                fillOpacity: 0.2,
                                                strokeColor: theme.palette.secondary.main,
                                                strokeOpacity: 0.8,
                                                strokeWeight: 2,
                                            }}
                                        />
                                    )}
                                </GoogleMap>
                            ) : (
                                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                    <CircularProgress />
                                </Box>
                            )}
                        </Box>

                        {/* Coordinates List */}
                        {boundingBoxCoords.length > 0 && (
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                    Selected Coordinates ({boundingBoxCoords.length} points):
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {boundingBoxCoords.map((coord, index) => (
                                        <Chip
                                            key={index}
                                            label={`${reduceLatLng(coord.lat)}, ${reduceLatLng(coord.lng)}`}
                                            onDelete={() => handleRemoveCoord(index)}
                                            deleteIcon={<FiX />}
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {/* Hidden field to show bounding box string */}
                        {formData.subAreaBoundingBox && (
                            <Box mt={2} p={1} bgcolor={theme.palette.mode === 'dark' ? 'rgba(156, 39, 176, 0.2)' : 'rgba(156, 39, 176, 0.1)'} borderRadius={1}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Bounding Box String:
                                </Typography>
                                <Typography variant="caption" fontFamily="monospace" color="text.primary">
                                    {formData.subAreaBoundingBox}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <AppButton onClick={handleClose} disabled={loading} label="Cancel" />
                <AppButton
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    label={loading ? <CircularProgress size={24} /> : editMode ? 'Update' : 'Create'}
                />
            </DialogActions>
        </Dialog>
    );
};

export default SubAreaDialog;
