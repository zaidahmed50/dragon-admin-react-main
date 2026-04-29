import apiService from './apiService';
import { ApiUrls } from './index';

const AreaService = {
    getAllMainAreas: async () => {
        return await apiService.get(ApiUrls.getAllMainAreas);
    },
    createMainArea: async (data) => {
        return await apiService.post(ApiUrls.createMainAreas, data);
    },
    updateMainArea: async (id, data) => {
        return await apiService.put(`${ApiUrls.updateMainAreas}${id}`, data);
    },
    deleteMainArea: async (id) => {
        return await apiService.delete(`${ApiUrls.deleteMainAreas}${id}`);
    },
    getSubAreasByMainArea: async (mainAreaId) => {
        return await apiService.get(`${ApiUrls.getSubAreasByMainArea}${mainAreaId}`);
    },
    createSubArea: async (data) => {
        return await apiService.post(ApiUrls.createSubArea, data);
    },
    updateSubArea: async (id, data) => {
        return await apiService.put(`${ApiUrls.updateSubArea}${id}`, data);
    },
    deleteSubArea: async (id) => {
        return await apiService.delete(`${ApiUrls.deleteSubArea}${id}`);
    }
};

export default AreaService;
