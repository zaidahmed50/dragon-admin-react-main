import { Box, Typography, IconButton, CircularProgress, useTheme } from '@mui/material';
import { FiMoreVertical, FiPlus } from 'react-icons/fi';
import SearchIcon from '@mui/icons-material/Search';
import AppFormField from '../../../../common/fromField.jsx';
import AppButton from "../../../../common/AppButton.jsx";

const DpList = ({
    dpLoading,
    filteredDps,
    selectedSubArea,
    selectedDp,
    dpSearch,
    setDpSearch,
    handleDpClick,
    handleDpMenuOpen,
    handleOpenDpDialog
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
                    {'DP'}
                </Typography>
                {selectedSubArea && (
                    <AppButton
                        startIcon={<FiPlus />}
                        size="small"
                        onClick={() => handleOpenDpDialog()}
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
                value={dpSearch}
                onChange={(e) => setDpSearch(e.target.value)}
                placeholder="Search DP..."
            />

            {dpLoading ? (
                <Box display="flex" justifyContent="center" mt={3}>
                    <CircularProgress />
                </Box>
            ) : !selectedSubArea ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
                    Select a sub area to view DPs
                </Typography>
            ) : filteredDps.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
                    {dpSearch ? 'No Dp found matching your search' : 'No DP found'}
                </Typography>
            ) : (
                filteredDps.map((dp, index) => (
                    <Box
                        key={dp.id || index}
                        onClick={() => handleDpClick(dp)}
                        sx={{
                            border: 1,
                            borderColor: selectedDp?.id === dp.id ? 'primary.main' : 'divider',
                            borderRadius: 1,
                            p: 1,
                            mt: 1,
                            bgcolor: selectedDp?.id === dp.id
                                ? (theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)')
                                : (theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)'),
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: selectedDp?.id === dp.id
                                    ? (theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.3)' : 'rgba(33, 150, 243, 0.2)')
                                    : (theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)'),
                            },
                        }}
                    >
                        {/* DP Info */}
                        <Box>
                            <Typography variant="body1" fontWeight="500" color="text.primary">
                                {dp.dpName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {dp.dpNumber ??""}
                            </Typography>
                        </Box>

                        {/* Settings Icon */}
                        <IconButton onClick={(e) => handleDpMenuOpen(e, dp)}>
                            <FiMoreVertical />
                        </IconButton>
                    </Box>
                ))
            )}
        </Box>
    );
};

export default DpList;
