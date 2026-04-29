import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Typography, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AppFormField from "../../../../common/fromField.jsx";
import AppButton from "../../../../common/AppButton.jsx";
import Snackbar from "../../../../common/snack_bar";
import { InventoryService } from "../../../../services/index.js";
import { useState, useEffect } from "react";
import AppDropDownField from "../../../../common/dropdownField.jsx";

export default function AddModelModal({ open, onClose, setOpen, onModelAdded, initialModel = null }) {
    const isEdit = Boolean(initialModel?.id);

    const [name, setName] = useState('');
    const [modelCode, setModelCode] = useState('');
    const [description, setDescription] = useState('');
    const [brandId, setBrandId] = useState('');
    const [unitId, setUnitId] = useState('');

    const [brands, setBrands] = useState([]);
    const [units, setUnits] = useState([]);

    const [submitting, setSubmitting] = useState(false);
    const [op, setOp] = useState(false);
    const [message, setMessage] = useState('');

    const showMsg = (msg) => { setMessage(msg); setOp(true); };
    const handleSnackClose = (_, reason) => { if (reason !== 'clickaway') setOp(false); };

    // Load dropdowns on open
    useEffect(() => {
        if (!open) return;
        Promise.all([
            InventoryService.getBrands(),
            InventoryService.getUnits(),
        ]).then(([brds, unts]) => {
            setBrands((brds?.data || []).map(b => ({ value: b.id, label: b.name })));
            setUnits((unts?.data || []).map(u => ({ value: u.id, label: `${u.name}${u.shortName ? ` (${u.shortName})` : ''}` })));
        }).catch(() => showMsg('Failed to load dropdown data'));
    }, [open]);

    // Pre-fill in edit mode
    useEffect(() => {
        if (!open) return;
        if (isEdit) {
            setName(initialModel.name || '');
            setModelCode(initialModel.modelCode || '');
            setDescription(initialModel.description || '');
            setBrandId(initialModel.brand?.id || initialModel.brandId || '');
            setUnitId(initialModel.unitId || '');
        } else {
            setName(''); setModelCode(''); setDescription(''); setBrandId(''); setUnitId('');
        }
    }, [open, isEdit, initialModel]);

    const handleSubmit = async () => {
        if (!name.trim())      { showMsg('Model Name is required'); return; }
        if (!modelCode.trim()) { showMsg('Model Code is required'); return; }
        if (!brandId)          { showMsg('Brand is required'); return; }

        const payload = {
            name: name.trim(),
            modelCode: modelCode.trim(),
            description,
            brandId,
            unitId: unitId || null,
        };

        setSubmitting(true);
        try {
            if (isEdit) {
                await InventoryService.updateModel({ ...payload, id: initialModel.id });
                showMsg('Model updated successfully!');
            } else {
                await InventoryService.createModel(payload);
                showMsg('Model created successfully!');
            }
            if (onModelAdded) onModelAdded();
            setTimeout(() => setOpen(false), 400);
        } catch (err) {
            showMsg(err?.message || (isEdit ? 'Failed to update model' : 'Failed to create model'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">{isEdit ? 'Edit Model' : 'Add Model'}</Typography>
                        <IconButton onClick={onClose} color="error"><CloseIcon /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box mt={1}>
                        <Grid container spacing={2}>
                            {/* Row 1: Brand + Unit */}
                            <Grid item xs={12} sm={6}>
                                <AppDropDownField title="Brand *" options={brands}
                                    value={brandId} onChange={(e) => setBrandId(e.target.value)} required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <AppDropDownField title="Unit" options={units}
                                    value={unitId} onChange={(e) => setUnitId(e.target.value)} required={false} />
                            </Grid>

                            {/* Row 2: Name + Code */}
                            <Grid item xs={12} sm={6}>
                                <AppFormField fullWidth required title="Model Name" name="name"
                                    value={name} onChange={(e) => setName(e.target.value)} margin="normal" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <AppFormField fullWidth required title="Model Code" name="modelCode"
                                    value={modelCode} onChange={(e) => setModelCode(e.target.value)} margin="normal" />
                            </Grid>

                            {/* Row 3: Description */}
                            <Grid item xs={12}>
                                <AppFormField fullWidth title="Description" name="description"
                                    value={description} onChange={(e) => setDescription(e.target.value)}
                                    margin="normal" multiline rows={3} />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <AppButton label={isEdit ? 'Update' : 'Create'} onClick={handleSubmit} disabled={submitting} loading={submitting} />
                    <AppButton label="Cancel" color="red" onClick={onClose} disabled={submitting} />
                </DialogActions>
            </Dialog>
            {op && <Snackbar open={op} message={message} handleClose={handleSnackClose} />}
        </>
    );
}
