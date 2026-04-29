import React from "react";
import { Snackbar, Alert } from "@mui/material";

const ShowValidationMessage = ({ open, message, handleClose }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }} // top-right position
        >
            <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default ShowValidationMessage;
