import { ApiUrls } from "./index.js";
import apiService from "./apiService.js";

const accessGroupService = {
    createAccessGroup: async (data) => {
        return await apiService.post(ApiUrls.createAccessGroup, data);
    },
    getAllAccessGroups: async () => {
        return await apiService.get(ApiUrls.getAllAccessGroups);
    },
    getAccessGroupById: async (id) => {
        return await apiService.get(`${ApiUrls.getAccessGroupById}${id}`);
    },
    updateAccessGroup: async (data) => {
        return await apiService.put(ApiUrls.updateAccessGroup, data);
    },
    deleteAccessGroup: async (id) => {
        return await apiService.delete(`${ApiUrls.deleteAccessGroup}${id}`);
    },
    assignPermissions: async (data) => {
        return await apiService.post(ApiUrls.assignPermissions, data);
    },
    removePermissions: async (data) => {
        return await apiService.post(ApiUrls.removePermissions, data);
    }
};

export default accessGroupService;
