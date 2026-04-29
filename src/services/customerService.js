import ApiService from './apiService';
import API_ENDPOINTS from './apiEndpoints';
import ApiUrls from "./DragonApi.js";
import apiService from './apiService.js';

class CustomerService {
    static async getCustomers(searchParams = {}) {
        try {
            const requestBody = {
                search: searchParams.search || "",
                sortBy: searchParams.sortBy ,
                sortOrder: searchParams.sortOrder || "desc",
                size: searchParams.size || 10,
                page: searchParams.page || 0,
                isIndividual: searchParams.isIndividual !== undefined ? searchParams.isIndividual : false,
                userStatus: searchParams.userStatus || null,
            };
            return await ApiService.post(ApiUrls.getCustomers, requestBody);
        } catch (error) {
            throw error;
        }
    }

    // static async getCustomerById(customerId) {
    //     try {
    //         const response = await ApiService.get('${ApiUrls.getCustomerById/customerId}');
    //         return response;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    /**
     * Get customer by user ID
     * @param {number} userId - User ID
     * @returns {Promise} API response with customer data
     */
    static async getCustomerByUserId(userId) {
        try {
            const response = await ApiService.get(API_ENDPOINTS.CUSTOMERS.GET_BY_USER_ID, { userId });
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Create a new customer
     * @param {Object} customerData - Customer data
     * @returns {Promise} API response
     */
    static async createCustomer(customerData) {
        try {
            const response = await ApiService.post(API_ENDPOINTS.CUSTOMERS.CREATE, customerData);
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update an existing customer
     * @param {Object} customerData - Customer data to update
     * @returns {Promise} API response
     */
    static async updateCustomer(customerData) {
        try {
            const response = await ApiService.put(API_ENDPOINTS.CUSTOMERS.UPDATE, customerData);
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Delete a customer
     * @param {number} customerId - Customer ID
     * @returns {Promise} API response
     */
    static async deleteCustomer(customerId) {
        try {
            const response = await ApiService.delete(API_ENDPOINTS.CUSTOMERS.DELETE(customerId));
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Generate a new customer reference number
     * @returns {Promise} API response with reference number
     */
    static async generateReferenceNumber() {
        try {
            const response = await ApiService.get(API_ENDPOINTS.CUSTOMERS.GENERATE_REF_NO);
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get network types for customers
     * @returns {Promise} API response with network types
     */
    static async getNetworkTypes() {
        try {
            const response = await ApiService.get(API_ENDPOINTS.CUSTOMERS.GET_NETWORK_TYPES);
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get connection types for customers
     * @returns {Promise} API response with connection types
     */
    static async getConnectionTypes() {
        try {
            const response = await ApiService.get(API_ENDPOINTS.CUSTOMERS.GET_CONNECTION_TYPES);
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Import customers from an Excel file
     * @param {File} file - The .xlsx file to import
     * @returns {Promise} API response with imported/skipped counts
     */
    static async importCustomers(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await apiService.upload(ApiUrls.importCustomer, formData);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default CustomerService;
