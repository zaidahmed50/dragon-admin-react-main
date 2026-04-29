import apiService from './apiService';
import { ApiUrls } from './index';

const DistributionPortService = {
    getAllMainAreas: async () => {
        return await apiService.get(ApiUrls.getAllMainAreas);
    },

    getSubAreasByMainArea: async (mainAreaId) => {
        return await apiService.get(`${ApiUrls.getSubAreasByMainArea}${mainAreaId}`);
    },

    getAllDpPortsBySubAreaId: async (subAreaId) => {
        return await apiService.get(`${ApiUrls.getAllDpPortsBySubAreaId}${subAreaId}`);
    },

    getDpNameBySubAreaId: async (subAreaId) => {
        return await apiService.get(`${ApiUrls.getDpNameBySubAreaId}${subAreaId}`);
    },

    getOffices: async () => {
        return await apiService.get(ApiUrls.getOffices);
    },

    getOfficesBySubArea: async (subAreaId) => {
        return await apiService.get(`${ApiUrls.getOfficesBySubArea}${subAreaId}`);
    },

    createDP: async (data) => {
        return await apiService.post(ApiUrls.createDP, data);
    },

    updateOfficeLocations: async (id, data) => {
        return await apiService.put(`${ApiUrls.updateOfficeLocations}${id}`, data);
    },

    deleteDP: async (id) => {
        return await apiService.delete(`${ApiUrls.deleteDP}${id}`);
    }
};

export default DistributionPortService;
