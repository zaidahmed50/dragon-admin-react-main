import * as React from "react";
import { Box, Typography, IconButton, Chip, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import AddBrandModal from "./add_brand.jsx";
import AppDataGrid from "../../../../common/AppDataGrid.jsx";
import { useBrandData } from "@/hooks/useBrandData.js";
import { useColumnManager } from "@/hooks/useColumnManager.js";
import { formatDate } from "../../../../helper/helper.jsx";
import { InventoryService } from "../../../../services/index.js";

const Brand = () => {
    const [open, setOpen] = React.useState(false);
    const [selectedBrand, setSelectedBrand] = React.useState(null);

    const {
        pageSize,
        currentPage,
        brands,
        loading,
        error,
        totalRecords,
        totalPages,
        searchQuery,
        setSearchQuery,
        handlePageSizeChange,
        handlePreviousPage,
        handleNextPage,
        handlePageClick,
        fetchBrands,
    } = useBrandData();

    const handleEdit = (brand) => {
        setSelectedBrand(brand);
        setOpen(true);
    };

    const handleToggleStatus = async (brand) => {
        try {
            await InventoryService.toggleBrandStatus(brand.id);
            fetchBrands(searchQuery, currentPage);
        } catch (err) {
            console.error('Failed to toggle brand status:', err);
        }
    };

    const handleModalClose = () => {
        setOpen(false);
        setSelectedBrand(null);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "name", headerName: "Brand Name", width: 200 },
        { field: "subCategoryName", headerName: "Sub-Category", width: 180,
            renderCell: (params) => (
                <Typography variant="body2">{params.value || "—"}</Typography>
            )
        },
        {
            field: "active",
            headerName: "Status",
            width: 110,
            renderCell: (params) => (
                <Chip
                    label={params.value ? "Active" : "Inactive"}
                    color={params.value ? "success" : "default"}
                    size="small"
                />
            ),
        },
        {
            field: "createdAt",
            headerName: "Created At",
            width: 180,
            renderCell: (params) => (
                <Typography variant="body2">{formatDate(params.row.createdAt)}</Typography>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Box display="flex" gap={0.5}>
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(params.row)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={params.row.active ? "Deactivate" : "Activate"}>
                        <IconButton size="small" color={params.row.active ? "success" : "default"}
                            onClick={() => handleToggleStatus(params.row)}>
                            {params.row.active ? <ToggleOnIcon fontSize="small" /> : <ToggleOffIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    const columnManager = useColumnManager(columns, 'brandList');

    const toolbarProps = {
        title: "Brands List",
        searchQuery: searchQuery,
        onSearchChange: (e) => setSearchQuery(e.target.value),
        searchPlaceholder: "Search brands...",
        createLabel: "Create Brand",
        createPermission: "BRAND_CREATE",
        onCreate: () => { setSelectedBrand(null); setOpen(true); },
    };

    return (
        <>
            <Box sx={{ height: '100%', width: '100%' }}>
                <AppDataGrid
                    rows={brands}
                    columns={columns}
                    loading={loading}
                    error={error}
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
                    onRefresh={() => fetchBrands(searchQuery, currentPage)}
                />
            </Box>

            <AddBrandModal
                open={open}
                onClose={handleModalClose}
                setOpen={setOpen}
                initialBrand={selectedBrand}
                onBrandAdded={() => fetchBrands(searchQuery, currentPage)}
            />
        </>
    );
};

export default Brand;
