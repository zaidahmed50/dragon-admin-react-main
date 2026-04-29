import apiService from "./apiService.js";
import {ApiUrls} from "./index.js";

const createTeam = async (teamData) => {
    try {
        const response = await apiService.post(ApiUrls.createTeam, teamData);
        return response.data;
    } catch (error) {
        console.error("Error creating team:", error);
        throw error;
    }
};

const updateTeam = async (teamData) => {
    try {
        const response = await apiService.put(ApiUrls.updateTeam, teamData);
        return response.data;
    } catch (error) {
        console.error("Error updating team:", error);
        throw error;
    }
};

const addTeamMembers = async (memberData) => {
    try {
        const response = await apiService.post(ApiUrls.addTeamMember, memberData);
        return response.data;
    } catch (error) {
        console.error("Error adding team members:", error);
        throw error;
    }
};

const removeTeamMembers = async (memberData) => {
    try {
        const response = await apiService.delete(ApiUrls.removeTeamMember, { data: memberData });
        return response.data;
    } catch (error) {
        console.error("Error removing team members:", error);
        throw error;
    }
};

const getAllTeams = async (params = {}) => {
    try {
        // Set default pagination if not provided
        const requestData = {
            page: params.page ?? 0,
            size: params.size ?? 10,
            search: params.search || null,
            sortBy: params.sortBy || "name",
            sortOrder: params.sortOrder || "asc",
            leaderId: params.leaderId || null,
        };
        
        const response = await apiService.post(ApiUrls.getAllTeams, requestData);
        if (response?.data) {
            return response;
        }
        return [];
    } catch (error) {
        console.error("Error getting teams:", error);
        throw error;
    }
};

const getTeamById = async (teamId) => {
    try {
        const response = await apiService.get(`${ApiUrls.getTeamById}${teamId}`);
        return response.data;
    } catch (error) {
        console.error("Error getting team by id:", error);
        throw error;
    }
};

const deleteTeam = async (teamId) => {
    try {
        const response = await apiService.put(`${ApiUrls.deleteTeam}${teamId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting team:", error);
        throw error;
    }
};

const getTeamHistory = async (teamId) => {
    try {
        // Note: Backend method exists but returns empty list
        // Expected endpoint: GET /api/v1/team/history?id={teamId}
        const response = await apiService.get(`${ApiUrls.getTeamHistory}${teamId}`);
        return response.data;
    } catch (error) {
        console.error("Error getting team history:", error);
        throw error;
    }
};

export const teamService = {
    createTeam,
    updateTeam,
    addTeamMembers,
    removeTeamMembers,
    getAllTeams,
    getTeamById,
    deleteTeam,
    getTeamHistory,
};

export default teamService;