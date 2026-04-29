import React from 'react';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Grid,
    Snackbar,
    Alert,
    CircularProgress,
    Checkbox,
    FormControlLabel,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    Divider,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
    Add as AddIcon,
    Security as SecurityIcon,
    TableChart as TableChartIcon,
    Palette as PaletteIcon,
} from '@mui/icons-material';
import usePermissionGroups from '../../../hooks/usePermissionGroups';
import AppFormField from '../../../common/fromField.jsx';

const PermissionGroupView = () => {
    const {
        filteredGroups,
        availablePermissions,
        filteredAvailablePermissions,
        assignedPermissions,
        selectedPermissions,
        loading,
        search,
        setSearch,
        permissionSearch,
        setPermissionSearch,
        groupName,
        setGroupName,
        currentGroupId,
        openAdd,
        setOpenAdd,
        openManagePermissions,
        setOpenManagePermissions,
        isColorPlateVisible,
        setIsColorPlateVisible,
        notification,
        setNotification,
        columnVisibility,
        setColumnVisibility,
        handleAddGroup,
        handleOpenManagePermissions,
        handleTogglePermission,
        handleSavePermissions,
        groups
    } = usePermissionGroups();

    const visibleColumns = React.useMemo(() => {
        const cols = [];
        if (columnVisibility.name) {
            cols.push({ 
                field: 'name', 
                headerName: 'Group Name', 
                flex: 1, 
                minWidth: 200 
            });
        }
        if (columnVisibility.total) {
            cols.push({ 
                field: 'total', 
                headerName: 'Permissions Count', 
                width: 180 
            });
        }

        cols.push({
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenManagePermissions(params.row)}
                        title="Manage Permissions"
                    >
                        <SecurityIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        });
        return cols;
    }, [columnVisibility, handleOpenManagePermissions]);

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
                <Typography variant="h5" fontWeight={600} color="#111827">
                    Permissions Groups
                </Typography>


                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAdd(true)}
                    sx={{ minWidth: 120 }}
                >
                    Add
                </Button>

                <TextField
                    size="small"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ flex: 1, maxWidth: 400 }}
                />

                <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                    <IconButton
                        onClick={() => setIsColorPlateVisible(!isColorPlateVisible)}
                        sx={{
                            border: '1px solid #D1D5DB',
                            borderRadius: 1,
                            backgroundColor: isColorPlateVisible ? 'primary.main' : 'transparent',
                            color: isColorPlateVisible ? 'white' : 'inherit',
                            '&:hover': {
                                backgroundColor: isColorPlateVisible 
                                    ? 'primary.dark' 
                                    : 'rgba(0,0,0,0.04)',
                            },
                        }}
                    >
                        <PaletteIcon />
                    </IconButton>

                    <IconButton
                        onClick={() => {
                            setColumnVisibility({
                                name: !columnVisibility.name,
                                total: !columnVisibility.total,
                                created_at: !columnVisibility.created_at,
                            });
                        }}
                        sx={{
                            border: '1px solid #D1D5DB',
                            borderRadius: 1,
                        }}
                    >
                        <TableChartIcon />
                    </IconButton>
                </Box>
            </Box>

            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={filteredGroups}
                    columns={visibleColumns}
                    loading={loading}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    disableSelectionOnClick
                    getRowClassName={(params) =>
                        isColorPlateVisible && params.indexRelativeToCurrentPage % 2 === 0
                            ? 'striped-row'
                            : ''
                    }
                    sx={{
                        '& .striped-row': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        },
                    }}
                />
            </Paper>

            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Permission Group</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <AppFormField
                            fullWidth
                            title="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
                    <Button onClick={handleAddGroup} variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={22} /> : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openManagePermissions}
                onClose={() => setOpenManagePermissions(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Manage Permissions - {groups.find((g) => g.id === currentGroupId)?.name}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <AppFormField
                            fullWidth
                            title="Search Permissions"
                            value={permissionSearch}
                            onChange={(e) => setPermissionSearch(e.target.value)}
                        />

                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Available Permissions
                                </Typography>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        height: 400,
                                        overflow: 'auto',
                                        p: 1,
                                    }}
                                >
                                    {loading ? (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '100%',
                                            }}
                                        >
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        <List dense>
                                            {filteredAvailablePermissions.map((perm, index) => (
                                                <React.Fragment key={index}>
                                                    <ListItem>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={selectedPermissions.includes(
                                                                        perm.permission
                                                                    )}
                                                                    onChange={() =>
                                                                        handleTogglePermission(
                                                                            perm.permission
                                                                        )
                                                                    }
                                                                />
                                                            }
                                                            label={
                                                                <Box>
                                                                    <Typography variant="body2">
                                                                        {perm.permission}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                    >
                                                                        {perm.category}
                                                                    </Typography>
                                                                </Box>
                                                            }
                                                        />
                                                    </ListItem>
                                                    {index <
                                                        filteredAvailablePermissions.length - 1 && (
                                                        <Divider />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    )}
                                </Paper>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Assigned Permissions
                                </Typography>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        height: 400,
                                        overflow: 'auto',
                                        p: 1,
                                    }}
                                >
                                    {loading ? (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '100%',
                                            }}
                                        >
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        <List dense>
                                            {assignedPermissions.map((perm, index) => (
                                                <React.Fragment key={index}>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary={
                                                                perm.acl_item?.permission || ''
                                                            }
                                                            secondary={
                                                                perm.acl_item?.category || ''
                                                            }
                                                        />
                                                    </ListItem>
                                                    {index < assignedPermissions.length - 1 && (
                                                        <Divider />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenManagePermissions(false)}>Cancel</Button>
                    <Button
                        onClick={handleSavePermissions}
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={22} /> : 'Save Permissions'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert severity={notification.severity}>{notification.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default PermissionGroupView;
