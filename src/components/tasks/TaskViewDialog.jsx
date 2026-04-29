import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from "@mui/material";
import { formatDateTime } from "../../helper/helper.jsx";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const TaskViewDialog = ({ open, task, onClose, onEdit, onApprove, onCancel }) => {
    if (!task) return null;

    const statusColors = {
        CREATED: "info", ASSIGNED: "warning", INPROGRESS: "primary",
        ONHOLD: "secondary", COMPLETED: "success", CANCELLED: "error",
    };
    const priorityColors = {
        CRITICAL: "error", HIGH: "error", MEDIUM: "warning", LOW: "success",
    };

    const approvalStatus = () => {
        if (task.isApproved === true)  return { label: "Approved",  color: "success" };
        if (task.isApproved === false) return { label: "Cancelled", color: "error"   };
        return                                { label: "Pending Approval", color: "warning" };
    };
    const approval = approvalStatus();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                    <Typography variant="h6">Task Details</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Chip label={approval.label} color={approval.color} size="small" />
                        <Chip label={task.status}    color={statusColors[task.status]   || "default"} size="small" />
                        <Chip label={task.priority}  color={priorityColors[task.priority] || "default"} size="small" />
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                        <Typography variant="body1">{task.title}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                            {task.description || "No description provided."}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Assigned To</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PersonIcon fontSize="small" />
                            <Typography variant="body1">{task.assigneeTo?.name || "Unassigned"}</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Assigned By</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PersonIcon fontSize="small" />
                            <Typography variant="body1">{task.assigneeBy?.name || "N/A"}</Typography>
                        </Box>
                    </Grid>

                    {task.approvedBy && (
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                {task.isApproved === false ? "Cancelled By" : "Approved By"}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <PersonIcon fontSize="small" />
                                <Typography variant="body1">{task.approvedBy?.name}</Typography>
                            </Box>
                        </Grid>
                    )}

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Due Date</Typography>
                        <Typography variant="body1">
                            {task.dueDate ? formatDateTime(task.dueDate) : "N/A"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                        <Typography variant="body1">
                            {task.createdAt ? formatDateTime(task.createdAt) : "N/A"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Updated At</Typography>
                        <Typography variant="body1">
                            {task.updatedAt ? formatDateTime(task.updatedAt) : "N/A"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Assigned Time</Typography>
                        <Typography variant="body1">
                            {task.assignedTime ? formatDateTime(task.assignedTime) : "N/A"}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>

                {/* Super Admin actions — only when task is still pending */}
                {onCancel  && task.isApproved == null && (
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelOutlinedIcon />}
                        onClick={() => { onCancel(task); onClose(); }}
                    >
                        Cancel Task
                    </Button>
                )}
                {onApprove && task.isApproved == null && (
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleOutlineIcon />}
                        onClick={() => { onApprove(task); onClose(); }}
                    >
                        Approve
                    </Button>
                )}

                <Button variant="contained" onClick={() => { onEdit(task); onClose(); }}>
                    Edit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskViewDialog;
