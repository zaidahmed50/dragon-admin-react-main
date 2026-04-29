import React from 'react';
import {
    Box,
    Button,
    TextField,
    Snackbar,
    Alert,
    IconButton, Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useManagers from '../../../hooks/useManagers';
import AddManagerDialog from './AddManagerDialog';

const ManagersList = () => {
    const navigate = useNavigate();
    const {
        filteredManagers,
        permissionGroups,
        formData,
        loading,
        search,
        setSearch,
        openAdd,
        setOpenAdd,
        notification,
        setNotification,
        handleChange,
        handleAddManager,
        handleDelete,
        managers
    } = useManagers();

    const columns = [
        { field: 'username', headerName: 'Username', width: 150 },
        { field: 'firstname', headerName: 'First Name', width: 130 },
        { field: 'lastname', headerName: 'Last Name', width: 130 },
        {
            field: 'email',
            headerName: 'Email',
            width: 220,
            renderCell: (p) => (
                <IconButton size="small" onClick={() => window.open(`mailto:${p.value}`)}>
                    <EmailIcon fontSize="small" />
                </IconButton>
            ),
        },
        {
            field: 'phone',
            headerName: 'Phone',
            width: 160,
            renderCell: (p) => (
                <IconButton size="small" onClick={() => window.open(`https://wa.me/${p.value.replace(/\D/g, '')}`)}>
                    <PhoneIcon fontSize="small" />
                </IconButton>
            ),
        },
        {
            field: 'enabled',
            headerName: 'Status',
            width: 100,
            renderCell: (p) => (p.value === 1 ? 'Active' : 'Inactive'),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 160,
            renderCell: (p) => (
                <>
                    <IconButton size="small"
                        onClick={() => navigate('/dragon-core/manager-detail', { state: { manager: p.row } })}>
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small"
                        onClick={() => navigate('/dragon-core/manager-edit', { state: { manager: p.row } })}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(p.row.id)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h5" fontWeight={600} color="#111827">
                    Managers
                </Typography>
                <TextField
                    size="small"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: 280 }}
                />
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
                    Add Manager
                </Button>
            </Box>

            <DataGrid
                autoHeight
                rows={filteredManagers}
                columns={columns}
                loading={loading}
                pageSize={10}
                getRowId={(row) => row.sasUserId}
            />

            <AddManagerDialog
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onSubmit={handleAddManager}
                loading={loading}
                formData={formData}
                permissionGroups={permissionGroups}
                managers={managers}
                onChange={handleChange}
            />

            <Snackbar open={notification.open} autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}>
                <Alert severity={notification.severity}>{notification.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default ManagersList;
