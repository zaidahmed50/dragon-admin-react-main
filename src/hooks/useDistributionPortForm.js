import { useState, useEffect } from 'react';
import { DistributionPortService } from '../services/index.js';

export const useDistributionPortForm = ({ open, editMode, currentDp, selectedSubArea, selectedMainArea, onSuccess, onError, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [mapCenter, setMapCenter] = useState({ lat: 31.435, lng: 74.369 });
    const [markerPosition, setMarkerPosition] = useState(null);
    const [formData, setFormData] = useState({
        dpName: '',
        dpNumber: '',
        lat: '',
        lng: '',
        remarks: '',
    });

    useEffect(() => {
        if (open) {
            if (editMode && currentDp) {
                initializeEditMode();
            } else {
                resetForm();
            }
            if (selectedSubArea?.subAreaBoundingBox) {
                const coords = selectedSubArea.subAreaBoundingBox.split(';').map(coord => {
                    const [lat, lng] = coord.split(',');
                    return { lat: parseFloat(lat), lng: parseFloat(lng) };
                });
                if (coords.length > 0) {
                    setMapCenter(coords[0]);
                }
            } else {
                 setMapCenter({ lat: 31.435, lng: 74.369 });
            }
        }
    }, [open, editMode, currentDp, selectedSubArea]);

    useEffect(() => {
        const fetchDpName = async () => {
            if (open && selectedSubArea?.id && !editMode) {
                try {
                    const response = await DistributionPortService.getDpNameBySubAreaId(selectedSubArea.id);
                    if (response?.data && typeof response.data === 'object') {
                        setFormData(prev => ({
                            ...prev,
                            dpName: response.data.dpName,
                            dpNumber: response.data.dpNumber,
                        }));
                    }
                } catch (error) {
                    console.error('Error fetching DP name:', error);
                }
            }
        };
        fetchDpName();
    }, [open, selectedSubArea, editMode]);

    const initializeEditMode = () => {
        setFormData({
            dpName: currentDp.dpName || '',
            dpNumber: currentDp.dpNumber || '',
            address: currentDp.address || '',
            lat: currentDp.lat?.toString() || '',
            lng: currentDp.lng?.toString() || '',
            remarks: currentDp.remarks || '',
        });

        if (currentDp.lat && currentDp.lng) {
            const pos = { lat: parseFloat(currentDp.lat), lng: parseFloat(currentDp.lng) };
            setMapCenter(pos);
            setMarkerPosition(pos);
        }
    };

    const resetForm = () => {
        setFormData({ dpName: '', dpNumber: '', address: '', lat: '', lng: '', remarks: '' });
        setMarkerPosition(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMapClick = (event) => {
        if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            setMarkerPosition({ lat, lng });
            setFormData(prev => ({ ...prev, lat: lat.toString(), lng: lng.toString() }));
        }
    };

    const handleSubmit = async () => {
        if (!formData.dpName.trim()) return onError('DP name is required');
        if (!formData.lat || !formData.lng) return onError('Location is required');
        if (!selectedSubArea?.id) return onError('A sub area must be selected');

        setLoading(true);
        try {
            let response;
            if (editMode) {
                const dataToSend = {
                    lat: parseFloat(formData.lat),
                    lng: parseFloat(formData.lng),
                    dpNumber: formData.dpNumber,
                    dpName: formData.dpName,
                    remarks: formData.remarks,
                };
                response = await DistributionPortService.updateOfficeLocations(currentDp.id, dataToSend);
            } else {
                const dataToSend = {
                    address: formData.address,
                    lat: parseFloat(formData.lat),
                    lng: parseFloat(formData.lng),
                    remarks: formData.remarks,
                    subAreaId: selectedSubArea.id,
                    dpNumber: formData.dpNumber,
                    dpName: formData.dpName,
                };
                response = await DistributionPortService.createDP(dataToSend);
            }

            if (response?.data) {
                onSuccess(editMode ? 'DP updated successfully' : 'DP created successfully');
                onClose();
            }
        } catch (error) {
            console.error('Error saving distribution port:', error);
            onError(error.message || 'Failed to save distribution port');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        mapCenter,
        markerPosition,
        formData,
        handleInputChange,
        handleMapClick,
        handleSubmit,
        selectedMainArea,
        selectedSubArea,
    };
};
