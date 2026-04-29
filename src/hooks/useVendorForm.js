import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import { VendorService } from '../services/vendorService.js';

const defaultCenter = { lat: 31.5204, lng: 74.3587 };
const LIBRARIES = ['maps', 'places'];

export const useVendorForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const vendorToEdit = location.state?.vendor;
    const isEditMode = !!vendorToEdit;

    const { isLoaded } = useJsApiLoader({
        id: 'vendor-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        vendorCode: '', name: '', contactPerson: '', email: '', phone: '', mobile: '',
        website: '', addressLine: '', city: '', taxNumber: '',
        paymentTerms: '', bankName: '', bankAccountNumber: '', iban: '',
        latitude: '', longitude: '',
    });
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [markerPosition, setMarkerPosition] = useState(null);
    const searchBoxRef = useRef(null);

    useEffect(() => {
        if (vendorToEdit) {
            setFormData({
                vendorCode: vendorToEdit.vendorCode || '',
                name: vendorToEdit.name || '',
                contactPerson: vendorToEdit.contactInformation?.contactPerson || '',
                email: vendorToEdit.contactInformation?.email || '',
                phone: vendorToEdit.contactInformation?.phone || '',
                mobile: vendorToEdit.contactInformation?.mobile || '',
                website: vendorToEdit.contactInformation?.website || '',
                addressLine: vendorToEdit.location?.addressLine || '',
                city: vendorToEdit.location?.city || '',
                taxNumber: vendorToEdit.taxNumber || '',
                paymentTerms: vendorToEdit.paymentTerms || '',
                bankName: vendorToEdit.bankName || '',
                bankAccountNumber: vendorToEdit.bankAccountNumber || '',
                iban: vendorToEdit.iban || '',
                latitude: vendorToEdit.location?.latitude || '',
                longitude: vendorToEdit.location?.longitude || '',
            });

            if (vendorToEdit.location?.latitude && vendorToEdit.location?.longitude) {
                const position = {
                    lat: parseFloat(vendorToEdit.location.latitude),
                    lng: parseFloat(vendorToEdit.location.longitude),
                };
                setMapCenter(position);
                setMarkerPosition(position);
            }
        }
    }, [vendorToEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMapClick = useCallback((event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setMarkerPosition({ lat, lng });
        setFormData((prev) => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }));
    }, []);

    const onSearchBoxLoad = useCallback((ref) => {
        searchBoxRef.current = ref;
    }, []);

    const handlePlacesChanged = useCallback(() => {
        if (!searchBoxRef.current) return;
        const places = searchBoxRef.current.getPlaces();
        if (!places || places.length === 0) return;
        const place = places[0];
        if (!place.geometry || !place.geometry.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        // Extract city from address components
        let city = '';
        if (place.address_components) {
            const cityComp = place.address_components.find(c =>
                c.types.includes('locality') || c.types.includes('administrative_area_level_2')
            );
            if (cityComp) city = cityComp.long_name;
        }

        setMarkerPosition({ lat, lng });
        setMapCenter({ lat, lng });
        setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString(),
            addressLine: place.formatted_address || prev.addressLine,
            ...(city && { city }),
        }));
    }, []);

    const handleSubmit = async () => {
        const requiredFields = ['vendorCode', 'name', 'contactPerson', 'addressLine', 'city'];
        for (const field of requiredFields) {
            if (!formData[field].trim()) {
                setErrorMessage(`${field.replace(/([A-Z])/g, ' $1')} is required`);
                return;
            }
        }

        setLoading(true);
        try {
            const payload = {
                vendorCode: formData.vendorCode,
                name: formData.name,
                taxNumber: formData.taxNumber,
                paymentTerms: formData.paymentTerms,
                bankName: formData.bankName,
                bankAccountNumber: formData.bankAccountNumber,
                iban: formData.iban,
                contactInformation: {
                    contactPerson: formData.contactPerson,
                    email: formData.email,
                    phone: formData.phone,
                    mobile: formData.mobile,
                    website: formData.website
                },
                location: {
                    addressLine: formData.addressLine,
                    city: formData.city,
                    state: 'Punjab',
                    country: 'Pakistan',
                    latitude: formData.latitude,
                    longitude: formData.longitude
                }

            };

            if (isEditMode) {
                await VendorService.updateVendor(vendorToEdit.id, payload);
                setSuccessMessage('Vendor updated successfully');
            } else {
                await VendorService.createVendor(payload);
                setSuccessMessage('Vendor created successfully');
            }

            setTimeout(() => navigate('/finance/inventory/vendors'), 1500);
        } catch (error) {
            console.error('Error saving vendor:', error);
            setErrorMessage(error.message || 'Failed to save vendor');
        } finally {
            setLoading(false);
        }
    };

    return {
        isEditMode,
        isLoaded,
        loading,
        successMessage,
        errorMessage,
        formData,
        mapCenter,
        markerPosition,
        setSuccessMessage,
        setErrorMessage,
        handleInputChange,
        handleMapClick,
        handlePlacesChanged,
        onSearchBoxLoad,
        handleSubmit,
    };
};
