import React from 'react';
import { Box, Typography, IconButton, CircularProgress, useTheme } from '@mui/material';
import { FiPlus, FiMoreVertical } from 'react-icons/fi';
import SearchIcon from '@mui/icons-material/Search';
import AppFormField from '../../../common/fromField.jsx';
import AppButton from '../../../common/AppButton.jsx';

const DepartmentList = ({
    loading,
    departments,
    filteredDepartments,
    selectedDepartment,
    departmentSearch,
    setDepartmentSearch,
    handleDepartmentClick,
    handleOpenDepartmentDialog,
    handleDepartmentMenuOpen
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
            <Box p={2.5}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                >
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        color="text.primary"
                    >
                        Departments
                    </Typography>

                    <AppButton
                        variant="contained"
                        startIcon={<FiPlus />}
                        onClick={() => {
                            handleOpenDepartmentDialog(false);
                        }}
                        disabled={loading}
                        sx={{
                            bgcolor: '#ff9800',
                            '&:hover': { bgcolor: '#f57c00' },
                            textTransform: 'none',
                        }}
                        label="Add Department"
                    />
                </Box>

                <AppFormField
                    title="Search"
                    startIcon={<SearchIcon sx={{ color: 'text.secondary' }} />}
                    value={departmentSearch}
                    onChange={(e) => setDepartmentSearch(e.target.value)}
                    placeholder="Search departments..."
                />
            </Box>

            <Box flex={1} overflow="auto" px={2.5}>
                {loading && departments.length === 0 ? (
                    <Box display="flex" justifyContent="center" mt={3}>
                        <CircularProgress />
                    </Box>
                ) : filteredDepartments.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
                        {departmentSearch ? 'No departments found matching your search' : 'No departments found'}
                    </Typography>
                ) : (
                    filteredDepartments.map((dept, index) => (
                        <Box
                            key={dept.id || index}
                            onClick={() => handleDepartmentClick(dept)}
                            sx={{
                                border: 1,
                                borderColor: selectedDepartment?.id === dept.id ? 'primary.main' : 'divider',
                                borderRadius: 1,
                                p: 0.75,
                                mb: 0.5,
                                bgcolor: selectedDepartment?.id === dept.id
                                    ? (theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.15)')
                                    : 'background.default',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                    bgcolor: selectedDepartment?.id === dept.id
                                        ? (theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.25)')
                                        : 'action.hover',
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src="/assets/departments-icon.png"
                                sx={{ width: 25, height: 25, mr: 1.5, ml: 1, filter: 'hue-rotate(20deg)' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <Box flex={1}>
                                <Typography variant="body2" fontWeight={500} color="text.primary">
                                    {dept.name || 'N/A'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {dept.designations?.length || 0} designations
                                </Typography>
                            </Box>
                            <IconButton
                                size="small"
                                onClick={(e) => handleDepartmentMenuOpen(e, dept)}
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

export default DepartmentList;
