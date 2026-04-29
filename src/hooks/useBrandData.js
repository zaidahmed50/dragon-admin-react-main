import * as React from "react";
import { InventoryService } from "../services/index.js";

const STORAGE_KEYS = {
    PAGE_SIZE: 'brandList_pageSize',
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

export const useBrandData = () => {
    const [pageSize, setPageSize] = React.useState(() =>
        getFromLocalStorage(STORAGE_KEYS.PAGE_SIZE, 10)
    );
    const [currentPage, setCurrentPage] = React.useState(0);
    const [brands, setBrands] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortBy, setSortBy] = React.useState("");
    const [sortOrder, setSortOrder] = React.useState("");

    const searchTimeoutRef = React.useRef(null);

    const fetchBrands = React.useCallback(async (query, page) => {
        setLoading(true);
        setError(null);
        try {
            const response = await InventoryService.getBrands();

            // ApiService.get returns response.data (axios body), which is
            // { success, data: [...brands] } from ResponseWrapper
            let data = response.data || [];

            if (query) {
                const lowerQuery = query.toLowerCase();
                data = data.filter(item =>
                    (item.name && item.name.toLowerCase().includes(lowerQuery)) ||
                    (item.subCategoryName && item.subCategoryName.toLowerCase().includes(lowerQuery))
                );
            }

            const total = data.length;
            const totalPg = Math.ceil(total / pageSize);
            const start = page * pageSize;
            const end = start + pageSize;
            const paginatedData = data.slice(start, end);

            setBrands(paginatedData);
            setTotalRecords(total);
            setTotalPages(totalPg);

        } catch (err) {
            console.error('Error fetching brands:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch brands');
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    React.useEffect(() => {
        fetchBrands(searchQuery, currentPage);
    }, [pageSize, currentPage, fetchBrands, searchQuery]);

    React.useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            if (currentPage !== 0) {
                setCurrentPage(0);
            } else {
                fetchBrands(searchQuery, 0);
            }
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery, fetchBrands]);

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
        brands,
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
        fetchBrands,
        setCurrentPage,
        setError
    };
};
