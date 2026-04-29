import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const PoolDetails = ({ selectedPool }) => {
    const theme = useTheme();

    return (
        <Box
            width="34%"
            display="flex"
            flexDirection="column"
            p={2}
        >
            {selectedPool ? (
                <Box>
                    <Typography variant="h6" fontWeight={600} mb={2} color="text.primary">
                        Pool Details
                    </Typography>
                    <Box
                        p={2}
                        bgcolor={theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 152, 0, 0.1)'}
                        borderRadius={2}
                        border={1}
                        borderColor={theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.3)'}
                    >
                        <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">
                                Name
                            </Typography>
                            <Typography variant="body2" fontWeight={500} color="text.primary">
                                {selectedPool.name || 'N/A'}
                            </Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">
                                IP Address / Cutting
                            </Typography>
                            <Typography variant="body2" fontWeight={500} color="text.primary">
                                {selectedPool.ipAddress}/{selectedPool.ipCutting}
                            </Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">
                                Start IP
                            </Typography>
                            <Typography variant="body2" fontWeight={500} color="text.primary">
                                {selectedPool.startIp || 'N/A'}
                            </Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">
                                End IP
                            </Typography>
                            <Typography variant="body2" fontWeight={500} color="text.primary">
                                {selectedPool.endIp || 'N/A'}
                            </Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">
                                Lease Time
                            </Typography>
                            <Typography variant="body2" fontWeight={500} color="text.primary">
                                {selectedPool.leaseTime || 'N/A'}
                            </Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">
                                Status ID
                            </Typography>
                            <Typography variant="body2" fontWeight={500} color="text.primary">
                                {selectedPool.ipStatusId || 'N/A'}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Description
                            </Typography>
                            <Typography variant="body2" fontWeight={500} color="text.primary">
                                {selectedPool.ipDescription || 'N/A'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Select a pool to view details
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default PoolDetails;
