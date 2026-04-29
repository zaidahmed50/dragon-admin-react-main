import { useState, useEffect, useCallback } from 'react';
import {
    Box, Paper, Stack, Typography, Chip, TextField,
    Tab, Tabs, Card, CardContent, Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import CircleProgress from '@/components/shared/CircleProgress.jsx';
import {InventoryService} from "../../services/index.js";

const StockSheet = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [tab, setTab] = useState(0); // 0=All, 1=Main Office
    const [search, setSearch] = useState('');

    const statusChip = (qty) => {
        if (qty === 0) return <Chip label="Out of Stock" size="small" color="error" />;
        if (qty < 5)  return <Chip label="Low Stock"    size="small" color="warning" />;
        return               <Chip label="In Stock"     size="small" color="success" />;
    };

    const mapRows = (data) => data.map((s, i) => ({
        id: i + 1,
        itemId: s.itemId,
        itemName: s.itemName,
        category: s.itemCategory || '-',
        subCategory: s.itemSubCategory || '-',
        brand: s.brand || '-',
        unit: s.unit || '-',
        office: s.officeName,
        isMainOffice: s.isMainOffice,
        total: s.totalQuantity ?? 0,
        available: s.availableQuantity ?? 0,
        rented: s.rentedQuantity ?? 0,
        damaged: s.damagedQuantity ?? 0,
        stolen: s.stolenQuantity ?? 0,
        costPrice: s.costPrice ?? 0,
        totalValue: s.totalStockValue ?? 0,
    }));

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = tab === 0
                ? await InventoryService.getFullStockSheet()
                : await InventoryService.getMainOfficeStockSheet();
            if (res?.success) setRows(mapRows(res.data || []));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [tab]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const filtered = rows.filter(r =>
        r.itemName.toLowerCase().includes(search.toLowerCase()) ||
        r.office.toLowerCase().includes(search.toLowerCase())
    );

    const totalValue = filtered.reduce((acc, r) => acc + r.totalValue, 0);

    const columns = [
        { field: 'itemName', headerName: 'Item', flex: 1.2 },
        { field: 'category', headerName: 'Category', flex: 1 },
        { field: 'brand', headerName: 'Brand', flex: 0.8 },
        { field: 'office', headerName: 'Office', flex: 1,
          renderCell: (p) => (
            <Stack direction="row" spacing={1} alignItems="center">
                <span>{p.value}</span>
                {p.row.isMainOffice && <Chip label="Main" size="small" color="primary" sx={{ height: 18, fontSize: 10 }} />}
            </Stack>
          )
        },
        { field: 'total',     headerName: 'Total Qty',  flex: 0.7, type: 'number' },
        { field: 'available', headerName: 'Available',  flex: 0.7, type: 'number' },
        { field: 'rented',    headerName: 'On Rent',    flex: 0.7, type: 'number' },
        { field: 'damaged',   headerName: 'Damaged',    flex: 0.7, type: 'number' },
        { field: 'stolen',    headerName: 'Stolen',     flex: 0.7, type: 'number' },
        { field: 'status', headerName: 'Status', flex: 0.8,
          renderCell: (p) => statusChip(p.row.available) },
        { field: 'totalValue', headerName: 'Stock Value', flex: 0.9, type: 'number',
          renderCell: (p) => `Rs. ${p.value?.toLocaleString()}` },
    ];

    return (
        <Box className="main-content">
            <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" fontWeight={600}>Stock Sheet</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField size="small" placeholder="Search item or office…" value={search} onChange={e => setSearch(e.target.value)} />
                    </Stack>
                </Stack>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 1 }}>
                    <Tab label="All Offices" />
                    <Tab label="Main Office" />
                </Tabs>
            </Paper>

            {/* Summary cards */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                {[
                    { label: 'Total Items', value: filtered.length, color: theme.palette.primary.main },
                    { label: 'Total Stock Value', value: `Rs. ${totalValue.toLocaleString()}`, color: theme.palette.success.main },
                    { label: 'Out of Stock', value: filtered.filter(r => r.available === 0).length, color: theme.palette.error.main },
                    { label: 'Low Stock (<5)', value: filtered.filter(r => r.available > 0 && r.available < 5).length, color: theme.palette.warning.main },
                ].map((c, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Card elevation={2} sx={{ borderLeft: `4px solid ${c.color}`, borderRadius: 2 }}>
                            <CardContent sx={{ py: 1.5 }}>
                                <Typography variant="body2" color="text.secondary">{c.label}</Typography>
                                <Typography variant="h5" fontWeight={700} sx={{ color: c.color }}>{c.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {loading ? <CircleProgress /> : (
                <Paper sx={{ height: 550, borderRadius: 2 }}>
                    <DataGrid rows={filtered} columns={columns} pageSizeOptions={[10, 25, 50]} disableRowSelectionOnClick
                        sx={{ border: 0, fontSize: 13, '& .MuiDataGrid-cell': { py: 1 } }} />
                </Paper>
            )}
        </Box>
    );
};
export default StockSheet;
