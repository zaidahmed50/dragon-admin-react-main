import apiService from './apiService';
import { ApiUrls } from './index';

const PermissionGroupService = {
    getAllPermissionGroups: async () => {
        return await apiService.get(ApiUrls.getAllPermissionGroups);
    },
    createPermissionGroup: async (data) => {
        return await apiService.post(ApiUrls.createGroupName, data);
    },
    getAvailablePermissions: async (groupId) => {
        return await apiService.get(`${ApiUrls.getAvailablePermissions}${groupId}`);
    },
    getAssignedPermissions: async (groupId) => {
        return await apiService.get(`${ApiUrls.getAssignedPermissions}${groupId}`);
    },
    addPermissionsToGroup: async (data) => {
        return await apiService.post(ApiUrls.addPermissionsToGroup, data);
    }
};

export default PermissionGroupService;
