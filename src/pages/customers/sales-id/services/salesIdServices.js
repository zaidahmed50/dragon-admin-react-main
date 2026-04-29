import apiService from '../../../../services/apiService';
import { ApiUrls } from '../../../../services/index';

export const getFreshSaleId = () => apiService.get(ApiUrls.getFreshSaleId);

export const getConnectionAllStatuses = () => apiService.get(ApiUrls.getConnectionAllStatuses);

export const getAllCities = () => apiService.get(ApiUrls.getAllCities);

export const getAllMainAreas = () => apiService.get(ApiUrls.getAllMainAreas);

export const getSubAreasByMainArea = (mainAreaId) => apiService.get(`${ApiUrls.getSubAreasByMainArea}${mainAreaId}`);

export const getAllDpPortsBySubAreaId = (subAreaId) => apiService.get(`${ApiUrls.getAllDpPortsBySubAreaId}${subAreaId}`);

export const getAllNetworkTypes = () => apiService.get(ApiUrls.getAllNetworkTypes);
export const getAllConnectionTypes = () => apiService.get(ApiUrls.getAllConnectionsTypes);

export const getOffices = () => apiService.get(ApiUrls.getOffices);

export const getUserByRefNo = (referenceNumber) => apiService.get(`${ApiUrls.getUserByRefNo}${referenceNumber}`);

export const getAllProfiles = () => apiService.get(ApiUrls.getAllProfiles);

export const getAllTaxes = () => apiService.get(ApiUrls.getAllTaxes);

export const getAllPromotions = () => apiService.get(ApiUrls.getAllPromotions);

export const getAllPools = () => apiService.get(ApiUrls.getAllPools);

export const getAllIpCuttingsByPool = (poolId) => apiService.get(`${ApiUrls.getAllIpCuttingsByPool}${poolId}`);

export const calculateBill = (data) => apiService.post(ApiUrls.calculateBill, data);

export const createConnection = (data) => apiService.post(ApiUrls.createConnection, data);

export const getSaleIdConnectionList = (data) => apiService.post(ApiUrls.getSaleIdConnectionList, data);
