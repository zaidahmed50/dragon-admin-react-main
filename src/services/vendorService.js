import apiService from './apiService';
import { ApiUrls } from './index';

export const VendorService = {
    getAllVendors: () => {
        return apiService.get(ApiUrls.getAllVendors);
    },

    getVendorById: (id) => {
        return apiService.get(`${ApiUrls.getAllVendors}/${id}`);
    },

    createVendor: (vendorData) => {
        return apiService.post(ApiUrls.createNewVendor, vendorData);
    },

    updateVendor: (id, vendorData) => {
        return apiService.put(`${ApiUrls.getAllVendors}/${id}`, vendorData);
    },

    toggleVendorStatus: (id) => {
        return apiService.delete(`${ApiUrls.getAllVendors}/${id}`);
    },
};

export default VendorService;
