import  { useState, useEffect, useCallback } from "react";
import {
    Box,
    Paper,
    Stack,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import CircleProgress from "@/components/shared/CircleProgress.jsx";
import AppButton from "../../common/AppButton.jsx";
import apiService from "../../services/apiService.js";
import { ApiUrls } from "../../services/index.js";
import StockAdjustment from "@/components/stock/StockAdjustment.jsx";

const StockView = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [stocks, setStocks] = useState([]);
    const [open, setOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [searchText, setSearchText] = useState("");

    const chipStyle = {
        height: 22,
        fontSize: "0.75rem",
        borderRadius: "4px",
        fontWeight: 600,
        px: 1.2,
        color: theme.palette.common.white,
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    };

    const getStatusChip = (quantity) => {
        let status = "IN_STOCK";
        if (quantity === 0) status = "OUT_OF_STOCK";
        else if (quantity < 10) status = "LOW_STOCK";

        const colors = {
            IN_STOCK: theme.palette.success.main,
            LOW_STOCK: theme.palette.warning.main,
            OUT_OF_STOCK: theme.palette.error.main,
        };

        return <Chip label={status} size="small" sx={{ ...chipStyle, backgroundColor: colors[status] }} />;
    };

    // Map API response to table rows
    const mapStocks = (data) => {
        return data.map((s) => ({
            id: s.id,
            name: s.item?.name || "-",
            sku: s.item?.id || "-", // assuming SKU = item.id
            brand: s.item?.brandName || "-",
            category: s.item?.categoryName || "-",
            subCategory: s.item?.subCategoryName || "-",
            unit: s.item?.unitName || "-",
            quantity: s.quantity || 0,
            price: s.item?.price || 0,
            createdAt: s.createdAt ,
        }));
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Item Name", flex: 1 },
        { field: "sku", headerName: "SKU", flex: 1 },
        { field: "brand", headerName: "Brand", flex: 1 },
        { field: "category", headerName: "Category", flex: 1 },
        { field: "subCategory", headerName: "Sub-Category", flex: 1 },
        { field: "unit", headerName: "Unit", flex: 0.7 },
        { field: "quantity", headerName: "Qty", flex: 0.5 },
        {
            field: "status",
            headerName: "Status",
            flex: 0.8,
            renderCell: (params) => getStatusChip(params.row.quantity),
        },
        { field: "price", headerName: "Price", flex: 0.8 },
        { field: "createdAt", headerName: "Date Added", flex: 1 },
    ];

    const fetchStocks = useCallback(async () => {
        setLoading(true);
        try {
            const query = {
                category: categoryFilter || null,
                status: statusFilter || null,
            };
            const response = await apiService.get(ApiUrls.getStocks, query);
            if (response?.success && Array.isArray(response.data)) {
                setStocks(mapStocks(response.data));
            } else {
                setStocks([]);
            }
        } catch (error) {
            console.error("Error fetching stocks:", error);
            setStocks([]);
        } finally {
            setLoading(false);
        }
    }, [categoryFilter, statusFilter]);

    useEffect(() => {
        fetchStocks();
    }, [fetchStocks]);

    const filteredStocks = stocks.filter((s) => {
        const searchLower = searchText.toLowerCase();
        return s.name.toLowerCase().includes(searchLower) || String(s.sku).includes(searchLower);
    });

    return (
        <Box className="main-content">
            {/* Header + Filters */}
            <Paper elevation={3} sx={{ padding: 2, mb: 2, borderRadius: 2 }}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography variant="h5" fontWeight={600}>
                        Stock Management
                    </Typography>

                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
                        <TextField
                            size="small"
                            placeholder="Search by Item or SKU"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={categoryFilter}
                                label="Category"
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                variant="outlined"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Routers">Routers</MenuItem>
                                <MenuItem value="Electronics">Electronics</MenuItem>
                                <MenuItem value="Apparel">Apparel</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="IN_STOCK">In Stock</MenuItem>
                                <MenuItem value="LOW_STOCK">Low Stock</MenuItem>
                                <MenuItem value="OUT_OF_STOCK">Out of Stock</MenuItem>
                            </Select>
                        </FormControl>
                        <AppButton variant="contained" label="Adjust Stock" onClick={() => setOpen(true)} />
                    </Stack>
                </Stack>
            </Paper>

            {/* Stock Adjustment Modal */}
            <StockAdjustment open={open} onClose={() => setOpen(false)} onStockAdded={fetchStocks} />

            {/* Table */}
            {loading ? (
                <CircleProgress />
            ) : (
                <Paper sx={{ height: 600, width: "100%", borderRadius: 2 }}>
                    <DataGrid
                        rows={filteredStocks}
                        columns={columns}
                        pageSizeOptions={[10, 25, 50]}
                        disableRowSelectionOnClick
                        sx={{
                            border: 0,
                            fontSize: 14,
                            "& .MuiDataGrid-cell": { py: 1 },
                        }}
                    />
                </Paper>
            )}
        </Box>
    );
};

export default StockView;
