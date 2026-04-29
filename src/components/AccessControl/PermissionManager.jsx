import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Checkbox,
    Button,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Collapse,
    CircularProgress,
    Paper,
    useTheme,
    alpha,
    Divider,
    Chip
} from '@mui/material';
import {
    ExpandLess,
    ExpandMore,
    ArrowForward,
    ArrowBack,
    Security,
    CheckCircle,
    RadioButtonUnchecked,
    AdminPanelSettings
} from '@mui/icons-material';
import accessGroupService from '../../services/accessGroupService.js';

const PermissionTree = ({ permissions, checked, onToggle, title, color = 'primary' }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState({});

    const handleExpandClick = (module) => {
        setExpanded((prev) => ({ ...prev, [module]: !prev[module] }));
    };

    // Group permissions by module
    const groupedPermissions = permissions.reduce((acc, perm) => {
        const module = perm.module || 'General';
        if (!acc[module]) {
            acc[module] = [];
        }
        acc[module].push(perm);
        return acc;
    }, {});

    // Auto-expand if only one module
    useEffect(() => {
        const modules = Object.keys(groupedPermissions);
        if (modules.length > 0) {
            const newExpanded = {};
            modules.forEach(module => {
                newExpanded[module] = true;
            });
            setExpanded(newExpanded);
        }
    }, [permissions]);

    const headerColor = color === 'primary' ? theme.palette.primary.main : theme.palette.success.main;
    const headerBg = color === 'primary' ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.success.main, 0.05);

    return (
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
                bgcolor: headerBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant="subtitle1" fontWeight={700} color={headerColor}>
                    {title}
                </Typography>
                <Chip 
                    label={permissions.length} 
                    size="small" 
                    sx={{ 
                        bgcolor: 'white', 
                        fontWeight: 600, 
                        color: headerColor,
                        border: '1px solid',
                        borderColor: alpha(headerColor, 0.2)
                    }} 
                />
            </Box>
            
            <Box sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                <List component="nav" dense disablePadding>
                    {Object.keys(groupedPermissions).map((module) => {
                        const modulePermissions = groupedPermissions[module];
                        const isExpanded = expanded[module];
                        const selectedCount = modulePermissions.filter(p => checked.includes(p.id)).length;
                        const totalCount = modulePermissions.length;
                        const isAllSelected = selectedCount === totalCount && totalCount > 0;
                        
                        return (
                            <Box key={module} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                                <ListItem 
                                    button 
                                    onClick={() => handleExpandClick(module)}
                                    sx={{ 
                                        py: 1.5,
                                        bgcolor: isExpanded ? alpha(headerColor, 0.03) : 'transparent',
                                        '&:hover': { bgcolor: alpha(headerColor, 0.05) }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 32, color: isAllSelected ? headerColor : 'text.secondary' }}>
                                        {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={module} 
                                        secondary={
                                            <Typography variant="caption" color={selectedCount > 0 ? headerColor : 'text.secondary'} fontWeight={selectedCount > 0 ? 600 : 400}>
                                                {selectedCount}/{totalCount} selected
                                            </Typography>
                                        }
                                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                                    />
                                </ListItem>
                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                                        {modulePermissions.map((perm) => {
                                            const isChecked = checked.includes(perm.id);
                                            return (
                                                <ListItem
                                                    key={perm.id}
                                                    button
                                                    onClick={() => onToggle(perm.id)}
                                                    sx={{ 
                                                        pl: 6, 
                                                        py: 1,
                                                        '&:hover': { bgcolor: alpha(headerColor, 0.08) }
                                                    }}
                                                >
                                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                                        <Checkbox
                                                            edge="start"
                                                            checked={isChecked}
                                                            tabIndex={-1}
                                                            disableRipple
                                                            size="small"
                                                            icon={<RadioButtonUnchecked fontSize="small" />}
                                                            checkedIcon={<CheckCircle fontSize="small" />}
                                                            sx={{ 
                                                                color: 'text.disabled',
                                                                '&.Mui-checked': { color: headerColor }
                                                            }}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary={perm.name} 
                                                        secondary={perm.description}
                                                        primaryTypographyProps={{ 
                                                            fontWeight: isChecked ? 600 : 400,
                                                            color: isChecked ? 'text.primary' : 'text.secondary',
                                                            fontSize: '0.85rem'
                                                        }}
                                                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Collapse>
                            </Box>
                        );
                    })}
                    {Object.keys(groupedPermissions).length === 0 && (
                        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                            <Typography variant="body2">No permissions found</Typography>
                        </Box>
                    )}
                </List>
            </Box>
        </Paper>
    );
};

const PermissionManager = ({ selectedGroup, onPermissionsUpdated }) => {
    const theme = useTheme();
    const [availablePermissions, setAvailablePermissions] = useState([]);
    const [assignedPermissions, setAssignedPermissions] = useState([]);
    const [checkedAvailable, setCheckedAvailable] = useState([]);
    const [checkedAssigned, setCheckedAssigned] = useState([]);
    const [loading, setLoading] = useState(false);
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
        
        setLoading(true);
        try {
            const response = await accessGroupService.getAccessGroupById(selectedGroup.id);
            
            if (response && response.success && response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
                const groupData = response.data;
                
                const parsePermission = (permString) => {
                    if (typeof permString !== 'string') return null;
                    
                    const parts = permString.split('_');
                    const module = parts.length > 1 ? parts[0] : 'General';
                    const name = parts.length > 1 
                        ? parts.slice(1).join(' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
                        : permString.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
                    
                    return {
                        id: permString,
                        name: name,
                        module: module.charAt(0).toUpperCase() + module.slice(1).toLowerCase(),
                        description: permString
                    };
                };

                const assigned = (groupData.assignedPermissions || []).map(parsePermission).filter(Boolean);
                const unassigned = (groupData.unassignedPermissions || []).map(parsePermission).filter(Boolean);
                
                setAssignedPermissions(assigned);
                setAvailablePermissions(unassigned);
            } else {
                setAssignedPermissions([]);
                setAvailablePermissions([]);
            }
            
            setCheckedAvailable([]);
            setCheckedAssigned([]);
        } catch (error) {
            console.error("Error fetching permissions:", error);
        } finally {
            setLoading(false);
        }
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

    const handleAssignPermissions = async () => {
        if (checkedAvailable.length === 0 || !selectedGroup) return;

        setSaving(true);
        try {
            const currentAssignedIds = assignedPermissions.map(p => p.id);
            const newPermissions = [...currentAssignedIds, ...checkedAvailable];
            
            const payload = {
                id: selectedGroup.id,
                permissions: newPermissions
            };
            
            await accessGroupService.assignPermissions(payload);
            await fetchPermissions();
            if (onPermissionsUpdated) onPermissionsUpdated();
            
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
            const payload = {
                id: selectedGroup.id,
                permissions: checkedAssigned
            };
            
            await accessGroupService.removePermissions(payload);
            await fetchPermissions();
            if (onPermissionsUpdated) onPermissionsUpdated();
            
        } catch (error) {
            console.error("Error removing permissions:", error);
        } finally {
            setSaving(false);
        }
    };

    if (!selectedGroup) {
        return (
            <Paper 
                elevation={0}
                sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 4,
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
                }}
            >
                <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
                    <Box sx={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: '50%', 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3
                    }}>
                        <AdminPanelSettings sx={{ fontSize: 40, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        Select a Role
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Choose a security group from the left panel to manage its permissions and access controls.
                    </Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        Managing: <Chip label={selectedGroup.groupName} color="primary" sx={{ fontWeight: 600 }} />
                    </Typography>
                </Box>
                {loading && <CircularProgress size={24} />}
            </Box>

            <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
                {/* Assigned Permissions (Left) */}
                <Grid item xs={12} md={5.5} sx={{ height: '100%' }}>
                    <PermissionTree 
                        title="Assigned Permissions" 
                        permissions={assignedPermissions} 
                        checked={checkedAssigned} 
                        onToggle={handleToggleAssigned} 
                        color="success"
                    />
                </Grid>

                {/* Actions (Center) */}
                <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={checkedAvailable.length === 0 || saving}
                            onClick={handleAssignPermissions}
                            sx={{ 
                                minWidth: 44, 
                                width: 44, 
                                height: 44, 
                                borderRadius: '12px', 
                                p: 0,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        >
                            <ArrowBack sx={{ transform: { xs: 'rotate(90deg)', md: 'rotate(0deg)' } }} />
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            disabled={checkedAssigned.length === 0 || saving}
                            onClick={handleRemovePermissions}
                            sx={{ 
                                minWidth: 44, 
                                width: 44, 
                                height: 44, 
                                borderRadius: '12px', 
                                p: 0,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        >
                            <ArrowForward sx={{ transform: { xs: 'rotate(90deg)', md: 'rotate(0deg)' } }} />
                        </Button>
                    </Box>
                </Grid>

                {/* Available Permissions (Right) */}
                <Grid item xs={12} md={5.5} sx={{ height: '100%' }}>
                    <PermissionTree 
                        title="Available Permissions" 
                        permissions={availablePermissions} 
                        checked={checkedAvailable} 
                        onToggle={handleToggleAvailable} 
                        color="primary"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default PermissionManager;
