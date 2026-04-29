import ApiService from './apiService';
import { ApiUrls } from './DragonApi';

class FaultReasonService {
    static async createFaultReason(data) {
        try {
            return await ApiService.post(ApiUrls.createFaultReason, data);
        } catch (error) {
            throw error;
        }
    }

    static async deleteFaultReason(id) {
        try {
            return await ApiService.delete(`${ApiUrls.deleteFaultReason}${id}`);
        } catch (error) {
            throw error;
        }
    }

    static async updateFaultReason(data) {
        try {
            return await ApiService.put(ApiUrls.updateFaultReason, data);
        } catch (error) {
            throw error;
        }
    }

    static async getAllFaultReasons() {
        try {
            return await ApiService.get(ApiUrls.getAllFaultReasons);
        } catch (error) {
            throw error;
        }
    }
}

export default FaultReasonService;
