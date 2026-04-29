import  { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Snackbar,
    Alert,
    Paper,
    List,
    ListItem,
    ListItemText,
    Chip,
    IconButton,
    Tooltip,
    useTheme,
    alpha,
    CircularProgress,
    Button
} from '@mui/material';
import {
    Add as AddIcon,
    Shield as ShieldIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ChevronRight,
    ArrowForward,
    ArrowBack,
    AdminPanelSettings
} from '@mui/icons-material';
import useAccessControl from '@/hooks/useAccessControl.js';
import GroupDialog from './GroupDialog.jsx';
import AppButton from "../../common/AppButton.jsx";
import PermissionTree from './PermissionTree.jsx';
import accessGroupService from '../../services/accessGroupService.js';
import ConfirmationDialog from './ConfirmationDialog.jsx';

const AccessControl = () => {
    const theme = useTheme();
    const {
        accessGroups,
        loading: groupsLoading,
        openGroupDialog,
        groupFormData,
        isEditMode,
        notification,
        dialogOpen,
        setOpenGroupDialog,
        setGroupFormData,
        setDialogOpen,
        handleCreateAccessGroup,
        handleUpdateAccessGroup,
        handleDeleteAccessGroup,
        confirmDelete,
        handleOpenGroupDialog,
        handleCloseNotification,
        fetchAccessGroups,
    } = useAccessControl();

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [availablePermissions, setAvailablePermissions] = useState([]);
    const [assignedPermissions, setAssignedPermissions] = useState([]);
    const [checkedAvailable, setCheckedAvailable] = useState([]);
    const [checkedAssigned, setCheckedAssigned] = useState([]);
    const [permissionsLoading, setPermissionsLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (selectedGroup) {
            fetchPermissions();
        } else {
            setAvailablePermissions([]);
            setAssignedPermissions([]);
        }
    }, [selectedGroup]);

    const fetchPermissions = async () => {
        if (!selectedGroup) return;
        
        setPermissionsLoading(true);
        try {
            const response = await accessGroupService.getAccessGroupById(selectedGroup.id);
            
            if (response && response.success && response.data) {
                const groupData = response.data;
                
                // The data is already in the correct object format
                setAssignedPermissions(groupData.assignedPermissions || []);
                setAvailablePermissions(groupData.unassignedPermissions || []);
            } else {
                setAssignedPermissions([]);
                setAvailablePermissions([]);
            }
            
            setCheckedAvailable([]);
            setCheckedAssigned([]);
        } catch (error) {
            console.error("Error fetching permissions:", error);
        } finally {
            setPermissionsLoading(false);
        }
    };

    const handleGroupSelect = (group) => {
        setSelectedGroup(group);
    };

    const handleToggleAvailable = (id) => {
        const currentIndex = checkedAvailable.indexOf(id);
        const newChecked = [...checkedAvailable];

        if (currentIndex === -1) {
            newChecked.push(id);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setCheckedAvailable(newChecked);
    };

    const handleToggleAssigned = (id) => {
        const currentIndex = checkedAssigned.indexOf(id);
        const newChecked = [...checkedAssigned];

        if (currentIndex === -1) {
            newChecked.push(id);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setCheckedAssigned(newChecked);
    };

    const handleModuleToggleAvailable = (modulePermissionIds) => {
        const allSelected = modulePermissionIds.every(id => checkedAvailable.includes(id));
        let newChecked = [...checkedAvailable];
        if (allSelected) {
            newChecked = newChecked.filter(id => !modulePermissionIds.includes(id));
        } else {
            modulePermissionIds.forEach(id => {
                if (!newChecked.includes(id)) {
                    newChecked.push(id);
                }
            });
        }
        setCheckedAvailable(newChecked);
    };

    const handleModuleToggleAssigned = (modulePermissionIds) => {
        const allSelected = modulePermissionIds.every(id => checkedAssigned.includes(id));
        let newChecked = [...checkedAssigned];
        if (allSelected) {
            newChecked = newChecked.filter(id => !modulePermissionIds.includes(id));
        } else {
            modulePermissionIds.forEach(id => {
                if (!newChecked.includes(id)) {
                    newChecked.push(id);
                }
            });
        }
        setCheckedAssigned(newChecked);
    };

    const handleAssignPermissions = async () => {
        if (checkedAvailable.length === 0 || !selectedGroup) return;
        setSaving(true);
        try {
            const currentAssignedIds = assignedPermissions.map(p => p.permission);
            const newPermissions = [...currentAssignedIds, ...checkedAvailable];
            const payload = { id: selectedGroup.id, permissions: newPermissions };
            await accessGroupService.assignPermissions(payload);
            await fetchPermissions();
            fetchAccessGroups();
        } catch (error) {
            console.error("Error assigning permissions:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleRemovePermissions = async () => {
        if (checkedAssigned.length === 0 || !selectedGroup) return;
        setSaving(true);
        try {
            const payload = { id: selectedGroup.id, permissions: checkedAssigned };
            await accessGroupService.removePermissions(payload);
            await fetchPermissions();
            await fetchAccessGroups();
        } catch (error) {
            console.error("Error removing permissions:", error);
        } finally {
            setSaving(false);
        }
    };

    const renderPermissionSection = (title, permissions, checked, onToggle, onModuleToggle, color, actionButton) => (
        <Paper
            elevation={0}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
            }}
        >
            <Box sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: alpha(color === 'success' ? theme.palette.success.main : theme.palette.primary.main, 0.05),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant="subtitle1" fontWeight={700} color={`${color}.main`}>{title}</Typography>
                {actionButton}
            </Box>
            {selectedGroup ? (
                permissionsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <CircularProgress size={30} />
                    </Box>
                ) : (
                    <PermissionTree
                        permissions={permissions}
                        checked={checked}
                        onToggle={onToggle}
                        onModuleToggle={onModuleToggle}
                        color={color}
                    />
                )
            ) : (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <AdminPanelSettings sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body2">Select a group to view permissions</Typography>
                </Box>
            )}
        </Paper>
    );

    return (
        <Box sx={{ 
            p: 2, 
            height: 'calc(85vh - 64px)',
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: 'background.default',
            width: '100%',
            overflow: 'hidden'
        }}>
            {/* Header Section */}
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex'
                    }}>
                        <ShieldIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight={700} color="text.primary">
                            Security & Permission Management
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage security groups and assign permissions to control access
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Main Wrapper */}
            <Box sx={{ display: 'flex', flex: 1, gap: 2, minHeight: 0 }}>
                {/* Section 1: Security Groups */}
                <Box sx={{ width: '33.33%', height: '100%' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            overflow: 'hidden',
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
                        }}
                    >
                        <Box sx={{
                            p: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            bgcolor: alpha(theme.palette.primary.main, 0.02)
                        }}>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={700}>Security Groups</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {accessGroups.length} Groups Available
                                </Typography>
                            </Box>
                            <AppButton
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenGroupDialog()}
                                label="New Role"
                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                            />
                        </Box>

                        <List sx={{ flex: 1, overflowY: 'auto', p: 1, gap: 1, display: 'flex', flexDirection: 'column' }}>
                            {accessGroups.map((group) => (
                                <ListItem
                                    key={group.id}
                                    button
                                    selected={selectedGroup?.id === group.id}
                                    onClick={() => handleGroupSelect(group)}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 0.5,
                                        py: 1,
                                        px: 1.5,
                                        border: '1px solid',
                                        borderColor: 'transparent',
                                        transition: 'all 0.2s',
                                        '&.Mui-selected': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.15),
                                            borderColor: alpha(theme.palette.primary.main, 0.4),
                                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                                        },
                                        '&:hover': { bgcolor: 'action.hover', borderColor: 'divider' }
                                    }}
                                    secondaryAction={
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenGroupDialog(group); }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteAccessGroup(group.id); }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    }
                                >
                                    <ListItemText
                                        primary={group.groupName}
                                        primaryTypographyProps={{ fontWeight: 600 }}
                                        secondary={`${group.permissionCount || 0} Permissions`}
                                    />
                                    {selectedGroup?.id === group.id && <ChevronRight color="primary" sx={{ mr: 1 }} />}
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Box>

                {/* Section 2: Assigned Permissions */}
                <Box sx={{ width: '33.33%', height: '100%' }}>
                    {renderPermissionSection(
                        'Assigned Permissions',
                        assignedPermissions,
                        checkedAssigned,
                        handleToggleAssigned,
                        handleModuleToggleAssigned,
                        'success',
                        <Button variant="contained" color="error" size="small" disabled={checkedAssigned.length === 0 || saving} onClick={handleRemovePermissions} startIcon={<ArrowForward />}>
                            Remove
                        </Button>
                    )}
                </Box>

                {/* Section 3: Available Permissions */}
                <Box sx={{ width: '33.33%', height: '100%' }}>
                    {renderPermissionSection(
                        'Available Permissions',
                        availablePermissions,
                        checkedAvailable,
                        handleToggleAvailable,
                        handleModuleToggleAvailable,
                        'primary',
                        <Button variant="contained" color="primary" size="small" disabled={checkedAvailable.length === 0 || saving} onClick={handleAssignPermissions} startIcon={<ArrowBack />}>
                            Assign
                        </Button>
                    )}
                </Box>
            </Box>
            {/* Dialogs */}
            <GroupDialog
                open={openGroupDialog}
                onClose={() => setOpenGroupDialog(false)}
                formData={groupFormData}
                onChange={setGroupFormData}
                onSubmit={isEditMode ? handleUpdateAccessGroup : handleCreateAccessGroup}
                loading={groupsLoading}
                isEditMode={isEditMode}
            />
            <ConfirmationDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this access group? This action cannot be undone."
                loading={groupsLoading}
            />

            {/* Notifications */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ borderRadius: 2 }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AccessControl;
