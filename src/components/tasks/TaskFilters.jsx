import {
    Box,
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import useEnumOptions from "../../hooks/useEnumOptions.js";
import TaskService from "../../services/taskService.js";

/**
 * @param {object}   filters             - current filter values
 * @param {function} onFilterChange      - (key, value) => void
 * @param {function} onClearFilters      - () => void
 * @param {boolean}  showApprovalFilter  - only visible to Super Admin / approvers
 */
const TaskFilters = ({ filters, onFilterChange, onClearFilters, showApprovalFilter = false }) => {

    const { options: statusOptions, loading: statusLoading } = useEnumOptions(
        TaskService.getStatuses,
        [
            { id: "CREATED",    title: "Created" },
            { id: "ASSIGNED",   title: "Assigned" },
            { id: "INPROGRESS", title: "In Progress" },
            { id: "ONHOLD",     title: "On Hold" },
            { id: "COMPLETED",  title: "Completed" },
            { id: "CANCELLED",  title: "Cancelled" },
        ]
    );

    const { options: priorityOptions, loading: priorityLoading } = useEnumOptions(
        TaskService.getPriorities,
        [
            { id: "LOW",      title: "Low" },
            { id: "MEDIUM",   title: "Medium" },
            { id: "HIGH",     title: "High" },
            { id: "CRITICAL", title: "Critical" },
        ]
    );

    return (
        <Box sx={{ mb: 3, p: 2, bgcolor: "background.paper", borderRadius: 1, boxShadow: 1 }}>
            <Grid container spacing={2} alignItems="center">

                {/* Status */}
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select fullWidth label="Status"
                        value={filters.status}
                        onChange={(e) => onFilterChange("status", e.target.value)}
                        size="small"
                        InputProps={{
                            endAdornment: statusLoading
                                ? <CircularProgress size={14} sx={{ mr: 1 }} />
                                : null,
                        }}
                    >
                        <MenuItem value="">All Statuses</MenuItem>
                        {statusOptions.map((opt) => (
                            <MenuItem key={opt.id} value={opt.id}>{opt.title}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Priority */}
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select fullWidth label="Priority"
                        value={filters.priority}
                        onChange={(e) => onFilterChange("priority", e.target.value)}
                        size="small"
                        InputProps={{
                            endAdornment: priorityLoading
                                ? <CircularProgress size={14} sx={{ mr: 1 }} />
                                : null,
                        }}
                    >
                        <MenuItem value="">All Priorities</MenuItem>
                        {priorityOptions.map((opt) => (
                            <MenuItem key={opt.id} value={opt.id}>{opt.title}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Approval status — only for super admin / approvers */}
                {showApprovalFilter && (
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            select fullWidth label="Approval Status"
                            value={filters.isApproved ?? ""}
                            onChange={(e) => onFilterChange("isApproved", e.target.value)}
                            size="small"
                        >
                            {/* Empty = backend default: pending + approved */}
                            <MenuItem value="">Pending + Approved</MenuItem>
                            <MenuItem value="true">Approved Only</MenuItem>
                            <MenuItem value="false">Cancelled Only</MenuItem>
                        </TextField>
                    </Grid>
                )}

                {/* Clear */}
                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        onClick={onClearFilters}
                        fullWidth
                    >
                        Clear Filters
                    </Button>
                </Grid>

            </Grid>
        </Box>
    );
};

export default TaskFilters;
