import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Chip, useTheme } from '@mui/material';
import { FiX } from 'react-icons/fi';
import { GoogleMap, MarkerF, PolygonF } from "@react-google-maps/api";
import AppFormField from '../../../common/fromField.jsx';
import AppButton from '../../../common/AppButton.jsx';
import {reduceLatLng} from "../../../helper/formaters.jsx";

const MainAreaDialog = ({
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
    handleRemoveCoord
}) => {
    const theme = useTheme();

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{editMode ? 'Edit Main Area' : 'Add New Main Area'}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    {/* Form Fields */}
                    <Box sx={{ mb: 3 }}>
                        <AppFormField
                            title="Area Name"
                            name="areaName"
                            value={formData.areaName}
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
                            Click on the map to add coordinates for the bounding box
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
                                    {boundingBoxCoords.map((coord, index) => (
                                        <MarkerF key={index} position={coord} />
                                    ))}
                                    
                                    {boundingBoxCoords.length > 2 && (
                                        <PolygonF
                                            paths={boundingBoxCoords}
                                            options={{
                                                fillColor: theme.palette.primary.main,
                                                fillOpacity: 0.2,
                                                strokeColor: theme.palette.primary.main,
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
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {/* Hidden field to show bounding box string */}
                        {formData.areaBoundingBox && (
                            <Box mt={2} p={1} bgcolor={theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)'} borderRadius={1}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Bounding Box String:
                                </Typography>
                                <Typography variant="caption" fontFamily="monospace" color="text.primary">
                                    {formData.areaBoundingBox}
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

export default MainAreaDialog;
