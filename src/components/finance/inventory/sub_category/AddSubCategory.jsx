import  { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Switch,
    FormControlLabel,
    IconButton,
    Box,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AppFormField from "../../../../common/fromField.jsx";
import AppButton from "../../../../common/AppButton.jsx";
import Snackbar from "../../../../common/snack_bar";
import apiService from "../../../../services/apiService";
import { ApiUrls } from "../../../../services";
import AppDropDownField from "../../../../common/dropdownField.jsx";

export default function AddSubCategoryModal({ open, onClose, setOpen }) {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subCategory, setSubCategory] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(true);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [categoryId, setCategoryId] = useState(""); // Renamed catId to categoryId

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") return;
        setIsSnackbarOpen(false);
    };

    const fetchCategory = async () => {
        try {
            const response = await apiService.get(ApiUrls.getCategories);
            setCategoryOptions(
                response.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                }))
            );
        } catch (error) {
            console.error("Error fetching categories:", error);
            setSnackbarMessage("Failed to load categories.");
            setIsSnackbarOpen(true);
        }
    }
    useEffect(() => {
        fetchCategory();
    }, []);

    const handleValidation = () => {
        if (!subCategory) return "SubCategory Required";
        if (!description) return "Description Required";
        if (!categoryId) return "Please Select Category";
        return null;
    }

    const handleSubmit = async () => {
        const validationError = handleValidation();
        if (validationError) {
            setSnackbarMessage(validationError);
            setIsSnackbarOpen(true);
            return;
        }

        try {
            await apiService.post(ApiUrls.createSubCategory, {
                "name": subCategory,
                "description": description,
                "categoryId": categoryId,
                "status": status // Assuming status should also be sent
            });
            setSnackbarMessage("SubCategory created successfully!");
            setIsSnackbarOpen(true);
        } catch (error) {
            console.error("Error creating subcategory:", error);
            setSnackbarMessage("Failed to create SubCategory.");
            setIsSnackbarOpen(true);
        } finally {
            setTimeout(() => setOpen(false), 500);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">Add SubCategory</Typography>
                        <IconButton onClick={onClose} color="error">
                            <CloseIcon/>
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box mt={1}>
                        <AppDropDownField
                            title="Category"
                            options={categoryOptions}
                            value={categoryId}
                            onChange={(e) => {setCategoryId(e.target.value);}}
                        />

                        <AppFormField
                            fullWidth
                            required
                            title="Sub Category"
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                            margin="normal"
                        />
                        <AppFormField
                            fullWidth
                            required
                            title="Description "
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            margin="normal"
                        />
                        <FormControlLabel
                            control={<Switch checked={status} onChange={(e) => setStatus(e.target.checked)}/>}
                            label="Status"
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <AppButton
                        label="Create"
                        onClick={handleSubmit}
                    />
                    <AppButton
                        label="Cancel"
                        color="red"
                        onClick={onClose} // Added onClick for Cancel button
                    />
                </DialogActions>
            </Dialog>

            {isSnackbarOpen && <Snackbar open={isSnackbarOpen} message={snackbarMessage} handleClose={handleCloseSnackbar}>
            </Snackbar>}
        </>
    );
}