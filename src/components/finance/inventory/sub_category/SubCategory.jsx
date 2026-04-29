import * as React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddSubCategoryModal from "./add_sub_category.jsx";
import AppDataGrid from "../../../../common/AppDataGrid.jsx";
import { useSubCategoryData } from "@/hooks/useSubCategoryData.js";
import { useColumnManager } from "@/hooks/useColumnManager.js";
import { formatDate } from "../../../../helper/helper.jsx";
import { InventoryService } from "../../../../services/index.js";

const SubCategoryList = () => {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(null);

    const { pageSize, currentPage, subCategories, loading, error, totalRecords, totalPages,
        searchQuery, setSearchQuery, handlePageSizeChange, handlePreviousPage,
        handleNextPage, handlePageClick, fetchSubCategories } = useSubCategoryData();

    const handleEdit = (row) => { setSelected(row); setOpen(true); };
    const handleDelete = async (row) => {
        if (!window.confirm(`Delete sub-category "${row.name}"?`)) return;
        try {
            await InventoryService.deleteSubCategory(row.id);
            fetchSubCategories(searchQuery, currentPage);
        } catch (err) { console.error('Delete failed:', err); }
    };
    const handleClose = () => { setOpen(false); setSelected(null); };

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "name", headerName: "Name", width: 200 },
        { field: "categoryName", headerName: "Category", width: 180,
            renderCell: (params) => params.row.category?.name || params.row.categoryName || '—' },
        { field: "createdAt", headerName: "Created At", width: 180,
            renderCell: (params) => <Typography variant="body2">{formatDate(params.row.createdAt)}</Typography> },
        { field: "actions", headerName: "Actions", width: 100, sortable: false,
            renderCell: (params) => (
                <Box display="flex" gap={0.5}>
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(params.row)}><EditIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(params.row)}><DeleteIcon fontSize="small" /></IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    const columnManager = useColumnManager(columns, 'subCategoryList');

    const toolbarProps = {
        title: "Sub-Category List",
        searchQuery, onSearchChange: (e) => setSearchQuery(e.target.value),
        searchPlaceholder: "Search sub-categories...",
        createLabel: "Create Sub-Category", createPermission: "ITEM_SUB_CATEGORY_CREATE",
        onCreate: () => { setSelected(null); setOpen(true); },
    };

    return (
        <>
            <Box sx={{ height: '100%', width: '100%' }}>
                <AppDataGrid rows={subCategories} columns={columns} loading={loading} error={error}
                    totalRecords={totalRecords} totalPages={totalPages} pageSize={pageSize}
                    currentPage={currentPage} handlePageSizeChange={handlePageSizeChange}
                    handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage}
                    handlePageClick={handlePageClick} toolbarProps={toolbarProps}
                    columnManager={columnManager} getRowId={(row) => row.id}
                    onRefresh={() => fetchSubCategories(searchQuery, currentPage)} />
            </Box>
            <AddSubCategoryModal open={open} onClose={handleClose} setOpen={setOpen}
                initialSubCategory={selected} onSubCategoryAdded={() => fetchSubCategories(searchQuery, currentPage)} />
        </>
    );
};

export default SubCategoryList;
