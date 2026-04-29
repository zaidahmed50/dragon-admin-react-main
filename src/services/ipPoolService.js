import apiService from './apiService';
import { ApiUrls } from './index';

const IpPoolService = {
    getAllPools: async () => {
        return await apiService.get(ApiUrls.getAllPools);
    },
    createIpPool: async (data) => {
        return await apiService.post(ApiUrls.createIpPool, data);
    },
    updateIpPool: async (id, data) => {
        return await apiService.put(ApiUrls.updateIpPool, { ...data, id });
    },
    deleteIpPool: async (id) => {
        return await apiService.delete(`${ApiUrls.deleteIpPool}${id}`);
    },
    getAllIpCuttingsByPool: async (poolId) => {
        return await apiService.get(`${ApiUrls.getAllIpCuttingsByPool}${poolId}`);
    }
};

export default IpPoolService;
