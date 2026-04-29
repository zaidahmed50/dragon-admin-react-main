import { useState, useEffect, useCallback } from 'react';
import {
    Box, Paper, Stack, Typography, TextField, FormControl,
    InputLabel, Select, MenuItem, Alert, Grid, Tab, Tabs,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import CircleProgress from '@/components/shared/CircleProgress.jsx';
import {ApiUrls, InventoryService} from "../../services/index.js";
import AppButton from "../../common/AppButton.jsx";
import apiService from "../../services/apiService.js";


const statusColor = { ACTIVE: 'primary', RETURNED: 'success', OVERDUE: 'error', PARTIAL: 'warning', CANCELLED: 'default' };

const Rentals = () => {
    const theme = useTheme();
    const [tab, setTab] = useState(0);
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [openRent, setOpenRent] = useState(false);
    const [openReturn, setOpenReturn] = useState(false);
    const [selectedRental, setSelectedRental] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [rentForm, setRentForm] = useState({
        itemId: '', quantity: '', renterName: '', renterContact: '',
        renterAddress: '', rentalPricePerDay: '', securityDeposit: '',
        rentStartDate: '', expectedReturnDate: '', notes: ''
    });

    const [returnForm, setReturnForm] = useState({
        rentalId: '', returnDate: '', returnedQuantity: '', totalRentalIncome: '', notes: ''
    });

    useEffect(() => {
        apiService.get(ApiUrls.getAllItems).then(r => { if (r?.success) setItems(r.data || []); });
    }, []);

    const fetchRentals = useCallback(async () => {
        setLoading(true);
        try {
            let r;
            if (tab === 0) r = await InventoryService.getActiveRentals();
            else if (tab === 1) r = await InventoryService.getAllRentals();
            else r = await InventoryService.getOverdueRentals();
            if (r?.success) setRentals((r.data || []).map((x, i) => ({ id: i + 1, ...x })));
        } catch (e) {} finally { setLoading(false); }
    }, [tab]);

    useEffect(() => { fetchRentals(); }, [fetchRentals]);

    const handleRentChange = (f) => (e) => setRentForm(p => ({ ...p, [f]: e.target.value }));
    const handleReturnChange = (f) => (e) => setReturnForm(p => ({ ...p, [f]: e.target.value }));

    const handleRentOut = async () => {
        if (!rentForm.itemId || !rentForm.quantity || !rentForm.renterName || !rentForm.rentStartDate) {
            setError('Item, Quantity, Renter Name and Start Date are required.'); return;
        }
        setSubmitting(true); setError(''); setSuccess('');
        try {
            const r = await InventoryService.rentOut({
                itemId: Number(rentForm.itemId),
                quantity: Number(rentForm.quantity),
                renterName: rentForm.renterName,
                renterContact: rentForm.renterContact,
                renterAddress: rentForm.renterAddress,
                rentalPricePerDay: rentForm.rentalPricePerDay ? Number(rentForm.rentalPricePerDay) : null,
                securityDeposit: rentForm.securityDeposit ? Number(rentForm.securityDeposit) : null,
                rentStartDate: rentForm.rentStartDate,
                expectedReturnDate: rentForm.expectedReturnDate || null,
                notes: rentForm.notes,
            });
            if (r?.success) {
                setSuccess('Item rented out successfully!');
                setOpenRent(false);
                setRentForm({ itemId: '', quantity: '', renterName: '', renterContact: '', renterAddress: '', rentalPricePerDay: '', securityDeposit: '', rentStartDate: '', expectedReturnDate: '', notes: '' });
                fetchRentals();
            } else setError(r?.message || 'Rental failed.');
        } catch (e) { setError(e?.response?.data?.message || 'Error.'); }
        finally { setSubmitting(false); }
    };

    const handleReturn = async () => {
        if (!returnForm.returnDate || !returnForm.returnedQuantity) {
            setError('Return date and quantity are required.'); return;
        }
        setSubmitting(true); setError(''); setSuccess('');
        try {
            const r = await InventoryService.rentReturn({
                rentalId: selectedRental.rentalId || selectedRental.id,
                returnDate: returnForm.returnDate,
                returnedQuantity: Number(returnForm.returnedQuantity),
                totalRentalIncome: returnForm.totalRentalIncome ? Number(returnForm.totalRentalIncome) : null,
                notes: returnForm.notes,
            });
            if (r?.success) {
                setSuccess('Return processed successfully!');
                setOpenReturn(false);
                fetchRentals();
            } else setError(r?.message || 'Return failed.');
        } catch (e) { setError(e?.response?.data?.message || 'Error.'); }
        finally { setSubmitting(false); }
    };

    const columns = [
        { field: 'referenceNumber', headerName: 'Ref#', flex: 0.9 },
        { field: 'itemName', headerName: 'Item', flex: 1.2 },
        { field: 'renterName', headerName: 'Renter', flex: 1 },
        { field: 'renterContact', headerName: 'Contact', flex: 0.9 },
        { field: 'quantity', headerName: 'Qty', flex: 0.5, type: 'number' },
        { field: 'rentStartDate', headerName: 'Start Date', flex: 0.9 },
        { field: 'expectedReturnDate', headerName: 'Expected Return', flex: 0.9 },
        { field: 'rentalPricePerDay', headerName: 'Rs./Day', flex: 0.7, type: 'number' },
        { field: 'status', headerName: 'Status', flex: 0.8,
          renderCell: (p) => <Chip label={p.value} size="small" color={statusColor[p.value] || 'default'} /> },
        { field: 'actions', headerName: 'Actions', flex: 0.8,
          renderCell: (p) => p.row.status === 'ACTIVE' || p.row.status === 'OVERDUE' ? (
            <AppButton size="small" variant="outlined" label="Return" onClick={() => {
                setSelectedRental(p.row);
                setReturnForm({ rentalId: p.row.id, returnDate: '', returnedQuantity: p.row.quantity, totalRentalIncome: '', notes: '' });
                setOpenReturn(true);
            }} />
          ) : null },
    ];

    return (
        <Box className="main-content">
            {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
            {error   && <Alert severity="error"   sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

            <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" fontWeight={600}>Rental Management</Typography>
                    <AppButton variant="contained" label="+ Rent Out Item" onClick={() => setOpenRent(true)} />
                </Stack>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 1 }}>
                    <Tab label="Active" />
                    <Tab label="All Rentals" />
                    <Tab label="Overdue" />
                </Tabs>
            </Paper>

            {loading ? <CircleProgress /> : (
                <Paper sx={{ height: 500, borderRadius: 2 }}>
                    <DataGrid rows={rentals} columns={columns} pageSizeOptions={[10, 25]} disableRowSelectionOnClick
                        sx={{ border: 0, fontSize: 13 }} />
                </Paper>
            )}

            {/* Rent Out Dialog */}
            <Dialog open={openRent} onClose={() => setOpenRent(false)} maxWidth="md" fullWidth>
                <DialogTitle>Rent Out Item (Main Office)</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Item *</InputLabel>
                                <Select value={rentForm.itemId} label="Item *" onChange={handleRentChange('itemId')}>
                                    {items.map(it => <MenuItem key={it.id} value={it.id}>{it.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <TextField fullWidth size="small" label="Quantity *" type="number" value={rentForm.quantity} onChange={handleRentChange('quantity')} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <TextField fullWidth size="small" label="Price/Day (Rs.)" type="number" value={rentForm.rentalPricePerDay} onChange={handleRentChange('rentalPricePerDay')} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth size="small" label="Renter Name *" value={rentForm.renterName} onChange={handleRentChange('renterName')} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth size="small" label="Renter Contact" value={rentForm.renterContact} onChange={handleRentChange('renterContact')} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth size="small" label="Renter Address" value={rentForm.renterAddress} onChange={handleRentChange('renterAddress')} />
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <TextField fullWidth size="small" label="Security Deposit (Rs.)" type="number" value={rentForm.securityDeposit} onChange={handleRentChange('securityDeposit')} />
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <TextField fullWidth size="small" type="date" label="Start Date *" InputLabelProps={{ shrink: true }} value={rentForm.rentStartDate} onChange={handleRentChange('rentStartDate')} />
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <TextField fullWidth size="small" type="date" label="Expected Return" InputLabelProps={{ shrink: true }} value={rentForm.expectedReturnDate} onChange={handleRentChange('expectedReturnDate')} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth size="small" label="Notes" value={rentForm.notes} onChange={handleRentChange('notes')} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRent(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleRentOut} disabled={submitting}>{submitting ? 'Saving…' : 'Confirm Rent Out'}</Button>
                </DialogActions>
            </Dialog>

            {/* Return Dialog */}
            <Dialog open={openReturn} onClose={() => setOpenReturn(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Process Rental Return</DialogTitle>
                <DialogContent>
                    {selectedRental && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Returning: <strong>{selectedRental.itemName}</strong> from <strong>{selectedRental.renterName}</strong>
                        </Typography>
                    )}
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={6}>
                            <TextField fullWidth size="small" type="date" label="Return Date *" InputLabelProps={{ shrink: true }} value={returnForm.returnDate} onChange={handleReturnChange('returnDate')} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth size="small" label="Qty Returned *" type="number" value={returnForm.returnedQuantity} onChange={handleReturnChange('returnedQuantity')} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth size="small" label="Total Rental Income Collected (Rs.)" type="number" value={returnForm.totalRentalIncome} onChange={handleReturnChange('totalRentalIncome')} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth size="small" label="Notes" value={returnForm.notes} onChange={handleReturnChange('notes')} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReturn(false)}>Cancel</Button>
                    <Button variant="contained" color="success" onClick={handleReturn} disabled={submitting}>{submitting ? 'Processing…' : 'Confirm Return'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
export default Rentals;
