import {
    Box,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { formatDateTime } from "../../helper/helper.jsx";
import TaskViewDialog from "@/components/tasks/TaskViewDialog.jsx";
import TaskFilters from "@/components/tasks/TaskFilters.jsx";
import { useTaskList } from "./useTaskList.js";
import AppDataGrid from "../../common/AppDataGrid.jsx";
import { useColumnManager } from "@/hooks/useColumnManager.js";
import PersonIcon from "@mui/icons-material/Person";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext.jsx";

const TaskList = () => {
    const navigate  = useNavigate();
    const { isSuperAdmin, hasPermission } = useAuth();
    const canManage = isSuperAdmin() || hasPermission("APPROVE_TASK") || hasPermission("CANCEL_TASK");

    const {
        tasks,
        loading,
        error,
        searchQuery,
        filters,
        pagination,
        viewOpen,
        selectedTask,
        fetchTasks,
        handleSearch,
        handleFilterChange,
        handleClearFilters,
        handleFilterClick,
        handlePageSizeChange,
        handlePageClick,
        handleNextPage,
        handlePreviousPage,
        handleRowClick,
        handleViewDialogClose,
        handleDeleteTask,
        setSelectedTask,
        handleConfirmApprove,
        handleConfirmCancel,
    } = useTaskList();

    // ── Dialog state ──────────────────────────────────────────────────────────
    const [deleteDialogOpen,  setDeleteDialogOpen]  = useState(false);
    const [taskToDelete,      setTaskToDelete]       = useState(null);
    const [openApproveDialog, setOpenApproveDialog] = useState(false);
    const [openCancelDialog,  setOpenCancelDialog]  = useState(false);

    // ── Action handlers ───────────────────────────────────────────────────────
    const handleApproveClick = (row, e) => {
        e.stopPropagation();
        setSelectedTask(row);
        setOpenApproveDialog(true);
    };

    const handleCancelClick = (row, e) => {
        e.stopPropagation();
        setSelectedTask(row);
        setOpenCancelDialog(true);
    };

    const handleEditClick = (task) => {
        navigate(`/support/tasks/edit/${task.id}`, { state: { taskData: task } });
    };

    const handleDeleteClick = (task, e) => {
        e.stopPropagation();
        setTaskToDelete(task);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (taskToDelete) {
            await handleDeleteTask(taskToDelete.id);
            setDeleteDialogOpen(false);
            setTaskToDelete(null);
        }
    };

    // ── Approval status cell ──────────────────────────────────────────────────
    const renderApprovalCell = (params) => {
        const { isApproved, approvedBy } = params.row;

        // Cancelled / rejected
        if (isApproved === false) {
            return (
                <Chip
                    label="Cancelled"
                    color="error"
                    size="small"
                    sx={{ height: 20, fontSize: "0.7rem", fontWeight: 500, borderRadius: "6px" }}
                />
            );
        }

        // Approved
        if (isApproved === true) {
            return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PersonIcon sx={{ fontSize: 15, color: "success.main" }} />
                    <Typography variant="caption" fontWeight={500}>
                        {approvedBy?.name || "Approved"}
                    </Typography>
                </Box>
            );
        }

        // Pending approval (isApproved === null)
        if (canManage) {
            return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Chip
                        label="Pending"
                        color="warning"
                        size="small"
                        sx={{ height: 20, fontSize: "0.7rem", fontWeight: 500, borderRadius: "6px" }}
                    />
                    <Tooltip title="Approve">
                        <IconButton
                            size="small"
                            color="success"
                            onClick={(e) => handleApproveClick(params.row, e)}
                        >
                            <CheckCircleIcon size={16} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancel">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => handleCancelClick(params.row, e)}
                        >
                            <XCircleIcon size={16} />
                        </IconButton>
                    </Tooltip>
                </Box>
            );
        }

        // Non-admin sees a plain pending chip
        return (
            <Chip
                label="Pending"
                color="warning"
                size="small"
                sx={{ height: 20, fontSize: "0.7rem", fontWeight: 500, borderRadius: "6px" }}
            />
        );
    };

    // ── Column definitions ────────────────────────────────────────────────────
    const initialColumns = [
        {
            field: "isApproved",
            headerName: "Approval",
            width: 200,
            renderCell: renderApprovalCell,
        },
        {
            field: "title",
            headerName: "Title",
            width: 200,
        },
        {
            field: "status",
            headerName: "Status",
            width: 110,
            renderCell: (params) => {
                const statusColors = {
                    CREATED: "info", ASSIGNED: "warning", INPROGRESS: "primary",
                    ONHOLD: "secondary", COMPLETED: "success", CANCELLED: "error",
                };
                return (
                    <Chip
                        label={params.value}
                        color={statusColors[params.value] || "default"}
                        size="small"
                        sx={{ height: 20, fontSize: "0.7rem", fontWeight: 500, borderRadius: "6px",
                              px: 0.8, "& .MuiChip-label": { px: 0, lineHeight: 1 } }}
                    />
                );
            },
        },
        {
            field: "priority",
            headerName: "Priority",
            width: 100,
            renderCell: (params) => {
                const priorityColors = { CRITICAL: "error", HIGH: "error", MEDIUM: "warning", LOW: "success" };
                return (
                    <Chip
                        label={params.value}
                        color={priorityColors[params.value] || "default"}
                        size="small"
                        sx={{ height: 20, fontSize: "0.7rem", fontWeight: 500, borderRadius: "6px",
                              px: 0.8, "& .MuiChip-label": { px: 0, lineHeight: 1 } }}
                    />
                );
            },
        },
        {
            field: "assigneeTo",
            headerName: "Assigned To",
            width: 150,
            renderCell: (params) => {
                const assignee = params.row.assigneeTo;
                if (!assignee) return (
                    <Chip label="Not Assigned" size="small" variant="outlined" sx={{ fontSize: "0.75rem" }} />
                );
                return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <PersonIcon sx={{ fontSize: 15 }} />
                        <span>{assignee.name}</span>
                    </Box>
                );
            },
        },
        {
            field: "assigneeBy",
            headerName: "Assigned By",
            width: 150,
            valueGetter: (params) => params?.name ?? "N/A",
        },
        {
            field: "dueDate",
            headerName: "Due Date",
            width: 130,
            valueFormatter: (value) => value ? formatDateTime(value) : "N/A",
        },
        {
            field: "createdAt",
            headerName: "Created At",
            width: 130,
            valueFormatter: (value) => value ? formatDateTime(value) : "N/A",
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Edit">
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handleEditClick(params.row); }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => handleDeleteClick(params.row, e)}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    const columnManager = useColumnManager(initialColumns, "taskList");

    const toolbarProps = {
        title: "Tasks",
        searchQuery,
        onSearchChange: (e) => handleSearch(e.target.value),
        searchPlaceholder: "Search tasks...",
        createLabel: "Create Task",
        createPermission: "CREATE_TASK",
        onCreate: () => navigate("/support/tasks/create"),
        onFilterClick: handleFilterClick,
    };

    return (
        <Box sx={{ p: 3 }}>
            <TaskFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                showApprovalFilter={canManage}
            />

            <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
                <AppDataGrid
                    rows={tasks}
                    columns={initialColumns}
                    loading={loading}
                    error={error}
                    columnManager={columnManager}
                    onRowClick={handleRowClick}
                    getRowId={(row) => row.id}
                    onRefresh={fetchTasks}
                    toolbarProps={toolbarProps}
                    totalRecords={pagination.totalElements}
                    totalPages={pagination.totalPages}
                    pageSize={pagination.size}
                    currentPage={pagination.page}
                    handlePageSizeChange={handlePageSizeChange}
                    handlePreviousPage={handlePreviousPage}
                    handleNextPage={handleNextPage}
                    handlePageClick={handlePageClick}
                />
            </Box>

            {/* Task detail view */}
            <TaskViewDialog
                open={viewOpen}
                task={selectedTask}
                onClose={handleViewDialogClose}
                onEdit={(task) => {
                    handleViewDialogClose();
                    navigate(`/support/tasks/edit/${task.id}`, { state: { taskData: task } });
                }}
                onApprove={canManage ? (task) => { setSelectedTask(task); setOpenApproveDialog(true); } : null}
                onCancel={canManage  ? (task) => { setSelectedTask(task); setOpenCancelDialog(true);  } : null}
            />

            {/* ── Approve confirmation ── */}
            <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)}>
                <DialogTitle>Approve Task</DialogTitle>
                <DialogContent>
                    <Typography>
                        Approve <strong>{selectedTask?.title}</strong>? The assigned employee will be
                        notified and the task will become visible to them.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
                    <Button
                        color="success"
                        variant="contained"
                        onClick={async (e) => {
                            e.stopPropagation();
                            await handleConfirmApprove(selectedTask.id);
                            setOpenApproveDialog(false);
                        }}
                    >
                        Yes, Approve
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Cancel / reject confirmation ── */}
            <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
                <DialogTitle>Cancel Task</DialogTitle>
                <DialogContent>
                    <Typography>
                        Cancel / reject <strong>{selectedTask?.title}</strong>? The task will be
                        marked as cancelled and hidden from the default list.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCancelDialog(false)}>Back</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={async (e) => {
                            e.stopPropagation();
                            await handleConfirmCancel(selectedTask.id);
                            setOpenCancelDialog(false);
                        }}
                    >
                        Yes, Cancel Task
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Delete confirmation ── */}
            <Dialog open={deleteDialogOpen} onClose={() => { setDeleteDialogOpen(false); setTaskToDelete(null); }} maxWidth="sm" fullWidth>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete task <strong>{taskToDelete?.title}</strong>?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setDeleteDialogOpen(false); setTaskToDelete(null); }} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={loading}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TaskList;
