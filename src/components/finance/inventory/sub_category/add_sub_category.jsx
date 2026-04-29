import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AppFormField from "../../../../common/fromField.jsx";
import AppButton from "../../../../common/AppButton.jsx";
import Snackbar from "../../../../common/snack_bar";
import { InventoryService } from "../../../../services/index.js";
import { useState, useEffect } from "react";
import AppDropDownField from "../../../../common/dropdownField.jsx";

export default function AddSubCategoryModal({ open, onClose, setOpen, onSubCategoryAdded, initialSubCategory = null }) {
    const isEdit = Boolean(initialSubCategory?.id);
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [op, setOp] = useState(false);
    const [message, setMessage] = useState('');

    const showMsg = (msg) => { setMessage(msg); setOp(true); };
    const handleSnackClose = (_, reason) => { if (reason !== 'clickaway') setOp(false); };

    useEffect(() => {
        if (!open) return;
        InventoryService.getCategories()
            .then(res => setCategories((res?.data || []).map(c => ({ label: c.name, value: c.id }))))
            .catch(() => showMsg('Failed to load categories'));
    }, [open]);

    useEffect(() => {
        if (!open) return;
        if (isEdit) {
            setName(initialSubCategory.name || '');
            setCategoryId(initialSubCategory.categoryId || initialSubCategory.category?.id || '');
        } else {
            setName('');
            setCategoryId('');
        }
    }, [open, isEdit, initialSubCategory]);

    const handleSubmit = async () => {
        if (!name.trim()) { showMsg('Name is required'); return; }
        if (!categoryId)  { showMsg('Category is required'); return; }
        setSubmitting(true);
        try {
            if (isEdit) {
                await InventoryService.updateSubCategory({ id: initialSubCategory.id, name: name.trim() });
                showMsg('Sub-Category updated successfully!');
            } else {
                await InventoryService.createSubCategory({ name: name.trim(), categoryId });
                showMsg('Sub-Category created successfully!');
            }
            if (onSubCategoryAdded) onSubCategoryAdded();
            setTimeout(() => setOpen(false), 400);
        } catch (err) {
            showMsg(err?.message || (isEdit ? 'Failed to update sub-category' : 'Failed to create sub-category'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">{isEdit ? 'Edit Sub-Category' : 'Add Sub-Category'}</Typography>
                        <IconButton onClick={onClose} color="error"><CloseIcon /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box mt={1} display="flex" flexDirection="column" gap={2}>
                        <AppDropDownField title="Category" options={categories} value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)} required disabled={isEdit} />
                        <AppFormField fullWidth required title="Sub-Category Name" name="name"
                            value={name} onChange={(e) => setName(e.target.value)} />
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
