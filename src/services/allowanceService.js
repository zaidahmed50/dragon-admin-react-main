import apiService from './apiService';
import { ApiUrls } from './index';

const AllowanceService = {
    getAllAllowances: async () => {
        return await apiService.get(ApiUrls.getAllAllowances);
    },
    addAllowance: async (data) => {
        return await apiService.post(ApiUrls.addAllowance, data);
    },
    updateAllowance: async (id, data) => {
        return await apiService.put(ApiUrls.updateAllowance, { ...data, id });
    },
    deleteAllowance: async (id) => {
        return await apiService.delete(`${ApiUrls.deleteAllowance}${id}`);
    }
};

export default AllowanceService;
