import ApiService from './apiService';
import { ApiUrls } from './DragonApi';

class InventoryService {
    // Categories
    static async getCategories(params = {}) {
        return ApiService.get(ApiUrls.getCategories, params);
    }
    static async createCategory(data) {
        return ApiService.post(ApiUrls.createCategory, data);
    }
    static async updateCategory(data) {
        return ApiService.put(ApiUrls.updateCategory, data);
    }
    static async deleteCategory(id) {
        return ApiService.delete(ApiUrls.deleteCategory, { id });
    }

    // Sub-Categories
    static async getSubCategories(params = {}) {
        return ApiService.get(ApiUrls.getSubCategories, params);
    }
    static async createSubCategory(data) {
        return ApiService.post(ApiUrls.createSubCategory, data);
    }
    static async updateSubCategory(data) {
        return ApiService.put(ApiUrls.updateSubCategory, data);
    }
    static async deleteSubCategory(id) {
        return ApiService.delete(ApiUrls.deleteSubCategory, { id });
    }

    // Items / Products
    static async getItems() {
        return ApiService.get(ApiUrls.getAllItems);
    }
    static async createItem(data) {
        return ApiService.post(ApiUrls.createItem, data);
    }
    static async updateItem(data) {
        return ApiService.put(ApiUrls.updateItem, data);
    }
    static async deleteItem(id) {
        return ApiService.delete(ApiUrls.deleteItem, { id });
    }

    // Brands
    static async getBrands(params = {}) {
        return ApiService.get(ApiUrls.getAllBrands, params);
    }

    static async createBrand(data) {
        return ApiService.post(ApiUrls.createBrand, data);
    }

    static async updateBrand(data) {
        return ApiService.put(ApiUrls.updateBrand, data);
    }

    static async toggleBrandStatus(id) {
        return ApiService.put(ApiUrls.toggleBrandStatus, id);
    }

    // Units
    static async getUnits(params = {}) {
        return ApiService.get(ApiUrls.getAllUnits, params);
    }

    static async createUnit(data) {
        return ApiService.post(ApiUrls.createUnit, data);
    }

    static async updateUnit(data) {
        return ApiService.put(ApiUrls.updateUnit, data);
    }

    static async deleteUnit(data) {
        return ApiService.put(ApiUrls.deleteUnit, data);
    }
    static async toggleUnitStatus(id) {
        return ApiService.put(ApiUrls.deleteUnit, id);
    }

    static async getUnitById(id) {
        return ApiService.get(`${ApiUrls.getUnitById}${id}`);
    }

    // Models
    static async getModels(params = {}) {
        return ApiService.get(ApiUrls.getAllModels, params);
    }

    static async createModel(data) {
        return ApiService.post(ApiUrls.createModel, data);
    }

    static async updateModel(data) {
        return ApiService.put(ApiUrls.updateModel, data);
    }

    static async deleteModel(data) {
        return ApiService.put(ApiUrls.deleteModel, data);
    }
    static async toggleModelStatus(id) {
        return ApiService.put(ApiUrls.deleteModel, id);
    }

    // Stock Operations
    static async getAllStocks() {
        return ApiService.get(ApiUrls.getStocks);
    }
    static async getMainOfficeStock() {
        return ApiService.get(ApiUrls.getMainOfficeStock);
    }

    // Centralized Operations
    static async purchase(data) {
        return ApiService.post(ApiUrls.inventoryPurchase, data);
    }
    static async sell(data) {
        return ApiService.post(ApiUrls.inventorySell, data);
    }
    static async rentOut(data) {
        return ApiService.post(ApiUrls.inventoryRentOut, data);
    }
    static async rentReturn(data) {
        return ApiService.post(ApiUrls.inventoryRentReturn, data);
    }
    static async issueToOffice(data) {
        return ApiService.post(ApiUrls.inventoryIssueToOffice, data);
    }
    static async returnFromOffice(data) {
        return ApiService.post(ApiUrls.inventoryReturnFromOffice, data);
    }
    static async reportDamage(data) {
        return ApiService.post(ApiUrls.inventoryDamage, data);
    }
    static async reportStolen(data) {
        return ApiService.post(ApiUrls.inventoryStolen, data);
    }
    static async manualAdjust(data) {
        return ApiService.post(ApiUrls.inventoryAdjust, data);
    }

    // Rentals
    static async getAllRentals() {
        return ApiService.get(ApiUrls.getRentals);
    }
    static async getActiveRentals() {
        return ApiService.get(ApiUrls.getActiveRentals);
    }
    static async getOverdueRentals() {
        return ApiService.get(ApiUrls.getOverdueRentals);
    }

    // Balance Sheet
    static async getBalanceSummary() {
        return ApiService.get(ApiUrls.getBalanceSummary);
    }
    static async getBalanceSummaryByRange(from, to) {
        return ApiService.get(ApiUrls.getBalanceSummaryByRange(from, to));
    }

    // Stock Sheet
    static async getFullStockSheet() {
        return ApiService.get(ApiUrls.getFullStockSheet);
    }
    static async getMainOfficeStockSheet() {
        return ApiService.get(ApiUrls.getMainOfficeStockSheet);
    }
    static async getStockSheetByOffice(officeId) {
        return ApiService.get(ApiUrls.getStockSheetByOffice(officeId));
    }
}

export default InventoryService;
