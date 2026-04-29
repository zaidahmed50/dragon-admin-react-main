
import { useState, useEffect, useCallback } from "react";
import { useEmployeeData } from "@/hooks/useEmployeeData.js";
import { useCustomerList } from "@/hooks/customers/useCustomerList.js";
import TicketService from "../../services/ticketService";
import { useDashboardMqtt } from "@/hooks/useDashboardMqtt.js";

export const useTicketList = () => {
    const {
        employees,
        loading: loadingEmployees,
        error: errorEmployees,
        fetchEmployees,
    } = useEmployeeData();

    const {
        customers,
        loading: loadingCustomers,
        error: errorCustomers,
        fetchCustomers,
    } = useCustomerList([]);

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        status: "",
        priority: "",
    });
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
    });
    const [viewOpen, setViewOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const searchParams = {
                page: pagination.page,
                size: pagination.size,
                search: searchQuery,
            };

            // Add filters if they have values
            if (filters.status) {
                searchParams.status = filters.status;
            }
            if (filters.priority) {
                searchParams.priority = filters.priority;
            }
            if (filters.includeDeleted) {
                searchParams.includeDeleted = filters.includeDeleted;
            }

            const response = await TicketService.searchTickets(searchParams);
            setTickets(response.content);
            setPagination((prev) => ({
                ...prev,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
            }));
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.size, searchQuery, filters]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    // ── Real-time updates via MQTT ─────────────────────────────────────────
    // Backend publishes to "tickets/events" on every status change
    // (CREATED, UPDATED, STARTED, RESOLVED). When Android changes a ticket
    // status we silently refresh the current page — no manual refresh needed.
    const handleTicketEvent = useCallback((event) => {
        const TICKET_EVENTS = ["CREATED", "UPDATED", "STARTED", "RESOLVED", "ASSIGNED"];
        if (event?.event && TICKET_EVENTS.includes(event.event)) {
            console.info(`[TicketList] MQTT event "${event.event}" for ${event.ticketNumber} — refreshing`);
            fetchTickets();
        }
    }, [fetchTickets]);

    const { connected: mqttConnected } = useDashboardMqtt(handleTicketEvent);

    const handleFilterChange = (filterName, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: value,
        }));
        setPagination((prev) => ({ ...prev, page: 0 })); // Reset to first page on filter change
    };

    const handleClearFilters = () => {
        setFilters({
            status: "",
            priority: "",
            includeDeleted: false,
        });
        setPagination((prev) => ({ ...prev, page: 0 }));
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        setPagination((prev) => ({ ...prev, page: 0 }));
    };

    const handleFilterClick = () => {
        fetchTickets();
    };

    const handlePageSizeChange = (newPageSize) => {
        setPagination((prev) => ({ ...prev, size: newPageSize, page: 0 })); // Reset to first page on size change
    };

    const handlePageClick = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handleNextPage = () => {
        if (pagination.page < pagination.totalPages - 1) {
            setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const handlePreviousPage = () => {
        if (pagination.page > 0) {
            setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
        }
    };

    const handleRowClick = (params) => {
        setSelectedTicket(params.row);
        setViewOpen(true);
    };

    const handleEditModalOpen = (ticket) => {
        setSelectedTicket(ticket);
        setEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setEditModalOpen(false);
        setSelectedTicket(null);
    };

    const handleViewDialogClose = () => {
        setViewOpen(false);
        setSelectedTicket(null);
    };

    const handleDeleteTicket = async (ticketId) => {
        setLoading(true);
        setError(null);
        try {
            await TicketService.deleteTicket(ticketId);
            // Refresh the ticket list after successful deletion
            await fetchTickets();
            return { success: true };
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Failed to delete ticket");
            return { success: false, error: err?.response?.data?.message || err.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        tickets,
        loading,
        error,
        searchQuery,
        filters,
        pagination,
        viewOpen,
        editModalOpen,
        selectedTicket,
        mqttConnected,
        fetchTickets,
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
        handleDeleteTicket,
        setSelectedTicket,
        setEditModalOpen,
        employees,
        customers,
        loadingEmployees,
        errorEmployees,
        loadingCustomers,
        errorCustomers,
        fetchEmployees,
        fetchCustomers,
    };
};
