import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Box,
    Alert,
    CircularProgress,
    Typography,
    Avatar,
} from "@mui/material";

import { ApiUrls, EmployeeService } from "../../services";
import AppDropDownField from "../../common/dropdownField.jsx";
import AppFormField from "../../common/fromField.jsx";
import SearchableDropdown from "../../common/SearchDropDown.jsx";
import { useEditTicket } from "./useEditTicket.js";

const STATUS_OPTIONS = [
    { label: "Open", value: "OPEN" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Resolved", value: "RESOLVED" },
];

const PRIORITY_OPTIONS = [
    { label: "High", value: "HIGH" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Low", value: "LOW" },
];

const EditTicketModal = ({ open, onClose, ticket, onSuccess }) => {
    const {
        loading,
        error,
        success,
        formData,
        errors,
        faultReasons,
        updateField,
        handleClose,
        handleUpdateTicket,
    } = useEditTicket({ ticket, onSuccess, onClose });

    if (!ticket) return null;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Update Ticket – {ticket.ticketNumber ?? "N/A"}
            </DialogTitle>

            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>Updated successfully</Alert>}

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                        <AppFormField
                            title="Title"
                            value={formData.title}
                            onChange={updateField("title")}
                            error={!!errors.title}
                            helperText={errors.title}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <AppDropDownField
                            label="Status"
                            value={formData.status}
                            onChange={updateField("status")}
                            options={STATUS_OPTIONS}
                            error={!!errors.status}
                            helperText={errors.status}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <AppDropDownField
                            label="Priority"
                            value={formData.priority}
                            onChange={updateField("priority")}
                            options={PRIORITY_OPTIONS}
                            error={!!errors.priority}
                            helperText={errors.priority}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <AppDropDownField
                            label="Fault Reason"
                            value={formData.faultReasonId}
                            onChange={updateField("faultReasonId")}
                            options={faultReasons.map(fr => ({ label: fr.reason, value: fr.id }))}
                            error={!!errors.faultReasonId}
                            helperText={errors.faultReasonId}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <AppFormField
                            title="Description"
                            value={formData.description}
                            onChange={updateField("description")}
                            multiline
                            rows={3}
                            error={!!errors.description}
                            helperText={errors.description}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <SearchableDropdown
                            label="Assign To (Employee)"
                            value={formData.employeeId ? { id: formData.employeeId } : null}
                            onChange={(val) => updateField("employeeId")(val?.id || 0)}
                            fetchOptions={async (search) => {
                                const res = await EmployeeService.getEmployees({
                                    search,
                                    page: 0,
                                    size: 10,
                                });
                                return res.data.content;
                            }}
                            optionLabel={(o) => o.user?.name || o.name}
                            renderOptionContent={(o) => (
                                <>
                                    <Avatar
                                        src={`${ApiUrls.imageUrl}${o.user?.profilePic}`}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                    <Box>
                                        <Typography variant="body2">
                                            {o.user?.name}
                                        </Typography>
                                        <Typography variant="caption">
                                            {o.user?.phone}
                                        </Typography>
                                    </Box>
                                </>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <AppFormField
                            title="Resolution Notes"
                            value={formData.resolutionNotes}
                            onChange={updateField("resolutionNotes")}
                            multiline
                            rows={3}
                            error={!!errors.resolutionNotes}
                            helperText={errors.resolutionNotes}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleUpdateTicket} disabled={loading}>
                    {loading ? <CircularProgress size={22} /> : "Update Ticket"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditTicketModal;
