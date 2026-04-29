import React from 'react';
import { Box, Typography, IconButton, CircularProgress, useTheme } from '@mui/material';
import { FiServer, FiMoreVertical } from 'react-icons/fi';
import SearchIcon from '@mui/icons-material/Search';
import AppFormField from '../../../common/fromField.jsx';

const PoolList = ({
    loading,
    ipPools,
    filteredIpPools,
    selectedPool,
    poolSearch,
    setPoolSearch,
    handlePoolClick,
    handlePoolMenuOpen
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
                    Pools
                </Typography>
                <AppFormField
                    title="Search"
                    startIcon={<SearchIcon sx={{ color: 'text.secondary' }} />}
                    value={poolSearch}
                    onChange={(e) => setPoolSearch(e.target.value)}
                    placeholder="Search pools..."
                />
            </Box>

            <Box flex={1} overflow="auto" px={2}>
                {loading && ipPools.length === 0 ? (
                    <Box display="flex" justifyContent="center" mt={3}>
                        <CircularProgress />
                    </Box>
                ) : filteredIpPools.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
                        {poolSearch ? 'No IP pools found matching your search' : 'No IP pools found'}
                    </Typography>
                ) : (
                    filteredIpPools.map((pool, index) => (
                        <Box
                            key={pool.id || index}
                            onClick={() => handlePoolClick(pool)}
                            sx={{
                                border: 1,
                                borderColor: selectedPool?.id === pool.id ? 'primary.main' : 'divider',
                                borderRadius: 1,
                                p: 0.75,
                                mb: 0.5,
                                bgcolor: selectedPool?.id === pool.id
                                    ? (theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.15)')
                                    : 'background.default',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                    bgcolor: selectedPool?.id === pool.id
                                        ? (theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.25)')
                                        : 'action.hover',
                                },
                            }}
                        >
                            <FiServer
                                style={{ marginLeft: 10, marginRight: 15, fontSize: 18, color: '#ff9800' }} />
                            <Box flex={1}>
                                <Typography variant="body2" fontWeight={500} color="text.primary">
                                    {pool.ipAddress}/{pool.ipCutting}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {pool.ipDescription}
                                </Typography>
                            </Box>
                            <IconButton
                                size="small"
                                onClick={(e) => handlePoolMenuOpen(e, pool)}
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

export default PoolList;
