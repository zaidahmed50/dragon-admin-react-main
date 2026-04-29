import { useState, useEffect } from 'react';
import { ProfileService } from '../services/index.js';

const useProfileManagement = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [profileEditMode, setProfileEditMode] = useState(false);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [profileFormData, setProfileFormData] = useState({
        name: '',
        dataInMb: '',
        dSpeed: '',
        uSpeed: '',
        unitPrice: '',
        downloadRate: '',
        uploadRate: '',
        types: 'prepaid',
        shortDescription: '',
        valueAddedTax_VAT: '0',
    });

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [profileToDelete, setProfileToDelete] = useState(null);

    // Menu states
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const [selectedProfileForMenu, setSelectedProfileForMenu] = useState(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const response = await ProfileService.getAllProfiles();
            if (response?.data) {
                setProfiles(response.data);
            }
        } catch (error) {
            console.error('Error fetching profiles:', error);
            setErrorMessage('Failed to load profiles');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenProfileDialog = (profile = null) => {
        if (profile) {
            setProfileEditMode(true);
            setCurrentProfile(profile);
            setProfileFormData({
                name: profile.name || '',
                dataInMb: profile.dataInMb?.toString() || '',
                dSpeed: profile.dSpeed || '',
                uSpeed: profile.uSpeed || '',
                unitPrice: profile.unitPrice?.toString() || '',
                downloadRate: profile.downloadRate?.toString() || '',
                uploadRate: profile.uploadRate?.toString() || '',
                types: profile.types || 'prepaid',
                shortDescription: profile.shortDescription || '',
                valueAddedTax_VAT: profile.valueAddedTax_VAT?.toString() || '0',
            });
        } else {
            setProfileEditMode(false);
            setCurrentProfile(null);
            setProfileFormData({
                name: '',
                dataInMb: '',
                dSpeed: '',
                uSpeed: '',
                unitPrice: '',
                downloadRate: '',
                uploadRate: '',
                types: 'prepaid',
                shortDescription: '',
                valueAddedTax_VAT: '0',
            });
        }
        setOpenProfileDialog(true);
    };

    const handleCloseProfileDialog = () => {
        setOpenProfileDialog(false);
        setProfileEditMode(false);
        setCurrentProfile(null);
        setProfileFormData({
            name: '',
            dataInMb: '',
            dSpeed: '',
            uSpeed: '',
            unitPrice: '',
            downloadRate: '',
            uploadRate: '',
            types: 'prepaid',
            shortDescription: '',
            valueAddedTax_VAT: '0',
        });
    };

    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        setProfileFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleProfileSubmit = async () => {
        if (!profileFormData.name.trim()) {
            setErrorMessage('Name is required');
            return;
        }

        if (!profileFormData.dataInMb.trim()) {
            setErrorMessage('Data limit is required');
            return;
        }

        if (!profileFormData.dSpeed.trim()) {
            setErrorMessage('Download speed is required');
            return;
        }

        if (!profileFormData.uSpeed.trim()) {
            setErrorMessage('Upload speed is required');
            return;
        }

        if (!profileFormData.unitPrice.trim()) {
            setErrorMessage('Unit price is required');
            return;
        }

        if (!profileFormData.downloadRate.trim()) {
            setErrorMessage('Download rate is required');
            return;
        }

        if (!profileFormData.uploadRate.trim()) {
            setErrorMessage('Upload rate is required');
            return;
        }

        if (!profileFormData.shortDescription.trim()) {
            setErrorMessage('Description is required');
            return;
        }

        if (!profileFormData.valueAddedTax_VAT.trim()) {
            setErrorMessage('VAT is required');
            return;
        }

        setLoading(true);
        try {
            const dataToSubmit = {
                name: profileFormData.name.trim(),
                dataInMb: profileFormData.dataInMb.trim(),
                dSpeed: profileFormData.dSpeed.trim(),
                uSpeed: profileFormData.uSpeed.trim(),
                unitPrice: parseInt(profileFormData.unitPrice) || 0,
                downloadRate: parseInt(profileFormData.downloadRate) || 0,
                uploadRate: parseInt(profileFormData.uploadRate) || 0,
                types: profileFormData.types.trim(),
                shortDescription: profileFormData.shortDescription.trim(),
                valueAddedTax_VAT: parseInt(profileFormData.valueAddedTax_VAT) || 0,
            };

            if (profileEditMode && currentProfile) {
                const response = await ProfileService.updateProfile(currentProfile.id, dataToSubmit);
                if (response?.data) {
                    setSuccessMessage('Profile updated successfully');
                    await fetchProfiles();
                    handleCloseProfileDialog();
                }
            } else {
                const response = await ProfileService.addProfile(dataToSubmit);
                if (response?.data) {
                    setSuccessMessage('Profile created successfully');
                    await fetchProfiles();
                    handleCloseProfileDialog();
                }
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            setErrorMessage(error.message || 'Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDeleteDialog = (profile) => {
        setProfileToDelete(profile);
        setOpenDeleteDialog(true);
        handleProfileMenuClose();
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setProfileToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!profileToDelete || !profileToDelete.id) {
            setErrorMessage('Invalid profile selected for deletion');
            handleCloseDeleteDialog();
            return;
        }

        setLoading(true);
        try {
            await ProfileService.deleteProfile(profileToDelete.id);
            setSuccessMessage('Profile deleted successfully');
            await fetchProfiles();
            handleCloseDeleteDialog();
        } catch (error) {
            console.error('Error deleting profile:', error);
            setErrorMessage('Failed to delete profile');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileMenuOpen = (event, profile) => {
        event.stopPropagation();
        setProfileAnchorEl(event.currentTarget);
        setSelectedProfileForMenu(profile);
    };

    const handleProfileMenuClose = () => {
        setProfileAnchorEl(null);
        setSelectedProfileForMenu(null);
    };

    const handleProfileEdit = () => {
        if (selectedProfileForMenu) handleOpenProfileDialog(selectedProfileForMenu);
        handleProfileMenuClose();
    };

    return {
        profiles,
        loading,
        openProfileDialog,
        profileEditMode,
        currentProfile,
        successMessage,
        errorMessage,
        setSuccessMessage,
        setErrorMessage,
        profileFormData,
        openDeleteDialog,
        profileToDelete,
        profileAnchorEl,
        selectedProfileForMenu,
        handleOpenProfileDialog,
        handleCloseProfileDialog,
        handleProfileInputChange,
        handleProfileSubmit,
        handleOpenDeleteDialog,
        handleCloseDeleteDialog,
        handleConfirmDelete,
        handleProfileMenuOpen,
        handleProfileMenuClose,
        handleProfileEdit
    };
};

export default useProfileManagement;
