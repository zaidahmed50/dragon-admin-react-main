import apiService from "./apiService.js";
import { ApiUrls } from "./index.js";

const fetchActivityLogs = async (userId, payload) => {
    try {
        let url;
        if (userId) {
             url = `${ApiUrls.getActivityLogsByUser}${userId}`;
        } else {
             url = ApiUrls.getActivityLogs;
        }

        const response = await apiService.post(url, payload);
        if (response?.data) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching activity logs:", error);
        throw error;
    }
};

export const activityLogService = {
    fetchActivityLogs,
};

export default activityLogService;
