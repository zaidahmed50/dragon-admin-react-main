import { useState, useEffect, useCallback } from 'react';
import {
    Box, Paper, Stack, Typography, Grid, Card, CardContent,
    TextField, Alert, Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import CircleProgress from '@/components/shared/CircleProgress.jsx';
import {InventoryService} from "../../services/index.js";
import AppButton from "../../common/AppButton.jsx";

const BalanceSheet = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [error, setError] = useState('');

    const fetchSummary = useCallback(async () => {
        setLoading(true); setError('');
        try {
            let r;
            if (fromDate && toDate) r = await InventoryService.getBalanceSummaryByRange(fromDate, toDate);
            else r = await InventoryService.getBalanceSummary();
            if (r?.success) setSummary(r.data);
            else setError(r?.message || 'Failed to load balance sheet.');
        } catch (e) { setError('Failed to load balance sheet.'); }
        finally { setLoading(false); }
    }, [fromDate, toDate]);

    useEffect(() => { fetchSummary(); }, []);

    const entryColor = { DEBIT: 'error', CREDIT: 'success' };
    const categoryLabel = {
        PURCHASE: 'Purchase', SALE: 'Sale', RENTAL_INCOME: 'Rental Income',
        DAMAGE_LOSS: 'Damage', STOLEN_LOSS: 'Stolen', ADJUSTMENT: 'Adjustment'
    };

    const rows = (summary?.entries || []).map((e, i) => ({ id: i + 1, ...e }));

    const columns = [
        { field: 'entryDate', headerName: 'Date', flex: 0.8 },
        { field: 'entryType', headerName: 'Type', flex: 0.7,
          renderCell: (p) => <Chip label={p.value} size="small" color={entryColor[p.value] || 'default'} /> },
        { field: 'category', headerName: 'Category', flex: 0.9,
          renderCell: (p) => <span>{categoryLabel[p.value] || p.value}</span> },
        { field: 'itemName', headerName: 'Item', flex: 1 },
        { field: 'officeName', headerName: 'Office', flex: 0.9 },
        { field: 'description', headerName: 'Description', flex: 1.5 },
        { field: 'quantity', headerName: 'Qty', flex: 0.5, type: 'number' },
        { field: 'unitPrice', headerName: 'Unit Price', flex: 0.7,
          renderCell: (p) => p.value ? `Rs. ${p.value?.toLocaleString()}` : '-' },
        { field: 'totalAmount', headerName: 'Total Amount', flex: 0.9,
          renderCell: (p) => (
            <Typography fontWeight={600} color={p.row.entryType === 'CREDIT' ? 'success.main' : 'error.main'}>
                Rs. {p.value?.toLocaleString()}
            </Typography>
          ) },
    ];

    const summaryCards = summary ? [
        { label: 'Total Purchases (Cost)', value: summary.totalPurchaseCost, color: theme.palette.error.main, prefix: '- Rs.' },
        { label: 'Total Sales Revenue', value: summary.totalSalesRevenue, color: theme.palette.success.main, prefix: '+ Rs.' },
        { label: 'Rental Income', value: summary.totalRentalIncome, color: theme.palette.info.main, prefix: '+ Rs.' },
        { label: 'Damage Loss', value: summary.totalDamageLoss, color: theme.palette.warning.dark, prefix: '- Rs.' },
        { label: 'Stolen Loss', value: summary.totalStolenLoss, color: theme.palette.error.dark, prefix: '- Rs.' },
        { label: 'Net Balance', value: summary.netBalance, color: summary.netBalance >= 0 ? theme.palette.success.dark : theme.palette.error.dark, prefix: 'Rs.', bold: true },
    ] : [];

    return (
        <Box className="main-content">
            <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" fontWeight={600}>Inventory Balance Sheet</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField size="small" type="date" label="From" InputLabelProps={{ shrink: true }} value={fromDate} onChange={e => setFromDate(e.target.value)} />
                        <TextField size="small" type="date" label="To" InputLabelProps={{ shrink: true }} value={toDate} onChange={e => setToDate(e.target.value)} />
                        <AppButton variant="contained" label="Filter" onClick={fetchSummary} />
                        <AppButton variant="outlined" label="All Time" onClick={() => { setFromDate(''); setToDate(''); fetchSummary(); }} />
                    </Stack>
                </Stack>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Summary Cards */}
            {summary && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {summaryCards.map((c, i) => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
                            <Card elevation={2} sx={{ borderLeft: `4px solid ${c.color}`, borderRadius: 2 }}>
                                <CardContent sx={{ py: 1.5, px: 2 }}>
                                    <Typography variant="caption" color="text.secondary">{c.label}</Typography>
                                    <Typography variant="h6" fontWeight={c.bold ? 800 : 600} sx={{ color: c.color, fontSize: c.bold ? '1.1rem' : '1rem' }}>
                                        {c.prefix} {(c.value || 0).toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {loading ? <CircleProgress /> : (
                <Paper sx={{ height: 500, borderRadius: 2 }}>
                    <DataGrid rows={rows} columns={columns} pageSizeOptions={[10, 25, 50]} disableRowSelectionOnClick
                        sx={{ border: 0, fontSize: 13 }} />
                </Paper>
            )}
        </Box>
    );
};
export default BalanceSheet;
