import React from 'react';
import { Box, Typography, IconButton, CircularProgress, useTheme } from '@mui/material';
import { FiMapPin, FiMoreVertical } from 'react-icons/fi';
import SearchIcon from '@mui/icons-material/Search';
import AppFormField from '../../../common/fromField.jsx';

const OfficeList = ({
    loading,
    offices,
    filteredOffices,
    selectedOffice,
    officeSearch,
    setOfficeSearch,
    handleOfficeClick,
    handleOfficeMenuOpen
}) => {
    const theme = useTheme();

    return (
        <Box
            width="35%"
            display="flex"
            flexDirection="column"
            borderRight={1}
            borderColor="#D9D9D9"
        >
            <Box p={2}>
                <AppFormField
                    title="Search"
                    startIcon={<SearchIcon sx={{ color: '#9e9e9e' }} />}
                    value={officeSearch}
                    onChange={(e) => setOfficeSearch(e.target.value)}
                    placeholder="Search offices..."
                />
            </Box>

            <Box flex={1} overflow="auto" px={2}>
                {loading && offices.length === 0 ? (
                    <Box display="flex" justifyContent="center" mt={3}>
                        <CircularProgress />
                    </Box>
                ) : filteredOffices.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
                        {officeSearch ? 'No offices found matching your search' : 'No offices found'}
                    </Typography>
                ) : (
                    filteredOffices.map((office, index) => (
                        <Box
                            key={office.id || index}
                            onClick={() => handleOfficeClick(office)}
                            sx={{
                                border: 1,
                                borderColor: selectedOffice?.id === office.id ? '#ff9800' : '#D1DFDB',
                                borderRadius: 1,
                                p: 0.75,
                                mb: 0.5,
                                bgcolor: selectedOffice?.id === office.id
                                    ? 'rgba(255, 152, 0, 0.15)'
                                    : '#F0F8FF',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                    bgcolor: selectedOffice?.id === office.id
                                        ? 'rgba(255, 152, 0, 0.25)'
                                        : 'rgba(255, 152, 0, 0.08)',
                                },
                            }}
                        >
                            <FiMapPin
                                style={{ marginLeft: 10, marginRight: 15, fontSize: 22, color: '#ff9800' }} />
                            <Box flex={1}>
                                <Typography variant="body2" fontWeight={500}>
                                    {office.officeName} - {office.capacity || 'N/A'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Type: {office.officeType || 'N/A'}
                                </Typography>
                            </Box>
                            <IconButton
                                size="small"
                                onClick={(e) => handleOfficeMenuOpen(e, office)}
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

export default OfficeList;
