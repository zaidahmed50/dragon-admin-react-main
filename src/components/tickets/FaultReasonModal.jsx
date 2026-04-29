import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Alert,
    CircularProgress,
} from "@mui/material";
import FaultReasonService from "../../services/faultReasonService.js";

const FaultReasonModal = ({ open, onClose, faultReason, onSuccess }) => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (faultReason) {
            setName(faultReason.name);
        } else {
            setName("");
        }
        setError(null);
    }, [faultReason, open]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let response;
            if (faultReason) {
                response = await FaultReasonService.updateFaultReason({
                    id: faultReason.id,
                    name: name,
                });
            } else {
                response = await FaultReasonService.createFaultReason({
                    name: name,
                });
            }

            if (response.success !== false) {
                onSuccess();
                onClose();
            } else {
                setError(response.message || "Operation failed");
            }
        } catch (err) {
            setError(err.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {faultReason ? "Edit Fault Reason" : "Create Fault Reason"}
            </DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Fault Reason Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : (faultReason ? "Update" : "Create")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FaultReasonModal;
