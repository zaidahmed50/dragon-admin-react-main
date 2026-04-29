import React from 'react';
import { Box, Typography, IconButton, CircularProgress, useTheme } from '@mui/material';
import { FiPlus, FiMoreVertical } from 'react-icons/fi';
import SearchIcon from '@mui/icons-material/Search';
import AppFormField from '../../../common/fromField.jsx';
import AppButton from "../../../common/AppButton.jsx";

const SubAreaList = ({
    subAreaLoading,
    filteredSubAreas,
    selectedMainArea,
    selectedSubArea,
    subAreaSearch,
    setSubAreaSearch,
    handleOpenSubAreaDialog,
    handleSubAreaMenuOpen,
    handleSubAreaClick
}) => {
    const theme = useTheme();

    return (
        <Box
            width="25%"
            display="flex"
            flexDirection="column"
            bgcolor="background.paper"
            border={0.5}
            padding={1}
            sx={{
                overflow: 'auto',
                borderColor: 'divider',
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" color="text.secondary">
                    {'Sub Areas'}
                </Typography>
                {selectedMainArea && (
                    <AppButton
                        startIcon={<FiPlus />}
                        size="small"
                        onClick={() => handleOpenSubAreaDialog()}
                        color="primary"
                        label={"Add"}
                    >
                        <FiPlus />
                    </AppButton>
                )}
            </Box>

            {selectedMainArea && (
                <AppFormField
                    title="Search"
                    startIcon={<SearchIcon />}
                    value={subAreaSearch}
                    onChange={(e) => setSubAreaSearch(e.target.value)}
                    placeholder="Search sub areas..."
                />
            )}

            {!selectedMainArea ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
                    Select a main area to view sub areas
                </Typography>
            ) : subAreaLoading ? (
                <Box display="flex" justifyContent="center" mt={3}>
                    <CircularProgress />
                </Box>
            ) : filteredSubAreas.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
                    {subAreaSearch ? 'No sub areas found matching your search' : 'No sub areas found. Click + to add one.'}
                </Typography>
            ) : (
                filteredSubAreas.map((subArea, index) => (
                    <Box
                        key={subArea.id || index}
                        onClick={() => handleSubAreaClick(subArea)}
                        sx={{
                            border: 1,
                            borderColor: selectedSubArea?.id === subArea.id ? 'primary.main' : 'success.main',
                            borderRadius: 1,
                            p: 1,
                            mt: 1,
                            bgcolor: selectedSubArea?.id === subArea.id 
                                ? (theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.3)' : 'rgba(33, 150, 243, 0.2)')
                                : (theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)'),
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: selectedSubArea?.id === subArea.id
                                    ? (theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.4)' : 'rgba(33, 150, 243, 0.3)')
                                    : (theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)'),
                            },
                        }}
                    >
                        {/* Sub Area Info */}
                        <Box>
                            <Typography variant="body1" fontWeight="500" color="text.primary">
                                {subArea.subAreaName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {subArea.shortName || 'No short name provided'}
                            </Typography>
                        </Box>

                        {/* Settings Icon */}
                        <IconButton onClick={(e) => handleSubAreaMenuOpen(e, subArea)}>
                            <FiMoreVertical />
                        </IconButton>
                    </Box>
                ))
            )}
        </Box>
    );
};

export default SubAreaList;
