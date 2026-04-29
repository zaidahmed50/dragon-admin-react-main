import { useState, useEffect } from 'react';
import { AreaService, DistributionPortService } from '../services/index.js';
import { useJsApiLoader } from "@react-google-maps/api";
import {reduceLatLng} from "../helper/formaters.jsx";

const LIBRARIES = ["places", "maps"];

const useAreaAndDpManagement = () => {
    const [mainAreas, setMainAreas] = useState([]);
    const [filteredMainAreas, setFilteredMainAreas] = useState([]);
    const [subAreas, setSubAreas] = useState([]);
    const [filteredSubAreas, setFilteredSubAreas] = useState([]);
    const [dpPorts, setDpPorts] = useState([]);
    const [filteredDps, setFilteredDps] = useState([]);
    const [selectedMainArea, setSelectedMainArea] = useState(null);
    const [selectedSubArea, setSelectedSubArea] = useState(null);
    const [selectedDp, setSelectedDp] = useState(null);
    const [loading, setLoading] = useState(false);
    const [subAreaLoading, setSubAreaLoading] = useState(false);
    const [dpLoading, setDpLoading] = useState(false);
    
    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [openSubAreaDialog, setOpenSubAreaDialog] = useState(false);
    const [openDpDialog, setOpenDpDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [subAreaEditMode, setSubAreaEditMode] = useState(false);
    const [dpEditMode, setDpEditMode] = useState(false);
    const [currentArea, setCurrentArea] = useState(null);
    const [currentSubArea, setCurrentSubArea] = useState(null);
    const [currentDp, setCurrentDp] = useState(null);
    
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Search states
    const [mainAreaSearch, setMainAreaSearch] = useState('');
    const [subAreaSearch, setSubAreaSearch] = useState('');
    const [dpSearch, setDpSearch] = useState('');

    // Bounding box coordinates
    const [boundingBoxCoords, setBoundingBoxCoords] = useState([]);
    const [subAreaBoundingBoxCoords, setSubAreaBoundingBoxCoords] = useState([]);

    const [formData, setFormData] = useState({
        areaName: '',
        shortName: '',
        areaBoundingBox: '',
    });

    const [subAreaFormData, setSubAreaFormData] = useState({
        subAreaName: '',
        shortName: '',
        subAreaBoundingBox: '',
    });

    // Delete confirmation dialog state
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState(''); // 'main', 'sub', or 'dp'

    // Google Map state
    const [mapCenter, setMapCenter] = useState({ lat: 31.5204, lng: 74.3587 }); // Default: Lahore
    const [dialogMapCenter, setDialogMapCenter] = useState({ lat: 31.5204, lng: 74.3587 });
    const [markers, setMarkers] = useState([]);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    // Fetch Main Areas
    useEffect(() => {
        fetchMainAreas();
    }, []);

    // Filter main areas based on search
    useEffect(() => {
        if (mainAreaSearch.trim() === '') {
            setFilteredMainAreas(mainAreas);
        } else {
            const filtered = mainAreas.filter(area =>
                area.areaName.toLowerCase().includes(mainAreaSearch.toLowerCase()) ||
                (area.shortName && area.shortName.toLowerCase().includes(mainAreaSearch.toLowerCase()))
            );
            setFilteredMainAreas(filtered);
        }
    }, [mainAreaSearch, mainAreas]);

    // Filter sub areas based on search
    useEffect(() => {
        if (subAreaSearch.trim() === '') {
            setFilteredSubAreas(subAreas);
        } else {
            const filtered = subAreas.filter(subArea =>
                subArea.subAreaName.toLowerCase().includes(subAreaSearch.toLowerCase()) ||
                (subArea.shortName && subArea.shortName.toLowerCase().includes(subAreaSearch.toLowerCase()))
            );
            setFilteredSubAreas(filtered);
        }
    }, [subAreaSearch, subAreas]);

    // Filter DPs based on search
    useEffect(() => {
        if (dpSearch.trim() === '') {
            setFilteredDps(dpPorts);
        } else {
            const filtered = dpPorts.filter(dp =>
                dp.dpName?.toLowerCase().includes(dpSearch.toLowerCase()) ||
                dp.address?.toLowerCase().includes(dpSearch.toLowerCase())
            );
            setFilteredDps(filtered);
        }
    }, [dpSearch, dpPorts]);

    const fetchMainAreas = async () => {
        setLoading(true);
        try {
            const response = await AreaService.getAllMainAreas();
            if (response?.data) {
                setMainAreas(response.data);
                setFilteredMainAreas(response.data);
            }
        } catch (error) {
            setErrorMessage('Failed to load areas');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubAreas = async (mainAreaId) => {
        setSubAreaLoading(true);
        try {
            const response = await AreaService.getSubAreasByMainArea(mainAreaId);
            if (response?.data) {
                setSubAreas(response.data);
                setFilteredSubAreas(response.data);
            } else {
                setSubAreas([]);
                setFilteredSubAreas([]);
            }
        } catch (error) {
            console.error('Error fetching sub areas:', error);
            setErrorMessage('Failed to load sub areas');
            setSubAreas([]);
            setFilteredSubAreas([]);
        } finally {
            setSubAreaLoading(false);
        }
    };
    
    const fetchDpPortsBySubArea = async (subAreaId) => {
        setDpLoading(true);
        try {
            const response = await DistributionPortService.getAllDpPortsBySubAreaId(subAreaId);
            if (response?.data) {
                setDpPorts(response.data);
                setFilteredDps(response.data);
                const newMarkers = response.data.map(dp => ({
                    lat: dp.lat || 31.435,
                    lng: dp.lng || 74.369,
                    name: dp.dpName,
                    address: dp.address,
                }));
                setMarkers(newMarkers);
                if (newMarkers.length > 0) {
                    setMapCenter({ lat: newMarkers[0].lat, lng: newMarkers[0].lng });
                }
            } else {
                setDpPorts([]);
                setFilteredDps([]);
                setMarkers([]);
            }
        } catch (error) {
            console.error('Error fetching DP ports:', error);
            setErrorMessage('Failed to load distribution ports');
            setDpPorts([]);
            setFilteredDps([]);
            setMarkers([]);
        } finally {
            setDpLoading(false);
        }
    };

    const handleMainAreaClick = (area) => {
        setSelectedMainArea(area);
        setSelectedSubArea(null);
        setSelectedDp(null);
        setSubAreaSearch('');
        setDpSearch('');
        setDpPorts([]);
        setFilteredDps([]);
        setMarkers([]);
        fetchSubAreas(area.id);

        if (area.areaBoundingBox) {
            const coords = area.areaBoundingBox.split(';').map(coord => {
                const [lat, lng] = coord.split(',');
                return { lat: parseFloat(lat), lng: parseFloat(lng) };
            });
            if (coords.length > 0) {
                setMapCenter(coords[0]);
            }
        } else if (area.latitude && area.longitude) {
            setMapCenter({ lat: parseFloat(area.latitude), lng: parseFloat(area.longitude) });
        }
    };
    
    const handleSubAreaClick = (subArea) => {
        setSelectedSubArea(subArea);
        setSelectedDp(null);
        setDpSearch('');
        fetchDpPortsBySubArea(subArea.id);
        
        if (subArea.subAreaBoundingBox) {
            const coords = subArea.subAreaBoundingBox.split(';').map(coord => {
                const [lat, lng] = coord.split(',');
                return { lat: parseFloat(lat), lng: parseFloat(lng) };
            });
            if (coords.length > 0) {
                setMapCenter(coords[0]);
            }
        }
    };

    const handleDpClick = (dp) => {
        setSelectedDp(dp);
        if (dp.lat && dp.lng) {
            setMapCenter({ lat: dp.lat, lng: dp.lng });
        }
    };

    const handleMapClick = (event) => {
        if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            const newCoords = [...boundingBoxCoords, { lat, lng }];
            setBoundingBoxCoords(newCoords);
            const boundingBoxString = newCoords.map(coord => `${reduceLatLng(coord.lat)},${reduceLatLng(coord.lng)}`).join(';');
            setFormData(prev => ({
                ...prev,
                areaBoundingBox: boundingBoxString
            }));
        }
    };

    const handleSubAreaMapClick = (event) => {
        if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            const newCoords = [...subAreaBoundingBoxCoords, { lat, lng }];
            setSubAreaBoundingBoxCoords(newCoords);
            const boundingBoxString = newCoords.map(coord => `${reduceLatLng(coord.lat)},${reduceLatLng(coord.lng)}`).join(';');
            setSubAreaFormData(prev => ({
                ...prev,
                subAreaBoundingBox: boundingBoxString
            }));
        }
    };

    const handleRemoveCoord = (index) => {
        const newCoords = boundingBoxCoords.filter((_, i) => i !== index);
        setBoundingBoxCoords(newCoords);
        const boundingBoxString = newCoords.map(coord => `${reduceLatLng(coord.lat)},${reduceLatLng(coord.lng)}`).join(';');
        setFormData(prev => ({
            ...prev,
            areaBoundingBox: boundingBoxString
        }));
    };

    const handleRemoveSubAreaCoord = (index) => {
        const newCoords = subAreaBoundingBoxCoords.filter((_, i) => i !== index);
        setSubAreaBoundingBoxCoords(newCoords);
        const boundingBoxString = newCoords.map(coord => `${reduceLatLng(coord.lat)},${reduceLatLng(coord.lng)}`).join(';');
        setSubAreaFormData(prev => ({
            ...prev,
            subAreaBoundingBox: boundingBoxString
        }));
    };

    const handleOpenDialog = (area = null) => {
        if (area) {
            setEditMode(true);
            setCurrentArea(area);
            setFormData({
                areaName: area.areaName || '',
                shortName: area.shortName || '',
                areaBoundingBox: area.areaBoundingBox || '',
            });
            if (area.areaBoundingBox) {
                const coords = area.areaBoundingBox.split(';').map(coord => {
                    const [lat, lng] = coord.split(',');
                    return { lat: parseFloat(lat), lng: parseFloat(lng) };
                });
                setBoundingBoxCoords(coords);
            } else {
                setBoundingBoxCoords([]);
            }
        } else {
            setEditMode(false);
            setCurrentArea(null);
            setFormData({
                areaName: '',
                shortName: '',
                areaBoundingBox: '',
            });
            setBoundingBoxCoords([]);
        }
        setDialogMapCenter({ lat: 31.5204, lng: 74.3587 });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditMode(false);
        setCurrentArea(null);
        setFormData({
            areaName: '',
            shortName: '',
            areaBoundingBox: '',
        });
        setBoundingBoxCoords([]);
    };

    const handleOpenSubAreaDialog = (subArea = null) => {
        if (subArea) {
            setSubAreaEditMode(true);
            setCurrentSubArea(subArea);
            setSubAreaFormData({
                subAreaName: subArea.subAreaName || '',
                shortName: subArea.shortName || '',
                subAreaBoundingBox: subArea.subAreaBoundingBox || '',
            });
            if (subArea.subAreaBoundingBox) {
                const coords = subArea.subAreaBoundingBox.split(';').map(coord => {
                    const [lat, lng] = coord.split(',');
                    return { lat: parseFloat(lat), lng: parseFloat(lng) };
                });
                setSubAreaBoundingBoxCoords(coords);
            } else {
                setSubAreaBoundingBoxCoords([]);
            }
        } else {
            setSubAreaEditMode(false);
            setCurrentSubArea(null);
            setSubAreaFormData({
                subAreaName: '',
                shortName: '',
                subAreaBoundingBox: '',
            });
            setSubAreaBoundingBoxCoords([]);
        }
        
        if (selectedMainArea && selectedMainArea.areaBoundingBox) {
             const coords = selectedMainArea.areaBoundingBox.split(';').map(coord => {
                const [lat, lng] = coord.split(',');
                return { lat: parseFloat(lat), lng: parseFloat(lng) };
            });
            if (coords.length > 0) {
                setDialogMapCenter(coords[0]);
            }
        } else {
            setDialogMapCenter({ lat: 31.5204, lng: 74.3587 });
        }
        
        setOpenSubAreaDialog(true);
    };

    const handleCloseSubAreaDialog = () => {
        setOpenSubAreaDialog(false);
        setSubAreaEditMode(false);
        setCurrentSubArea(null);
        setSubAreaFormData({
            subAreaName: '',
            shortName: '',
            subAreaBoundingBox: '',
        });
        setSubAreaBoundingBoxCoords([]);
    };
    
    const handleOpenDpDialog = (dp = null) => {
        if (dp) {
            setDpEditMode(true);
            setCurrentDp(dp);
        } else {
            setDpEditMode(false);
            setCurrentDp(null);
        }
        setOpenDpDialog(true);
    };

    const handleCloseDpDialog = () => {
        setOpenDpDialog(false);
        setDpEditMode(false);
        setCurrentDp(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubAreaInputChange = (e) => {
        const { name, value } = e.target;
        setSubAreaFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.areaName.trim()) {
            setErrorMessage('Area name is required');
            return;
        }
        if (!formData.shortName.trim()) {
            setErrorMessage('Short Name is required');
            return;
        }

        setLoading(true);
        try {
            const dataToSubmit = {
                areaName: formData.areaName.trim(),
                shortName: formData.shortName.trim(),
                areaBoundingBox: formData.areaBoundingBox || '',
            };

            if (editMode && currentArea) {
                const response = await AreaService.updateMainArea(currentArea.id, dataToSubmit);
                if (response?.data) {
                    setSuccessMessage('Main area updated successfully');
                    await fetchMainAreas();
                    handleCloseDialog();
                }
            } else {
                const response = await AreaService.createMainArea(dataToSubmit);
                if (response?.data) {
                    setSuccessMessage('Main area created successfully');
                    await fetchMainAreas();
                    handleCloseDialog();
                }
            }
        } catch (error) {
            console.error('Error saving main area:', error);
            setErrorMessage(error.message || 'Failed to save main area');
        } finally {
            setLoading(false);
        }
    };

    const handleSubAreaSubmit = async () => {
        if (!subAreaFormData.subAreaName.trim()) {
            setErrorMessage('Sub area name is required');
            return;
        }

        if (!selectedMainArea) {
            setErrorMessage('Please select a main area first');
            return;
        }

        setSubAreaLoading(true);
        try {
            const dataToSend = {
                ...subAreaFormData,
                mainAreaId: selectedMainArea.id,
                subAreaBoundingBox: subAreaFormData.subAreaBoundingBox || '',
            };

            if (subAreaEditMode && currentSubArea) {
                const response = await AreaService.updateSubArea(currentSubArea.id, dataToSend);
                if (response?.data) {
                    setSuccessMessage('Sub area updated successfully');
                    await fetchSubAreas(selectedMainArea.id);
                    handleCloseSubAreaDialog();
                }
            } else {
                const response = await AreaService.createSubArea(dataToSend);
                if (response?.data) {
                    setSuccessMessage('Sub area created successfully');
                    await fetchSubAreas(selectedMainArea.id);
                    handleCloseSubAreaDialog();
                }
            }
        } catch (error) {
            console.error('Error saving sub area:', error);
            setErrorMessage(error.message || 'Failed to save sub area');
        } finally {
            setSubAreaLoading(false);
        }
    };
    
    const handleDpSuccess = async (message) => {
        setSuccessMessage(message);
        if (selectedSubArea) {
            await fetchDpPortsBySubArea(selectedSubArea.id);
        }
    };

    const handleDpError = (message) => {
        setErrorMessage(message);
    };

    const handleOpenDeleteDialog = (item, type) => {
        setItemToDelete(item);
        setDeleteType(type);
        setOpenDeleteDialog(true);
        handleMenuClose();
        handleSubAreaMenuClose();
        handleDpMenuClose();
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setItemToDelete(null);
        setDeleteType('');
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete || !itemToDelete.id) {
            setErrorMessage('Invalid item selected for deletion');
            handleCloseDeleteDialog();
            return;
        }

        if (deleteType === 'main') setLoading(true);
        else if (deleteType === 'sub') setSubAreaLoading(true);
        else if (deleteType === 'dp') setDpLoading(true);

        try {
            if (deleteType === 'main') {
                await AreaService.deleteMainArea(itemToDelete.id);
            } else if (deleteType === 'sub') {
                await AreaService.deleteSubArea(itemToDelete.id);
            } else if (deleteType === 'dp') {
                await DistributionPortService.deleteDP(itemToDelete.id);
            }

            setSuccessMessage(`${deleteType.toUpperCase()} deleted successfully`);

            if (deleteType === 'main') {
                await fetchMainAreas();
                if (selectedMainArea?.id === itemToDelete.id) {
                    setSelectedMainArea(null);
                    setSubAreas([]);
                    setFilteredSubAreas([]);
                    setDpPorts([]);
                    setFilteredDps([]);
                }
            } else if (deleteType === 'sub') {
                await fetchSubAreas(selectedMainArea.id);
                 if (selectedSubArea?.id === itemToDelete.id) {
                    setSelectedSubArea(null);
                    setDpPorts([]);
                    setFilteredDps([]);
                }
            } else if (deleteType === 'dp') {
                await fetchDpPortsBySubArea(selectedSubArea.id);
            }

            handleCloseDeleteDialog();
        } catch (error) {
            console.error(`Error deleting ${deleteType}:`, error);
            setErrorMessage(`Failed to delete ${deleteType}`);
        } finally {
            if (deleteType === 'main') setLoading(false);
            else if (deleteType === 'sub') setSubAreaLoading(false);
            else if (deleteType === 'dp') setDpLoading(false);
        }
    };

    // Main Area Menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);

    const handleMenuOpen = (event, area) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedArea(area);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedArea(null);
    };

    const handleEdit = () => {
        if (selectedArea) handleOpenDialog(selectedArea);
        handleMenuClose();
    };

    // Sub Area Menu
    const [subAreaAnchorEl, setSubAreaAnchorEl] = useState(null);
    const [selectedSubAreaForMenu, setSelectedSubAreaForMenu] = useState(null);

    const handleSubAreaMenuOpen = (event, subArea) => {
        event.stopPropagation();
        setSubAreaAnchorEl(event.currentTarget);
        setSelectedSubAreaForMenu(subArea);
    };

    const handleSubAreaMenuClose = () => {
        setSubAreaAnchorEl(null);
        setSelectedSubAreaForMenu(null);
    };

    const handleSubAreaEdit = () => {
        if (selectedSubAreaForMenu) handleOpenSubAreaDialog(selectedSubAreaForMenu);
        handleSubAreaMenuClose();
    };

    // DP Menu
    const [dpAnchorEl, setDpAnchorEl] = useState(null);
    const [selectedDpForMenu, setSelectedDpForMenu] = useState(null);

    const handleDpMenuOpen = (event, dp) => {
        event.stopPropagation();
        setDpAnchorEl(event.currentTarget);
        setSelectedDpForMenu(dp);
    };

    const handleDpMenuClose = () => {
        setDpAnchorEl(null);
        setSelectedDpForMenu(null);
    };

    const handleDpEdit = () => {
        if (selectedDpForMenu) handleOpenDpDialog(selectedDpForMenu);
        handleDpMenuClose();
    };

    return {
        mainAreas,
        filteredMainAreas,
        subAreas,
        filteredSubAreas,
        dpPorts,
        filteredDps,
        selectedMainArea,
        selectedSubArea,
        selectedDp,
        loading,
        subAreaLoading,
        dpLoading,
        openDialog,
        openSubAreaDialog,
        openDpDialog,
        editMode,
        subAreaEditMode,
        dpEditMode,
        currentArea,
        currentSubArea,
        currentDp,
        successMessage,
        errorMessage,
        setSuccessMessage,
        setErrorMessage,
        mainAreaSearch,
        setMainAreaSearch,
        subAreaSearch,
        setSubAreaSearch,
        dpSearch,
        setDpSearch,
        boundingBoxCoords,
        setBoundingBoxCoords,
        subAreaBoundingBoxCoords,
        setSubAreaBoundingBoxCoords,
        formData,
        subAreaFormData,
        openDeleteDialog,
        itemToDelete,
        deleteType,
        mapCenter,
        dialogMapCenter,
        markers,
        isLoaded,
        handleMainAreaClick,
        handleSubAreaClick,
        handleDpClick,
        handleMapClick,
        handleSubAreaMapClick,
        handleRemoveCoord,
        handleRemoveSubAreaCoord,
        handleOpenDialog,
        handleCloseDialog,
        handleOpenSubAreaDialog,
        handleCloseSubAreaDialog,
        handleOpenDpDialog,
        handleCloseDpDialog,
        handleInputChange,
        handleSubAreaInputChange,
        handleSubmit,
        handleSubAreaSubmit,
        handleDpSuccess,
        handleDpError,
        handleOpenDeleteDialog,
        handleCloseDeleteDialog,
        handleConfirmDelete,
        anchorEl,
        selectedArea,
        handleMenuOpen,
        handleMenuClose,
        handleEdit,
        subAreaAnchorEl,
        selectedSubAreaForMenu,
        handleSubAreaMenuOpen,
        handleSubAreaMenuClose,
        handleSubAreaEdit,
        dpAnchorEl,
        selectedDpForMenu,
        handleDpMenuOpen,
        handleDpMenuClose,
        handleDpEdit
    };
};

export default useAreaAndDpManagement;
