import { useState, useEffect } from 'react';
import {
    Box, Paper, Stack, Typography, TextField, FormControl,
    InputLabel, Select, MenuItem, Alert, Divider, Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CircleProgress from '@/components/shared/CircleProgress.jsx';
import { DataGrid } from '@mui/x-data-grid';
import apiService from "../../services/apiService.js";
import {ApiUrls, InventoryService} from "../../services/index.js";
import AppButton from "../../common/AppButton.jsx";

const PurchaseStock = () => {
    const theme = useTheme();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);

    const [form, setForm] = useState({
        itemId: '', quantity: '', unitPrice: '',
        vendorName: '', invoiceNumber: '', notes: ''
    });

    useEffect(() => {
        apiService.get(ApiUrls.getAllItems).then(r => {
            if (r?.success) setItems(r.data || []);
        });
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const r = await InventoryService.getMainOfficeStockSheet();
            if (r?.success) setHistory((r.data || []).map((s, i) => ({ id: i + 1, ...s })));
        } catch (e) {} finally { setLoading(false); }
    };

    const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async () => {
        if (!form.itemId || !form.quantity || !form.unitPrice) {
            setError('Item, Quantity, and Unit Price are required.');
            return;
        }
        setSubmitting(true); setError(''); setSuccess('');
        try {
            const r = await InventoryService.purchase({
                itemId: Number(form.itemId),
                quantity: Number(form.quantity),
                unitPrice: Number(form.unitPrice),
                vendorName: form.vendorName,
                invoiceNumber: form.invoiceNumber,
                notes: form.notes,
            });
            if (r?.success) {
                setSuccess('Stock purchased and added to main office successfully!');
                setForm({ itemId: '', quantity: '', unitPrice: '', vendorName: '', invoiceNumber: '', notes: '' });
                fetchHistory();
            } else {
                setError(r?.message || 'Purchase failed.');
            }
        } catch (e) {
            setError(e?.response?.data?.message || 'Something went wrong.');
        } finally { setSubmitting(false); }
    };

    const columns = [
        { field: 'itemName', headerName: 'Item', flex: 1.2 },
        { field: 'itemCategory', headerName: 'Category', flex: 1 },
        { field: 'totalQuantity', headerName: 'Total Qty', flex: 0.7, type: 'number' },
        { field: 'availableQuantity', headerName: 'Available', flex: 0.7, type: 'number' },
        { field: 'totalStockValue', headerName: 'Stock Value', flex: 0.9,
          renderCell: (p) => `Rs. ${(p.value || 0).toLocaleString()}` },
    ];

    return (
        <Box className="main-content">
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight={600} mb={1}>Purchase Stock</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Stock purchases are recorded at the <strong>Main Office</strong> only. This updates both the stock sheet and balance sheet automatically.
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Select Item *</InputLabel>
                            <Select value={form.itemId} label="Select Item *" onChange={handleChange('itemId')}>
                                {items.map(it => <MenuItem key={it.id} value={it.id}>{it.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField fullWidth size="small" label="Quantity *" type="number"
                            value={form.quantity} onChange={handleChange('quantity')} inputProps={{ min: 1 }} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField fullWidth size="small" label="Unit Price (Rs.) *" type="number"
                            value={form.unitPrice} onChange={handleChange('unitPrice')} inputProps={{ min: 0 }} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth size="small" label="Vendor Name"
                            value={form.vendorName} onChange={handleChange('vendorName')} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth size="small" label="Invoice / Bill Number"
                            value={form.invoiceNumber} onChange={handleChange('invoiceNumber')} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth size="small" label="Notes"
                            value={form.notes} onChange={handleChange('notes')} />
                    </Grid>

                    {form.quantity && form.unitPrice && (
                        <Grid item xs={12}>
                            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1, bgcolor: theme.palette.success.light + '20' }}>
                                <Typography variant="body2">
                                    <strong>Total Purchase Cost: Rs. {(Number(form.quantity) * Number(form.unitPrice)).toLocaleString()}</strong>
                                    {' '}— This will be recorded as a DEBIT in the balance sheet.
                                </Typography>
                            </Paper>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <AppButton variant="contained" label={submitting ? 'Saving…' : 'Record Purchase'} onClick={handleSubmit} disabled={submitting} />
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>Current Main Office Stock</Typography>
                {loading ? <CircleProgress /> : (
                    <Box sx={{ height: 400 }}>
                        <DataGrid rows={history} columns={columns} pageSizeOptions={[10, 25]} disableRowSelectionOnClick
                            sx={{ border: 0, fontSize: 13 }} />
                    </Box>
                )}
            </Paper>
        </Box>
    );
};
export default PurchaseStock;
