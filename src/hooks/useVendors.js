import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { VendorService } from '../services/vendorService.js';

export const useVendors = () => {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState(null);

    useEffect(() => {
        fetchVendors();
    }, []);

    const filteredVendors = useMemo(() => {
        if (!searchQuery) return vendors;
        const lowercasedQuery = searchQuery.toLowerCase();
        return vendors.filter(vendor =>
            Object.values(vendor).some(value =>
                String(value).toLowerCase().includes(lowercasedQuery)
            )
        );
    }, [searchQuery, vendors]);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const response = await VendorService.getAllVendors();
            if (response?.data) {
                setVendors(response.data);
            }
        } catch (error) {
            console.error('Error fetching vendors:', error);
            setErrorMessage('Failed to load vendors');
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, vendor) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedVendor(vendor);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedVendor(null);
    };

    const handleViewDetails = () => {
        if (selectedVendor) {
            navigate('/dragon-core/vendor-detail', { state: { vendor: selectedVendor } });
        }
        handleMenuClose();
    };

    const handleEdit = () => {
        if (selectedVendor) {
            navigate('/dragon-core/vendor-create', { state: { vendor: selectedVendor } });
        }
        handleMenuClose();
    };

    const handleDelete = async () => {
        if (!selectedVendor) return;
        if (!window.confirm(`Are you sure you want to toggle the status of ${selectedVendor.name}?`)) {
            return;
        }

        setLoading(true);
        try {
            await VendorService.toggleVendorStatus(selectedVendor.id);
            setSuccessMessage('Vendor status toggled successfully');
            await fetchVendors();
        } catch (error) {
            console.error('Error toggling vendor status:', error);
            setErrorMessage('Failed to toggle vendor status');
        } finally {
            setLoading(false);
            handleMenuClose();
        }
    };

    return {
        vendors: filteredVendors,
        loading,
        successMessage,
        errorMessage,
        searchQuery,
        anchorEl,
        selectedVendor,
        setSearchQuery,
        setSuccessMessage,
        setErrorMessage,
        handleMenuOpen,
        handleMenuClose,
        handleViewDetails,
        handleEdit,
        handleDelete,
    };
};
