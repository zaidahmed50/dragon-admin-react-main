
import * as React from "react";
import { EmployeeService, ApiUrls } from "../services/index.js";
import apiService from "../services/apiService.js";

const STORAGE_KEYS = {
    PAGE_SIZE: 'employeeList_pageSize',
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

export const useEmployeeData = () => {
    const [pageSize, setPageSize] = React.useState(() =>
        getFromLocalStorage(STORAGE_KEYS.PAGE_SIZE, 10)
    );
    const [currentPage, setCurrentPage] = React.useState(0);
    const [employees, setEmployees] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [filters, setFilters] = React.useState({
        designationId: null,
        departmentId: null,
        bloodGroup: "",
        userStatus: "",
    });
    const [sortBy, setSortBy] = React.useState("");
    const [sortOrder, setSortOrder] = React.useState("");
    const [designations, setDesignations] = React.useState([]);
    const [departments, setDepartments] = React.useState([]);
    const [tempFilters, setTempFilters] = React.useState(filters);

    const searchTimeoutRef = React.useRef(null);

    const fetchEmployees = React.useCallback(async (query, page) => {
        setLoading(true);
        setError(null);
        try {
            const requestBody = {
                search: query,
                sortBy: sortBy,
                sortOrder: sortOrder,
                size: pageSize,
                page: page,
                departmentId: filters.departmentId,
                designationId: filters.designationId,
                bloodGroup: filters.bloodGroup,
                userStatus: filters.userStatus,
            };
            const response = await EmployeeService.fetchEmployee(requestBody);
            console.log(11111,response)

            if (response.data) {
                const data = response.data;
                setEmployees(data.content || []);
                setTotalRecords(data.totalElements || 0);
                setTotalPages(data.totalPages || 0);
            } else {
                setError('Failed to fetch employees');
            }
        } catch (err) {
            console.error('Error fetching employees:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    }, [sortBy, sortOrder, pageSize, filters]);

    React.useEffect(() => {
        fetchEmployees(searchQuery, currentPage);
    }, [pageSize, currentPage, filters, fetchEmployees, searchQuery]);

    React.useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            if (currentPage !== 0) {
                setCurrentPage(0);
            } else {
                fetchEmployees(searchQuery, 0);
            }
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery, fetchEmployees]);

    React.useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await apiService.get(ApiUrls.getDepartments);
                if (response?.data != null) {
                    setDepartments(
                        response.data.map((item) => ({
                            label: item.name,
                            value: item.id,
                        }))
                    );
                }
            } catch (error) {
                console.error("Error getting departments:", error);
            }
        };

        fetchDepartments();
    }, []);

    React.useEffect(() => {
        const fetchDesignations = async () => {
            if (!tempFilters.departmentId) {
                setDesignations([]);
                return;
            }

            try {
                const response = await apiService.get(
                    `${ApiUrls.getDesignationsByDepartment}${tempFilters.departmentId}`
                );

                if (response?.data != null) {
                    setDesignations(
                        response.data.map((item) => ({
                            label: item.name,
                            value: item.id,
                        }))
                    );
                }
            } catch (error) {
                console.error("Error fetching designations:", error);
            }
        };

        fetchDesignations();
    }, [tempFilters.departmentId]);

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        saveToLocalStorage(STORAGE_KEYS.PAGE_SIZE, newPageSize);
        setCurrentPage(0);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(0, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    return {
        pageSize,
        currentPage,
        employees,
        loading,
        error,
        totalRecords,
        totalPages,
        searchQuery,
        filters,
        sortBy,
        sortOrder,
        designations,
        departments,
        tempFilters,
        setSearchQuery,
        setFilters,
        setSortBy,
        setSortOrder,
        setTempFilters,
        handlePageSizeChange,
        handlePreviousPage,
        handleNextPage,
        handlePageClick,
        fetchEmployees,
        setCurrentPage,
        setError
    };
};
