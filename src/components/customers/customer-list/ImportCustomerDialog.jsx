import React, { useState, useRef } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, Typography, LinearProgress, Alert,
    List, ListItem, ListItemText, Chip, Divider,
    IconButton, Paper,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CustomerService from "../../../services/customerService.js";

const COLUMN_REFERENCE = [
    { col: "A", label: "Ref #" },
    { col: "B", label: "ATTN Name" },
    { col: "C", label: "Display Name" },
    { col: "D", label: "Business Name" },
    { col: "E", label: "Services" },
    { col: "F", label: "Status (Active / Inactive)" },
    { col: "G", label: "CNIC | NTN (with or without dashes)" },
    { col: "H", label: "Invoice Type" },
    { col: "I", label: "Mobile # 1" },
    { col: "J", label: "Mobile # 2" },
    { col: "K", label: "Mobile # 3" },
    { col: "L", label: "E-mail Address" },
    { col: "M", label: "Address" },
    { col: "N", label: "City" },
];

const ImportCustomerDialog = ({ open, onClose, onImportSuccess }) => {
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showColumns, setShowColumns] = useState(false);
    const inputRef = useRef();

    const handleFileSelect = (selectedFile) => {
        if (!selectedFile) return;
        const validTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ];
        if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
            setError("Please select a valid Excel file (.xlsx or .xls)");
            return;
        }
        setFile(selectedFile);
        setResult(null);
        setError(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFileSelect(e.dataTransfer.files[0]);
    };

    const handleImport = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await CustomerService.importCustomers(file);
            const data = response?.data;
            setResult({
                imported: data?.imported ?? 0,
                skipped: data?.skipped ?? 0,
                skippedReasons: data?.skippedReasons ?? [],
            });
            if (onImportSuccess) onImportSuccess();
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Import failed. Please check your file and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setResult(null);
        setError(null);
    };

    const handleClose = () => {
        handleReset();
        setShowColumns(false);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { bgcolor: "background.paper", border: 1, borderColor: "divider" } }}
        >
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <UploadFileIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>Import Customers</Typography>
                </Box>
                <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* Column Reference Toggle */}
                <Box sx={{ mb: 2 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setShowColumns(v => !v)}
                        sx={{ fontSize: "0.75rem" }}
                    >
                        {showColumns ? "Hide" : "Show"} Column Reference
                    </Button>
                    {showColumns && (
                        <Paper variant="outlined" sx={{ mt: 1, p: 1.5, maxHeight: 220, overflowY: "auto" }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: "block", mb: 0.5 }}>
                                Row 1 = Header (skipped). Data starts from Row 2.
                            </Typography>
                            {COLUMN_REFERENCE.map(({ col, label }) => (
                                <Box key={col} sx={{ display: "flex", gap: 1, alignItems: "center", mb: 0.3 }}>
                                    <Chip label={col} size="small" sx={{ width: 28, fontSize: "0.7rem", fontWeight: 700 }} />
                                    <Typography variant="caption">{label}</Typography>
                                </Box>
                            ))}
                        </Paper>
                    )}
                </Box>

                {/* Drop Zone */}
                {!result && (
                    <Box
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => !file && inputRef.current?.click()}
                        sx={{
                            border: 2,
                            borderStyle: "dashed",
                            borderColor: dragging ? "primary.main" : file ? "success.main" : "divider",
                            borderRadius: 2,
                            p: 3,
                            textAlign: "center",
                            cursor: file ? "default" : "pointer",
                            bgcolor: dragging ? "action.hover" : "background.default",
                            transition: "all 0.2s",
                            mb: 2,
                        }}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            style={{ display: "none" }}
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                        />
                        {file ? (
                            <Box>
                                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 36, mb: 0.5 }} />
                                <Typography variant="body2" fontWeight={600}>{file.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {(file.size / 1024).toFixed(1)} KB
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Button size="small" onClick={(e) => { e.stopPropagation(); handleReset(); }}>
                                        Change File
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box>
                                <UploadFileIcon sx={{ fontSize: 40, color: "text.disabled", mb: 0.5 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Drag & drop your Excel file here, or <strong>click to browse</strong>
                                </Typography>
                                <Typography variant="caption" color="text.disabled">Supports .xlsx and .xls</Typography>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Progress */}
                {loading && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Importing customers, please wait…
                        </Typography>
                        <LinearProgress />
                    </Box>
                )}

                {/* Error */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Result */}
                {result && (
                    <Box>
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            <Paper variant="outlined" sx={{ flex: 1, p: 2, textAlign: "center", borderColor: "success.light" }}>
                                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 28 }} />
                                <Typography variant="h5" fontWeight={700} color="success.main">{result.imported}</Typography>
                                <Typography variant="caption" color="text.secondary">Imported</Typography>
                            </Paper>
                            <Paper variant="outlined" sx={{ flex: 1, p: 2, textAlign: "center", borderColor: result.skipped > 0 ? "warning.light" : "divider" }}>
                                <WarningAmberIcon color={result.skipped > 0 ? "warning" : "disabled"} sx={{ fontSize: 28 }} />
                                <Typography variant="h5" fontWeight={700} color={result.skipped > 0 ? "warning.main" : "text.disabled"}>
                                    {result.skipped}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Skipped</Typography>
                            </Paper>
                        </Box>

                        {result.skippedReasons?.length > 0 && (
                            <>
                                <Divider sx={{ mb: 1 }} />
                                <Typography variant="caption" fontWeight={700} color="warning.main">
                                    Skipped Rows:
                                </Typography>
                                <List dense disablePadding sx={{ maxHeight: 160, overflowY: "auto" }}>
                                    {result.skippedReasons.map((reason, i) => (
                                        <ListItem key={i} sx={{ py: 0.2, px: 0 }}>
                                            <ListItemText
                                                primary={reason}
                                                primaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                {result ? (
                    <>
                        <Button onClick={handleReset} variant="outlined" size="small">Import Another File</Button>
                        <Button onClick={handleClose} variant="contained" size="small">Done</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={handleClose} color="inherit" size="small">Cancel</Button>
                        <Button
                            onClick={handleImport}
                            variant="contained"
                            disabled={!file || loading}
                            size="small"
                            startIcon={<UploadFileIcon />}
                        >
                            {loading ? "Importing…" : "Import"}
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ImportCustomerDialog;
