import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Box,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AppFormField from "../../../../common/fromField.jsx";
import AppButton from "../../../../common/AppButton.jsx";
import Snackbar from "../../../../common/snack_bar";
import { InventoryService } from "../../../../services/index.js";
import { useState, useEffect } from "react";

export default function AddBrandModal({ open, onClose, setOpen, onBrandAdded, initialBrand = null }) {
    const isEdit = Boolean(initialBrand?.id);

    const [name, setName] = useState('');
    const [subCategoryId, setSubCategoryId] = useState('');
    const [subCategories, setSubCategories] = useState([]);
    const [loadingSubs, setLoadingSubs] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [op, setOp] = useState(false);
    const [message, setMessage] = useState('');

    const showMsg = (msg) => { setMessage(msg); setOp(true); };
    const handleSnackClose = (_, reason) => { if (reason !== 'clickaway') setOp(false); };

    // Load subcategories whenever dialog opens
    useEffect(() => {
        if (!open) return;
        setLoadingSubs(true);
        InventoryService.getSubCategories()
            .then((res) => setSubCategories(res?.data || []))
            .catch(() => showMsg('Failed to load sub-categories'))
            .finally(() => setLoadingSubs(false));
    }, [open]);

    // Pre-fill form in edit mode
    useEffect(() => {
        if (!open) return;
        if (isEdit) {
            setName(initialBrand.name || '');
            setSubCategoryId(initialBrand.subCategoryId || '');
        } else {
            setName('');
            setSubCategoryId('');
        }
    }, [open, isEdit, initialBrand]);

    const handleSubmit = async () => {
        if (!name.trim()) { showMsg('Brand Name is required'); return; }
        if (!subCategoryId)  { showMsg('Sub-Category is required'); return; }

        setSubmitting(true);
        try {
            if (isEdit) {
                await InventoryService.updateBrand({
                    id: initialBrand.id,
                    name: name.trim(),
                    subCategoryId,
                });
                showMsg('Brand updated successfully!');
            } else {
                await InventoryService.createBrand({
                    name: name.trim(),
                    subCategoryId,
                });
                showMsg('Brand created successfully!');
            }

            if (onBrandAdded) onBrandAdded();
            setTimeout(() => setOpen(false), 400);
        } catch (error) {
            console.error('Brand save error:', error);
            showMsg(error?.message || (isEdit ? 'Failed to update brand' : 'Failed to create brand'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                            {isEdit ? 'Edit Brand' : 'Add Brand'}
                        </Typography>
                        <IconButton onClick={onClose} color="error">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Box mt={1} display="flex" flexDirection="column" gap={2}>
                        {/* Sub-Category dropdown */}
                        <FormControl fullWidth size="small" required>
                            <InputLabel>Sub-Category</InputLabel>
                            <Select
                                value={subCategoryId}
                                label="Sub-Category"
                                onChange={(e) => setSubCategoryId(e.target.value)}
                                disabled={loadingSubs}
                                endAdornment={
                                    loadingSubs
                                        ? <CircularProgress size={16} sx={{ mr: 2 }} />
                                        : null
                                }
                            >
                                {subCategories.map((sc) => (
                                    <MenuItem key={sc.id} value={sc.id}>
                                        {sc.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Brand Name */}
                        <AppFormField
                            fullWidth
                            required
                            title="Brand Name"
                            name="brandName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <AppButton
                        label={isEdit ? 'Update' : 'Create'}
                        onClick={handleSubmit}
                        disabled={submitting}
                        loading={submitting}
                    />
                    <AppButton
                        label="Cancel"
                        color="red"
                        onClick={onClose}
                        disabled={submitting}
                    />
                </DialogActions>
            </Dialog>

            {op && <Snackbar open={op} message={message} handleClose={handleSnackClose} />}
        </>
    );
}
