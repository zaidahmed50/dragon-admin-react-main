import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AppFormField from "../../../../common/fromField.jsx";
import AppButton from "../../../../common/AppButton.jsx";
import AppDropDownField from "../../../../common/dropdownField.jsx";
import Snackbar from "../../../../common/snack_bar";
import { InventoryService } from "../../../../services/index.js";
import { useState, useEffect } from "react";

export default function AddProductModal({
  open,
  onClose,
  setOpen,
  onProductAdded,
  initialProduct = null,
}) {
  const isEdit = Boolean(initialProduct?.id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [variant, setVariant] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);
  const [modelId, setModelId] = useState(0);
  const [unitId, setUnitId] = useState(0);

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [op, setOp] = useState(false);
  const [message, setMessage] = useState("");

  const showMsg = (msg) => {
    setMessage(msg);
    setOp(true);
  };
  const handleSnackClose = (_, reason) => {
    if (reason !== "clickaway") setOp(false);
  };

  useEffect(() => {
    if (!open) return;
    InventoryService.getCategories()
      .then((res) => {
        setCategories(
          (res?.data || []).map((c) => ({ label: c.name, value: c.id, ...c })),
        );
      })
      .catch(() => showMsg("Failed to load products"));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      setName(initialProduct.name || "");
      setDescription(initialProduct.description || "");
      setCategoryId(initialProduct.categoryId || "");
      setSku(initialProduct.sku || "");
      setUnitPrice(initialProduct.unitPrice || 0);
      setUnitId(initialProduct.unitId || 0);
      setModelId(initialProduct.modelId || 0);
      setVariant(initialProduct.variant || "");
    } else {
      setName("");
      setDescription("");
      setCategoryId("");
      setSku("");
      setUnitPrice(0);
      setUnitId(0);
      setModelId(0);
      setVariant("");
      setSelectedProduct(null);
    }
  }, [open, isEdit, initialProduct]);

  const handleSubmit = async () => {
    if (!categoryId) {
      showMsg("Please select a product first");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        modelId: Number(modelId) > 0 ? Number(modelId) : 1,
        name: name.trim(),
        description: description || "New product entry",
        sku: `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        variant: variant || "Standard",
        unitId: Number(unitId) > 0 ? Number(unitId) : 1,
        unitPrice: Number(unitPrice),
      };
      console.log("Sending Payload to Sir's API:", payload);

      if (isEdit) {
        await InventoryService.updateItem({
          ...payload,
          productId: initialProduct.id,
        });
        showMsg("Product updated successfully!");
      } else {
        await InventoryService.createItem(payload);
        showMsg("Product created successfully!");
      }

      if (onProductAdded) onProductAdded();
      setTimeout(() => setOpen(false), 400);
    } catch (err) {
      console.error("API Error Details:", err.response?.data);
      showMsg(
        err.response?.data?.message ||
          "Action failed: Check Data Integrity (SKU unique?)",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ pb: 0 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            pb={1}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#2c3e50" }}>
              {isEdit ? "Edit Product Details" : "Add Product"}
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{ color: "#e74c3c" }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
        </DialogTitle>

        <DialogContent sx={{ pt: 3, bgcolor: "#fdfdfd" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <AppDropDownField
                title="Select Product"
                options={categories}
                value={categoryId}
                onChange={(e) => {
                  const id = e.target.value;
                  setCategoryId(id);

                  const item = categories.find((c) => c.value === id);

                  if (item) {
                    setSelectedProduct(item);
                    setName(item.label || "");
                    setSku(item.sku || "");
                    setUnitPrice(item.unitPrice || 0);

                    const mId = item.modelId || item.id;
                    setModelId(mId);

                    console.log("Setting Model ID to:", mId);

                    setUnitId(item.unitId || 0);
                    if (!description) setDescription(item.description || "");
                  }
                }}
                disabled={isEdit}
              />
            </Grid>

            {(categoryId || isEdit) && (
              <Grid item xs={12}>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{ border: "1px solid #e0e0e0", borderRadius: "8px" }}
                >
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                      <TableRow>
                        <TableCell
                          sx={{ fontWeight: "800", fontSize: "0.75rem" }}
                        >
                          MODEL ID
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "800", fontSize: "0.75rem" }}
                        >
                          PRODUCT NAME
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "800", fontSize: "0.75rem" }}
                        >
                          SKU CODE
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "800", fontSize: "0.75rem" }}
                        >
                          BASE PRICE
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{modelId}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#1a73e8" }}>
                          {name}
                        </TableCell>
                        <TableCell>{sku || "---"}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#188038" }}>
                          {unitPrice}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <AppFormField
                label="Product Variant"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                placeholder="Example: Color (Red), Size (XL), or Storage (512GB)"
              />
              <Typography variant="caption" color="textSecondary">
                Variant
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <AppFormField
                label="Adjust Unit Price"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                type="number"
                placeholder="Enter price"
              />
              <Typography variant="caption" color="textSecondary">
                Unit Price
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <AppFormField
                label="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                placeholder="Write important details or notes about this product..."
              />
              <Typography variant="caption" color="textSecondary">
                Description
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{ p: 3, bgcolor: "#f8f9fa", borderTop: "1px solid #eee" }}
        >
          <AppButton
            label={isEdit ? "Update Product" : "Create"}
            onClick={handleSubmit}
            disabled={submitting}
            loading={submitting}
            variant="contained"
          />
          <AppButton
            label="Cancel"
            color="red"
            onClick={onClose}
            disabled={submitting}
          />
        </DialogActions>
      </Dialog>
      {op && (
        <Snackbar open={op} message={message} handleClose={handleSnackClose} />
      )}
    </>
  );
}
