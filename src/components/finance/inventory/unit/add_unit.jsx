import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AppFormField from "../../../../common/fromField.jsx";
import AppButton from "../../../../common/AppButton.jsx";
import Snackbar from "../../../../common/snack_bar";
import { InventoryService } from "../../../../services/index.js";
import { useState, useEffect } from "react";

export default function AddUnitModal({ open, onClose, setOpen, onUnitAdded, initialUnit = null }) {
    const isEdit = Boolean(initialUnit?.id);
    const [name, setName] = useState('');
    const [shortName, setShortName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [op, setOp] = useState(false);
    const [message, setMessage] = useState('');

    const showMsg = (msg) => { setMessage(msg); setOp(true); };
    const handleSnackClose = (_, reason) => { if (reason !== 'clickaway') setOp(false); };

    useEffect(() => {
        if (!open) return;
        if (isEdit) { setName(initialUnit.name || ''); setShortName(initialUnit.shortName || ''); }
        else { setName(''); setShortName(''); }
    }, [open, isEdit, initialUnit]);

    const handleSubmit = async () => {
        if (!name.trim())      { showMsg('Unit Name is required'); return; }
        if (!shortName.trim()) { showMsg('Short Name is required'); return; }
        setSubmitting(true);
        try {
            if (isEdit) {
                await InventoryService.updateUnit({ id: initialUnit.id, name: name.trim(), shortName: shortName.trim() });
                showMsg('Unit updated successfully!');
            } else {
                await InventoryService.createUnit({ name: name.trim(), shortName: shortName.trim() });
                showMsg('Unit created successfully!');
            }
            if (onUnitAdded) onUnitAdded();
            setTimeout(() => setOpen(false), 400);
        } catch (err) {
            showMsg(err?.message || (isEdit ? 'Failed to update unit' : 'Failed to create unit'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">{isEdit ? 'Edit Unit' : 'Add Unit'}</Typography>
                        <IconButton onClick={onClose} color="error"><CloseIcon /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box mt={1} display="flex" flexDirection="column" gap={1}>
                        <AppFormField fullWidth required title="Unit Name" name="name"
                            value={name} onChange={(e) => setName(e.target.value)} margin="normal" />
                        <AppFormField fullWidth required title="Short Name" name="shortName"
                            value={shortName} onChange={(e) => setShortName(e.target.value)} margin="normal" />
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
