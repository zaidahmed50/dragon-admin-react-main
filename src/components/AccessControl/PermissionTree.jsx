import React, { useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Checkbox,
    Collapse,
    useTheme,
    alpha,
    IconButton
} from '@mui/material';
import {
    ExpandLess,
    ExpandMore,
    CheckCircle,
    RadioButtonUnchecked
} from '@mui/icons-material';

const PermissionTree = ({ permissions, checked, onToggle, onModuleToggle, color = 'primary' }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState({});

    const handleExpandClick = (module, e) => {
        e.stopPropagation();
        setExpanded((prev) => ({ ...prev, [module]: !prev[module] }));
    };

    const groupedPermissions = permissions.reduce((acc, perm) => {
        const module = perm.module || 'General';
        if (!acc[module]) {
            acc[module] = [];
        }
        acc[module].push(perm);
        return acc;
    }, {});

    const headerColor = color === 'primary' ? theme.palette.primary.main : theme.palette.success.main;

    return (
        <Box sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
            <List component="nav" dense disablePadding>
                {Object.keys(groupedPermissions).map((module) => {
                    const modulePermissions = groupedPermissions[module];
                    const isExpanded = expanded[module];
                    
                    const modulePermissionIds = modulePermissions.map(p => p.permission);
                    const selectedCount = modulePermissions.filter(p => checked.includes(p.permission)).length;
                    const totalCount = modulePermissions.length;
                    const isAllSelected = selectedCount === totalCount && totalCount > 0;
                    const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;
                    
                    return (
                        <Box key={module} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                            <ListItem 
                                button 
                                onClick={() => onModuleToggle(modulePermissionIds)}
                                sx={{ 
                                    py: 1,
                                    px: 1.5,
                                    bgcolor: isExpanded ? alpha(headerColor, 0.03) : 'transparent',
                                    '&:hover': { bgcolor: alpha(headerColor, 0.05) }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Checkbox
                                        edge="start"
                                        checked={isAllSelected}
                                        indeterminate={isIndeterminate}
                                        tabIndex={-1}
                                        disableRipple
                                        size="small"
                                        icon={<RadioButtonUnchecked fontSize="small" />}
                                        checkedIcon={<CheckCircle fontSize="small" />}
                                        indeterminateIcon={<CheckCircle fontSize="small" sx={{ opacity: 0.6 }} />}
                                        sx={{ 
                                            color: 'text.disabled',
                                            '&.Mui-checked': { color: headerColor },
                                            '&.MuiCheckbox-indeterminate': { color: headerColor }
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={module.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                                    secondary={
                                        <Typography variant="caption" color={selectedCount > 0 ? headerColor : 'text.secondary'} fontWeight={selectedCount > 0 ? 600 : 400}>
                                            {selectedCount}/{totalCount} selected
                                        </Typography>
                                    }
                                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                                />
                                <IconButton 
                                    size="small" 
                                    onClick={(e) => handleExpandClick(module, e)}
                                    sx={{ ml: 1 }}
                                >
                                    {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                                </IconButton>
                            </ListItem>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                                    {modulePermissions.map((perm) => {
                                        const isChecked = checked.includes(perm.permission);
                                        return (
                                            <ListItem
                                                key={perm.permission}
                                                button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggle(perm.permission);
                                                }}
                                                sx={{ 
                                                    pl: 4, 
                                                    py: 0.5,
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
                                                    primary={perm.label} 
                                                    secondary={perm.permission}
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
                        <Typography variant="body2">No permissions</Typography>
                    </Box>
                )}
            </List>
        </Box>
    );
};

export default PermissionTree;
