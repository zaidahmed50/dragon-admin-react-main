import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Typography, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AppFormField from "../../../../common/fromField.jsx";
import AppButton from "../../../../common/AppButton.jsx";
import AppDropDownField from "../../../../common/dropdownField.jsx";
import Snackbar from "../../../../common/snack_bar";
import { InventoryService } from "../../../../services/index.js";
import { useState, useEffect } from "react";

export default function AddProductModal({ open, onClose, setOpen, onProductAdded, initialProduct = null }) {
    const isEdit = Boolean(initialProduct?.id);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [subCategoryId, setSubCategoryId] = useState('');
    const [brandId, setBrandId] = useState('');
    const [unitId, setUnitId] = useState('');

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [allSubCategories, setAllSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [units, setUnits] = useState([]);
    const [categoryId, setCategoryId] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [op, setOp] = useState(false);
    const [message, setMessage] = useState('');

    const showMsg = (msg) => { setMessage(msg); setOp(true); };
    const handleSnackClose = (_, reason) => { if (reason !== 'clickaway') setOp(false); };

    // Load dropdowns on open
    useEffect(() => {
        if (!open) return;
        Promise.all([
            InventoryService.getCategories(),
            InventoryService.getSubCategories(),
            InventoryService.getBrands(),
            InventoryService.getUnits(),
        ]).then(([cats, subs, brds, unts]) => {
            setCategories((cats?.data || []).map(c => ({ label: c.name, value: c.id })));
            setAllSubCategories(subs?.data || []);
            setBrands((brds?.data || []).map(b => ({ label: b.name, value: b.id })));
            setUnits((unts?.data || []).map(u => ({ label: `${u.name} (${u.shortName})`, value: u.id })));
        }).catch(() => showMsg('Failed to load dropdown data'));
    }, [open]);

    // Filter subcategories by selected category
    useEffect(() => {
        if (!categoryId) { setSubCategories([]); return; }
        setSubCategories(
            allSubCategories
                .filter(s => (s.categoryId === categoryId || s.category?.id === categoryId))
                .map(s => ({ label: s.name, value: s.id }))
        );
        setSubCategoryId('');
    }, [categoryId, allSubCategories]);

    // Pre-fill in edit mode
    useEffect(() => {
        if (!open) return;
        if (isEdit) {
            setName(initialProduct.name || '');
            setDescription(initialProduct.description || '');
            setPrice(initialProduct.price ?? '');
            setQuantity(initialProduct.quantity ?? '');
            setSubCategoryId(initialProduct.subCategoryId || '');
            setBrandId(initialProduct.brandId || '');
            setUnitId(initialProduct.unitId || '');
            setCategoryId(initialProduct.categoryId || '');
        } else {
            setName(''); setDescription(''); setPrice(''); setQuantity('');
            setSubCategoryId(''); setBrandId(''); setUnitId(''); setCategoryId('');
        }
    }, [open, isEdit, initialProduct]);

    const handleSubmit = async () => {
        if (!name.trim())    { showMsg('Product Name is required'); return; }
        if (!subCategoryId)  { showMsg('Sub-Category is required'); return; }

        const payload = {
            name: name.trim(),
            description,
            price: price !== '' ? Number(price) : null,
            quantity: quantity !== '' ? Number(quantity) : null,
            subCategoryId,
            brandId: brandId || null,
            unitId: unitId || null,
        };

        setSubmitting(true);
        try {
            if (isEdit) {
                await InventoryService.updateItem({ ...payload, productId: initialProduct.id });
                showMsg('Product updated successfully!');
            } else {
                await InventoryService.createItem(payload);
                showMsg('Product created successfully!');
            }
            if (onProductAdded) onProductAdded();
            setTimeout(() => setOpen(false), 400);
        } catch (err) {
            showMsg(err?.message || (isEdit ? 'Failed to update product' : 'Failed to create product'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">{isEdit ? 'Edit Product' : 'Add Product'}</Typography>
                        <IconButton onClick={onClose} color="error"><CloseIcon /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box mt={1}>
                        <Grid container spacing={2}>
                            {/* Row 1: Category → Sub-Category */}
                            <Grid item xs={12} sm={6}>
                                <AppDropDownField title="Category" options={categories}
                                    value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                                    required={false} disabled={isEdit} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <AppDropDownField title="Sub-Category *" options={subCategories}
                                    value={subCategoryId} onChange={(e) => setSubCategoryId(e.target.value)}
                                    required disabled={isEdit && !categoryId} />
                            </Grid>

                            {/* Row 2: Brand + Unit */}
                            <Grid item xs={12} sm={6}>
                                <AppDropDownField title="Brand" options={brands}
                                    value={brandId} onChange={(e) => setBrandId(e.target.value)} required={false} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <AppDropDownField title="Unit" options={units}
                                    value={unitId} onChange={(e) => setUnitId(e.target.value)} required={false} />
                            </Grid>

                            {/* Row 3: Name */}
                            <Grid item xs={12}>
                                <AppFormField fullWidth required title="Product Name" name="name"
                                    value={name} onChange={(e) => setName(e.target.value)} margin="normal" />
                            </Grid>

                            {/* Row 4: Price + Quantity */}
                            <Grid item xs={12} sm={6}>
                                <AppFormField fullWidth title="Price" name="price" type="number"
                                    value={price} onChange={(e) => setPrice(e.target.value)} margin="normal" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <AppFormField fullWidth title="Quantity" name="quantity" type="number"
                                    value={quantity} onChange={(e) => setQuantity(e.target.value)} margin="normal" />
                            </Grid>

                            {/* Row 5: Description */}
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
