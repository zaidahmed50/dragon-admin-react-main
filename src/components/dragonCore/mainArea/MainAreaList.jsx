import { Box, Typography, IconButton, CircularProgress, useTheme } from '@mui/material';
import {FiMoreVertical, FiPlus} from 'react-icons/fi';
import SearchIcon from '@mui/icons-material/Search';
import AppFormField from '../../../common/fromField.jsx';
import AppButton from "../../../common/AppButton.jsx";

const MainAreaList = ({
    loading,
    mainAreas,
    filteredMainAreas,
    selectedMainArea,
    mainAreaSearch,
    setMainAreaSearch,
    handleMainAreaClick,
    handleMenuOpen,
   handleOpenDialog,
}) => {
    const theme = useTheme();

    return (
        <Box
            width="25%"
            display="flex"
            flexDirection="column"
            bgcolor="background.paper"
            border={1}
            padding={1}
            sx={{
                borderTopLeftRadius: 5,
                borderColor: 'divider',
                overflow: 'auto',
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" color="text.secondary">
                    {'Main Areas'}
                </Typography>
                { (
                    <AppButton
                        startIcon={<FiPlus />}
                        size="small"
                        onClick={() => handleOpenDialog()}
                        color="primary"
                        label={"Add "}
                    >
                        <FiPlus />
                    </AppButton>
                )}
            </Box>
            <AppFormField
                title="Search"
                startIcon={<SearchIcon />}
                value={mainAreaSearch}
                onChange={(e) => setMainAreaSearch(e.target.value)}
                placeholder="Search main areas..."
            />

            {loading && mainAreas.length === 0 ? (
                <Box display="flex" justifyContent="center" mt={3}>
                    <CircularProgress />
                </Box>
            ) : filteredMainAreas.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
                    {mainAreaSearch ? 'No main areas found matching your search' : 'No main areas found'}
                </Typography>
            ) : (
                filteredMainAreas.map((area, index) => (
                    <Box
                        key={area.id || index}
                        onClick={() => handleMainAreaClick(area)}
                        sx={{
                            border: 1,
                            borderColor: selectedMainArea?.id === area.id ? 'primary.main' : 'divider',
                            borderRadius: 1,
                            p: 1,
                            mt: 1,
                            bgcolor: selectedMainArea?.id === area.id
                                ? (theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)')
                                : (theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)'),
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: selectedMainArea?.id === area.id
                                    ? (theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.3)' : 'rgba(33, 150, 243, 0.2)')
                                    : (theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)'),
                            },
                        }}
                    >
                        {/* Area Info */}
                        <Box>
                            <Typography variant="body1" fontWeight="500" color="text.primary">
                                {area.areaName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {area.shortName || 'No short name provided'}
                            </Typography>
                        </Box>

                        {/* Settings Icon */}
                        <IconButton onClick={(e) => handleMenuOpen(e, area)}>
                            <FiMoreVertical />
                        </IconButton>
                    </Box>
                ))
            )}
        </Box>
    );
};

export default MainAreaList;
