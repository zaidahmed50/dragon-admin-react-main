import apiService from './apiService';
import { ApiUrls } from './index';

const ManagerService = {
    getManagers: async () => {
        return await apiService.get(ApiUrls.getManagers);
    },
    addManager: async (data) => {
        return await apiService.post(ApiUrls.addManager, data);
    },
    editManager: async (data) => {
        return await apiService.put(ApiUrls.editManager, data);
    },
    deleteManager: async (id) => {
        return await apiService.delete(`${ApiUrls.deleteManager}?managerId=${id}`);
    },
    getAllPermissionGroups: async () => {
        return await apiService.get(ApiUrls.getAllPermissionGroups);
    }
};

export default ManagerService;
