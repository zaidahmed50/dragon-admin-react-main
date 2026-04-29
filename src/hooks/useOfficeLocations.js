import { useState, useEffect } from 'react';
import { OfficeLocationService } from '../services/index.js';
import { useJsApiLoader } from "@react-google-maps/api";

const LIBRARIES = ["places", "maps"];

const useOfficeLocations = () => {
    const [offices, setOffices] = useState([]);
    const [filteredOffices, setFilteredOffices] = useState([]);
    const [officeTypes, setOfficeTypes] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openOfficeDialog, setOpenOfficeDialog] = useState(false);
    const [officeEditMode, setOfficeEditMode] = useState(false);
    const [currentOffice, setCurrentOffice] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [officeSearch, setOfficeSearch] = useState('');
    const [mapCenter, setMapCenter] = useState({ lat: 31.5204, lng: 74.3587 });
    const [markerPosition, setMarkerPosition] = useState({ lat: 31.5204, lng: 74.3587 });
    const [dialogMapCenter, setDialogMapCenter] = useState({ lat: 31.5204, lng: 74.3587 });
    const [dialogMarker, setDialogMarker] = useState(null);
     const [officeRoles, setOfficeRoles] = useState(null);


    const [officeFormData, setOfficeFormData] = useState({
        id:null,
        officeName: '',
        address: '',
        gpsLocation: '',
        capacity: '',
        remarks: '',
        ownBy: '',
        officeTypeId: '',
        wireless: false,
        redundant: false,
        officeRoleId: ''
    });

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [officeToDelete, setOfficeToDelete] = useState(null);

    // Menu states
    const [officeAnchorEl, setOfficeAnchorEl] = useState(null);
    const [selectedOfficeForMenu, setSelectedOfficeForMenu] = useState(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    useEffect(() => {
        fetchOffices();
        fetchOfficeTypes();
        fetchOfficeRoles();
    }, []);

    useEffect(() => {
        if (officeSearch.trim() === '') {
            setFilteredOffices(offices);
        } else {
            const filtered = offices.filter(office =>
                office.officeName?.toLowerCase().includes(officeSearch.toLowerCase()) ||
                office.address?.toLowerCase().includes(officeSearch.toLowerCase()) ||
                office.ownBy?.toLowerCase().includes(officeSearch.toLowerCase()) ||
                office.remarks?.toLowerCase().includes(officeSearch.toLowerCase()) ||
                office.capacity?.toLowerCase().includes(officeSearch.toLowerCase()) ||
                office.gpsLocation?.toLowerCase().includes(officeSearch.toLowerCase()) ||
                office.officeType?.toLowerCase().includes(officeSearch.toLowerCase())
            );
            setFilteredOffices(filtered);
        }
    }, [officeSearch, offices]);

    const fetchOffices = async () => {
        setLoading(true);
        try {
            const response = await OfficeLocationService.getOffices();
            if (response?.data) {
                setOffices(response.data);
                setFilteredOffices(response.data);
            }
        } catch (error) {
            console.error('Error fetching offices:', error);
            setErrorMessage('Failed to load offices');
        } finally {
            setLoading(false);
        }
    };



    const fetchOfficeTypes = async () => {
        try {
            const response = await OfficeLocationService.getOfficeTypes();
            if (response?.data) {
                setOfficeTypes(response.data);
            }
        } catch (error) {
            console.error('Error fetching office types:', error);
        }
    };
    const fetchOfficeRoles = async () => {
        try {
            const response = await OfficeLocationService.getOfficeRoles();
            if (response?.data) {
                setOfficeRoles(response.data);
            }
        } catch (error) {
            console.error('Error fetching office types:', error);
        }
    };

    const handleOfficeClick = (office) => {
        setSelectedOffice(office);
        if (office.gpsLocation) {
            const [lat, lng] = office.gpsLocation.split(',').map(coord => parseFloat(coord.trim()));
            if (!isNaN(lat) && !isNaN(lng)) {
                setMapCenter({ lat, lng });
                setMarkerPosition({ lat, lng });
            }
        }
    };

    const handleOpenOfficeDialog = (office = null) => {
        if (office) {
            setOfficeEditMode(true);
            setCurrentOffice(office);
            setOfficeFormData({
                id:office.id,
                officeName: office.officeName || '',
                address: office.address || '',
                gpsLocation: office.gpsLocation || '',
                capacity: office.capacity || '',
                remarks: office.remarks || '',
                ownBy: office.ownBy || '',
                officeTypeId: office.officeTypeId || '',
                wireless: office.wireless || false,
                redundant: office.redundant || false,
            });
            if (office.gpsLocation) {
                const [lat, lng] = office.gpsLocation.split(',').map(coord => parseFloat(coord.trim()));
                if (!isNaN(lat) && !isNaN(lng)) {
                    setDialogMapCenter({ lat, lng });
                    setDialogMarker({ lat, lng });
                }
            } else {
                setDialogMapCenter(mapCenter);
                setDialogMarker(null);
            }
        } else {
            setOfficeEditMode(false);
            setCurrentOffice(null);
            setOfficeFormData({
                officeName: '',
                address: '',
                gpsLocation: '',
                capacity: '',
                remarks: '',
                ownBy: '',
                officeTypeId: '',
                wireless: false,
                redundant: false,
            });
            setDialogMapCenter(mapCenter);
            setDialogMarker(null);
        }
        setOpenOfficeDialog(true);
    };

    const handleCloseOfficeDialog = () => {
        setOpenOfficeDialog(false);
        setOfficeEditMode(false);
        setCurrentOffice(null);
        setOfficeFormData({
            officeName: '',
            address: '',
            gpsLocation: '',
            capacity: '',
            remarks: '',
            ownBy: '',
            officeTypeId: '',
            wireless: false,
            redundant: false,
        });
        setDialogMarker(null);
    };

    const handleOfficeInputChange = (e) => {
        const { name, value, checked, type } = e.target;
        setOfficeFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleDialogMapClick = (event) => {
        if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            setDialogMarker({ lat, lng });
            setOfficeFormData(prev => ({
                ...prev,
                gpsLocation: `${lat}, ${lng}`
            }));
        }
    };

    const handleOfficeSubmit = async () => {

console.log('Submitting office data:', officeFormData); // Debugging line

        if (!officeFormData.officeName.trim()) {
            setErrorMessage('Office name is required');
            return;
        }

        if (!officeFormData.address.trim()) {
            setErrorMessage('Address is required');
            return;
        }

        if (!officeFormData.gpsLocation.trim()) {
            setErrorMessage('GPS location is required');
            return;
        }

        if (!officeFormData.ownBy.trim()) {
            setErrorMessage('Owned by is required');
            return;
        }

        setLoading(true);
        try {
            const dataToSubmit = {
                id:officeFormData.id,
                officeName: officeFormData.officeName.trim(),
                address: officeFormData.address.trim(),
                gpsLocation: officeFormData.gpsLocation.trim(),
                capacity: officeFormData.capacity.trim(),
                remarks: officeFormData.remarks.trim(),
                ownBy: officeFormData.ownBy.trim(),
                officeTypeId: officeFormData.officeTypeId || null,
                wireless: officeFormData.wireless,
                redundant: officeFormData.redundant,
                officeRoleId: officeFormData.officeRoleId || null,
            };

            if (officeEditMode && currentOffice) {
                const response = await OfficeLocationService.updateOfficeLocation(currentOffice.id, dataToSubmit);
                if (response?.data) {
                    setSuccessMessage('Office location updated successfully');
                    await fetchOffices();
                    handleCloseOfficeDialog();
                }
            } else {
                const response = await OfficeLocationService.createOfficeLocation(dataToSubmit);
                if (response?.data) {
                    setSuccessMessage('Office location created successfully');
                    await fetchOffices();
                    handleCloseOfficeDialog();
                }
            }
        } catch (error) {
            console.error('Error saving office location:', error);
            setErrorMessage(error.message || 'Failed to save office location');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDeleteDialog = (office) => {
        setOfficeToDelete(office);
        setOpenDeleteDialog(true);
        handleOfficeMenuClose();
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setOfficeToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!officeToDelete || !officeToDelete.id) {
            setErrorMessage('Invalid office location selected for deletion');
            handleCloseDeleteDialog();
            return;
        }

        setLoading(true);
        try {
            await OfficeLocationService.deleteOfficeLocation(officeToDelete.id);
            setSuccessMessage('Office location deleted successfully');
            await fetchOffices();
            if (selectedOffice?.id === officeToDelete.id) {
                setSelectedOffice(null);
            }
            handleCloseDeleteDialog();
        } catch (error) {
            console.error('Error deleting office location:', error);
            setErrorMessage('Failed to delete office location');
        } finally {
            setLoading(false);
        }
    };

    const handleOfficeMenuOpen = (event, office) => {
        event.stopPropagation();
        setOfficeAnchorEl(event.currentTarget);
        setSelectedOfficeForMenu(office);
    };

    const handleOfficeMenuClose = () => {
        setOfficeAnchorEl(null);
        setSelectedOfficeForMenu(null);
    };

    const handleOfficeEdit = () => {
        if (selectedOfficeForMenu) handleOpenOfficeDialog(selectedOfficeForMenu);
        handleOfficeMenuClose();
    };

    const handleCopyOfficeDetails = () => {
        if (!selectedOffice) return;

        const [lat, lng] = selectedOffice.gpsLocation
            ? selectedOffice.gpsLocation.split(',').map(coord => parseFloat(coord.trim()))
            : [null, null];

        const googleMapsUrl = lat && lng
            ? `https://www.google.com/maps?q=${lat},${lng}`
            : 'N/A';

        const officeDetails = `📍 Office Details:

Name: *${selectedOffice.officeName}*
Owned by: ${selectedOffice.ownBy || 'N/A'}
Type: ${selectedOffice.officeType || 'N/A'}
Capacity: ${selectedOffice.capacity || 'N/A'}
Wireless: ${selectedOffice.wireless ? 'Yes' : 'No'}
Redundant: ${selectedOffice.redundant ? 'Yes' : 'No'}
${selectedOffice.remarks ? `Remarks: ${selectedOffice.remarks}` : ''}
Address: ${selectedOffice.address || 'N/A'}
Google Maps: ${googleMapsUrl}`;

        navigator.clipboard.writeText(officeDetails)
            .then(() => {
                setSuccessMessage('Office details copied to clipboard!');
            })
            .catch((err) => {
                console.error('Failed to copy:', err);
                setErrorMessage('Failed to copy office details');
            });
    };

    return {
        offices,
        filteredOffices,
        officeTypes,
        selectedOffice,
        loading,
        openOfficeDialog,
        officeEditMode,
        currentOffice,
        successMessage,
        errorMessage,
        setSuccessMessage,
        setErrorMessage,
        officeSearch,
        setOfficeSearch,
        mapCenter,
        markerPosition,
        dialogMapCenter,
        dialogMarker,
        officeFormData,
        setOfficeFormData,
        openDeleteDialog,
        officeToDelete,
        officeAnchorEl,
        selectedOfficeForMenu,
        isLoaded,
        handleOfficeClick,
        handleOpenOfficeDialog,
        handleCloseOfficeDialog,
        handleOfficeInputChange,
        handleDialogMapClick,
        handleOfficeSubmit,
        handleOpenDeleteDialog,
        handleCloseDeleteDialog,
        handleConfirmDelete,
        handleOfficeMenuOpen,
        handleOfficeMenuClose,
        handleOfficeEdit,
        handleCopyOfficeDetails,
        officeRoles,
    };
};

export default useOfficeLocations;
