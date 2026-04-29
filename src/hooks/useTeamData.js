import * as React from "react";
import teamService from "../services/teamService.js";

const STORAGE_KEYS = {
    PAGE_SIZE: 'teamList_pageSize',
};

const getFromLocalStorage = (key, defaultValue) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
};

const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
};

export const useTeamData = () => {
    const [pageSize, setPageSize] = React.useState(() =>
        getFromLocalStorage(STORAGE_KEYS.PAGE_SIZE, 10)
    );
    const [currentPage, setCurrentPage] = React.useState(0);
    const [teams, setTeams] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [filters, setFilters] = React.useState({
        leaderId: null,
    });
    const [sortBy, setSortBy] = React.useState("name");
    const [sortOrder, setSortOrder] = React.useState("asc");

    const searchTimeoutRef = React.useRef(null);

    const fetchTeams = React.useCallback(async (query, page) => {
        setLoading(true);
        setError(null);
        try {
            const requestBody = {
                search: query,
                sortBy: sortBy,
                sortOrder: sortOrder,
                size: pageSize,
                page: page,
                leaderId: filters.leaderId,
            };
            const response = await teamService.getAllTeams(requestBody);

            if (response.data) {
                const data = response.data;
                setTeams(data.content || []);
                setTotalRecords(data.totalElements || 0);
                setTotalPages(data.totalPages || 0);
            } else {
                setError('Failed to fetch teams');
            }
        } catch (err) {
            console.error('Error fetching teams:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch teams');

        } finally {
            setLoading(false);
        }
    }, [sortBy, sortOrder, pageSize, filters]);

    React.useEffect(() => {
        fetchTeams(searchQuery, currentPage);
    }, [pageSize, currentPage, filters, fetchTeams, searchQuery]);

    React.useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            if (currentPage !== 0) {
                setCurrentPage(0);
            } else {
                fetchTeams(searchQuery, 0);
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(0);
        saveToLocalStorage(STORAGE_KEYS.PAGE_SIZE, newSize);
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const createTeam = async (teamData) => {
        setLoading(true);
        try {
            const response = await teamService.createTeam(teamData);
            await fetchTeams(searchQuery, currentPage);
            return response;
        }  finally {
            setLoading(false);
        }
    };

    const updateTeam = async (teamData) => {
        setLoading(true);
        try {
            const response = await teamService.updateTeam(teamData);
            await fetchTeams(searchQuery, currentPage);
            return response;
        }  finally {
            setLoading(false);
        }
    };

    const addMembers = async (teamId, employeeIds) => {
        setLoading(true);
        try {
            const response = await teamService.addTeamMembers({
                teamId,
                employees: employeeIds,
            });
            await fetchTeams(searchQuery, currentPage);
            return response;
        } finally {
            setLoading(false);
        }
    };

    const removeMembers = async (teamId, employeeIds) => {
        setLoading(true);
        try {
            const response = await teamService.removeTeamMembers({
                teamId,
                employees: employeeIds,
            });
            await fetchTeams(searchQuery, currentPage);
            return response;
        } finally {
            setLoading(false);
        }
    };

    const deleteTeam = async (teamId) => {
        setLoading(true);
        try {
            // Note: Delete endpoint not available in backend yet
            // This is a placeholder for future implementation
            const response = await teamService.deleteTeam(teamId);
            await fetchTeams(searchQuery, currentPage);
            return response;
        } catch (error) {
            console.error('Error deleting team:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getTeamHistory = async (teamId) => {
        setLoading(true);
        try {
            const response = await teamService.getTeamHistory(teamId);
            return response;
        } catch (error) {
            console.error('Error fetching team history:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        pageSize,
        currentPage,
        teams,
        loading,
        error,
        totalRecords,
        totalPages,
        searchQuery,
        filters,
        sortBy,
        sortOrder,
        setSearchQuery,
        setFilters,
        setSortBy,
        setSortOrder,
        handlePageSizeChange,
        handlePreviousPage,
        handleNextPage,
        handlePageClick,
        fetchTeams,
        setCurrentPage,
        createTeam,
        updateTeam,
        addMembers,
        removeMembers,
        deleteTeam,
        getTeamHistory,
    };
};

export const useTeamDetails = (teamId) => {
    const [team, setTeam] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const fetchTeamDetails = async () => {
        if (!teamId) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await teamService.getTeamById(teamId);
            setTeam(response);
        }  finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchTeamDetails();
    }, [teamId]);

    return {
        team,
        loading,
        error,
        refetch: fetchTeamDetails,
    };
};
