import { useState, useEffect } from 'react';
import {
    Box, Paper, Stack, Typography, TextField, FormControl,
    InputLabel, Select, MenuItem, Alert, Divider, Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import apiService from "../../services/apiService.js";
import {ApiUrls, InventoryService} from "../../services/index.js";
import AppButton from "../../common/AppButton.jsx";

const SellStock = () => {
    const theme = useTheme();
    const [items, setItems] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        itemId: '', quantity: '', unitPrice: '',
        customerName: '', customerContact: '', invoiceNumber: '', notes: ''
    });

    useEffect(() => {
        apiService.get(ApiUrls.getAllItems).then(r => { if (r?.success) setItems(r.data || []); });
    }, []);

    const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async () => {
        if (!form.itemId || !form.quantity || !form.unitPrice) {
            setError('Item, Quantity, and Selling Price are required.');
            return;
        }
        setSubmitting(true); setError(''); setSuccess('');
        try {
            const r = await InventoryService.sell({
                itemId: Number(form.itemId),
                quantity: Number(form.quantity),
                unitPrice: Number(form.unitPrice),
                customerName: form.customerName,
                customerContact: form.customerContact,
                invoiceNumber: form.invoiceNumber,
                notes: form.notes,
            });
            if (r?.success) {
                setSuccess('Sale recorded successfully! Balance sheet updated.');
                setForm({ itemId: '', quantity: '', unitPrice: '', customerName: '', customerContact: '', invoiceNumber: '', notes: '' });
            } else setError(r?.message || 'Sale failed.');
        } catch (e) {
            setError(e?.response?.data?.message || 'Insufficient stock or error occurred.');
        } finally { setSubmitting(false); }
    };

    return (
        <Box className="main-content">
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight={600} mb={1}>Sell Stock</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Sales are processed from the <strong>Main Office</strong> only. Stock and balance sheet update automatically.
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
                        <TextField fullWidth size="small" label="Quantity *" type="number" value={form.quantity} onChange={handleChange('quantity')} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField fullWidth size="small" label="Selling Price (Rs.) *" type="number" value={form.unitPrice} onChange={handleChange('unitPrice')} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth size="small" label="Customer Name" value={form.customerName} onChange={handleChange('customerName')} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth size="small" label="Customer Contact" value={form.customerContact} onChange={handleChange('customerContact')} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth size="small" label="Invoice Number" value={form.invoiceNumber} onChange={handleChange('invoiceNumber')} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth size="small" label="Notes" value={form.notes} onChange={handleChange('notes')} />
                    </Grid>
                    {form.quantity && form.unitPrice && (
                        <Grid item xs={12}>
                            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1, bgcolor: theme.palette.primary.light + '15' }}>
                                <Typography variant="body2">
                                    <strong>Total Sale Value: Rs. {(Number(form.quantity) * Number(form.unitPrice)).toLocaleString()}</strong>
                                    {' '}— Recorded as CREDIT in balance sheet.
                                </Typography>
                            </Paper>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <AppButton variant="contained" label={submitting ? 'Saving…' : 'Record Sale'} onClick={handleSubmit} disabled={submitting} />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};
export default SellStock;
