import React, { useState, useMemo } from 'react';
import {
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Group as GroupIcon,
} from '@mui/icons-material';
import AppDataGrid from "../../common/AppDataGrid.jsx";

/**
 * AccessGroupList Component
 * Displays a data grid of access groups
 */
const AccessGroupList = ({ accessGroups, loading, onEdit, onDelete, onRefresh }) => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    // Column visibility state
    const [columnVisibility, setColumnVisibility] = useState({
        id: true,
        groupName: true,
        actions: true,
    });
    const [anchorEl, setAnchorEl] = useState(null);

    // Define columns
    const initialColumns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
        },
        {
            field: 'groupName',
            headerName: 'Group Name',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupIcon fontSize="small" color="primary" />
                    <strong>{params.value}</strong>
                </Box>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Tooltip title="Edit Group">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(params.row)}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Group">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(params.row.id)}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    // Filter columns based on visibility
    const visibleColumns = useMemo(() => {
        return initialColumns.filter((col) => columnVisibility[col.field]);
    }, [columnVisibility]);

    // Filter rows based on search query
    const filteredRows = useMemo(() => {
        if (!searchQuery.trim()) return accessGroups;
        
        const query = searchQuery.toLowerCase();
        return accessGroups.filter((group) => {
            return (
                group.groupName?.toLowerCase().includes(query) ||
                group.id?.toString().includes(query)
            );
        });
    }, [accessGroups, searchQuery]);

    // Pagination calculations
    const totalRecords = filteredRows.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const paginatedRows = useMemo(() => {
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredRows.slice(startIndex, endIndex);
    }, [filteredRows, currentPage, pageSize]);

    // Pagination handlers
    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        setCurrentPage(0); // Reset to first page
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

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Search handler
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(0); // Reset to first page on search
    };

    // Column visibility handlers
    const handleColumnVisibilityChange = (field) => {
        setColumnVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleColumnMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleColumnMenuClose = () => {
        setAnchorEl(null);
    };

    const handleColumnResize = (params) => {
        console.log('Column resized:', params);
    };

    // Column manager object
    const columnManager = {
        columns: visibleColumns,
        anchorEl,
        columnVisibility,
        handleColumnResize,
        handleColumnVisibilityChange,
        handleColumnMenuOpen,
        handleColumnMenuClose,
    };

    // Toolbar props
    const toolbarProps = {
        title: 'Access Groups',
        searchQuery,
        onSearchChange: handleSearchChange,
        searchPlaceholder: 'Search access groups...',
        createLabel: 'Create Group',
        onCreate: null, 
    };

    // Refresh handler
    const handleRefresh = () => {
        if (onRefresh) {
            onRefresh();
        } else {
            setSearchQuery('');
            setCurrentPage(0);
        }
    };

    return (
        <AppDataGrid
            rows={paginatedRows}
            columns={initialColumns}
            loading={loading}
            error={null}
            totalRecords={totalRecords}
            totalPages={totalPages}
            pageSize={pageSize}
            currentPage={currentPage}
            handlePageSizeChange={handlePageSizeChange}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            handlePageClick={handlePageClick}
            toolbarProps={toolbarProps}
            columnManager={columnManager}
            getRowId={(row) => row.id}
            onRefresh={handleRefresh}
        />
    );
};

export default AccessGroupList;
