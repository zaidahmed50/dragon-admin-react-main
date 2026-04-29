import { useState, useEffect } from 'react';
import { IpPoolService } from '../services/index.js';

const useIpPools = () => {
    const [ipPools, setIpPools] = useState([]);
    const [filteredIpPools, setFilteredIpPools] = useState([]);
    const [ipCuttings, setIpCuttings] = useState([]);
    const [filteredIpCuttings, setFilteredIpCuttings] = useState([]);
    const [selectedPool, setSelectedPool] = useState(null);
    const [selectedIpCutting, setSelectedIpCutting] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ipCuttingLoading, setIpCuttingLoading] = useState(false);
    const [openPoolDialog, setOpenPoolDialog] = useState(false);
    const [poolEditMode, setPoolEditMode] = useState(false);
    const [currentPool, setCurrentPool] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [poolSearch, setPoolSearch] = useState('');
    const [ipCuttingSearch, setIpCuttingSearch] = useState('');

    const [poolFormData, setPoolFormData] = useState({
        name: '',
        leaseTime: '',
        ipAddress: '',
        startIp: '',
        endIp: '',
        ipCutting: '',
        ipStatusId: '',
        ipDescription: '',
    });

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [poolToDelete, setPoolToDelete] = useState(null);

    // Menu states
    const [poolAnchorEl, setPoolAnchorEl] = useState(null);
    const [selectedPoolForMenu, setSelectedPoolForMenu] = useState(null);
    const [ipCuttingAnchorEl, setIpCuttingAnchorEl] = useState(null);
    const [selectedCuttingForMenu, setSelectedCuttingForMenu] = useState(null);

    useEffect(() => {
        fetchIpPools();
    }, []);

    useEffect(() => {
        if (poolSearch.trim() === '') {
            setFilteredIpPools(ipPools);
        } else {
            const filtered = ipPools.filter(pool =>
                pool.ipAddress?.toLowerCase().includes(poolSearch.toLowerCase()) ||
                pool.ipCutting?.toString().toLowerCase().includes(poolSearch.toLowerCase()) ||
                pool.ipDescription?.toLowerCase().includes(poolSearch.toLowerCase())
            );
            setFilteredIpPools(filtered);
        }
    }, [poolSearch, ipPools]);

    useEffect(() => {
        if (ipCuttingSearch.trim() === '') {
            setFilteredIpCuttings(ipCuttings);
        } else {
            const filtered = ipCuttings.filter(cutting =>
                cutting.ipAddress?.toLowerCase().includes(ipCuttingSearch.toLowerCase()) ||
                cutting.ipDescription?.toLowerCase().includes(ipCuttingSearch.toLowerCase())
            );
            setFilteredIpCuttings(filtered);
        }
    }, [ipCuttingSearch, ipCuttings]);

    const fetchIpPools = async () => {
        setLoading(true);
        try {
            const response = await IpPoolService.getAllPools();
            if (response?.data) {
                setIpPools(response.data);
                setFilteredIpPools(response.data);
            }
        } catch (error) {
            console.error('Error fetching IP pools:', error);
            setErrorMessage('Failed to load IP pools');
        } finally {
            setLoading(false);
        }
    };

    const fetchIpCuttingsByPool = async (poolId) => {
        setIpCuttingLoading(true);
        try {
            const response = await IpPoolService.getAllIpCuttingsByPool(poolId);
            if (response?.data) {
                setIpCuttings(response.data);
                setFilteredIpCuttings(response.data);
            } else {
                setIpCuttings([]);
                setFilteredIpCuttings([]);
            }
        } catch (error) {
            console.error('Error fetching IP cuttings:', error);
            setErrorMessage('Failed to load IP cuttings');
            setIpCuttings([]);
            setFilteredIpCuttings([]);
        } finally {
            setIpCuttingLoading(false);
        }
    };

    const handlePoolClick = (pool) => {
        setSelectedPool(pool);
        setSelectedIpCutting(null);
        setIpCuttingSearch('');
        fetchIpCuttingsByPool(pool.id);
    };

    const handleIpCuttingClick = (cutting) => {
        setSelectedIpCutting(cutting);
    };

    const handleOpenPoolDialog = (pool = null) => {
        if (pool) {
            setPoolEditMode(true);
            setCurrentPool(pool);
            setPoolFormData({
                name: pool.name || '',
                leaseTime: pool.leaseTime || '',
                ipAddress: pool.ipAddress || '',
                startIp: pool.startIp || '',
                endIp: pool.endIp || '',
                ipCutting: pool.ipCutting || '',
                ipStatusId: pool.ipStatusId || '',
                ipDescription: pool.ipDescription || '',
            });
        } else {
            setPoolEditMode(false);
            setCurrentPool(null);
            setPoolFormData({
                name: '',
                leaseTime: '',
                ipAddress: '',
                startIp: '',
                endIp: '',
                ipCutting: '',
                ipStatusId: '',
                ipDescription: '',
            });
        }
        setOpenPoolDialog(true);
    };

    const handleClosePoolDialog = () => {
        setOpenPoolDialog(false);
        setPoolEditMode(false);
        setCurrentPool(null);
        setPoolFormData({
            name: '',
            leaseTime: '',
            ipAddress: '',
            startIp: '',
            endIp: '',
            ipCutting: '',
            ipStatusId: '',
            ipDescription: '',
        });
    };

    const handlePoolInputChange = (e) => {
        const { name, value } = e.target;
        setPoolFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePoolSubmit = async () => {
        if (!poolFormData.name.trim()) {
            setErrorMessage('Name is required');
            return;
        }

        if (!poolFormData.leaseTime.trim()) {
            setErrorMessage('Lease time is required');
            return;
        }

        if (!poolFormData.ipAddress.trim()) {
            setErrorMessage('IP Address is required');
            return;
        }

        if (!poolFormData.startIp.trim()) {
            setErrorMessage('Start IP is required');
            return;
        }

        if (!poolFormData.endIp.trim()) {
            setErrorMessage('End IP is required');
            return;
        }

        if (!poolFormData.ipCutting.trim()) {
            setErrorMessage('IP cutting is required');
            return;
        }

        if (!poolFormData.ipStatusId.trim()) {
            setErrorMessage('IP Status ID is required');
            return;
        }

        if (!poolFormData.ipDescription.trim()) {
            setErrorMessage('IP Description is required');
            return;
        }

        setLoading(true);
        try {
            const dataToSubmit = {
                name: poolFormData.name.trim(),
                leaseTime: poolFormData.leaseTime.trim(),
                ipAddress: poolFormData.ipAddress.trim(),
                startIp: poolFormData.startIp.trim(),
                endIp: poolFormData.endIp.trim(),
                ipCutting: poolFormData.ipCutting.trim(),
                ipStatusId: poolFormData.ipStatusId.trim(),
                ipDescription: poolFormData.ipDescription.trim(),
            };

            if (poolEditMode && currentPool) {
                const response = await IpPoolService.updateIpPool(currentPool.id, dataToSubmit);
                if (response?.data) {
                    setSuccessMessage('IP Pool updated successfully');
                    await fetchIpPools();
                    handleClosePoolDialog();
                    if (selectedPool?.id === currentPool.id) {
                        const updatedPool = ipPools.find(p => p.id === currentPool.id);
                        if (updatedPool) {
                            setSelectedPool({ ...updatedPool, ...dataToSubmit });
                        }
                    }
                }
            } else {
                const response = await IpPoolService.createIpPool(dataToSubmit);
                if (response?.data) {
                    setSuccessMessage('IP Pool created successfully');
                    await fetchIpPools();
                    handleClosePoolDialog();
                }
            }
        } catch (error) {
            console.error('Error saving IP pool:', error);
            setErrorMessage(error.message || 'Failed to save IP pool');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDeleteDialog = (pool) => {
        setPoolToDelete(pool);
        setOpenDeleteDialog(true);
        handlePoolMenuClose();
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setPoolToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!poolToDelete || !poolToDelete.id) {
            setErrorMessage('Invalid IP pool selected for deletion');
            handleCloseDeleteDialog();
            return;
        }

        setLoading(true);
        try {
            await IpPoolService.deleteIpPool(poolToDelete.id);
            setSuccessMessage('IP Pool deleted successfully');
            await fetchIpPools();
            if (selectedPool?.id === poolToDelete.id) {
                setSelectedPool(null);
                setIpCuttings([]);
                setFilteredIpCuttings([]);
            }
            handleCloseDeleteDialog();
        } catch (error) {
            console.error('Error deleting IP pool:', error);
            setErrorMessage('Failed to delete IP pool');
        } finally {
            setLoading(false);
        }
    };

    const handlePoolMenuOpen = (event, pool) => {
        event.stopPropagation();
        setPoolAnchorEl(event.currentTarget);
        setSelectedPoolForMenu(pool);
    };

    const handlePoolMenuClose = () => {
        setPoolAnchorEl(null);
        setSelectedPoolForMenu(null);
    };

    const handlePoolEdit = () => {
        if (selectedPoolForMenu) handleOpenPoolDialog(selectedPoolForMenu);
        handlePoolMenuClose();
    };

    const handleIpCuttingMenuOpen = (event, cutting) => {
        event.stopPropagation();
        setIpCuttingAnchorEl(event.currentTarget);
        setSelectedCuttingForMenu(cutting);
    };

    const handleIpCuttingMenuClose = () => {
        setIpCuttingAnchorEl(null);
        setSelectedCuttingForMenu(null);
    };

    return {
        ipPools,
        filteredIpPools,
        ipCuttings,
        filteredIpCuttings,
        selectedPool,
        selectedIpCutting,
        loading,
        ipCuttingLoading,
        openPoolDialog,
        poolEditMode,
        currentPool,
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
    };
};

export default useIpPools;
