import * as React from "react";
import { InventoryService } from "../services/index.js";

const STORAGE_KEYS = { PAGE_SIZE: 'productsList_pageSize' };

const getLS = (key, def) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } };
const setLS = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

export const useProductsData = () => {
    const [pageSize, setPageSize] = React.useState(() => getLS(STORAGE_KEYS.PAGE_SIZE, 10));
    const [currentPage, setCurrentPage] = React.useState(0);
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);
    const [searchQuery, setSearchQuery] = React.useState("");
    const searchRef = React.useRef(null);

    const fetchProducts = React.useCallback(async (query, page) => {
        setLoading(true);
        setError(null);
        try {
            const response = await InventoryService.getItems();
            let data = response?.data || [];
            if (query) {
                const q = query.toLowerCase();
                data = data.filter(item =>
                    (item.name && item.name.toLowerCase().includes(q)) ||
                    (item.categoryName && item.categoryName.toLowerCase().includes(q)) ||
                    (item.subCategoryName && item.subCategoryName.toLowerCase().includes(q)) ||
                    (item.brandName && item.brandName.toLowerCase().includes(q))
                );
            }
            const total = data.length;
            const totalPg = Math.ceil(total / pageSize);
            setProducts(data.slice(page * pageSize, page * pageSize + pageSize));
            setTotalRecords(total);
            setTotalPages(totalPg);
        } catch (err) {
            setError(err?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    React.useEffect(() => { fetchProducts(searchQuery, currentPage); }, [pageSize, currentPage, fetchProducts]);

    React.useEffect(() => {
        if (searchRef.current) clearTimeout(searchRef.current);
        searchRef.current = setTimeout(() => {
            if (currentPage !== 0) setCurrentPage(0);
            else fetchProducts(searchQuery, 0);
        }, 500);
        return () => clearTimeout(searchRef.current);
    }, [searchQuery, fetchProducts]);

    const handlePageSizeChange = (s) => { setPageSize(s); setLS(STORAGE_KEYS.PAGE_SIZE, s); setCurrentPage(0); };
    const handlePreviousPage = () => setCurrentPage(p => Math.max(0, p - 1));
    const handleNextPage = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));
    const handlePageClick = (p) => setCurrentPage(p);

    return { pageSize, currentPage, products, loading, error, totalRecords, totalPages, searchQuery,
        setSearchQuery, handlePageSizeChange, handlePreviousPage, handleNextPage, handlePageClick,
        fetchProducts, setCurrentPage, setError };
};
