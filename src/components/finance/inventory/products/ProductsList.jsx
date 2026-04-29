import * as React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddProductModal from "./add_product.jsx";
import AppDataGrid from "../../../../common/AppDataGrid.jsx";
import { useProductsData } from "@/hooks/useProductsData.js";
import { useColumnManager } from "@/hooks/useColumnManager.js";
import { InventoryService } from "../../../../services/index.js";

const ProductsList = () => {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(null);

    const { pageSize, currentPage, products, loading, error, totalRecords, totalPages,
        searchQuery, setSearchQuery, handlePageSizeChange, handlePreviousPage,
        handleNextPage, handlePageClick, fetchProducts } = useProductsData();

    const handleEdit = (row) => { setSelected(row); setOpen(true); };
    const handleDelete = async (row) => {
        if (!window.confirm(`Delete product "${row.name}"?`)) return;
        try {
            await InventoryService.deleteItem(row.id);
            fetchProducts(searchQuery, currentPage);
        } catch (err) { console.error('Delete failed:', err); }
    };
    const handleClose = () => { setOpen(false); setSelected(null); };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "name", headerName: "Product Name", width: 200 },
        { field: "categoryName", headerName: "Category", width: 140 },
        { field: "subCategoryName", headerName: "Sub-Category", width: 150 },
        { field: "brandName", headerName: "Brand", width: 130 },
        { field: "unitName", headerName: "Unit", width: 90 },
        { field: "price", headerName: "Price", width: 100,
            renderCell: (params) => (
                <Typography variant="body2">
                    {params.value != null ? `Rs ${Number(params.value).toLocaleString()}` : '—'}
                </Typography>
            ),
        },
        { field: "quantity", headerName: "Qty", width: 80,
            renderCell: (params) => <Typography variant="body2">{params.value ?? '—'}</Typography> },
        { field: "description", headerName: "Description", width: 200 },
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

    const columnManager = useColumnManager(columns, 'productsList');

    const toolbarProps = {
        title: "Products List",
        searchQuery, onSearchChange: (e) => setSearchQuery(e.target.value),
        searchPlaceholder: "Search products...",
        createLabel: "Create Product", createPermission: "ITEM_CREATE",
        onCreate: () => { setSelected(null); setOpen(true); },
    };

    return (
        <>
            <Box sx={{ height: '100%', width: '100%' }}>
                <AppDataGrid rows={products} columns={columns} loading={loading} error={error}
                    totalRecords={totalRecords} totalPages={totalPages} pageSize={pageSize}
                    currentPage={currentPage} handlePageSizeChange={handlePageSizeChange}
                    handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage}
                    handlePageClick={handlePageClick} toolbarProps={toolbarProps}
                    columnManager={columnManager} getRowId={(row) => row.id}
                    onRefresh={() => fetchProducts(searchQuery, currentPage)} />
            </Box>
            <AddProductModal open={open} onClose={handleClose} setOpen={setOpen}
                initialProduct={selected} onProductAdded={() => fetchProducts(searchQuery, currentPage)} />
        </>
    );
};

export default ProductsList;
