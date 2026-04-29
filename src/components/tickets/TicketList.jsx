import {
    Badge,
    Box,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";
import DeleteIcon              from "@mui/icons-material/Delete";
import EditIcon                from "@mui/icons-material/Edit";
import ChatBubbleOutlineIcon   from "@mui/icons-material/ChatBubbleOutline";
import PersonIcon              from "@mui/icons-material/Person";
import GroupIcon               from "@mui/icons-material/Group";
import { useNavigate }         from "react-router-dom";
import { useState }            from "react";
import { formatDateTime }      from "../../helper/helper.jsx";
import TicketViewDialog        from "@/components/tickets/TicketViewDialog.jsx";
import TicketFilters           from "@/components/tickets/TicketFilters.jsx";
import { useTicketList }       from "./useTicketList.js";
import AppDataGrid             from "../../common/AppDataGrid.jsx";
import { useColumnManager }    from "@/hooks/useColumnManager.js";
import { useChatNotification } from "../../contexts/ChatNotificationContext.jsx";
import { useChatPopup }        from "../../contexts/ChatPopupContext.jsx";

const STATUS_COLORS = {
    OPEN: "info", ASSIGNED: "warning", IN_PROGRESS: "primary",
    RESOLVED: "success", CLOSED: "default",
};
const PRIORITY_COLORS = { HIGH: "error", MEDIUM: "warning", LOW: "success" };

const TicketList = () => {
    const navigate = useNavigate();

    const {
        tickets, loading, error,
        searchQuery, filters, pagination,
        viewOpen, selectedTicket,
        mqttConnected,
        fetchTickets, handleSearch, handleFilterChange, handleClearFilters,
        handleFilterClick, handlePageSizeChange, handlePageClick,
        handleNextPage, handlePreviousPage, handleViewDialogClose,
        handleDeleteTicket, setSelectedTicket,
    } = useTicketList();

    // ── Unread badges from global notification context ────────────────────
    const { unreadCounts } = useChatNotification();

    // ── Popup chat ────────────────────────────────────────────────────────
    const { openChats, openChat } = useChatPopup();

    const handleOpenChat = (ticket, e) => {
        e?.stopPropagation();
        openChat(ticket);
    };

    // ── Delete confirm dialog ─────────────────────────────────────────────
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [ticketToDelete,   setTicketToDelete]   = useState(null);

    const handleEditClick = (ticket) =>
        navigate(`/support/tickets/edit/${ticket.id}`, { state: { ticketData: ticket } });

    const handleDeleteClick = (ticket, event) => {
        event.stopPropagation();
        setTicketToDelete(ticket);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (ticketToDelete) {
            await handleDeleteTicket(ticketToDelete.id);
            setDeleteDialogOpen(false);
            setTicketToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setTicketToDelete(null);
    };

    // ── Row click → open popup ────────────────────────────────────────────
    const handleRowClick = (params) => handleOpenChat(params.row);

    // ── Columns ───────────────────────────────────────────────────────────
    const TICKET_TYPE_COLORS = { COR: "secondary", NOC: "info", ODU: "warning" };

    const initialColumns = [
        { field: "ticketNumber", headerName: "Ticket #", width: 80 },
        {
            field: "ticketType", headerName: "Type", width: 75,
            renderCell: (params) => params.value ? (
                <Chip label={params.value} color={TICKET_TYPE_COLORS[params.value] || "default"} size="small"
                    sx={{ height: 20, fontSize: "0.7rem", fontWeight: 500, borderRadius: "6px", px: 0.8, "& .MuiChip-label": { px: 0, lineHeight: 1 } }} />
            ) : null,
        },
        {
            field: "status", headerName: "Status", width: 90,
            renderCell: (params) => (
                <Chip label={params.value} color={STATUS_COLORS[params.value] || "default"} size="small"
                    sx={{ height: 20, fontSize: "0.7rem", fontWeight: 500, borderRadius: "6px", px: 0.8, "& .MuiChip-label": { px: 0, lineHeight: 1 } }} />
            ),
        },
        {
            field: "priority", headerName: "Priority", width: 80,
            renderCell: (params) => (
                <Chip label={params.value} color={PRIORITY_COLORS[params.value] || "default"} size="small"
                    sx={{ height: 20, fontSize: "0.7rem", fontWeight: 500, borderRadius: "6px", px: 0.8, "& .MuiChip-label": { px: 0, lineHeight: 1 } }} />
            ),
        },
        {
            field: "customer", headerName: "Customer", width: 140,
            valueGetter: (params) => params?.name,
        },
        {
            field: "assignment", headerName: "Assigned To", width: 140,
            renderCell: (params) => {
                const assignment = params.row.assignment;
                if (!assignment) return <Chip label="Not Assigned" size="small" variant="outlined" sx={{ fontSize: "0.72rem" }} />;
                return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {assignment.type === "EMPLOYEE" ? <PersonIcon sx={{ fontSize: 15 }} /> : <GroupIcon sx={{ fontSize: 15 }} />}
                        <span>{assignment.name}</span>
                    </Box>
                );
            },
        },
        {
            field: "assignedBy", headerName: "Assigned By", width: 130,
            valueGetter: (params) => params?.name ?? "N/A",
        },
        {
            field: "faultReasons", headerName: "Fault Reason", width: 130,
            valueGetter: (params) => params?.name ?? "N/A",
        },
        {
            field: "ticketStartTime", headerName: "Start Time", width: 110,
            valueFormatter: (value) => value ? formatDateTime(value) : "N/A",
        },
        {
            field: "ticketAssignTime", headerName: "Assigned Time", width: 130,
            valueFormatter: (value) => value ? formatDateTime(value) : "N/A",
        },
        {
            field: "ticketResolveTime", headerName: "Resolve Time", width: 130,
            valueFormatter: (value) => value ? formatDateTime(value) : "N/A",
        },
        {
            field: "deletedAt", headerName: "Deleted", width: 80,
            renderCell: (params) =>
                params.value ? (
                    <Chip label="DELETED" color="error" size="small" variant="outlined"
                        sx={{ height: 20, fontSize: "0.7rem", fontWeight: 600 }} />
                ) : null,
        },
        {
            field: "actions", headerName: "Actions", width: 130, sortable: false,
            renderCell: (params) => {
                const isDeleted = params.row.deletedAt != null;
                const isOpen    = openChats.some(c => c.ticket.id === params.row.id);
                return (
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                        {/* Chat button — badge shows unread count */}
                        <Badge
                            badgeContent={unreadCounts[params.row.id] ?? 0}
                            color="error"
                            max={10}
                            overlap="circular"
                            sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 12, height: 10, p: '0 2px' } }}
                        >
                            <IconButton
                                size="small"
                                color={isOpen ? 'success' : (unreadCounts[params.row.id] ? 'error' : 'primary')}
                                onClick={(e) => handleOpenChat(params.row, e)}
                                title={isOpen
                                    ? 'Chat is open'
                                    : unreadCounts[params.row.id]
                                        ? `${unreadCounts[params.row.id]} unread message(s)`
                                        : 'Open Team Chat'}
                            >
                                <ChatBubbleOutlineIcon fontSize="small" />
                            </IconButton>
                        </Badge>

                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handleEditClick(params.row); }}
                            title={isDeleted ? "Cannot edit deleted ticket" : "Edit Ticket"}
                            disabled={isDeleted}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>

                        {params.row.status === "OPEN" && !isDeleted && (
                            <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => handleDeleteClick(params.row, e)}
                                title="Delete Ticket"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                );
            },
        },
    ];

    const columnManager = useColumnManager(initialColumns, "ticketList");

    const liveIndicator = (
        <Box
            component="span"
            title={mqttConnected ? "Live updates active" : "Live updates offline"}
            sx={{
                display:       "inline-flex",
                alignItems:    "center",
                gap:           0.6,
                ml:            1.5,
                fontSize:      "0.72rem",
                color:         mqttConnected ? "success.main" : "text.disabled",
                verticalAlign: "middle",
            }}
        >
            <Box
                component="span"
                sx={{
                    width:        8,
                    height:       8,
                    borderRadius: "50%",
                    bgcolor:      mqttConnected ? "success.main" : "grey.400",
                    display:      "inline-block",
                    // pulse animation only when connected
                    animation:    mqttConnected
                        ? "mqttPulse 1.8s ease-in-out infinite"
                        : "none",
                    "@keyframes mqttPulse": {
                        "0%, 100%": { opacity: 1 },
                        "50%":      { opacity: 0.35 },
                    },
                }}
            />
            {mqttConnected ? "Live" : "Offline"}
        </Box>
    );

    const toolbarProps = {
        title:             <Box component="span" sx={{ display: "inline-flex", alignItems: "center" }}>Support Tickets{liveIndicator}</Box>,
        searchQuery:       searchQuery,
        onSearchChange:    (e) => handleSearch(e.target.value),
        searchPlaceholder: "Search tickets...",
        createLabel:       "Create Ticket",
        createPermission:  "TICKET_CREATE",
        onCreate:          () => navigate("/support/tickets/create"),
        onFilterClick:     handleFilterClick,
    };

    return (
        <Box sx={{
            p:             3,
            height:        "calc(100vh - 70px)",
            display:       "flex",
            flexDirection: "column",
            overflow:      "hidden",
            minHeight:     0,
        }}>
            <TicketFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
            />

            {/* ── Full-width ticket list ─────────────────────────────────
              * Chat now opens as floating bottom popup (Facebook-style),
              * so the list always takes full width.
              * ─────────────────────────────────────────────────────────── */}
            <Box sx={{ flex: "1 1 0", minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <AppDataGrid
                    rows={tickets}
                    columns={initialColumns}
                    loading={loading}
                    error={error}
                    columnManager={columnManager}
                    onRowClick={handleRowClick}
                    getRowId={(row) => row.id}
                    onRefresh={fetchTickets}
                    toolbarProps={toolbarProps}
                    totalRecords={pagination.totalElements}
                    totalPages={pagination.totalPages}
                    pageSize={pagination.size}
                    currentPage={pagination.page}
                    handlePageSizeChange={handlePageSizeChange}
                    handlePreviousPage={handlePreviousPage}
                    handleNextPage={handleNextPage}
                    handlePageClick={handlePageClick}
                    getRowClassName={(params) =>
                        openChats.some(c => c.ticket.id === params.row.id) ? "chat-active-row" : ""
                    }
                    sx={{
                        "& .chat-active-row": {
                            bgcolor:  "primary.50",
                            "&:hover": { bgcolor: "primary.100" },
                        },
                    }}
                />
            </Box>

            {/* ── View dialog ── */}
            <TicketViewDialog
                open={viewOpen}
                ticket={selectedTicket}
                onClose={handleViewDialogClose}
                onEdit={(ticket) => {
                    setSelectedTicket(ticket);
                    navigate(`/support/tickets/edit/${ticket.id}`, { state: { ticketData: ticket } });
                }}
            />

            {/* ── Delete confirm dialog ── */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="sm" fullWidth>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete ticket <strong>{ticketToDelete?.ticketNumber}</strong>?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This action cannot be undone. Only tickets with OPEN status can be deleted.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="inherit">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={loading}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TicketList;
