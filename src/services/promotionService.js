import apiService from './apiService';
import { ApiUrls } from './index';

const PromotionService = {
    getAllPromotions: async () => {
        return await apiService.get(ApiUrls.getAllPromotions);
    },
    addPromotion: async (data) => {
        return await apiService.post(ApiUrls.addNewPromotion, data);
    },
    updatePromotion: async (id, data) => {
        return await apiService.put(ApiUrls.updatePromotion, { ...data, id });
    },
    deletePromotion: async (id) => {
        return await apiService.delete(`${ApiUrls.deletePromotion}${id}`);
    }
};

export default PromotionService;
