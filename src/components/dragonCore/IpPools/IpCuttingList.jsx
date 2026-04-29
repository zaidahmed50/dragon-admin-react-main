import React from 'react';
import { Box, Typography, IconButton, CircularProgress, useTheme } from '@mui/material';
import { FiServer, FiMoreVertical } from 'react-icons/fi';
import SearchIcon from '@mui/icons-material/Search';
import AppFormField from '../../../common/fromField.jsx';

const IpCuttingList = ({
    ipCuttingLoading,
    filteredIpCuttings,
    selectedPool,
    selectedIpCutting,
    ipCuttingSearch,
    setIpCuttingSearch,
    handleIpCuttingClick,
    handleIpCuttingMenuOpen
}) => {
    const theme = useTheme();

    return (
        <Box
            width="33%"
            display="flex"
            flexDirection="column"
            borderRight={1}
            borderColor="divider"
        >
            <Box p={2}>
                <Typography variant="h6" fontWeight={600} mb={1.5} color="text.primary">
                    {selectedPool ? selectedPool.ipAddress : ''}
                </Typography>
                {selectedPool && (
                    <AppFormField
                        title="Search"
                        startIcon={<SearchIcon sx={{ color: 'text.secondary' }} />}
                        value={ipCuttingSearch}
                        onChange={(e) => setIpCuttingSearch(e.target.value)}
                        placeholder="Search IP cuttings..."
                    />
                )}
            </Box>

            <Box flex={1} overflow="auto" px={2}>
                {!selectedPool ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
                        Select a pool to view IP cuttings
                    </Typography>
                ) : ipCuttingLoading ? (
                    <Box display="flex" justifyContent="center" mt={3}>
                        <CircularProgress />
                    </Box>
                ) : filteredIpCuttings.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
                        {ipCuttingSearch ? 'No IP cuttings found matching your search' : 'No IP cuttings found'}
                    </Typography>
                ) : (
                    filteredIpCuttings.map((cutting, index) => (
                        <Box
                            key={cutting.id || index}
                            onClick={() => handleIpCuttingClick(cutting)}
                            sx={{
                                border: 1,
                                borderColor: selectedIpCutting?.id === cutting.id ? 'primary.main' : 'divider',
                                borderRadius: 1,
                                p: 0.75,
                                mb: 0.5,
                                bgcolor: selectedIpCutting?.id === cutting.id
                                    ? (theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.15)')
                                    : 'background.default',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                    bgcolor: selectedIpCutting?.id === cutting.id
                                        ? (theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.25)')
                                        : 'action.hover',
                                },
                            }}
                        >
                            <FiServer
                                style={{ marginLeft: 10, marginRight: 15, fontSize: 22, color: '#4caf50' }} />
                            <Box flex={1}>
                                <Typography variant="body2" fontWeight={500} color="text.primary">
                                    {cutting.ipAddress || 'N/A'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {cutting.ipDescription || 'N/A'}
                                </Typography>
                            </Box>
                            <IconButton
                                size="small"
                                onClick={(e) => handleIpCuttingMenuOpen(e, cutting)}
                                sx={{ ml: 0.5 }}
                            >
                                <FiMoreVertical size={18} />
                            </IconButton>
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default IpCuttingList;
