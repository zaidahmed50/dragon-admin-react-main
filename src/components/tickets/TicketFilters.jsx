import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Paper,
    Typography,
    Collapse,
    CircularProgress,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";
import useEnumOptions from "../../hooks/useEnumOptions.js";
import TicketService from "../../services/ticketService.js";

const TicketFilters = ({ filters, onFilterChange, onClearFilters }) => {
    const [showFilters, setShowFilters] = useState(false);

    // ── Fetch options from backend (with static fallback) ────────────────────
    const { options: statusOptions, loading: statusLoading } = useEnumOptions(
        TicketService.getStatuses,
        [
            { id: "OPEN",        title: "Open" },
            { id: "ASSIGNED",    title: "Assigned" },
            { id: "IN_PROGRESS", title: "In Progress" },
            { id: "RESOLVED",    title: "Resolved" },
            { id: "CLOSED",      title: "Closed" },
        ]
    );

    const { options: priorityOptions, loading: priorityLoading } = useEnumOptions(
        TicketService.getPriorities,
        [
            { id: "HIGH",   title: "High" },
            { id: "MEDIUM", title: "Medium" },
            { id: "LOW",    title: "Low" },
        ]
    );

    const hasActiveFilters = filters.status || filters.priority || filters.includeDeleted;

    return (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, m: 2 }}>
                <Button
                    variant={showFilters ? "contained" : "outlined"}
                    startIcon={<FilterListIcon />}
                    onClick={() => setShowFilters(!showFilters)}
                    size="small"
                >
                    Filters{hasActiveFilters && ` (${[filters.status, filters.priority, filters.includeDeleted].filter(Boolean).length})`}
                </Button>
                {hasActiveFilters && (
                    <Button
                        variant="text"
                        size="small"
                        startIcon={<ClearIcon />}
                        onClick={onClearFilters}
                        color="error"
                    >
                        Clear Filters
                    </Button>
                )}
            </Box>

            <Collapse in={showFilters}>
                <Paper sx={{ p: 2, m: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Filter Tickets
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>

                        {/* Status */}
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filters.status}
                                label="Status"
                                onChange={(e) => onFilterChange("status", e.target.value)}
                                endAdornment={statusLoading ? <CircularProgress size={14} sx={{ mr: 2 }} /> : null}
                            >
                                <MenuItem value=""><em>All Statuses</em></MenuItem>
                                {statusOptions.map((opt) => (
                                    <MenuItem key={opt.id} value={opt.id}>
                                        {opt.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Priority */}
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={filters.priority}
                                label="Priority"
                                onChange={(e) => onFilterChange("priority", e.target.value)}
                                endAdornment={priorityLoading ? <CircularProgress size={14} sx={{ mr: 2 }} /> : null}
                            >
                                <MenuItem value=""><em>All Priorities</em></MenuItem>
                                {priorityOptions.map((opt) => (
                                    <MenuItem key={opt.id} value={opt.id}>
                                        {opt.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Box>
                </Paper>
            </Collapse>
        </Box>
    );
};

export default TicketFilters;
