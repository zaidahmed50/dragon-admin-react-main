import apiService from './apiService';
import { ApiUrls } from './index';

const ProfileService = {
    getAllProfiles: async () => {
        return await apiService.get(ApiUrls.getAllProfiles);
    },
    addProfile: async (data) => {
        return await apiService.post(ApiUrls.addNewProfile, data);
    },
    updateProfile: async (id, data) => {
        return await apiService.put(`${ApiUrls.updateProfiles}${id}`, data);
    },
    deleteProfile: async (id) => {
        return await apiService.delete(`${ApiUrls.deleteProfile}${id}`);
    }
};

export default ProfileService;
