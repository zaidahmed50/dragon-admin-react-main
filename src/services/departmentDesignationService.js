import apiService from './apiService';
import { ApiUrls } from './index';

const DepartmentDesignationService = {
    getDepartments: async () => {
        return await apiService.get(ApiUrls.getDepartments);
    },
    addDepartment: async (data) => {
        return await apiService.post(ApiUrls.addDepartment, data);
    },
    updateDepartment: async (id, data) => {
        return await apiService.put(ApiUrls.updateDepartment, { ...data, id });
    },
    deleteDepartment: async (id) => {
        return await apiService.delete(`${ApiUrls.deleteDepartment}${id}`);
    },
    getDesignationsByDepartment: async (departmentId) => {
        return await apiService.get(`${ApiUrls.getDesignationsByDepartment}${departmentId}`);
    },
    addDesignation: async (data) => {
        return await apiService.post(ApiUrls.addDesignation, data);
    },
    updateDesignation: async (id, data) => {
        return await apiService.put(ApiUrls.updateDesignation, { ...data, id });
    },
    deleteDesignation: async (id) => {
        return await apiService.delete(`${ApiUrls.deleteDesignation}${id}`);
    }
};

export default DepartmentDesignationService;
