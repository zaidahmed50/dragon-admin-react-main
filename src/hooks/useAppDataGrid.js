import { useState, useMemo } from "react";

const useAppDataGrid = (initialColumns, storageKey) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const getInitialColumnState = (key, defaultValue) => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (error) {
            console.error(`Error reading ${key} from localStorage:`, error);
            return defaultValue;
        }
    };

    const [columnVisibility, setColumnVisibility] = useState(() =>
        getInitialColumnState(
            `${storageKey}_visibility`,
            initialColumns.reduce((acc, col) => ({ ...acc, [col.field]: true }), {})
        )
    );

    const [columnWidths, setColumnWidths] = useState(() =>
        getInitialColumnState(
            `${storageKey}_widths`,
            initialColumns.reduce((acc, col) => ({ ...acc, [col.field]: col.width }), {})
        )
    );

    const saveToLocalStorage = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    };

    const handleColumnVisibilityChange = (field) => {
        const newVisibility = { ...columnVisibility, [field]: !columnVisibility[field] };
        setColumnVisibility(newVisibility);
        saveToLocalStorage(`${storageKey}_visibility`, newVisibility);
    };

    const handleColumnResize = (params) => {
        const newWidths = { ...columnWidths, [params.colDef.field]: params.width };
        setColumnWidths(newWidths);
        saveToLocalStorage(`${storageKey}_widths`, newWidths);
    };

    const handleColumnMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleColumnMenuClose = () => setAnchorEl(null);

    const columns = useMemo(
        () =>
            initialColumns
                .filter((col) => columnVisibility[col.field])
                .map((col) => ({ ...col, width: columnWidths[col.field] })),
        [initialColumns, columnVisibility, columnWidths]
    );

    return {
        columns,
        anchorEl,
        columnVisibility,
        handleColumnResize,
        handleColumnVisibilityChange,
        handleColumnMenuOpen,
        handleColumnMenuClose,
    };
};

export default useAppDataGrid;
