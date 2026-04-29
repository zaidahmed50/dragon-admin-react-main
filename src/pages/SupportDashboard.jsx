import { useState, useEffect, useCallback, useRef } from "react";
import {
    Box,
    Tooltip,
    Typography,
    CircularProgress,
    Button,
    Avatar,
    InputBase,
    Paper,
    ClickAwayListener,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
} from "@mui/material";
import {
    Person as PersonIcon,
    CheckCircleOutline as CheckCircleIcon,
    ErrorOutline as ErrorOutlineIcon,
    HourglassEmpty as HourglassIcon,
    Search as SearchIcon,
    Wifi as WifiIcon,
    WifiOff as WifiOffIcon,
    NotificationsActive as RingIcon,
    PhoneInTalk as PhoneInTalkIcon,
    Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TicketService from "../services/ticketService";
import { TaskService } from "../services/index.js";
import employeeService from "../services/employeeService.js";
import apiService from "../services/apiService.js";
import { formatDateTime } from "../helper/helper.jsx";
import { ApiUrls } from "../services/index.js";
import { useDashboardMqtt } from "../hooks/useDashboardMqtt.js";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, count, gradient, icon: Icon, onClick }) => (
    <Box onClick={onClick} sx={{
        flex: 1, minWidth: 0, background: gradient, borderRadius: 3,
        px: 3, py: 2.5, color: "#fff", cursor: "pointer", position: "relative",
        overflow: "hidden", transition: "transform 0.18s, box-shadow 0.18s",
        "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 28px rgba(0,0,0,0.18)" },
    }}>
        <Typography sx={{ fontWeight: 600, fontSize: "1rem", mb: 0.5 }}>{title}</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: "2.8rem", lineHeight: 1.1, mb: 1 }}>
            {(count === null || count === undefined) ? <CircularProgress size={28} sx={{ color: "rgba(255,255,255,0.8)" }} /> : count}
        </Typography>
        <Typography sx={{ fontSize: "0.78rem", opacity: 0.85 }}>Click to view</Typography>
        <Box sx={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", opacity: 0.22 }}>
            <Icon sx={{ fontSize: 70 }} />
        </Box>
    </Box>
);

// ─── Status / Priority Chip ───────────────────────────────────────────────────
const StatusChip = ({ value, type = "status" }) => {
    const statusColors = {
        OPEN: "#17a2b8", ASSIGNED: "#fd7e14", IN_PROGRESS: "#007bff",
        RESOLVED: "#28a745", CLOSED: "#6c757d", ONHOLD: "#fd7e14",
        COMPLETED: "#28a745", CREATED: "#17a2b8", INPROGRESS: "#007bff",
        CANCELLED: "#dc3545",
    };
    const priorityColors = { HIGH: "#fd7e14", MEDIUM: "#ffc107", LOW: "#28a745", CRITICAL: "#dc3545" };
    const bg = (type === "priority" ? priorityColors : statusColors)[value] || "#6c757d";
    return (
        <span style={{
            display: "inline-block", padding: "2px 10px", borderRadius: 4,
            fontSize: "0.72rem", fontWeight: 600, color: "#fff",
            background: bg, whiteSpace: "nowrap",
        }}>{value}</span>
    );
};

