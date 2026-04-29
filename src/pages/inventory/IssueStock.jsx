import { useState, useEffect } from 'react';
import {
    Box, Paper, Stack, Typography, TextField, FormControl,
    InputLabel, Select, MenuItem, Alert, Divider, Grid, Tab, Tabs
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import apiService from "../../services/apiService.js";
import {ApiUrls, InventoryService} from "../../services/index.js";
import AppButton from "../../common/AppButton.jsx";

const IssueStock = () => {
    const theme = useTheme();
    const [tab, setTab] = useState(0); // 0=Issue, 1=Return, 2=Damage, 3=Stolen
    const [items, setItems] = useState([]);
    const [offices, setOffices] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [issueForm, setIssueForm] = useState({ itemId: '', toOfficeId: '', quantity: '', notes: '' });
    const [returnForm, setReturnForm] = useState({ itemId: '', fromOfficeId: '', quantity: '', notes: '' });
    const [damageForm, setDamageForm] = useState({ itemId: '', officeId: '', quantity: '', reason: '', notes: '' });
    const [stolenForm, setStolenForm] = useState({ itemId: '', officeId: '', quantity: '', reportNumber: '', notes: '' });

    useEffect(() => {
        apiService.get(ApiUrls.getAllItems).then(r => { if (r?.success) setItems(r.data || []); });
        apiService.get(ApiUrls.getOffices).then(r => { if (r?.success) setOffices(r.data || []); });
    }, []);

    const setField = (setter) => (field) => (e) => setter(p => ({ ...p, [field]: e.target.value }));

    const submit = async (action, data) => {
        setSubmitting(true); setError(''); setSuccess('');
        try {
            let r;
            if (action === 'issue') r = await InventoryService.issueToOffice({ ...data, itemId: Number(data.itemId), toOfficeId: Number(data.toOfficeId), quantity: Number(data.quantity) });
            else if (action === 'return') r = await InventoryService.returnFromOffice({ ...data, itemId: Number(data.itemId), fromOfficeId: Number(data.fromOfficeId), quantity: Number(data.quantity) });
            else if (action === 'damage') r = await InventoryService.reportDamage({ ...data, itemId: Number(data.itemId), officeId: Number(data.officeId), quantity: Number(data.quantity) });
            else r = await InventoryService.reportStolen({ ...data, itemId: Number(data.itemId), officeId: Number(data.officeId), quantity: Number(data.quantity) });

            if (r?.success) {
                setSuccess(r.message || 'Action completed successfully!');
                if (action === 'issue')  setIssueForm({ itemId: '', toOfficeId: '', quantity: '', notes: '' });
                if (action === 'return') setReturnForm({ itemId: '', fromOfficeId: '', quantity: '', notes: '' });
                if (action === 'damage') setDamageForm({ itemId: '', officeId: '', quantity: '', reason: '', notes: '' });
                if (action === 'stolen') setStolenForm({ itemId: '', officeId: '', quantity: '', reportNumber: '', notes: '' });
            } else setError(r?.message || 'Action failed.');
        } catch (e) { setError(e?.response?.data?.message || 'Something went wrong.'); }
        finally { setSubmitting(false); }
    };

    const ItemSelect = ({ value, onChange }) => (
        <FormControl fullWidth size="small">
            <InputLabel>Select Item *</InputLabel>
            <Select value={value} label="Select Item *" onChange={onChange}>
                {items.map(it => <MenuItem key={it.id} value={it.id}>{it.name}</MenuItem>)}
            </Select>
        </FormControl>
    );

    const OfficeSelect = ({ value, onChange, label }) => (
        <FormControl fullWidth size="small">
            <InputLabel>{label || 'Select Office *'}</InputLabel>
            <Select value={value} label={label || 'Select Office *'} onChange={onChange}>
                {offices.map(o => <MenuItem key={o.id} value={o.id}>{o.officeName}{o.isMainOffice ? ' (Main)' : ''}</MenuItem>)}
            </Select>
        </FormControl>
    );

    return (
        <Box className="main-content">
            {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
            {error   && <Alert severity="error"   sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

            <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight={600} mb={1}>Stock Operations</Typography>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                    <Tab label="Issue to Office" />
                    <Tab label="Return from Office" />
                    <Tab label="Report Damage" />
                    <Tab label="Report Stolen" />
                </Tabs>
            </Paper>

            {/* Issue to Office */}
            {tab === 0 && (
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight={600} mb={1}>Issue Stock: Main Office → Branch</Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>Transfer stock from the main office to a branch office. No financial impact — internal transfer only.</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={5}><ItemSelect value={issueForm.itemId} onChange={setField(setIssueForm)('itemId')} /></Grid>
                        <Grid item xs={12} md={5}><OfficeSelect value={issueForm.toOfficeId} onChange={setField(setIssueForm)('toOfficeId')} label="Destination Branch Office *" /></Grid>
                        <Grid item xs={12} md={2}><TextField fullWidth size="small" label="Quantity *" type="number" value={issueForm.quantity} onChange={setField(setIssueForm)('quantity')} /></Grid>
                        <Grid item xs={12}><TextField fullWidth size="small" label="Notes" value={issueForm.notes} onChange={setField(setIssueForm)('notes')} /></Grid>
                        <Grid item xs={12}><AppButton variant="contained" label={submitting ? 'Issuing…' : 'Issue Stock'} onClick={() => submit('issue', issueForm)} disabled={submitting} /></Grid>
                    </Grid>
                </Paper>
            )}

            {/* Return from Office */}
            {tab === 1 && (
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight={600} mb={1}>Return Stock: Branch → Main Office</Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>Return stock from a branch office back to the main office.</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={5}><ItemSelect value={returnForm.itemId} onChange={setField(setReturnForm)('itemId')} /></Grid>
                        <Grid item xs={12} md={5}><OfficeSelect value={returnForm.fromOfficeId} onChange={setField(setReturnForm)('fromOfficeId')} label="Source Branch Office *" /></Grid>
                        <Grid item xs={12} md={2}><TextField fullWidth size="small" label="Quantity *" type="number" value={returnForm.quantity} onChange={setField(setReturnForm)('quantity')} /></Grid>
                        <Grid item xs={12}><TextField fullWidth size="small" label="Notes" value={returnForm.notes} onChange={setField(setReturnForm)('notes')} /></Grid>
                        <Grid item xs={12}><AppButton variant="contained" label={submitting ? 'Processing…' : 'Return Stock'} onClick={() => submit('return', returnForm)} disabled={submitting} /></Grid>
                    </Grid>
                </Paper>
            )}

            {/* Report Damage */}
            {tab === 2 && (
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight={600} mb={1} color="warning.main">Report Damaged Items</Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>Mark items as damaged. This reduces the stock count and records a DEBIT (loss) in the balance sheet.</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}><ItemSelect value={damageForm.itemId} onChange={setField(setDamageForm)('itemId')} /></Grid>
                        <Grid item xs={12} md={4}><OfficeSelect value={damageForm.officeId} onChange={setField(setDamageForm)('officeId')} label="Office *" /></Grid>
                        <Grid item xs={12} md={4}><TextField fullWidth size="small" label="Quantity *" type="number" value={damageForm.quantity} onChange={setField(setDamageForm)('quantity')} /></Grid>
                        <Grid item xs={12}><TextField fullWidth size="small" label="Reason / Description *" value={damageForm.reason} onChange={setField(setDamageForm)('reason')} /></Grid>
                        <Grid item xs={12}><TextField fullWidth size="small" label="Notes" value={damageForm.notes} onChange={setField(setDamageForm)('notes')} /></Grid>
                        <Grid item xs={12}><AppButton variant="contained" color="warning" label={submitting ? 'Reporting…' : 'Report Damage'} onClick={() => submit('damage', damageForm)} disabled={submitting} /></Grid>
                    </Grid>
                </Paper>
            )}

            {/* Report Stolen */}
            {tab === 3 && (
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight={600} mb={1} color="error.main">Report Stolen Items</Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>Mark items as stolen. This reduces the stock count and records a DEBIT (loss) in the balance sheet.</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}><ItemSelect value={stolenForm.itemId} onChange={setField(setStolenForm)('itemId')} /></Grid>
                        <Grid item xs={12} md={4}><OfficeSelect value={stolenForm.officeId} onChange={setField(setStolenForm)('officeId')} label="Office *" /></Grid>
                        <Grid item xs={12} md={4}><TextField fullWidth size="small" label="Quantity *" type="number" value={stolenForm.quantity} onChange={setField(setStolenForm)('quantity')} /></Grid>
                        <Grid item xs={12} md={6}><TextField fullWidth size="small" label="Police Report Number (if any)" value={stolenForm.reportNumber} onChange={setField(setStolenForm)('reportNumber')} /></Grid>
                        <Grid item xs={12} md={6}><TextField fullWidth size="small" label="Notes" value={stolenForm.notes} onChange={setField(setStolenForm)('notes')} /></Grid>
                        <Grid item xs={12}><AppButton variant="contained" color="error" label={submitting ? 'Reporting…' : 'Report Stolen'} onClick={() => submit('stolen', stolenForm)} disabled={submitting} /></Grid>
                    </Grid>
                </Paper>
            )}
        </Box>
    );
};
export default IssueStock;
