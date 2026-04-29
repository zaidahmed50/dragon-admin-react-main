import * as React from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
} from "@mui/material";
import { formatDateTime } from "../../helper/helper.jsx";

/* -------------------- CONSTANTS -------------------- */

const STATUS_COLORS = {
    OPEN: "info",
    ASSIGNED: "warning",
    IN_PROGRESS: "primary",
    RESOLVED: "success",
    CLOSED: "default",
};

/* -------------------- COMPONENT -------------------- */

const TicketViewDialog = ({ open, ticket, onClose, onEdit }) => {
    if (!ticket) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 3,
                    py: 2,
                }}
            >
                <DialogTitle sx={{ p: 0, fontWeight: 600 }}>
                    Ticket #{ticket.ticketNumber}
                </DialogTitle>

                <Chip
                    label={ticket.status}
                    color={STATUS_COLORS[ticket.status] || "default"}
                    size="small"
                    sx={{
                        height: 24,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        borderRadius: 1,
                        textTransform: "capitalize",
                    }}
                />
            </Box>

            <Divider />

            <DialogContent sx={{ py: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                        {ticket.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {ticket.description || "No description provided"}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "column",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    }}
                >
                    <InfoItem label="Priority" value={ticket.priority} />
                    <InfoItem
                        label="Customer"
                        value={ticket.customer?.name}
                    />
                    <InfoItem
                        label="Assigned by"
                        value={ticket.assignedBy?.user?.name || ""}
                    /> <InfoItem
                        label="Assigned To"
                        value={ticket.assignedTo?.user?.name || "Unassigned"}
                    />
                    <InfoItem
                        label="Created At"
                        value={formatDateTime((ticket.createdAt))}
                    />
                    <InfoItem
                        label="Assigned At"
                        value={
                            ticket.ticketAssignTime
                                ? formatDateTime(ticket.ticketAssignTime)
                                : "Not Assigned"
                        }
                    />
                    <InfoItem
                        label="Resolved At"
                        value={
                            ticket.ticketResolveTime
                                ? formatDateTime(ticket.ticketResolveTime)
                                : "Not Assigned"
                        }
                    /> <InfoItem
                        label="Resolution Notes"
                        value={
                            ticket.resolutionNotes?? "N/A"
                        }
                    />
                </Box>
            </DialogContent>

            <Divider />

            {/* Actions */}
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Close
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        onClose();
                        onEdit(ticket);
                    }}
                >
                    Edit Ticket
                </Button>
            </DialogActions>
        </Dialog>
    );
};

/* -------------------- SUB COMPONENT -------------------- */

const InfoItem = ({ label, value }) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
        }}

    >
        <Typography
            color="text.secondary"
             variant="caption" fontWeight={500}
            sx={{ display: "block", mb: 0.3 }

        }
        >
            {label}
        </Typography>
        <Typography variant="caption" fontWeight={500}>
            {value || "N/A"}
        </Typography>
        <Divider />
    </Box>
);

export default TicketViewDialog;
