// import  {useEffect, useState} from 'react';
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     IconButton,
//     Box,
//     Typography
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import AppFormField from "../../../../common/fromField.jsx";
// import AppButton from "../../../../common/AppButton.jsx";
// import Snackbar from "../../../../common/snack_bar";
// import apiService from "../../../../services/apiService";
// import {ApiUrls} from "../../../../services";
//
// export default function AddBrandModal({open, onClose, setOpen, onBrandAdded, initialBrand = null}) {
//     const isEdit = Boolean(initialBrand?.id);
//
//     const [brandCode, setBrandCode] = useState('');
//     const [name, setName] = useState('');
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState("");
//
//     useEffect(() => {
//         if (!open) return;
//
//         if (isEdit) {
//             setBrandCode(initialBrand?.brandCode || '');
//             setName(initialBrand?.name || '');
//         } else {
//             setBrandCode('');
//             setName('');
//
//         }
//     }, [open, isEdit, initialBrand]);
//
//     const handleCloseSnackbar = (event, reason) => {
//         if (reason === "clickaway") return;
//         setSnackbarOpen(false);
//     };
//
//     const validate = () => {
//         if (!brandCode) return "Units code is required";
//         if (!name) return "Units name is required";
//         return null;
//     };
//
//     const handleSubmit = async () => {
//         const validationError = validate();
//         if (validationError) {
//             setSnackbarMessage(validationError);
//             setSnackbarOpen(true);
//             return;
//         }
//
//         try {
//             if (isEdit) {
//                 await apiService.put(ApiUrls.updateBrand, {
//                     id: Number(initialBrand.id),
//                     name: name,
//                     brandCode: brandCode,
//
//                 });
//
//                 setSnackbarMessage("Units updated successfully!");
//             } else {
//                 await apiService.post(ApiUrls.createBrand, {
//                     brandCode: brandCode,
//                     name: name,
//                 });
//
//                 setSnackbarMessage("Units created successfully!");
//             }
//
//             setSnackbarOpen(true);
//
//             if (typeof onBrandAdded === 'function') {
//                 onBrandAdded();
//             }
//
//             setTimeout(() => setOpen(false), 400);
//         } catch (error) {
//             console.error(isEdit ? "Error updating brand:" : "Error creating brand:", error);
//             setSnackbarMessage(error?.message || (isEdit ? "Failed to update brand" : "Failed to create brand"));
//             setSnackbarOpen(true);
//         }
//     };
//
//     return (
//         <>
//             <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//                 <DialogTitle>
//                     <Box display="flex" justifyContent="space-between" alignItems="center">
//                         <Typography variant="h6" fontWeight="bold">{isEdit ? "Update Units" : "Add Units"}</Typography>
//                         <IconButton onClick={onClose} color="error">
//                             <CloseIcon/>
//                         </IconButton>
//                     </Box>
//                 </DialogTitle>
//
//                 <DialogContent>
//                     <Box mt={1}>
//                         <AppFormField
//                             fullWidth
//                             required
//                             title="Brand Code"
//                             value={brandCode}
//                             onChange={(e) => setBrandCode(e.target.value)}
//                             margin="normal"
//                         />
//                         <AppFormField
//                             fullWidth
//                             required
//                             title="Brand Name"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             margin="normal"
//                         />
//
//                     </Box>
//                 </DialogContent>
//
//                 <DialogActions>
//                     <AppButton
//                         label={isEdit ? "Update" : "Create"}
//                         onClick={handleSubmit}
//                     />
//                     <AppButton
//                         label="Cancel"
//                         color="red"
//                         onClick={onClose}
//                     />
//                 </DialogActions>
//             </Dialog>
//
//             {snackbarOpen && (
//                 <Snackbar open={snackbarOpen} message={snackbarMessage} handleClose={handleCloseSnackbar}/>
//             )}
//         </>
//     );
// }
