import { useState, useEffect, useCallback } from 'react';
import accessGroupService from '../services/accessGroupService';

/**
 * Custom Hook for Access Group Management
 */
const useAccessControl = () => {
    // ==================== State Management ====================
    const [accessGroups, setAccessGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Access Group Form Data
    const [groupFormData, setGroupFormData] = useState({
        id: 0,
        groupName: ''
    });
    
    // Dialog States
    const [openGroupDialog, setOpenGroupDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Notification States
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // ==================== Utility Functions ====================
    
    const showNotification = (message, severity = 'info') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    // ==================== Data Fetching ====================
    
    const fetchAccessGroups = useCallback(async () => {
        try {
            setLoading(true);
            const response = await accessGroupService.getAllAccessGroups();
            if (response && response.success && Array.isArray(response.data)) {
                // Adapt to new response structure
                const groups = response.data.map(group => ({
                    id: group.id,
                    groupName: group.groupName,
                    // Calculate permission count from the new structure
                    permissionCount: group.assignedPermissions ? group.assignedPermissions.length : 0,
                }));
                setAccessGroups(groups);
            } else {
                setAccessGroups([]);
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to fetch access groups';
            showNotification(errorMessage, 'error');
            console.error('Error fetching access groups:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // ==================== Access Group Management ====================
    
    const handleCreateAccessGroup = async () => {
        if (!groupFormData.groupName.trim()) {
            showNotification('Please provide a group name', 'warning');
            return;
        }

        try {
            setLoading(true);
            await accessGroupService.createAccessGroup({
                groupName: groupFormData.groupName
            });
            showNotification('Access group created successfully', 'success');
            setOpenGroupDialog(false);
            setGroupFormData({ id: 0, groupName: '' });
            await fetchAccessGroups();
        } catch (error) {
            const errorMessage = error.message || 'Failed to create access group';
            showNotification(errorMessage, 'error');
            console.error('Error creating access group:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAccessGroup = async () => {
        if (!groupFormData.groupName.trim()) {
            showNotification('Please provide a group name', 'warning');
            return;
        }

        try {
            setLoading(true);
            await accessGroupService.updateAccessGroup({
                id: groupFormData.id,
                groupName: groupFormData.groupName
            });
            showNotification('Access group updated successfully', 'success');
            setOpenGroupDialog(false);
            setGroupFormData({ id: 0, groupName: '' });
            setIsEditMode(false);
            await fetchAccessGroups();
        } catch (error) {
            const errorMessage = error.message || 'Failed to update access group';
            showNotification(errorMessage, 'error');
            console.error('Error updating access group:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccessGroup = (id) => {
        setItemToDelete(id);
        setDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            setLoading(true);
            await accessGroupService.deleteAccessGroup(itemToDelete);
            showNotification('Access group deleted successfully', 'success');
            await fetchAccessGroups();
        } catch (error) {
            const errorMessage = error.message || 'Failed to delete access group';
            showNotification(errorMessage, 'error');
            console.error('Error deleting access group:', error);
        } finally {
            setLoading(false);
            setDialogOpen(false);
            setItemToDelete(null);
        }
    };

    const handleOpenGroupDialog = (group = null) => {
        if (group) {
            setGroupFormData({
                id: group.id,
                groupName: group.groupName
            });
            setIsEditMode(true);
        } else {
            setGroupFormData({
                id: 0,
                groupName: ''
            });
            setIsEditMode(false);
        }
        setOpenGroupDialog(true);
    };

    // ==================== Effects ====================
    
    useEffect(() => {
        fetchAccessGroups();
    }, [fetchAccessGroups]);

    // ==================== Return ====================
    
    return {
        // State
        accessGroups,
        loading,
        openGroupDialog,
        groupFormData,
        isEditMode,
        notification,
        dialogOpen,
        
        // Setters
        setOpenGroupDialog,
        setGroupFormData,
        setDialogOpen,
        
        // Actions
        handleCreateAccessGroup,
        handleUpdateAccessGroup,
        handleDeleteAccessGroup,
        confirmDelete,
        handleOpenGroupDialog,
        handleCloseNotification,
        fetchAccessGroups,
    };
};

export default useAccessControl;
