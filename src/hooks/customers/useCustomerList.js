import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import CustomerService from "../../services/customerService";

const STORAGE_KEYS = {
    PAGE_SIZE: "customerList_pageSize",
    COLUMN_WIDTHS: "customerList_columnWidths",
    COLUMN_VISIBILITY: "customerList_columnVisibility",
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

export const useCustomerList = (initialColumns) => {
    const [pageSize, setPageSize] = useState(() => getFromLocalStorage(STORAGE_KEYS.PAGE_SIZE, 10));
    const [currentPage, setCurrentPage] = useState(0);
    const [columnWidths, setColumnWidths] = useState(() => getFromLocalStorage(STORAGE_KEYS.COLUMN_WIDTHS, {}));
    const [columnVisibility, setColumnVisibility] = useState(() =>
        getFromLocalStorage(
            STORAGE_KEYS.COLUMN_VISIBILITY,
            initialColumns.reduce((acc, col) => ({...acc, [col.field]: true}), {})
        )
    );

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        search: "",
        sortOrder: "desc",
        sortBy: "",
        size: 10,
        page: 0,
        isIndividual: false,
        userStatus: 0,
    });

    const [anchorEl, setAnchorEl] = useState(null);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState(filters);

    const searchTimeoutRef = useRef(null);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const searchParams = {
                search: searchQuery,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
                size: pageSize,
                page: currentPage,
                isIndividual: filters.isIndividual,
                userStatus: filters.userStatus,
            };

            const response = await CustomerService.getCustomers(searchParams);

            if (response.success) {
                const data = response.data;
                setCustomers(data.content || []);
                setTotalRecords(data.totalElements || 0);
                setTotalPages(data.totalPages || 0);
            } else {
                setError(response?.message || "Failed to fetch customers");
            }
        } catch (err) {
            console.error("Error fetching customers:", err);
            setError(err.message || "Failed to fetch customers");
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filters, pageSize, currentPage]);

    // Initial fetch and refetch when dependencies change
    useEffect(() => {
        fetchCustomers();
    }, [pageSize, currentPage, filters]);

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            if (currentPage !== 0) {
                setCurrentPage(0);
            } else {
                fetchCustomers();
            }
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    const columns = useMemo(() => {
        return initialColumns
            .filter((col) => columnVisibility[col.field])
            .map((col) => ({
                ...col,
                width: columnWidths[col.field] || col.width,
            }));
    }, [columnWidths, columnVisibility, initialColumns]);

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        saveToLocalStorage(STORAGE_KEYS.PAGE_SIZE, newPageSize);
        setCurrentPage(0);
    };

    const handleColumnResize = (params) => {
        const newWidths = {
            ...columnWidths,
            [params.colDef.field]: params.width,
        };
        setColumnWidths(newWidths);
        saveToLocalStorage(STORAGE_KEYS.COLUMN_WIDTHS, newWidths);
    };

    const handleColumnVisibilityChange = (field) => {
        const newVisibility = {
            ...columnVisibility,
            [field]: !columnVisibility[field],
        };
        setColumnVisibility(newVisibility);
        saveToLocalStorage(STORAGE_KEYS.COLUMN_VISIBILITY, newVisibility);
    };

    const handleColumnMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleColumnMenuClose = () => {
        setAnchorEl(null);
    };

    const handleFilterDialogOpen = () => {
        setTempFilters(filters);
        setFilterDialogOpen(true);
    };

    const handleFilterDialogClose = () => {
        setFilterDialogOpen(false);
    };

    const handleApplyFilters = () => {
        setFilters(tempFilters);
        setCurrentPage(0);
        setFilterDialogOpen(false);
    };

    const handleResetFilters = () => {
        const resetFilters = {
            search: "",
            sortOrder: "desc",
            sortBy: "referenceNumber",
            size: pageSize,
            page: 0,
            isIndividual: true,
            userStatus: null,
        };
        setTempFilters(resetFilters);
        setFilters(resetFilters);
        setCurrentPage(0);
        setFilterDialogOpen(false);
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

    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 2) {
                for (let i = 0; i < 4; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages - 1);
            } else if (currentPage >= totalPages - 3) {
                pages.push(0);
                pages.push("...");
                for (let i = totalPages - 4; i < totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(0);
                pages.push("...");
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push("...");
                pages.push(totalPages - 1);
            }
        }

        return pages;
    };

    return {
        pageSize,
        currentPage,
        columnWidths,
        columnVisibility,
        customers,
        loading,
        error,
        setError,
        totalRecords,
        totalPages,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        anchorEl,
        filterDialogOpen,
        tempFilters,
        setTempFilters,
        fetchCustomers,
        columns,
        handlePageSizeChange,
        handleColumnResize,
        handleColumnVisibilityChange,
        handleColumnMenuOpen,
        handleColumnMenuClose,
        handleFilterDialogOpen,
        handleFilterDialogClose,
        handleApplyFilters,
        handleResetFilters,
        handlePreviousPage,
        handleNextPage,
        handlePageClick,
        getPageNumbers
    };
};
