import React from 'react';
import {
    Box,
    Typography,
    Button,
    Alert,
    Snackbar,
    MenuItem,
    Menu,
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import useIpPools from '../../../hooks/useIpPools';
import PoolList from './PoolList';
import IpCuttingList from './IpCuttingList';
import PoolDetails from './PoolDetails';
import PoolDialog from './PoolDialog';
import DeleteDialog from './DeleteDialog';

const IpPools = () => {
    const {
        ipPools,
        filteredIpPools,
        filteredIpCuttings,
        selectedPool,
        selectedIpCutting,
        loading,
        ipCuttingLoading,
        openPoolDialog,
        poolEditMode,
        successMessage,
        errorMessage,
        setSuccessMessage,
        setErrorMessage,
        poolSearch,
        setPoolSearch,
        ipCuttingSearch,
        setIpCuttingSearch,
        poolFormData,
        openDeleteDialog,
        poolToDelete,
        poolAnchorEl,
        selectedPoolForMenu,
        ipCuttingAnchorEl,
        selectedCuttingForMenu,
        handlePoolClick,
        handleIpCuttingClick,
        handleOpenPoolDialog,
        handleClosePoolDialog,
        handlePoolInputChange,
        handlePoolSubmit,
        handleOpenDeleteDialog,
        handleCloseDeleteDialog,
        handleConfirmDelete,
        handlePoolMenuOpen,
        handlePoolMenuClose,
        handlePoolEdit,
        handleIpCuttingMenuOpen,
        handleIpCuttingMenuClose
    } = useIpPools();

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h5" fontWeight={600} color="text.primary">
                    Internet Protocol Pools
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<FiPlus />}
                    onClick={() => handleOpenPoolDialog()}
                    disabled={loading}
                    sx={{
                        bgcolor: '#ff9800',
                        '&:hover': { bgcolor: '#f57c00' },
                        textTransform: 'none',
                    }}
                >
                    + Add Pool
                </Button>
            </Box>

            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="success" onClose={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="error" onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            <Box
                height="75vh"
                display="flex"
                border={1}
                borderColor="divider"
                borderRadius={3}
                bgcolor="background.paper"
                overflow="hidden"
            >
                <PoolList
                    loading={loading}
                    ipPools={ipPools}
                    filteredIpPools={filteredIpPools}
                    selectedPool={selectedPool}
                    poolSearch={poolSearch}
                    setPoolSearch={setPoolSearch}
                    handlePoolClick={handlePoolClick}
                    handlePoolMenuOpen={handlePoolMenuOpen}
                />

                <IpCuttingList
                    ipCuttingLoading={ipCuttingLoading}
                    filteredIpCuttings={filteredIpCuttings}
                    selectedPool={selectedPool}
                    selectedIpCutting={selectedIpCutting}
                    ipCuttingSearch={ipCuttingSearch}
                    setIpCuttingSearch={setIpCuttingSearch}
                    handleIpCuttingClick={handleIpCuttingClick}
                    handleIpCuttingMenuOpen={handleIpCuttingMenuOpen}
                />

                <PoolDetails
                    selectedPool={selectedPool}
                />
            </Box>

            <Menu
                anchorEl={poolAnchorEl}
                open={Boolean(poolAnchorEl)}
                onClose={handlePoolMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handlePoolEdit}>
                    <FiEdit2 style={{ marginRight: 8 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => handleOpenDeleteDialog(selectedPoolForMenu)}>
                    <FiTrash2 style={{ marginRight: 8, color: '#f44336' }} /> Delete
                </MenuItem>
            </Menu>

            <Menu
                anchorEl={ipCuttingAnchorEl}
                open={Boolean(ipCuttingAnchorEl)}
                onClose={handleIpCuttingMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleIpCuttingMenuClose}>
                    View
                </MenuItem>
                <MenuItem onClick={handleIpCuttingMenuClose}>
                    <FiEdit2 style={{ marginRight: 8 }} /> Edit
                </MenuItem>
                <MenuItem onClick={handleIpCuttingMenuClose}>
                    <FiTrash2 style={{ marginRight: 8, color: '#f44336' }} /> Delete
                </MenuItem>
            </Menu>

            <DeleteDialog
                open={openDeleteDialog}
                itemToDelete={poolToDelete}
                loading={loading}
                handleClose={handleCloseDeleteDialog}
                handleConfirm={handleConfirmDelete}
            />

            <PoolDialog
                open={openPoolDialog}
                editMode={poolEditMode}
                formData={poolFormData}
                loading={loading}
                handleClose={handleClosePoolDialog}
                handleSubmit={handlePoolSubmit}
                handleInputChange={handlePoolInputChange}
            />
        </Box>
    );
};

export default IpPools;
