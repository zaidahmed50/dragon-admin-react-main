import { useState, useEffect } from 'react';
import subAdminService from '../services/subAdminService';

export const useSubAdminData = () => {
    const [subAdmins, setSubAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchSubAdmins = async () => { // Removed query and page parameters as API doesn't support them
        setLoading(true);
        setError(null);
        try {
            const data = await subAdminService.fetchSubAdmins();
            setSubAdmins(data); // Data is now the array of sub-admins
            setTotalRecords(data.length); // Total records is the length of the array
            setTotalPages(Math.ceil(data.length / pageSize)); // Calculate total pages
        } catch (err) {
            setError('Failed to fetch sub-admins');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubAdmins(); // Call fetchSubAdmins without parameters
    }, [pageSize]); // Only re-fetch when pageSize changes, as search and page are handled client-side

    // Client-side filtering and pagination
    const filteredSubAdmins = subAdmins.filter(admin =>
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedSubAdmins = filteredSubAdmins.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    );

    useEffect(() => {
        // Recalculate total pages and reset current page if filtered data changes
        setTotalRecords(filteredSubAdmins.length);
        setTotalPages(Math.ceil(filteredSubAdmins.length / pageSize));
        setCurrentPage(0); // Reset to first page on search/filter change
    }, [searchQuery, filteredSubAdmins.length, pageSize]);


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
        pageSize,
        currentPage,
        subAdmins: paginatedSubAdmins, // Return paginated and filtered data
        loading,
        error,
        totalRecords,
        totalPages,
        searchQuery,
        setSearchQuery,
        handlePageSizeChange,
        handlePreviousPage,
        handleNextPage,
        handlePageClick,
        fetchSubAdmins, // Keep this for manual refresh
        setCurrentPage,
    };
};
