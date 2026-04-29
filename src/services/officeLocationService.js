import apiService from './apiService';
import { ApiUrls } from './index';

const OfficeLocationService = {
    getOffices: async () => {
        return await apiService.get(ApiUrls.getOffices);
    },
    getOfficeTypes: async () => {
        return await apiService.get(ApiUrls.getOfficeTypes);
    },
     getOfficeRoles: async () => {
        return await apiService.get(ApiUrls.getOfficeRoles);
    },
    createOfficeLocation: async (data) => {
        return await apiService.post(ApiUrls.createNewOfficeLocations, data);
    },
    updateOfficeLocation: async (id, data) => {
        return await apiService.put(`${ApiUrls.updateOfficeLocations}`, data);
    },
    deleteOfficeLocation: async (id) => {
        return await apiService.delete(`${ApiUrls.deleteOfficeLocation}${id}`);
    }
};

export default OfficeLocationService;
