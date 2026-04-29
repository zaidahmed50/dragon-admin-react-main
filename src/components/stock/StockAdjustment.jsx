import  { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import apiService from "../../services/apiService.js";
import {ApiUrls} from "../../services/index.js";


const StockAdjustment = ({ open, onClose, onStockAdded }) => {
    useTheme();
    const [itemName, setItemName] = useState("");
    const [sku, setSku] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [unit, setUnit] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState("IN_STOCK");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!itemName || !sku || !category) {
            alert("Please fill required fields!");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: itemName,
                sku,
                brand,
                category,
                subCategory,
                unit,
                quantity: Number(quantity),
                price: Number(price),
                status,
            };

            const response = await apiService.post(ApiUrls.adjustStock, payload);

            if (response?.success) {
                onStockAdded();
                onClose();
                setItemName("");
                setSku("");
                setBrand("");
                setCategory("");
                setSubCategory("");
                setUnit("");
                setQuantity("");
                setPrice("");
                setStatus("IN_STOCK");
            } else {
                alert("Error adding stock");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error adding stock");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 500,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    p: 4,
                    boxShadow: 24,
                }}
            >
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Add New Stock
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Item Name"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="SKU"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Units"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <MenuItem value="">Select Category</MenuItem>
                            <MenuItem value="Electronics">Electronics</MenuItem>
                            <MenuItem value="Apparel">Apparel</MenuItem>
                            <MenuItem value="Accessories">Accessories</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Sub-Category"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <MenuItem value="IN_STOCK">In Stock</MenuItem>
                            <MenuItem value="LOW_STOCK">Low Stock</MenuItem>
                            <MenuItem value="OUT_OF_STOCK">Out of Stock</MenuItem>
                        </Select>
                    </FormControl>

                    <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                        <Button variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Stock"}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    );
};

export default StockAdjustment;
