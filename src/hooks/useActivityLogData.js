import { useState, useEffect } from 'react';
import activityLogService from '../services/activityLogService';

export const useActivityLogData = (userId, isCurrentUser = false) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                search: searchQuery,
                sortBy,
                sortOrder,
                size: pageSize,
                page: currentPage,
            };
            // If isCurrentUser is true, we pass null as userId to the service, 
            // which will trigger the use of the generic endpoint.
            const idToPass = isCurrentUser ? null : userId;
            const data = await activityLogService.fetchActivityLogs(idToPass, payload);
            setLogs(data.content || []);
            setTotalRecords(data.totalElements || 0);
            setTotalPages(data.totalPages || 0);
        } catch (err) {
            setError('Failed to fetch activity logs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isCurrentUser || (userId !== undefined && userId !== null)) {
            fetchLogs();
        }
    }, [pageSize, currentPage, searchQuery, sortBy, sortOrder, userId, isCurrentUser]);

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        setCurrentPage(0);
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

    return {
        logs,
        loading,
        error,
        pageSize,
        currentPage,
        totalRecords,
        totalPages,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        handlePageSizeChange,
        handlePreviousPage,
        handleNextPage,
        handlePageClick,
        fetchLogs,
    };
};
