
import { useState, useEffect, useCallback, useRef } from "react";
import { useEmployeeData } from "@/hooks/useEmployeeData.js";
import { TaskService } from "../../services/index.js";

const MQTT_WS_URL    = import.meta.env.VITE_MQTT_WS_URL || 'ws://localhost:9001/mqtt';
const TASKS_TOPIC    = 'tasks/events';

export const useTaskList = () => {
    const {
        employees,
        loading: loadingEmployees,
        error: errorEmployees,
        fetchEmployees,
    } = useEmployeeData();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        status: "",
        priority: "",
        isApproved: "",   // "", "true", "false"  — empty = default (pending+approved)
    });
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
    });
    const [viewOpen, setViewOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const searchParams = {
                page: pagination.page,
                size: pagination.size,
                title: searchQuery || undefined,
            };

            if (filters.status)     searchParams.status     = filters.status;
            if (filters.priority)   searchParams.priority   = filters.priority;
            // Only pass isApproved when explicitly chosen; omitting = backend default (pending+approved)
            if (filters.isApproved !== "") {
                searchParams.isApproved = filters.isApproved === "true";
            }

            const response = await TaskService.searchTasks(searchParams);
            // Spring Page response is nested under response.data
            const pageData = response?.data ?? response;
            setTasks(pageData?.content ?? []);
            setPagination((prev) => ({
                ...prev,
                totalElements: pageData?.totalElements ?? 0,
                totalPages:    pageData?.totalPages    ?? 0,
            }));
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.size, searchQuery, filters]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // ── MQTT real-time refresh ────────────────────────────────────────────────
    // Keep a stable ref to fetchTasks so the MQTT handler always calls the latest version
    const fetchTasksRef = useRef(fetchTasks);
    useEffect(() => { fetchTasksRef.current = fetchTasks; }, [fetchTasks]);

    useEffect(() => {
        let mqttClient = null;
        let destroyed  = false;

        import('mqtt')
            .then(mod => {
                if (destroyed) return;
                const mqtt = mod.default ?? mod;

                mqttClient = mqtt.connect(MQTT_WS_URL, {
                    clientId:        `dragon-tasks-list-${Date.now()}`,
                    clean:           true,
                    reconnectPeriod: 5000,
                    connectTimeout:  10_000,
                    keepalive:       30,
                    protocolVersion: 4,
                });

                mqttClient.on('connect', () => {
                    if (destroyed) return;
                    mqttClient.subscribe(TASKS_TOPIC, { qos: 0 }, (err) => {
                        if (err) console.warn('[MQTT Tasks] Subscribe failed:', err.message);
                    });
                });

                mqttClient.on('message', (_topic, payload) => {
                    try {
                        JSON.parse(new TextDecoder().decode(payload)); // validate
                        fetchTasksRef.current();
                    } catch { /* ignore malformed */ }
                });

                mqttClient.on('error',   () => { /* silent — REST fallback active */ });
                mqttClient.on('close',   () => {});
            })
            .catch(() => { /* mqtt package not available — REST-only mode */ });

        return () => {
            destroyed = true;
            if (mqttClient) {
                try { mqttClient.end(true); } catch { /* ignore */ }
            }
        };
    }, []); // run once — stable ref handles callback updates

    // ── Filters / search ──────────────────────────────────────────────────────

    const handleFilterChange = (filterName, value) => {
        setFilters((prev) => ({ ...prev, [filterName]: value }));
        setPagination((prev) => ({ ...prev, page: 0 }));
    };

    const handleClearFilters = () => {
        setFilters({ status: "", priority: "", isApproved: "" });
        setPagination((prev) => ({ ...prev, page: 0 }));
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        setPagination((prev) => ({ ...prev, page: 0 }));
    };

    const handleFilterClick = () => { fetchTasks(); };

    // ── Pagination ────────────────────────────────────────────────────────────

    const handlePageSizeChange = (newPageSize) => {
        setPagination((prev) => ({ ...prev, size: newPageSize, page: 0 }));
    };
    const handlePageClick      = (newPage) => { setPagination((prev) => ({ ...prev, page: newPage })); };
    const handleNextPage       = () => {
        if (pagination.page < pagination.totalPages - 1)
            setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    };
    const handlePreviousPage   = () => {
        if (pagination.page > 0)
            setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    };

    // ── Row interactions ──────────────────────────────────────────────────────

    const handleRowClick = (params) => {
        setSelectedTask(params.row);
        setViewOpen(true);
    };
    const handleEditModalOpen  = (task) => { setSelectedTask(task); setEditModalOpen(true); };
    const handleEditModalClose = () => { setEditModalOpen(false); setSelectedTask(null); };
    const handleViewDialogClose= () => { setViewOpen(false); setSelectedTask(null); };

    // ── CRUD operations ───────────────────────────────────────────────────────

    const handleDeleteTask = async (taskId) => {
        setLoading(true);
        setError(null);
        try {
            await TaskService.deleteTask(taskId);
            await fetchTasks();
            return { success: true };
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Failed to delete task";
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmApprove = async (taskId) => {
        setLoading(true);
        setError(null);
        try {
            await TaskService.approveTask(taskId);
            await fetchTasks();
            return { success: true };
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Failed to approve task";
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmCancel = async (taskId) => {
        setLoading(true);
        setError(null);
        try {
            await TaskService.cancelTask(taskId);
            await fetchTasks();
            return { success: true };
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Failed to cancel task";
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    return {
        tasks,
        loading,
        error,
        searchQuery,
        filters,
        pagination,
        viewOpen,
        editModalOpen,
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
        handleEditModalOpen,
        handleEditModalClose,
        handleViewDialogClose,
        handleDeleteTask,
        setSelectedTask,
        setEditModalOpen,
        employees,
        loadingEmployees,
        errorEmployees,
        fetchEmployees,
        handleConfirmApprove,
        handleConfirmCancel,
    };
};
