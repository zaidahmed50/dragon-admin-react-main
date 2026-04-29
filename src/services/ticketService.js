import ApiService from './apiService';
import apiService from './apiService';
import {ApiUrls} from "./index.js";

class TicketService {
    static async getDashboard() {
        try {
            return await apiService.get(ApiUrls.ticketDashboard);
        } catch (error) {
            throw error;
        }
    }

    static async getPriorities() {
        try {
            return await apiService.get(ApiUrls.ticketPriorities);
        } catch (error) {
            throw error;
        }
    }

    static async getStatuses() {
        try {
            return await apiService.get(ApiUrls.ticketStatuses);
        } catch (error) {
            throw error;
        }
    }

    static async getTypes() {
        try {
            return await apiService.get(ApiUrls.ticketTypes);
        } catch (error) {
            throw error;
        }
    }

    static async searchTickets(searchParams = {}) {
        try {
            return await apiService.post(ApiUrls.searchTickets, searchParams);
        } catch (error) {
            throw error;
        }
    }

    static async createTicket(ticketData) {
        try {
            return await ApiService.post(ApiUrls.createTicket, ticketData);
        } catch (error) {
            throw error;
        }
    }

    static async updateTicket(id, ticketData) {
        try {
            return await ApiService.put(`${ApiUrls.updateTicket}${id}`, ticketData);
        } catch (error) {
            throw error;
        }
    }

    static async deleteTicket(id) {
        try {
            return await ApiService.delete(`${ApiUrls.deleteTicket}${id}`);
        } catch (error) {
            throw error;
        }
    }
}

export default TicketService;
