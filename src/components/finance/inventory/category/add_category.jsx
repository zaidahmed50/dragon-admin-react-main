import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AppFormField from "../../../../common/fromField.jsx";
import AppButton from "../../../../common/AppButton.jsx";
import Snackbar from "../../../../common/snack_bar";
import { InventoryService } from "../../../../services/index.js";
import { useState, useEffect } from "react";

export default function AddCategoryModal({ open, onClose, setOpen, onCategoryAdded, initialCategory = null }) {
    const isEdit = Boolean(initialCategory?.id);
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [op, setOp] = useState(false);
    const [message, setMessage] = useState('');

    const showMsg = (msg) => { setMessage(msg); setOp(true); };
    const handleSnackClose = (_, reason) => { if (reason !== 'clickaway') setOp(false); };

    useEffect(() => {
        if (!open) return;
        setName(isEdit ? (initialCategory.name || '') : '');
    }, [open, isEdit, initialCategory]);

    const handleSubmit = async () => {
        if (!name.trim()) { showMsg('Category Name is required'); return; }
        setSubmitting(true);
        try {
            if (isEdit) {
                await InventoryService.updateCategory({ id: initialCategory.id, name: name.trim() });
                showMsg('Category updated successfully!');
            } else {
                await InventoryService.createCategory({ name: name.trim() });
                showMsg('Category created successfully!');
            }
            if (onCategoryAdded) onCategoryAdded();
            setTimeout(() => setOpen(false), 400);
        } catch (err) {
            showMsg(err?.message || (isEdit ? 'Failed to update category' : 'Failed to create category'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">{isEdit ? 'Edit Category' : 'Add Category'}</Typography>
                        <IconButton onClick={onClose} color="error"><CloseIcon /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box mt={1}>
                        <AppFormField fullWidth required title="Category Name" name="categoryName"
                            value={name} onChange={(e) => setName(e.target.value)} margin="normal" />
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
