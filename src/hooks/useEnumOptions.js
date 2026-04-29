import { useState, useEffect } from "react";

/**
 * Generic hook that fetches {id, title} enum options from any async fetchFn.
 *
 * @param {Function} fetchFn  - async function returning the API response
 * @param {Array}    fallback - static fallback options if the call fails
 *
 * @returns {{ options: Array<{id,title}>, loading: boolean }}
 *
 * @example
 *   const { options: priorityOptions } = useEnumOptions(TicketService.getPriorities);
 *   <AppDropDownField options={priorityOptions.map(o => ({ label: o.title, value: o.id }))} />
 */
const useEnumOptions = (fetchFn, fallback = []) => {
    const [options, setOptions] = useState(fallback);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetchFn()
            .then((res) => {
                if (cancelled) return;
                // Support both plain array, { data: [...] } and ResponseWrapper { data: { data: [...] } }
                const raw = res?.data?.data ?? res?.data ?? res;
                if (Array.isArray(raw)) setOptions(raw);
            })
            .catch(() => {
                // silently fall back to provided fallback options
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [fetchFn]);

    return { options, loading };
};

export default useEnumOptions;
