import apiService from "./apiService.js";
import { ApiUrls } from "./index.js";
import accessGroupService from "./accessGroupService.js";

const fetchUserStatus = async () => {
    try {
        const response = await apiService.get(ApiUrls.getUserStatus);
        if (response?.data) {
            return response.data.map((item) => ({
                label: item.name,
                value: item.id,
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching user status:", error);
        throw error;
    }
};

const fetchOccupations = async () => {
    try {
        const response = await apiService.get(ApiUrls.getOccupations);
        if (response?.data) {
            return response.data.map((item) => ({
                label: item.name,
                value: item.id,
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching occupations:", error);
        throw error;
    }
};

const fetchSubAdmins = async () => {
    try {
        const response = await apiService.get(ApiUrls.getSubAdmins);
        if (response?.data) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching sub-admins:", error);
        throw error;
    }
};

const fetchAccessGroups = async () => {
    try {
        const response = await accessGroupService.getAllAccessGroups();
        const payload = response?.data ?? response;
        const rawGroups = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.content)
                ? payload.content
                : Array.isArray(response?.content)
                    ? response.content
                    : [];

        return rawGroups.map(group => ({
            label: group.groupName,
            value: group.id ?? group.groupId ?? group.securityGroupId,
        }));
    } catch (error) {
        console.error("Error fetching access groups:", error);
        throw error;
    }
};

const createSubAdmin = (data) => {
    return apiService.post(ApiUrls.getSubAdmins, data);
};

const updateSubAdmin = (data) => {
    return apiService.put(ApiUrls.getSubAdmins, data);
};

export const subAdminService = {
    fetchUserStatus,
    fetchOccupations,
    fetchSubAdmins,
    fetchAccessGroups,
    createSubAdmin,
    updateSubAdmin,
};

export default subAdminService;
