import React from 'react';
import { Box, Typography, CircularProgress, useTheme, Tooltip, IconButton } from '@mui/material';
import { GoogleMap, MarkerF, PolygonF, OverlayViewF } from "@react-google-maps/api";
import { useMapData } from '@/hooks/useMapData.js';
import AppButton from "../../../common/AppButton.jsx";
import { FiPlus, FiHardDrive, FiCopy } from "react-icons/fi";
import {reduceLatLng} from "../../../helper/formaters.jsx";

// A constant for the OverlayView pane
const OVERLAY_MOUSE_TARGET = "overlayMouseTarget";

const MapView = ({
    isLoaded,
    mapCenter,
    selectedMainArea,
    selectedSubArea,
    selectedDp,
    subAreas,
    dpPorts,
    handleOpenDpDialog,
    subAreaBoundingBoxCoords,
    openSubAreaDialog
}) => {
    const theme = useTheme();
    const { mainAreaCoords, subAreaPolygons, dpMarkers } = useMapData(selectedMainArea, subAreas, dpPorts);

    const handleCopy = () => {
        let textToCopy = '';
        if (selectedMainArea) {
            textToCopy += `Main Area: ${selectedMainArea.areaName}\n`;
        }
        if (selectedSubArea) {
            textToCopy += `Sub Area: ${selectedSubArea.subAreaName}\n`;
        }
        if (selectedDp) {
            textToCopy += `DP: ${selectedDp.dpName}\nLocation: https://www.google.com/maps?q=${reduceLatLng(selectedDp.lat)},${reduceLatLng(selectedDp.lng)}\n`;
        }
        navigator.clipboard.writeText(textToCopy);
    };

    return (
        <Box
            width="50%"
            display="flex"
            flexDirection="column"
            bgcolor="background.paper"
            border={0.5}
            padding={1}
            sx={{
                borderTopRightRadius: 5,
                borderColor: 'divider',
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" color="text.secondary">
                    {'Map View'}
                </Typography>
                {selectedSubArea && (
                    <AppButton
                        startIcon={<FiPlus />}
                        size="small"
                        onClick={() => handleOpenDpDialog()}
                        color="primary"
                        label={"Add DP Port"}
                    />
                )}
            </Box>

            <Box
                sx={{
                    flex: 1,
                    width: '100%',
                    border: '2px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={mapCenter}
                        zoom={13}
                    >
                        {/* Main Area Polygon */}
                        {selectedMainArea && mainAreaCoords.length > 2 && (
                            <PolygonF
                                paths={mainAreaCoords}
                                options={{
                                    fillColor: theme.palette.primary.main,
                                    fillOpacity: 0.2,
                                    strokeColor: theme.palette.primary.main,
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                }}
                            />
                        )}

                        {/* Sub Area Polygons */}
                        {subAreaPolygons.map(polygon => {
                            const isSelected = selectedSubArea && polygon.id === selectedSubArea.id;
                            return (
                                <PolygonF
                                    key={polygon.id}
                                    paths={polygon.paths}
                                    options={{
                                        fillColor: isSelected ? theme.palette.secondary.main : 'grey',
                                        fillOpacity: isSelected ? 0.3 : 0.2,
                                        strokeColor: isSelected ? theme.palette.secondary.main : 'grey',
                                        strokeOpacity: isSelected ? 0.9 : 0.7,
                                        strokeWeight: 2,
                                    }}
                                />
                            );
                        })}

                        {/* Bounding box for adding sub-area */}
                        {openSubAreaDialog && subAreaBoundingBoxCoords.length > 2 && (
                            <PolygonF
                                paths={subAreaBoundingBoxCoords}
                                options={{
                                    fillColor: theme.palette.warning.main,
                                    fillOpacity: 0.2,
                                    strokeColor: theme.palette.warning.main,
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    strokeDasharray: '5, 5',
                                }}
                            />
                        )}
                        
                        {/* DP Port Markers */}
                        {dpMarkers.map(marker => (
                            <OverlayViewF
                                key={marker.id}
                                position={marker.position}
                                mapPaneName={OVERLAY_MOUSE_TARGET}
                            >
                                <Box
                                    sx={{
                                        transform: 'translate(-50%, -50%)',
                                        padding: '4px',
                                        background: theme.palette.primary.main,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                        border: `2px solid ${theme.palette.background.paper}`
                                    }}
                                    title={marker.name}
                                >
                                    <FiHardDrive size={30} color="white" />
                                </Box>
                            </OverlayViewF>
                        ))}

                        {mainAreaCoords.length <= 2 && mainAreaCoords.map((coord, index) => (
                            <MarkerF key={`main-marker-${index}`} position={coord} />
                        ))}
                        
                        {mainAreaCoords.length === 0 && selectedMainArea && (
                            <MarkerF position={mapCenter} />
                        )}
                    </GoogleMap>
                ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                    </Box>
                )}
            </Box>

            {(selectedMainArea || selectedSubArea || selectedDp) && (
                <Box mt={2} p={2} bgcolor={theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)'} borderRadius={1} position="relative">
                    {selectedMainArea && (
                        <>
                            <Typography variant="subtitle1" fontWeight="600" color="primary">
                                {selectedMainArea.areaName}
                            </Typography>

                        </>
                    )}
                    {selectedSubArea && (
                        <Typography variant="subtitle2" color="secondary" mt={1}>
                            {selectedSubArea.subAreaName}
                        </Typography>
                    )}
                    {selectedDp && (
                        <>
                            <Typography variant="body2" color="text.primary" mt={1}>
                                DP: {selectedDp.dpName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                                Location: <a href={`https://www.google.com/maps?q=${reduceLatLng(selectedDp.lat)},${reduceLatLng(selectedDp.lng)}`} target="_blank" rel="noopener noreferrer">{reduceLatLng(selectedDp.lat)}, {reduceLatLng(selectedDp.lng)}</a>
                            </Typography>
                        </>
                    )}
                    <Tooltip title="Copy Details">
                        <IconButton onClick={handleCopy} size="small" sx={{ position: 'absolute', top: 8, right: 8 }}>
                            <FiCopy />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
        </Box>
    );
};

export default MapView;
