
import * as React from "react";

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

export const useColumnManager = (initialColumns, keyPrefix = 'employeeList') => {
    const STORAGE_KEYS = {
        COLUMN_WIDTHS: `${keyPrefix}_columnWidths`,
        COLUMN_VISIBILITY: `${keyPrefix}_columnVisibility`,
    };

    const [columnWidths, setColumnWidths] = React.useState(() =>
        getFromLocalStorage(STORAGE_KEYS.COLUMN_WIDTHS, {})
    );
    const [columnVisibility, setColumnVisibility] = React.useState(() =>
        getFromLocalStorage(STORAGE_KEYS.COLUMN_VISIBILITY,
            initialColumns.reduce((acc, col) => ({ ...acc, [col.field]: true }), {})
        )
    );
    const [anchorEl, setAnchorEl] = React.useState(null);

    const columns = React.useMemo(() => {
        return initialColumns
            .filter(col => columnVisibility[col.field])
            .map(col => ({
                ...col,
                width: columnWidths[col.field] || col.width,
            }));
    }, [columnWidths, columnVisibility, initialColumns]);

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
