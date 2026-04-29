import React from 'react';
import { Box, Typography, IconButton, CircularProgress, useTheme } from '@mui/material';
import { FiPlus, FiMoreVertical } from 'react-icons/fi';
import SearchIcon from '@mui/icons-material/Search';
import AppFormField from '../../../common/fromField.jsx';
import AppButton from '../../../common/AppButton.jsx';

const DesignationList = ({
    designationLoading,
    filteredDesignations,
    selectedDepartment,
    selectedDesignation,
    designationSearch,
    setDesignationSearch,
    handleDesignationClick,
    handleOpenDesignationDialog,
    handleDesignationMenuOpen
}) => {
    const theme = useTheme();

    return (
        <Box
            width="67%"
            display="flex"
            flexDirection="column"
        >
            <Box p={2.5} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={600} color="text.primary">
                    {"Designations"}
                </Typography>
                {selectedDepartment && (
                    <AppButton
                        variant="contained"
                        size="small"
                        startIcon={<FiPlus />}
                        onClick={() => handleOpenDesignationDialog()}
                        sx={{
                            bgcolor: '#ff9800',
                            '&:hover': { bgcolor: '#f57c00' },
                            textTransform: 'none',
                        }}
                        label={"Add Designation"}
                    >
                    </AppButton>
                )}
            </Box>

            {selectedDepartment && (
                <Box px={2.5}>
                    <AppFormField
                        title="Search"
                        startIcon={<SearchIcon sx={{ color: 'text.secondary' }} />}
                        value={designationSearch}
                        onChange={(e) => setDesignationSearch(e.target.value)}
                        placeholder="Search designations..."
                    />
                </Box>
            )}

            <Box flex={1} overflow="auto" px={2.5} pt={1}>
                {!selectedDepartment ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
                        Select a department to view designations
                    </Typography>
                ) : designationLoading ? (
                    <Box display="flex" justifyContent="center" mt={3}>
                        <CircularProgress />
                    </Box>
                ) : filteredDesignations.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
                        {designationSearch ? 'No designations found matching your search' : 'No designations found. Click + to add one.'}
                    </Typography>
                ) : (
                    filteredDesignations.map((desig, index) => (
                        <Box
                            key={desig.id || index}
                            onClick={() => handleDesignationClick(desig)}
                            sx={{
                                border: 1,
                                borderColor: selectedDesignation?.id === desig.id ? 'primary.main' : 'divider',
                                borderRadius: 1,
                                p: 0.75,
                                mb: 0.5,
                                bgcolor: selectedDesignation?.id === desig.id
                                    ? (theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.15)')
                                    : 'background.default',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                    bgcolor: selectedDesignation?.id === desig.id
                                        ? (theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.25)')
                                        : 'action.hover',
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src="/assets/designer-icon.png"
                                sx={{ width: 25, height: 25, mr: 1.5, ml: 1, filter: 'hue-rotate(20deg)' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <Box flex={1}>
                                <Typography variant="body2" fontWeight={500} color="text.primary">
                                    {desig.name || 'N/A'}
                                </Typography>
                            </Box>
                            <IconButton
                                size="small"
                                onClick={(e) => handleDesignationMenuOpen(e, desig)}
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

export default DesignationList;
