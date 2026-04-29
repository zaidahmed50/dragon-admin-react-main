
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TicketService from "../../services/ticketService";
import FaultReasonService from "../../services/faultReasonService";
import OfficeLocationService from "../../services/officeLocationService";

export const useEditTicket = (props = {}) => {
    const { ticket, onClose } = props;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        description: "",
        priority: "MEDIUM",
        status: "OPEN",
        faultReasonId: null,
        resolutionNotes: "",
        ticketType: null,
        // Customer (COR / ODU)
        customerId: null,
        customer: null,
        // Office Location (NOC)
        officeLocationId: null,
        // Assignment
        employeeId: null,
        teamId: null,
        assignedTo: null,
        team: null,
        assignmentType: 'EMPLOYEE',
    });

    const [errors, setErrors] = useState({});
    const [faultReasons, setFaultReasons] = useState([]);
    const [officeLocations, setOfficeLocations] = useState([]);

    // Load fault reasons once
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await FaultReasonService.getAllFaultReasons();
                if (res.success) setFaultReasons(res.data);
            } catch (err) {
                console.error("Failed to fetch fault reasons", err);
            }
        };
        fetch();
    }, []);

    // Load office locations once
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await OfficeLocationService.getOffices();
                if (res.success) setOfficeLocations(res.data ?? []);
            } catch (err) {
                console.error("Failed to fetch office locations", err);
            }
        };
        fetch();
    }, []);

    // Populate form when editing an existing ticket
    useEffect(() => {
        if (ticket) {
            const isEmployee = ticket.assignment?.type === 'EMPLOYEE';
            const isTeam = ticket.assignment?.type === 'TEAM';
            setFormData({
                description: ticket.description || "",
                priority: ticket.priority || "MEDIUM",
                status: ticket.status || "OPEN",
                faultReasonId: ticket.faultReasons?.id || null,
                resolutionNotes: ticket.resolutionNotes || "",
                ticketType: ticket.ticketType || null,
                customerId: ticket.customer?.id || null,
                customer: ticket.customer || null,
                officeLocationId: ticket.officeLocationId || null,
                assignmentType: ticket.assignment?.type || 'EMPLOYEE',
                employeeId: isEmployee ? ticket.assignment.id : null,
                teamId: isTeam ? ticket.assignment.id : null,
                assignedTo: isEmployee ? ticket.assignment : null,
                team: isTeam ? ticket.assignment : null,
            });
        } else {
            setFormData({
                description: "",
                priority: "MEDIUM",
                status: "OPEN",
                faultReasonId: null,
                resolutionNotes: "",
                ticketType: null,
                customerId: null,
                customer: null,
                officeLocationId: null,
                employeeId: null,
                teamId: null,
                assignedTo: null,
                team: null,
                assignmentType: 'EMPLOYEE',
            });
        }
        setError(null);
        setSuccess(false);
        setLoading(false);
    }, [ticket]);

    const handleChange = (field) => (e) => {
        const value = e?.target?.value ?? e;
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const isNoc = formData.ticketType === 'NOC';

    const validateForm = () => {
        const newErrors = {};
        if (!formData.ticketType) newErrors.ticketType = "Ticket type is required";
        if (!formData.description?.trim()) newErrors.description = "Description is required";
        if (!formData.faultReasonId) newErrors.faultReasonId = "Fault Reason is required";

        // Customer is always required regardless of type
        if (!formData.customerId) {
            newErrors.customer   = "Customer is required";
            newErrors.customerId = "Customer is required";
        }
        // Office location is additionally required for NOC
        if (isNoc && !formData.officeLocationId) {
            newErrors.officeLocationId = "Office location is required for NOC tickets";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const payload = {
                description: formData.description,
                status: formData.status,
                priority: formData.priority,
                ticketType: formData.ticketType,
                faultReasonId: formData.faultReasonId,
                assignmentType: formData.assignmentType,
                assignedTo: formData.assignmentType === 'EMPLOYEE' ? formData.employeeId : null,
                teamId: formData.assignmentType === 'TEAM' ? formData.teamId : null,
                // Customer always sent; office location only for NOC
                customerId: formData.customerId,
                officeLocationId: isNoc ? formData.officeLocationId : null,
            };
            const response = await TicketService.createTicket(payload);
            if (response?.success !== false) {
                setSuccess(true);
                setTimeout(() => navigate("/support/tickets"), 1500);
            } else {
                setError(response?.message || "Failed to create ticket");
            }
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Failed to create ticket");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTicket = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const payload = {
            description: formData.description,
            priority: formData.priority,
            status: formData.status,
            faultReasonId: formData.faultReasonId,
            ticketType: formData.ticketType,
            // Customer always sent; office location only for NOC
            customerId: formData.customerId,
            officeLocationId: isNoc ? formData.officeLocationId : null,
            employeeId: formData.assignmentType === 'EMPLOYEE' ? formData.employeeId : null,
            teamId: formData.assignmentType === 'TEAM' ? formData.teamId : null,
            resolutionNotes: formData.resolutionNotes,
        };

        try {
            const response = await TicketService.updateTicket(ticket.id, payload);
            if (response?.success !== false) {
                setSuccess(true);
                setTimeout(() => navigate("/support/tickets"), 1500);
            } else {
                setError(response?.message || "An error occurred.");
            }
        } catch (err) {
            setError(err.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (onClose) onClose();
    };

    return {
        loading,
        error,
        success,
        errors,
        faultReasons,
        officeLocations,
        isNoc,
        setError,
        handleClose,
        ticketForm: formData,
        setTicketForm: setFormData,
        formData,
        handleChange,
        updateField: handleChange,
        handleSubmit,
        handleUpdateTicket,
    };
};
