import { useState, useEffect, useCallback } from 'react';
import subAdminService from '../services/subAdminService';

const useSubAdminForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone1: '',
        phone2: '',
        phone3: '',
        sirName: '',
        permanentAddress: '',
        temporaryAddress: '',
        shortName: '',
        pocName: '',
        occupationName: '',
        remarks: '',
        referenceNumber: '',
        userStatusId: '',
        userTypeId: '',
        occupationId: '',
        accessGroupId: '',
    });
    const [userStatuses, setUserStatuses] = useState([]);
    const [occupations, setOccupations] = useState([]);
    const [accessGroups, setAccessGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [validationError, setValidationError] = useState(null);

    useEffect(() => {
        subAdminService.fetchUserStatus().then(setUserStatuses);
        subAdminService.fetchOccupations().then(setOccupations);
        subAdminService.fetchAccessGroups().then(setAccessGroups);
    }, []);

    const handleInputChange = useCallback((name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData({
            name: '',
            email: '',
            password: '',
            phone1: '',
            phone2: '',
            phone3: '',
            sirName: '',
            permanentAddress: '',
            temporaryAddress: '',
            shortName: '',
            pocName: '',
            occupationName: '',
            remarks: '',
            referenceNumber: '',
            userStatusId: '',
            userTypeId: '',
            occupationId: '',
            accessGroupId: '',
        });
    }, []);

    const submitForm = async (editData, onSuccess) => {
        setLoading(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        const requestBody = {
            name: formData.name,
            email: formData.email,
            userStatusId: 1, // Assuming 'ACTIVE' status
            accessGroupId: formData.accessGroupId,
        };

        if (formData.password) {
            requestBody.password = formData.password;
        }

        if (editData) {
            requestBody.userId = editData.id;
        }

        try {
            const response = editData
                ? await subAdminService.updateSubAdmin(requestBody)
                : await subAdminService.createSubAdmin(requestBody);

            if (response.success || response.status === 200 || response.ok) { // Adjust based on your API response structure
                setSubmitSuccess(true);
                resetForm();
                if (onSuccess) onSuccess();
            } else {
                // Handle cases where response is returned but indicates failure (if apiService doesn't throw)
                const errorData = response.data || response;
                 if (errorData.data) {
                    const errorMessages = Object.values(errorData.data).join(', ');
                    setSubmitError(`${errorData.message}: ${errorMessages}`);
                } else {
                    setSubmitError(errorData.message || `Failed to ${editData ? 'update' : 'register'} sub-admin`);
                }
            }
        } catch (error) {
             // Handle errors thrown by apiService
             const errorData = error.response?.data || error;
             if (errorData.data) {
                const errorMessages = Object.values(errorData.data).join(', ');
                setSubmitError(`${errorData.message}: ${errorMessages}`);
            } else {
                setSubmitError(errorData.message || error.message || `Failed to ${editData ? 'update' : 'register'} sub-admin`);
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        setFormData,
        userStatuses,
        occupations,
        accessGroups,
        loading,
        submitSuccess,
        submitError,
        validationError,
        handleInputChange,
        resetForm,
        setLoading,
        setSubmitSuccess,
        setSubmitError,
        setValidationError,
        submitForm, // Expose submitForm
    };
};

export default useSubAdminForm;
