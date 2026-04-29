import { useState, useEffect, useMemo } from 'react';
import { ManagerService } from '../services/index.js';

const buildInitialForm = () => ({
    username: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
    maxUsers: '1000000',
    debtLimit: 0,
    discountRate: 0,
    aclGroupId: '',
    parentId: '',
    enabled: 1,
});

const useManagers = () => {
    const [managers, setManagers] = useState([]);
    const [permissionGroups, setPermissionGroups] = useState([]);
    const [formData, setFormData] = useState(buildInitialForm());
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchManagers();
        fetchPermissionGroups();
    }, []);

    const fetchManagers = async () => {
        setLoading(true);
        try {
            const res = await ManagerService.getManagers();
            setManagers(res?.data || []);
        } catch {
            notify('Failed to fetch managers', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchPermissionGroups = async () => {
        try {
            const res = await ManagerService.getAllPermissionGroups();
            setPermissionGroups(res?.body?.data || []);
        } catch (e) {
            console.error(e);
        }
    };

    const notify = (message, severity = 'success') =>
        setNotification({ open: true, message, severity });

    const handleChange = (field) => (e) =>
        setFormData((prev) => {
            let value = e.target.value;
            if (field === "discountRate") {
                value = value === "" ? "" : parseInt(value);
            }
            return ({ ...prev, [field]: value });
        });

    const resetForm = () => setFormData(buildInitialForm());

    const handleAddManager = async () => {
        if (formData.password !== formData.confirmPassword) {
            notify('Passwords do not match', 'error');
            return;
        }

        setLoading(true);
        try {
            await ManagerService.addManager({
                ...formData,
                allowedNases: [],
                requires2fa: 0,
                ignoreCaptcha: 0,
                parent_id: formData.parentId,
                acl_group_id: formData.aclGroupId,
                discount_rate: formData.discountRate,
            });
            notify('Manager added successfully');
            setOpenAdd(false);
            resetForm();
            fetchManagers();
        } catch {
            notify('Failed to add manager', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this manager?')) return;
        setLoading(true);
        try {
            await ManagerService.deleteManager(id);
            notify('Manager deleted');
            fetchManagers();
        } catch {
            notify('Delete failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredManagers = useMemo(
        () =>
            managers.filter((m) =>
                Object.values(m).some((v) =>
                    String(v).toLowerCase().includes(search.toLowerCase())
                )
            ),
        [managers, search]
    );

    return {
        managers,
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
        notify
    };
};

export default useManagers;
