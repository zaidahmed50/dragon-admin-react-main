import ApiService from './apiService';
import apiService from './apiService';
import {ApiUrls} from "./index.js";

class TaskService {
    static async getDashboard() {
        try {
            return await apiService.get(ApiUrls.taskDashboard);
        } catch (error) {
            throw error;
        }
    }

    static async getPriorities() {
        try {
            return await apiService.get(ApiUrls.taskPriorities);
        } catch (error) {
            throw error;
        }
    }

    static async getStatuses() {
        try {
            return await apiService.get(ApiUrls.taskStatuses);
        } catch (error) {
            throw error;
        }
    }

    static async searchTasks(searchParams = {}) {
        try {
            return await apiService.post(ApiUrls.searchTasks, searchParams);
        } catch (error) {
            throw error;
        }
    }

    static async createTask(taskData) {
        try {
            return await ApiService.post(ApiUrls.createTask, taskData);
        } catch (error) {
            throw error;
        }
    }

    static async updateTask(id, taskData) {
        try {
            return await ApiService.put(`${ApiUrls.updateTask}${id}`, taskData);
        } catch (error) {
            throw error;
        }
    }

    static async deleteTask(id) {
        try {
            return await ApiService.delete(`${ApiUrls.deleteTask}${id}`);
        } catch (error) {
            throw error;
        }
    }

    static async approveTask(taskId) {
        try {
            return await ApiService.put(`${ApiUrls.approveTask}${taskId}`);
        } catch (error) {
            throw error;
        }
    }

    static async cancelTask(taskId) {
        try {
            return await ApiService.put(`${ApiUrls.cancelTask}${taskId}`);
        } catch (error) {
            throw error;
        }
    }
}

export default TaskService;
