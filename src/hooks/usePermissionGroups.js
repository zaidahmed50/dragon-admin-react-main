import { useState, useEffect, useMemo } from 'react';
import { PermissionGroupService } from '../services/index.js';

const usePermissionGroups = () => {
    const [groups, setGroups] = useState([]);
    const [availablePermissions, setAvailablePermissions] = useState([]);
    const [assignedPermissions, setAssignedPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [permissionSearch, setPermissionSearch] = useState('');
    const [groupName, setGroupName] = useState('');
    const [currentGroupId, setCurrentGroupId] = useState(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [openManagePermissions, setOpenManagePermissions] = useState(false);
    const [isColorPlateVisible, setIsColorPlateVisible] = useState(false);
    const [notification, setNotification] = useState({ 
        open: false, 
        message: '', 
        severity: 'success' 
    });

    const [columnVisibility, setColumnVisibility] = useState({
        name: true,
        total: true,
        created_at: true,
    });

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const res = await PermissionGroupService.getAllPermissionGroups();
            setGroups(res?.body.data || []);
        } catch (error) {
            notify('Failed to fetch permission groups', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailablePermissions = async (groupId) => {
        try {
            const res = await PermissionGroupService.getAvailablePermissions(groupId);
            setAvailablePermissions(res?.body[0].data || []);
        } catch (error) {
            notify('Failed to fetch available permissions', 'error');
        }
    };

    const fetchAssignedPermissions = async (groupId) => {
        try {
            const res = await PermissionGroupService.getAssignedPermissions(groupId);
            setAssignedPermissions(res?.body || []);
        } catch (error) {
            notify('Failed to fetch assigned permissions', 'error');
        }
    };

    const notify = (message, severity = 'success') =>
        setNotification({ open: true, message, severity });

    const handleAddGroup = async () => {
        if (!groupName.trim()) {
            notify('Group name is required', 'error');
            return;
        }

        setLoading(true);
        try {
            await PermissionGroupService.createPermissionGroup({ groupName });
            notify('Permission group created successfully');
            setOpenAdd(false);
            setGroupName('');
            fetchGroups();
        } catch (error) {
            notify('Failed to create permission group', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenManagePermissions = async (group) => {
        setCurrentGroupId(group.id);
        setSelectedPermissions([]);
        await fetchAvailablePermissions(group.id);
        await fetchAssignedPermissions(group.id);
        setOpenManagePermissions(true);
    };

    const handleTogglePermission = (permission) => {
        setSelectedPermissions((prev) => {
            if (prev.includes(permission)) {
                return prev.filter((p) => p !== permission);
            }
            return [...prev, permission];
        });
    };

    const handleSavePermissions = async () => {
        if (selectedPermissions.length === 0) {
            notify('Please select at least one permission', 'warning');
            return;
        }

        setLoading(true);
        try {
            await PermissionGroupService.addPermissionsToGroup({
                groupId: currentGroupId,
                permissions: selectedPermissions,
            });
            notify('Permissions assigned successfully');
            setOpenManagePermissions(false);
            setSelectedPermissions([]);
            fetchGroups();
        } catch (error) {
            notify('Failed to assign permissions', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredGroups = useMemo(
        () =>
            groups.filter((g) =>
                Object.values(g).some((v) =>
                    String(v).toLowerCase().includes(search.toLowerCase())
                )
            ),
        [groups, search]
    );

    const filteredAvailablePermissions = useMemo(
        () =>
            availablePermissions.filter((p) =>
                (p.permission || '').toLowerCase().includes(permissionSearch.toLowerCase()) ||
                (p.category || '').toLowerCase().includes(permissionSearch.toLowerCase())
            ),
        [availablePermissions, permissionSearch]
    );

    return {
        groups,
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
        notify
    };
};

export default usePermissionGroups;
