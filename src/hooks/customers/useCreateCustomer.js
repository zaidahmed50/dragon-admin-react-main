import { useState, useEffect, useRef } from "react";
import apiService from "../../services/apiService.js";
import { ApiUrls } from "../../services/index.js";
import {
    validateRequired,
    validateName,
} from "../../helper/validationHelper.js";


export const useCreateCustomer = (navigate, customerDataFromState, isEditMode) => {
    // Form type state
    const [userFormType, setUserFormType] = useState('Individual');

    // Dropdown options state
    const [identityTypes, setIdentityTypes] = useState([]);
    const [occupationTypes, setOccupationTypes] = useState([]);
    const [userStatuses, setUserStatuses] = useState([]);

    // UI state
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [validationError, setValidationError] = useState(null);

    // Reference to UploadSection
    const uploadSectionRef = useRef(null);

    // Form state
    const [formData, setFormData] = useState({
        // Common fields
        referenceNumber: "",
        name: null,
        email: null,
        phone1: null,
        phone2: null,
        phone3: null,
        remarks: null,
        uuid: null,
        identityType: null,
        userStatusId: '1',
        // Individual fields
        sirName: null,
        occupationName: null,
        occupationId: null,
        password: null,
        confirmPassword: null,
        profileId: null,
        // Business fields
        shortName: null,
        pocName: null,
    });

    // Handle input change
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle identity type change and reset UUID
    const handleIdentityTypeChange = (newIdentityTypeId) => {
        setFormData(prev => ({
            ...prev,
            identityType: newIdentityTypeId,
            uuid: '', // Reset UUID when identity type changes
        }));
    };

    const validateForm = () => {
        let error;
        error = validateRequired(formData.name, 'Name');
        if (error) return error;
        error = validateName(formData.name, 'Name', 2, 70);
        if (error) return error;

        error = validateRequired(formData.referenceNumber, 'Reference number');
        if (error) return error;
        error = validateRequired(formData.uuid, 'UUID/CNIC');
        if (error) return error;
        error = validateRequired(formData.identityType, 'Identity type');
        if (error) return error;
        if (userFormType === 'Business') {
            error = validateRequired(formData.shortName, 'Business short name');
            if (error) return error;

            error = validateName(formData.shortName, 'Business short name', 2, 70);
            if (error) return error;

            error = validateRequired(formData.pocName, 'POC name');
            if (error) return error;

            error = validateName(formData.pocName, 'POC name', 2, 70);
            if (error) return error;
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError(null);
        setSubmitError(null);
        const validationErrorMsg = validateForm();
        if (validationErrorMsg) {
            setValidationError(validationErrorMsg);
            return;
        }

        setLoading(true);

        try {
            const files = uploadSectionRef.current?.getFiles();
            const formDataToSend = new FormData();
            const customerData = {
                name: formData.name?.trim() || null,
                email: formData.email?.trim() || null,
                phone1: formData.phone1?.trim() || null,
                phone2: formData.phone2?.trim() || null,
                phone3: formData.phone3?.trim() || null,
                sirName: formData.sirName?.trim() || null,
                referenceNumber: formData.referenceNumber,
                remarks: formData.remarks?.trim() || null,
                uuid: formData.uuid?.trim() || null,
                userStatusId: formData.userStatusId || null,
                userTypeId: '1',
                identityType: formData.identityType ? formData.identityType.toString() : null,
                userType: userFormType || null,
            };

            // Add Individual specific fields
            if (userFormType === 'Individual') {
                customerData.sirName = formData.sirName?.trim() || null;
                customerData.occupationName = formData.occupationName?.trim() || null;
                customerData.occupationId = formData.occupationId ? formData.occupationId.toString() : null;
            }

            // Add Business specific fields
            if (userFormType === 'Business') {
                customerData.shortName = formData.shortName?.trim() || null;
                customerData.pocName = formData.pocName?.trim() || null;
            }

            // Add userId for edit mode
            if (isEditMode && customerDataFromState?.userId) {
                customerData.userId = customerDataFromState.userId.toString();
            }

            // Append all fields
            Object.keys(customerData).forEach(key => {
                if (customerData[key] !== null && customerData[key] !== undefined && customerData[key] !== '') {
                    formDataToSend.append(key, customerData[key]);
                }
            });

            // Append documents only if they are new files
            if (files?.profilePic instanceof File) formDataToSend.append('profilePicture', files.profilePic);
            if (files?.cnicFront instanceof File) formDataToSend.append('cnicFront', files.cnicFront);
            if (files?.cnicBack instanceof File) formDataToSend.append('cnicBack', files.cnicBack);
            if (files?.passportScan instanceof File) formDataToSend.append('passportScan', files.passportScan);
            if (files?.ntnScan instanceof File) formDataToSend.append('ntnScan', files.ntnScan);

            // Call appropriate API endpoint
            const apiUrl = isEditMode ? ApiUrls.updateCustomer : ApiUrls.createCustomer;
            const response = await apiService.upload(apiUrl, formDataToSend);

            if (response.success !== false) {
                setSubmitSuccess(true);
                setTimeout(() => {
                    navigate('/customers/list');
                }, 1500);
            } else {
                setSubmitError(response.message || `Failed to ${isEditMode ? 'update' : 'create'} customer`);
            }
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} customer:`, error);
            setSubmitError(error.message || `An error occurred while ${isEditMode ? 'updating' : 'creating'} the customer`);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            referenceNumber: formData.referenceNumber, // Keep reference number
            name: null,
            email: null,
            phone1: null,
            phone2: null,
            phone3: null,
            remarks: null,
            uuid: null,
            identityType: null,
            userStatusId: '1',
            sirName: null,
            occupationName: null,
            occupationId: null,
            shortName: null,
            pocName: null,
        });
        uploadSectionRef.current?.resetFiles();
        setValidationError(null);
        setSubmitError(null);
    };

    const setDefaultValues = (identityData, occupationData) => {
        const cnicType = identityData?.find(it => it.title?.toLowerCase() === 'cnic');
        if (cnicType) {
            setFormData(prev => ({...prev, identityType: cnicType.id}));
        }
        const employedType = occupationData?.find(ot => ot.title?.toLowerCase() === 'employed');
        if (employedType) {
            setFormData(prev => ({...prev, occupationId: employedType.id}));
        }
    };

    const loadCustomerFromState = (user, identityData, occupationData) => {
        console.log('🔄 Loading customer data for edit:', {
            userId: user.userId,
            name: user.name,
            hasNtnScan: !!user.ntnScan,
            hasShortName: !!user.shortName,
            hasPocName: !!user.pocName
        });
        
        // Determine form type based on business-specific fields
        const isBusiness = user.ntnScan || user.shortName || user.pocName;
        const formType = isBusiness ? 'Business' : 'Individual';
        setUserFormType(formType);
        console.log('📋 Customer Type:', formType);

        // Find matching identity type
        console.log('🔍 Detecting Identity Type:', {
            uuid: user.uuid,
            hasPassportScan: !!user.passportScan,
            hasNtnScan: !!user.ntnScan,
            formType: formType
        });
        
        let identityId = '';
        
        // Try to determine identity type from the existing data
        // For Business: Check for NTN scan OR if formType is Business
        if (formType === 'Business') {
            const ntnType = identityData?.find(it => it.title?.toLowerCase() === 'ntn');
            identityId = ntnType?.id || '';
            console.log('💼 Business customer - Setting NTN identity type:', identityId);
        }
        // For Individual: Check uuid format or passport scan
        else if (user.uuid && /^\d{5}-\d{7}-\d{1}$/.test(user.uuid)) {
            const cnicType = identityData?.find(it => it.title?.toLowerCase() === 'cnic');
            identityId = cnicType?.id || '';
            console.log('🆔 CNIC format detected:', identityId);
        }
        // If passportScan exists, likely passport
        else if (user.passportScan) {
            const passportType = identityData?.find(it => it.title?.toLowerCase() === 'passport');
            identityId = passportType?.id || '';
            console.log('✈️ Passport scan detected:', identityId);
        }
        // Fallback to checking userIdentityType or identityType fields
        else if (user.userIdentityType) {
            if (typeof user.userIdentityType === 'object' && user.userIdentityType.id) {
                identityId = user.userIdentityType.id;
            } else if (typeof user.userIdentityType === 'string') {
                const identity = identityData?.find(
                    it => it.title?.toLowerCase() === user.userIdentityType?.toLowerCase()
                );
                identityId = identity?.id || '';
            }
            console.log('📋 Identity from userIdentityType field:', identityId);
        } else if (user.identityType) {
            if (typeof user.identityType === 'object' && user.identityType.id) {
                identityId = user.identityType.id;
            } else if (typeof user.identityType === 'string') {
                const identity = identityData?.find(
                    it => it.title?.toLowerCase() === user.identityType?.toLowerCase()
                );
                identityId = identity?.id || '';
            }
            console.log('📋 Identity from identityType field:', identityId);
        }
        
        console.log('✅ Final Identity ID:', identityId);

        // Find matching occupation type
        console.log('💼 Occupation Data Available:', occupationData?.length || 0);
        console.log('🔍 Searching for occupation type:', {
            occupationType: user.occupationType,
            userOccupationType: user.userOccupationType,
            occupationId: user.occupationId,
            occupationTypeId: user.occupationTypeId,
            occupationName: user.occupationName
        });
        
        let occupationId = '';
        
        // NEW: Check for occupationType string field first (e.g., "Business" or "Employed")
        if (user.occupationType && typeof user.occupationType === 'string') {
            const occupation = occupationData?.find(
                ot => ot.title?.toLowerCase() === user.occupationType?.toLowerCase() ||
                    ot.name?.toLowerCase() === user.occupationType?.toLowerCase()
            );
            occupationId = occupation?.id || '';
            console.log('✅ Found occupation from occupationType string:', occupationId);
        }
        // Check userOccupationType object
        else if (user.userOccupationType) {
            if (typeof user.userOccupationType === 'object' && user.userOccupationType.id) {
                occupationId = user.userOccupationType.id;
                console.log('✅ Found occupation from userOccupationType object:', occupationId);
            } else if (typeof user.userOccupationType === 'string') {
                const occupation = occupationData?.find(
                    ot => ot.title?.toLowerCase() === user.userOccupationType?.toLowerCase() ||
                        ot.name?.toLowerCase() === user.userOccupationType?.toLowerCase()
                );
                occupationId = occupation?.id || '';
                console.log('✅ Found occupation from userOccupationType string:', occupationId);
            }
        } else if (user.occupationId) {
            occupationId = user.occupationId;
            console.log('✅ Found occupation from occupationId field:', occupationId);
        } else if (user.occupationTypeId) {
            occupationId = user.occupationTypeId;
            console.log('✅ Found occupation from occupationTypeId field:', occupationId);
        }
        
        console.log('📊 Occupation ID after all checks:', occupationId);
        
        // If still no occupation found for Individual customers, default to Employed
        if (!occupationId && formType === 'Individual') {
            console.log('🤖 Smart default: Setting occupation to "Employed" for Individual customer (no occupation data from API)');
            // Default to "Employed" if occupation name is provided but no type is set
            const employedType = occupationData?.find(ot => ot.name?.toLowerCase() === 'employed');
            if (employedType) {
                occupationId = employedType.id;
                console.log('✅ Auto-set occupation to Employed (ID:', employedType.id, ')');
            }
        }
        
        console.log('✅ Final Occupation ID:', occupationId);

        // Find matching user status
        let statusId = '1';
        if (user.userStatus) {
            if (typeof user.userStatus === 'object' && user.userStatus.id !== undefined) {
                statusId = user.userStatus.id.toString();
            } else if (typeof user.userStatus === 'string') {
                const statusMapping = {
                    'pending': '0',
                    'active': '1',
                    'inactive': '2',
                    'permanent_disabled': '2',
                    'terminated': '3',
                    'blocked': '3'
                };
                const statusName = user.userStatus.toLowerCase();
                statusId = statusMapping[statusName] || '1';
            }
        } else if (user.userStatusId !== undefined) {
            statusId = user.userStatusId.toString();
        }

        // Populate form data
        setFormData({
            referenceNumber: user.referenceNumber || '',
            name: user.name || '',
            email: user.email || '',
            phone1: user.phone1 || '',
            phone2: user.phone2 || '',
            phone3: user.phone3 || '',
            remarks: user.remarks || '',
            uuid: user.uuid || '',
            identityType: identityId,
            userStatusId: statusId,
            sirName: user.sirName || user.guardianName || '',
            occupationName: user.occupationName || '',
            occupationId: occupationId || '',
            parentId: user.parentId || '',
            profileId: user.profileId || '',
            shortName: user.shortName || '',
            pocName: user.pocName || '',
            password: '',
            confirmPassword: '',
        });

        // Set existing files with delay to ensure upload section is mounted
        console.log('💾 Setting existing files for customer:', {
            profilePicture: user.profilePicture,
            cnicFront: user.cnicFront,
            cnicBack: user.cnicBack,
            passportScan: user.passportScan,
            ntnScan: user.ntnScan
        });
        
        setTimeout(() => {
            if (uploadSectionRef.current) {
                // const imageBaseUrl = ApiUrls.imageUrl;
                
                // Helper function to build correct URL
                // const buildFileUrl = (filePath) => {
                //     if (!filePath) return null;
                //     // If file path already contains http:// or https://, it's a full URL
                //     if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
                //         return filePath;
                //     }
                //     // Otherwise, prepend the base URL
                //     return `${imageBaseUrl}${filePath}`;
                // };
                
                const filesToSet = {
                    profilePic: (user.profilePicture),
                    cnicFront: (user.cnicFront),
                    cnicBack: (user.cnicBack),
                    passportScan: (user.passportScan),
                    ntnScan: (user.ntnScan),
                };
                
                console.log('✅ Calling setExistingFiles with:', filesToSet);
                uploadSectionRef.current.setExistingFiles(filesToSet);
                console.log('✅ Files set successfully');
            } else {
                console.error('❌ uploadSectionRef.current is null - component not mounted');
            }
        }, 300); // Increased delay to 300ms
    };

    useEffect(() => {
        const initializeData = async () => {
            try {
                // Fetch all dropdown data
                const [identityRes, occupationRes, statusRes] = await Promise.all([
                    apiService.get(ApiUrls.getUserIdentityTypes),
                    apiService.get(ApiUrls.getUserOccupationTypes),
                    apiService.get(ApiUrls.getUserStatus),
                ]);

                if (identityRes?.data) setIdentityTypes(identityRes.data);
                if (occupationRes?.data) setOccupationTypes(occupationRes.data);
                if (statusRes?.data) setUserStatuses(statusRes.data);

                // Handle create mode
                if (!isEditMode) {
                    const refResponse = await apiService.get(ApiUrls.createCustomerRefNo);
                    if (refResponse?.data) {
                        setFormData(prev => ({...prev, referenceNumber: refResponse.data}));
                    }

                    if (userFormType === 'Individual') {
                        setDefaultValues(identityRes.data, occupationRes.data);
                    } else if (userFormType === 'Business') {
                        const ntnType = identityRes.data?.find(it => it.title?.toLowerCase() === 'ntn');
                        if (ntnType) {
                            setFormData(prev => ({...prev, identityType: ntnType.id}));
                        }
                    }
                }
                // Handle edit mode
                if (isEditMode && customerDataFromState) {
                    loadCustomerFromState(customerDataFromState, identityRes.data, occupationRes.data, statusRes.data);
                }
            } catch (error) {
                console.error('Error initializing data:', error);
                setSubmitError('Failed to load initial data');
            }
        };

        initializeData();
    }, [isEditMode]);

    useEffect(() => {
        if (isEditMode || identityTypes.length === 0) return;

        if (userFormType === 'Business') {
            const ntnType = identityTypes.find(it => it.title?.toLowerCase().includes('ntn'));
            if (ntnType) {
                setFormData(prev => ({
                    ...prev,
                    identityType: ntnType.id,
                    uuid: '',
                }));
            }
        }

        if (userFormType === 'Individual') {
            const cnicType = identityTypes.find(it => it.title?.toLowerCase().includes('cnic'));
            setFormData(prev => ({
                ...prev,
                identityType: cnicType?.id || '',
                uuid: '',
            }));
        }
    }, [userFormType, identityTypes, isEditMode]);

    // Reset files when identity type changes (for Individual customers)
    useEffect(() => {
        if (userFormType === 'Individual' && formData.identityType && !isEditMode) {
            const selectedType = identityTypes.find(it => it.id === formData.identityType);
            if (uploadSectionRef.current) {
                const currentFiles = uploadSectionRef.current.getFiles();

                if (selectedType?.title?.toLowerCase().includes('cnic')) {
                    if (currentFiles.passportScan) {
                        uploadSectionRef.current.resetFiles();
                    }
                } else if (selectedType?.title?.toLowerCase().includes('passport')) {
                    if (currentFiles.cnicFront || currentFiles.cnicBack) {
                        uploadSectionRef.current.resetFiles();
                    }
                }
            }
        }
    }, [formData.identityType, userFormType, isEditMode, identityTypes]);

    const getFilteredIdentityTypes = () => {
        return identityTypes
            .filter(it => {
                if (userFormType === 'Individual') {
                    return !it.title?.toLowerCase().includes('ntn');
                } else {
                    return it.title?.toLowerCase().includes('ntn');
                }
            })
            .map(it => ({label: it.title, value: it.id}));
    };

    const getSelectedIdentityType = () => {
        return identityTypes.find(it => it.id === formData.identityType);
    };

    const getStatusOptions = () => {
        return userStatuses.map(status => ({
            label: status.title,
            value: status.id.toString()
        }));
    };

    return {
        userFormType,
        setUserFormType,
        identityTypes,
        occupationTypes,
        userStatuses,
        loading,
        submitError,
        setSubmitError,
        submitSuccess,
        setSubmitSuccess,
        validationError,
        setValidationError,
        uploadSectionRef,
        formData,
        handleInputChange,
        handleIdentityTypeChange,
        handleSubmit,
        resetForm,
        getFilteredIdentityTypes,
        getSelectedIdentityType,
        getStatusOptions
    };
};