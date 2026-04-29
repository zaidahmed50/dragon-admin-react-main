import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { FiCopy } from 'react-icons/fi';
import { GoogleMap, MarkerF } from "@react-google-maps/api";

const OfficeMapView = ({
    isLoaded,
    mapCenter,
    markerPosition,
    selectedOffice,
    handleCopyOfficeDetails
}) => {
    return (
        <Box
            width="65%"
            display="flex"
            flexDirection="column"
            bgcolor="#1E293B"
        >
            <Typography variant="h6" fontWeight={600} p={2}>
                {selectedOffice ? `Map view for ${selectedOffice.officeName}` : 'Map View'}
            </Typography>

            <Box
                flex={1}
                sx={{
                    // border: '2px solid #e0e0e0',
                    borderRadius: 2,
                    overflow: 'hidden',
                    mx: 2,
                    mb: 2,
                    position: 'relative',
                }}
            >
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={mapCenter}
                        zoom={14}
                    >
                        {selectedOffice && selectedOffice.gpsLocation && (
                            <MarkerF
                                position={markerPosition}
                                title={selectedOffice.officeName}
                            />
                        )}
                    </GoogleMap>
                ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                    </Box>
                )}
            </Box>

            {selectedOffice && (
                <Box mx={2} mb={2} p={2} bgcolor="rgba(255, 152, 0, 0.1)" borderRadius={1}>
                    <Typography variant="subtitle2" fontWeight="600" color="#ff9800" mb={1}>
                        {selectedOffice.officeName}
                    </Typography>
                    <Typography variant="caption" display="block" mb={0.5}>
                        📍 {selectedOffice.address}
                    </Typography>
                    <Typography variant="caption" display="block" mb={0.5}>
                        📞 Owned by: {selectedOffice.ownBy || 'N/A'}
                    </Typography>
                    <Typography variant="caption" display="block" mb={0.5}>
                        🏢 Type: {selectedOffice.officeType || 'N/A'}
                    </Typography>
                    <Typography variant="caption" display="block" mb={0.5}>
                        👥 Capacity: {selectedOffice.capacity || 'N/A'}
                    </Typography>
                    {selectedOffice.remarks && (
                        <Typography variant="caption" display="block" color="text.secondary" mb={1}>
                            💬 {selectedOffice.remarks}
                        </Typography>
                    )}
                    <Box display="flex" justifyContent="flex-end" mt={1}>
                        <Button
                            size="small"
                            startIcon={<FiCopy />}
                            onClick={handleCopyOfficeDetails}
                            sx={{
                                textTransform: 'none',
                                color: '#ff9800',
                                fontSize: '0.75rem',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 152, 0, 0.1)',
                                },
                            }}
                        >
                            Copy Details
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default OfficeMapView;
