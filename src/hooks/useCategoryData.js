import * as React from "react";
import { InventoryService } from "../services/index.js";

const STORAGE_KEYS = {
    PAGE_SIZE: 'categoryList_pageSize',
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

export const useCategoryData = () => {
    const [pageSize, setPageSize] = React.useState(() =>
        getFromLocalStorage(STORAGE_KEYS.PAGE_SIZE, 10)
    );
    const [currentPage, setCurrentPage] = React.useState(0);
    const [categories, setCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortBy, setSortBy] = React.useState("");
    const [sortOrder, setSortOrder] = React.useState("");

    const searchTimeoutRef = React.useRef(null);

    const fetchCategories = React.useCallback(async (query, page) => {
        setLoading(true);
        setError(null);
        try {
            const response = await InventoryService.getCategories();
            
            let data = response.data || [];
            
            if (query) {
                const lowerQuery = query.toLowerCase();
                data = data.filter(item => 
                    (item.name && item.name.toLowerCase().includes(lowerQuery)) || 
                    (item.description && item.description.toLowerCase().includes(lowerQuery))
                );
            }

            const total = data.length;
            const totalPg = Math.ceil(total / pageSize);
            const start = page * pageSize;
            const end = start + pageSize;
            const paginatedData = data.slice(start, end);

            setCategories(paginatedData);
            setTotalRecords(total);
            setTotalPages(totalPg);

        } catch (err) {
            console.error('Error fetching categories:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    React.useEffect(() => {
        fetchCategories(searchQuery, currentPage);
    }, [pageSize, currentPage, fetchCategories, searchQuery]);

    React.useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            if (currentPage !== 0) {
                setCurrentPage(0);
            } else {
                fetchCategories(searchQuery, 0);
            }
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery, fetchCategories]);

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
        categories,
        loading,
        error,
        totalRecords,
        totalPages,
        searchQuery,
        sortBy,
        sortOrder,
        setSearchQuery,
        setSortBy,
        setSortOrder,
        handlePageSizeChange,
        handlePreviousPage,
        handleNextPage,
        handlePageClick,
        fetchCategories,
        setCurrentPage,
        setError
    };
};
