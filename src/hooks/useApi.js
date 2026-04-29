import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for API calls with loading, error, and data states
 * @param {Function} apiFunction - API function to call
 * @param {boolean} immediate - Whether to call API immediately on mount
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export const useApi = (apiFunction, immediate = false) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(
        async (...params) => {
            try {
                setLoading(true);
                setError(null);
                const response = await apiFunction(...params);
                setData(response);
                return response;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [apiFunction]
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { data, loading, error, execute, reset };
};

/**
 * Custom hook for paginated API calls
 * @param {Function} apiFunction - API function to call
 * @param {Object} initialParams - Initial parameters
 * @returns {Object} - Paginated data and controls
 */
export const usePaginatedApi = (apiFunction, initialParams = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [params, setParams] = useState(initialParams);

    const fetchData = useCallback(
        async (currentPage = page, currentParams = params) => {
            try {
                setLoading(true);
                setError(null);

                const response = await apiFunction({
                    page: currentPage,
                    ...currentParams,
                });

                setData(response.data || response);
                setTotalPages(response.totalPages || 1);
                setTotalRecords(response.totalRecords || response.data?.length || 0);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        },
        [apiFunction, page, params]
    );

    const goToPage = useCallback(
        (newPage) => {
            setPage(newPage);
            fetchData(newPage, params);
        },
        [fetchData, params]
    );

    const nextPage = useCallback(() => {
        if (page < totalPages) {
            goToPage(page + 1);
        }
    }, [page, totalPages, goToPage]);

    const previousPage = useCallback(() => {
        if (page > 1) {
            goToPage(page - 1);
        }
    }, [page, goToPage]);

    const updateParams = useCallback(
        (newParams) => {
            setParams(newParams);
            setPage(1);
            fetchData(1, newParams);
        },
        [fetchData]
    );

    const refresh = useCallback(() => {
        fetchData(page, params);
    }, [fetchData, page, params]);

    useEffect(() => {
        fetchData();
    }, []);

    return {
        data,
        loading,
        error,
        page,
        totalPages,
        totalRecords,
        goToPage,
        nextPage,
        previousPage,
        updateParams,
        refresh,
    };
};

/**
 * Custom hook for form submission with API
 * @param {Function} apiFunction - API function to call
 * @param {Object} options - Options for the hook
 * @returns {Object} - Form submission utilities
 */
export const useFormSubmit = (apiFunction, options = {}) => {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const { onSuccess, onError, resetOnSuccess = true } = options;

    const submit = useCallback(
        async (formData) => {
            try {
                setSubmitting(true);
                setError(null);
                setSuccess(false);

                const response = await apiFunction(formData);
                setSuccess(true);

                if (onSuccess) {
                    onSuccess(response);
                }

                if (resetOnSuccess) {
                    setTimeout(() => setSuccess(false), 3000);
                }

                return response;
            } catch (err) {
                setError(err);
                if (onError) {
                    onError(err);
                }
                throw err;
            } finally {
                setSubmitting(false);
            }
        },
        [apiFunction, onSuccess, onError, resetOnSuccess]
    );

    const reset = useCallback(() => {
        setSubmitting(false);
        setSuccess(false);
        setError(null);
    }, []);

    return { submit, submitting, success, error, reset };
};

/**
 * Custom hook for multiple API calls
 * @param {Array} apiFunctions - Array of API functions
 * @returns {Object} - Multiple API call utilities
 */
export const useMultipleApi = (apiFunctions) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executeAll = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const promises = apiFunctions.map((fn) => fn());
            const results = await Promise.all(promises);

            setData(results);
            return results;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunctions]);

    return { data, loading, error, executeAll };
};

/**
 * Custom hook for search with debounce
 * @param {Function} apiFunction - Search API function
 * @param {number} delay - Debounce delay in ms
 * @returns {Object} - Search utilities
 */
export const useSearch = (apiFunction, delay = 500) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await apiFunction(query);
                setResults(response.data || response);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }, delay);

        return () => clearTimeout(timeoutId);
    }, [query, apiFunction, delay]);

    return { query, setQuery, results, loading, error };
};

export default useApi;