// ─── Mini Table ───────────────────────────────────────────────────────────────
const MiniTable = ({ columns, rows, emptyMessage, loading }) => (
    <Box sx={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col.key} style={{
                            textAlign: "left", padding: "8px 10px",
                            borderBottom: "1px solid #e8e8e8", fontWeight: 600, color: "#555", whiteSpace: "nowrap",
                        }}>{col.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr><td colSpan={columns.length} style={{ textAlign: "center", padding: 24 }}><CircularProgress size={22} /></td></tr>
                ) : rows.length === 0 ? (
                    <tr><td colSpan={columns.length} style={{ textAlign: "center", padding: 28, color: "#999" }}>{emptyMessage}</td></tr>
                ) : rows.map((row, i) => (
                    <tr key={i}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9f9")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                        style={{ borderBottom: "1px solid #f0f0f0" }}>
                        {columns.map((col) => (
                            <td key={col.key} style={{ padding: "9px 10px", whiteSpace: "nowrap" }}>
                                {col.render ? col.render(row) : row[col.key] ?? "N/A"}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </Box>
);

// ─── Panel Card ───────────────────────────────────────────────────────────────
const PanelCard = ({ title, onViewAll, children }) => (
    <Box sx={{ flex: 1, minWidth: 0, background: "#fff", borderRadius: 3, border: "1px solid #eee", p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>{title}</Typography>
            <Button variant="contained" size="small" onClick={onViewAll} sx={{
                background: "#5c6bc0", borderRadius: 2, fontSize: "0.78rem",
                textTransform: "none", px: 2, "&:hover": { background: "#3f51b5" },
            }}>View All</Button>
        </Box>
        {children}
    </Box>
);

const CodeBadge = ({ value }) => (
    <span style={{ background: "#f0f0f0", borderRadius: 4, padding: "2px 7px", fontSize: "0.75rem", fontWeight: 600 }}>
        {value}
    </span>
);

// ─── Perf Stat Badge ──────────────────────────────────────────────────────────
const PerfBadge = ({ icon, label, value, color }) => (
    <Box sx={{
        display: "flex", alignItems: "center", gap: 1.5,
        background: `${color}15`, border: `1px solid ${color}30`,
        borderRadius: 2.5, px: 2.5, py: 1.5, flex: 1, minWidth: 130,
    }}>
        <Box sx={{ color, p: 0.7, background: `${color}20`, borderRadius: 1.5, display: "flex" }}>{icon}</Box>
        <Box>
            <Typography sx={{ color: "#9ca3af", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.3 }}>
                {label}
            </Typography>
            <Typography sx={{ color: "#f1f5f9", fontWeight: 700, fontSize: "1.45rem", lineHeight: 1 }}>{value}</Typography>
        </Box>
    </Box>
);

// ─── Employee Search Dropdown ─────────────────────────────────────────────────
const EmployeeSearch = ({ selected, onSelect }) => {
    const [query, setQuery]       = useState("");
    const [options, setOptions]   = useState([]);
    const [open, setOpen]         = useState(false);
    const [searching, setSearching] = useState(false);
    const timerRef = useRef(null);

    const doSearch = useCallback(async (q) => {
        setSearching(true);
        try {
            const res = await employeeService.fetchEmployee({ search: q, size: 8, page: 0 });
            setOptions(res?.data?.content ?? []);
            setOpen(true);
        } catch { setOptions([]); }
        finally { setSearching(false); }
    }, []);

    const handleInput = (e) => {
        const v = e.target.value;
        setQuery(v);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => doSearch(v), 320);
    };

    const pick = (emp) => {
        onSelect(emp);
        setQuery(emp.name ?? "");
        setOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box sx={{ position: "relative", width: 300 }}>
                <Box sx={{
                    display: "flex", alignItems: "center", gap: 1,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 2, px: 1.5, py: 0.8,
                }}>
                    <SearchIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                    <InputBase
                        value={query}
                        onChange={handleInput}
                        onFocus={() => query && setOpen(true)}
                        placeholder="Search employee…"
                        sx={{ color: "#f1f5f9", fontSize: "0.84rem", flex: 1,
                            "& input::placeholder": { color: "#64748b" } }}
                    />
                    {searching && <CircularProgress size={14} sx={{ color: "#818cf8" }} />}
                </Box>

                {open && options.length > 0 && (
                    <Paper sx={{
                        position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                        zIndex: 999, background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 2, overflow: "hidden", maxHeight: 260, overflowY: "auto",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    }}>
                        {options.map((emp, i) => (
                            <Box key={i} onClick={() => pick(emp)} sx={{
                                display: "flex", alignItems: "center", gap: 1.5,
                                px: 1.5, py: 1.2, cursor: "pointer",
                                borderBottom: "1px solid rgba(255,255,255,0.05)",
                                "&:hover": { background: "rgba(99,102,241,0.15)" },
                            }}>
                                <Avatar
                                    src={emp?.profilePic ? `${ApiUrls.imageUrl}${emp.profilePic}` : undefined}
                                    sx={{ width: 30, height: 30, fontSize: "0.75rem", background: "#6366f1" }}
                                >
                                    {(emp?.name ?? "?")[0].toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography sx={{ color: "#f1f5f9", fontSize: "0.82rem", fontWeight: 600 }}>{emp?.name}</Typography>
                                    <Typography sx={{ color: "#64748b", fontSize: "0.72rem" }}>{emp?.employeeCode ?? emp?.email ?? ""}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
};


// ─── Ring Employee Dialog ─────────────────────────────────────────────────────
// Pops up when admin clicks the ring bell.  Admin searches for an employee
// and clicks the phone button — backend publishes "ring/employees/{userId}"
// via MQTT which triggers the full-screen call UI on the employee's Android device.
const RingEmployeeDialog = ({ open, onClose }) => {
    const [selected,  setSelected]  = useState(null);
    const [ringing,   setRinging]   = useState(false);
    const [toast,     setToast]     = useState(null);   // { severity, message }

    const handleRing = async () => {
        if (!selected) return;
        setRinging(true);
        try {
            await apiService.post(ApiUrls.ringEmployee(selected.id));
            setToast({ severity: "success", message: `📞 Ring sent to ${selected.name}` });
            setTimeout(onClose, 1200);
        } catch (err) {
            setToast({ severity: "error", message: err?.response?.data?.message || "Failed to send ring" });
        } finally {
            setRinging(false);
        }
    };

    const handleClose = () => {
        setSelected(null);
        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
                PaperProps={{ sx: { borderRadius: 3, background: "#1e293b" } }}>
                <DialogTitle sx={{
                    display: "flex", alignItems: "center", gap: 1.5,
                    color: "#f1f5f9", fontWeight: 700, pb: 0.5,
                }}>
                    <PhoneInTalkIcon sx={{ color: "#6366f1" }} />
                    Ring Employee
                    <Box flex={1} />
                    <IconButton size="small" onClick={handleClose} sx={{ color: "#64748b" }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pt: 1 }}>
                    <Typography sx={{ color: "#94a3b8", fontSize: "0.83rem", mb: 2 }}>
                        Search for an employee. Clicking Ring will send a real-time call
                        alert to their Android device — even if the app is in the background.
                    </Typography>

                    <EmployeeSearch selected={selected} onSelect={setSelected} />

                    {selected && (
                        <Box sx={{
                            mt: 2, display: "flex", alignItems: "center", gap: 1.5,
                            background: "rgba(99,102,241,0.12)",
                            border: "1px solid rgba(99,102,241,0.3)",
                            borderRadius: 2, px: 2, py: 1.2,
                        }}>
                            <Avatar sx={{ width: 34, height: 34, fontSize: "0.8rem", bgcolor: "#6366f1" }}>
                                {(selected.name ?? "?")[0].toUpperCase()}
                            </Avatar>
                            <Box flex={1}>
                                <Typography sx={{ color: "#f1f5f9", fontWeight: 600, fontSize: "0.88rem" }}>
                                    {selected.name}
                                </Typography>
                                <Typography sx={{ color: "#64748b", fontSize: "0.73rem" }}>
                                    {selected.employeeCode ?? selected.email ?? ""}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={handleClose} variant="outlined" size="small"
                        sx={{ color: "#94a3b8", borderColor: "#334155", textTransform: "none" }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRing}
                        disabled={!selected || ringing}
                        variant="contained"
                        startIcon={ringing ? <CircularProgress size={14} color="inherit" /> : <PhoneInTalkIcon />}
                        sx={{
                            background: "#6366f1", textTransform: "none", fontWeight: 600,
                            "&:hover": { background: "#4f46e5" },
                            "&:disabled": { background: "#334155", color: "#64748b" },
                        }}
                    >
                        {ringing ? "Ringing…" : "Ring Now"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Toast feedback */}
            <Snackbar
                open={!!toast}
                autoHideDuration={3500}
                onClose={() => setToast(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                {toast && (
                    <Alert severity={toast.severity} onClose={() => setToast(null)} sx={{ borderRadius: 2 }}>
                        {toast.message}
                    </Alert>
                )}
            </Snackbar>
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Main Dashboard
// ═══════════════════════════════════════════════════════════════════════════════
const SupportDashboard = () => {
    const navigate = useNavigate();

    const [ticketData, setTicketData]         = useState(null);
    const [taskData, setTaskData]             = useState(null);
    const [ticketsLoading, setTicketsLoading] = useState(true);
    const [tasksLoading, setTasksLoading]     = useState(true);
    const [lastUpdated, setLastUpdated]       = useState(null);
    const [ringOpen, setRingOpen]             = useState(false);
    const debounceRef = useRef(null);

    const fetchTicketDashboard = useCallback(async () => {
        setTicketsLoading(true);
        try {
            const res = await TicketService.getDashboard();
            setTicketData(res?.data ?? res);
            setLastUpdated(new Date());
        } catch (err) { console.error("Failed to fetch ticket dashboard", err); }
        finally { setTicketsLoading(false); }
    }, []);

    const fetchTaskDashboard = useCallback(async () => {
        setTasksLoading(true);
        try {
            const res = await TaskService.getDashboard();
            // ResponseWrapper structure: { success, message, data: { onHoldCount, ... } }
            // apiService.get() returns response.data (the ResponseWrapper), so res.data is the actual payload
            const payload = res?.data ?? res;
            setTaskData(payload);
        } catch (err) {
            console.error("Failed to fetch task dashboard", err);
            // Set zeros so cards show 0 instead of infinite spinner
            setTaskData({ onHoldCount: 0, inProgressCount: 0, completedCount: 0, criticalCount: 0, recentTasks: [], dueTasks: [] });
        }
        finally { setTasksLoading(false); }
    }, []);

    useEffect(() => {
        fetchTicketDashboard();
        fetchTaskDashboard();
    }, [fetchTicketDashboard, fetchTaskDashboard]);

    // ── MQTT real-time refresh ─────────────────────────────────────────────────
    // Debounce so rapid-fire events (e.g. bulk updates) only trigger one refresh.
    // The 600 ms window also gives the backend transaction a comfortable margin to
    // commit before the REST call arrives (afterCommit + network RTT).
    const handleTicketEvent = useCallback((event) => {
        console.info(`[Dashboard] Ticket event: ${event.event} ${event.ticketNumber}`);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchTicketDashboard(), 600);
    }, [fetchTicketDashboard]);

    // Clean up debounce timer when the component unmounts
    useEffect(() => () => clearTimeout(debounceRef.current), []);

    const { connected: mqttConnected } = useDashboardMqtt(handleTicketEvent);

    // ── Table column definitions ───────────────────────────────────────────────
    const ticketRecentCols = [
        { key: "ticketNumber", label: "Code",     render: (r) => <CodeBadge value={r.ticketNumber} /> },
        { key: "status",       label: "Status",   render: (r) => <StatusChip value={r.status}   type="status" /> },
        { key: "priority",     label: "Priority", render: (r) => <StatusChip value={r.priority} type="priority" /> },
        { key: "complaint",    label: "Complaint", render: (r) => r.faultReasons?.name ?? r.description ?? "—" },
        { key: "ticketStartTime", label: "Created",
            render: (r) => <span style={{ color: "#e74c3c", fontSize: "0.78rem" }}>{r.ticketStartTime ? formatDateTime(r.ticketStartTime) : "—"}</span> },
    ];
    const ticketDueCols = [
        { key: "ticketNumber",    label: "Code",     render: (r) => <CodeBadge value={r.ticketNumber} /> },
        { key: "status",          label: "Status",   render: (r) => <StatusChip value={r.status}   type="status" /> },
        { key: "priority",        label: "Priority", render: (r) => <StatusChip value={r.priority} type="priority" /> },
        { key: "ticketResolveTime", label: "Due Date", render: (r) => r.ticketResolveTime ? formatDateTime(r.ticketResolveTime) : "—" },
    ];
    const taskRecentCols = [
        { key: "id",       label: "Code",     render: (r) => <CodeBadge value={r.id ? `TSK-${String(r.id).padStart(4, "0")}` : "—"} /> },
        { key: "title",    label: "Task",     render: (r) => r.title ?? "—" },
        { key: "status",   label: "Status",   render: (r) => <StatusChip value={r.status}   type="status" /> },
        { key: "priority", label: "Priority", render: (r) => <StatusChip value={r.priority} type="priority" /> },
        { key: "createdAt", label: "Created", render: (r) => <span style={{ fontSize: "0.78rem" }}>{r.createdAt ? formatDateTime(r.createdAt) : "—"}</span> },
    ];
    const taskDueCols = [
        { key: "id",       label: "Code",     render: (r) => <CodeBadge value={r.id ? `TSK-${String(r.id).padStart(4, "0")}` : "—"} /> },
        { key: "title",    label: "Task",     render: (r) => r.title ?? "—" },
        { key: "status",   label: "Status",   render: (r) => <StatusChip value={r.status}   type="status" /> },
        { key: "priority", label: "Priority", render: (r) => <StatusChip value={r.priority} type="priority" /> },
        { key: "dueDate",  label: "Due Date", render: (r) => r.dueDate ? formatDateTime(r.dueDate) : "—" },
    ];

    const SectionLabel = ({ children }) => (
        <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", mb: 1.5, color: "#333" }}>{children}</Typography>
    );

    return (
        <Box sx={{ p: 3, background: "#f7f8fa", minHeight: "100vh" }}>
            {/* ── Header row ─────────────────────────────────────────────────── */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#1a1a2e", flex: 1 }}>
                    Dashboard
                </Typography>

                {/* Last-updated timestamp */}
                {lastUpdated && (
                    <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                        Updated {lastUpdated.toLocaleTimeString()}
                    </Typography>
                )}

                {/* ── Ring employee button ────────────────────────────────────
                  * Opens the RingEmployeeDialog — admin picks an employee and
                  * triggers a full-screen call alert on their Android device.
                  * ─────────────────────────────────────────────────────────── */}
                <Tooltip title="Ring an employee (sends a call alert to their phone)">
                    <Box
                        onClick={() => setRingOpen(true)}
                        sx={{
                            display:       "flex",
                            alignItems:    "center",
                            gap:           0.6,
                            px:            1.4,
                            py:            0.5,
                            borderRadius:  2,
                            cursor:        "pointer",
                            bgcolor:       "rgba(99,102,241,0.1)",
                            border:        "1px solid rgba(99,102,241,0.35)",
                            transition:    "all 0.18s",
                            "&:hover": {
                                bgcolor:     "rgba(99,102,241,0.2)",
                                borderColor: "rgba(99,102,241,0.6)",
                            },
                            // animated ring effect
                            "@keyframes ringWiggle": {
                                "0%,100%": { transform: "rotate(0deg)" },
                                "20%":     { transform: "rotate(-18deg)" },
                                "40%":     { transform: "rotate(18deg)" },
                                "60%":     { transform: "rotate(-12deg)" },
                                "80%":     { transform: "rotate(12deg)" },
                            },
                            "&:hover .ring-icon": {
                                animation: "ringWiggle 0.55s ease",
                            },
                        }}
                    >
                        <RingIcon
                            className="ring-icon"
                            sx={{ fontSize: 18, color: "#6366f1" }}
                        />
                        <Typography sx={{ fontSize: "0.73rem", fontWeight: 600, color: "#6366f1" }}>
                            Ring
                        </Typography>
                    </Box>
                </Tooltip>

                {/* Live / offline indicator */}
                <Tooltip title={mqttConnected ? "Live – updates automatically" : "Offline – refresh manually"}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5,
                        px: 1, py: 0.4, borderRadius: 2,
                        bgcolor: mqttConnected ? "rgba(46,204,143,0.1)" : "rgba(253,126,20,0.1)",
                        border: "1px solid",
                        borderColor: mqttConnected ? "rgba(46,204,143,0.4)" : "rgba(253,126,20,0.4)",
                        cursor: "default",
                    }}>
                        {mqttConnected
                            ? <WifiIcon    sx={{ fontSize: 14, color: "#2ecc8f" }} />
                            : <WifiOffIcon sx={{ fontSize: 14, color: "#fd7e14" }} />
                        }
                        <Typography sx={{ fontSize: "0.7rem", fontWeight: 600,
                            color: mqttConnected ? "#2ecc8f" : "#fd7e14" }}>
                            {mqttConnected ? "Live" : "Offline"}
                        </Typography>
                    </Box>
                </Tooltip>
            </Box>

            {/* Ring employee dialog */}
            <RingEmployeeDialog open={ringOpen} onClose={() => setRingOpen(false)} />

            {/* ══════════════════ TICKETS ═════════════════════════════════════ */}
            <SectionLabel>Tickets</SectionLabel>
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <StatCard title="Open"            count={ticketData?.onHoldCount}     gradient="linear-gradient(135deg,#4a90d9,#357abd)" icon={PersonIcon}       onClick={() => navigate("/support/tickets")} />
                <StatCard title="In Progress"     count={ticketData?.inProgressCount} gradient="linear-gradient(135deg,#f5a623,#e8930c)" icon={HourglassIcon}    onClick={() => navigate("/support/tickets")} />
                <StatCard title="Resolved"        count={ticketData?.resolvedCount}   gradient="linear-gradient(135deg,#2ecc8f,#1ea876)" icon={CheckCircleIcon}  onClick={() => navigate("/support/tickets")} />
                <StatCard title="Critical"        count={ticketData?.criticalCount}   gradient="linear-gradient(135deg,#e74c3c,#c0392b)" icon={ErrorOutlineIcon} onClick={() => navigate("/support/tickets")} />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
                <PanelCard title="Recent Tickets" onViewAll={() => navigate("/support/tickets")}>
                    <MiniTable columns={ticketRecentCols} rows={ticketData?.recentTickets ?? []} loading={ticketsLoading} emptyMessage="No recent tickets" />
                </PanelCard>
                <Box sx={{ flex: "0 0 400px", minWidth: 300 }}>
                    <PanelCard title="Tickets Due Date" onViewAll={() => navigate("/support/tickets")}>
                        <MiniTable columns={ticketDueCols} rows={ticketData?.dueTickets ?? []} loading={ticketsLoading} emptyMessage="No upcoming tickets" />
                    </PanelCard>
                </Box>
            </Box>

            {/* ══════════════════ TASKS AND OPERATIONS ═══════════════════════════════════════ */}
            <SectionLabel>Operations</SectionLabel>
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <StatCard title="On Hold"         count={taskData?.onHoldCount}     gradient="linear-gradient(135deg,#4a90d9,#357abd)" icon={PersonIcon}       onClick={() => navigate("/support/tasks")} />
                <StatCard title="In Progress"     count={taskData?.inProgressCount} gradient="linear-gradient(135deg,#f5a623,#e8930c)" icon={HourglassIcon}    onClick={() => navigate("/support/tasks")} />
                <StatCard title="Completed"       count={taskData?.completedCount}  gradient="linear-gradient(135deg,#2ecc8f,#1ea876)" icon={CheckCircleIcon}  onClick={() => navigate("/support/tasks")} />
                <StatCard title="Critical"        count={taskData?.criticalCount}   gradient="linear-gradient(135deg,#e74c3c,#c0392b)" icon={ErrorOutlineIcon} onClick={() => navigate("/support/tasks")} />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
                <PanelCard title="Recent Tasks" onViewAll={() => navigate("/support/tasks")}>
                    <MiniTable columns={taskRecentCols} rows={taskData?.recentTasks ?? []} loading={tasksLoading} emptyMessage="No recent tasks" />
                </PanelCard>
                <Box sx={{ flex: "0 0 440px", minWidth: 300 }}>
                    <PanelCard title="Tasks Due Date" onViewAll={() => navigate("/support/tasks")}>
                        <MiniTable columns={taskDueCols} rows={taskData?.dueTasks ?? []} loading={tasksLoading} emptyMessage="No upcoming tasks" />
                    </PanelCard>
                </Box>
            </Box>

        </Box>
    );
};

export default SupportDashboard;
