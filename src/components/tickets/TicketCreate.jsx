import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    Typography,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppFormField from "../../common/fromField.jsx";
import AppDropDownField from "../../common/dropdownField.jsx";
import { ApiUrls, CustomerService, EmployeeService, TeamService, TicketService } from "../../services/index.js";
import useEnumOptions from "../../hooks/useEnumOptions.js";
import SearchableDropdown from "../../common/SearchDropDown.jsx";
import AppButton from "../../common/AppButton.jsx";
import { useEditTicket } from "./useEditTicket.js";

const SummaryItem = ({ label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{label}:</Typography>
        <Typography variant="body1">{value || "Not specified"}</Typography>
    </Box>
);

const TicketAssignmentType = { EMPLOYEE: 'EMPLOYEE', TEAM: 'TEAM' };

const CreateTicketPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const isEditMode = id !== undefined;
    const navigate = useNavigate();
    const [initialTicket, setInitialTicket] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            const passedTicketData = location.state?.ticketData;
            if (passedTicketData) {
                setInitialTicket(passedTicketData);
            } else {
                const fetchTicket = async () => {
                    const response = await TicketService.searchTickets({ id, page: 0, size: 1 });
                    if (response.success && response.data.content.length > 0) {
                        setInitialTicket(response.data.content[0]);
                    }
                };
                fetchTicket();
            }
        }
    }, [id, isEditMode, location.state]);

    const {
        loading,
        error,
        success,
        ticketForm,
        setTicketForm,
        errors,
        handleChange,
        handleSubmit,
        handleUpdateTicket,
        setError,
        faultReasons,
        officeLocations,
        isNoc,
    } = useEditTicket({ ticket: initialTicket });

    // ── Dynamic enum options from backend ─────────────────────────────────────
    const { options: priorityOptions } = useEnumOptions(TicketService.getPriorities, [
        { id: "HIGH", title: "High" }, { id: "MEDIUM", title: "Medium" }, { id: "LOW", title: "Low" },
    ]);
    const { options: statusOptions } = useEnumOptions(TicketService.getStatuses, [
        { id: "OPEN", title: "Open" }, { id: "ASSIGNED", title: "Assigned" },
        { id: "IN_PROGRESS", title: "In Progress" }, { id: "RESOLVED", title: "Resolved" },
    ]);
    const { options: typeOptions } = useEnumOptions(TicketService.getTypes, [
        { id: "COR", title: "COR – Corporate" },
        { id: "NOC", title: "NOC – Noc Office" },
        { id: "ODU", title: "ODU – Domestic" },
    ]);

    const onFormSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) handleUpdateTicket();
        else handleSubmit(e);
    };

    const fetchCustomerOptions = useCallback(async (search) => {
        const res = await CustomerService.getCustomers({ search, size: 20, page: 0, isIndividual: null });
        return res?.data?.content || [];
    }, []);

    const fetchEmployeeOptions = useCallback(async (search) => {
        const res = await EmployeeService.fetchEmployee({ search, size: 10, page: 0 });
        return res?.data?.content || [];
    }, []);

    const fetchTeamOptions = useCallback(async (search) => {
        const res = await TeamService.getAllTeams({ search, size: 10, page: 0 });
        return res?.data?.content || [];
    }, []);

    const selectedOfficeName = officeLocations.find(o => o.id === ticketForm.officeLocationId)?.name;

    return (
        <Box component="form" onSubmit={onFormSubmit} sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <IconButton onClick={() => navigate("/support/tickets")}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                    {isEditMode ? "Edit Support Ticket" : "Create New Support Ticket"}
                </Typography>
                <AppButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    loading={loading}
                    label={isEditMode ? "Update" : "Generate"}
                />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{`Ticket ${isEditMode ? 'updated' : 'created'} successfully! Redirecting...`}</Alert>}

            <Box sx={{ display: "flex", justifyContent: "center", p: 5, alignItems: 'stretch' }}>
                {/* ── Left: form ── */}
                <Box sx={{ flex: 1, mr: 2 }}>
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Ticket Information</Typography>
                            <Grid container spacing={2}>

                                <AppDropDownField
                                    label="Ticket Type"
                                    value={ticketForm.ticketType}
                                    options={typeOptions.map(o => ({ label: o.title, value: o.id }))}
                                    onChange={(e) => {
                                        const newType = e?.target?.value ?? e;
                                        setTicketForm(prev => ({
                                            ...prev,
                                            ticketType: newType,
                                            customerId: null, customer: null,
                                            officeLocationId: null,
                                        }));
                                    }}
                                    error={errors.ticketType}
                                    required
                                />

                                <AppDropDownField
                                    label="Status"
                                    value={ticketForm.status}
                                    options={statusOptions.map(o => ({ label: o.title, value: o.id }))}
                                    onChange={handleChange("status")}
                                    error={errors.status}
                                    required
                                />
                                <AppDropDownField
                                    label="Priority"
                                    value={ticketForm.priority}
                                    options={priorityOptions.map(o => ({ label: o.title, value: o.id }))}
                                    onChange={handleChange("priority")}
                                    error={errors.priority}
                                    required
                                />
                                <AppDropDownField
                                    label="Fault Reason"
                                    value={ticketForm.faultReasonId}
                                    options={faultReasons.map(r => ({ label: r.name || r.reason, value: r.id }))}
                                    onChange={handleChange("faultReasonId")}
                                    error={errors.faultReasonId}
                                    required
                                />

                                {/* Customer — shown for all ticket types once a type is selected */}
                                {ticketForm.ticketType && (
                                    <SearchableDropdown
                                        label="Customer"
                                        value={ticketForm.customer}
                                        error={errors.customer}
                                        onChange={(user) => setTicketForm(prev => ({
                                            ...prev, customer: user, customerId: user?.userId,
                                        }))}
                                        fetchOptions={fetchCustomerOptions}
                                        optionLabel={(o) => o?.name || ''}
                                        renderOptionContent={(o) => (
                                            <>
                                                <Avatar src={`${ApiUrls.imageUrl}${o?.profilePicture}`} sx={{ width: 32, height: 32 }} />
                                                <Box>
                                                    <Typography variant="body2" fontWeight="bold">{o?.name}</Typography>
                                                    <Typography variant="caption" color="warning.main">
                                                        {o?.referenceNumber ? `Code: ${o.referenceNumber}` : ""}
                                                        {o?.referenceNumber && o?.phone1 ? "  ·  " : ""}
                                                        {o?.phone1 || ""}
                                                    </Typography>
                                                    {o?.email && (
                                                        <Typography variant="caption" color="textSecondary" display="block">
                                                            {o.email}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </>
                                        )}
                                    />
                                )}

                                {/* Office Location — additionally shown for NOC */}
                                {isNoc && (
                                    <AppDropDownField
                                        label="Office Location"
                                        value={ticketForm.officeLocationId}
                                        options={officeLocations.map(o => ({ label: o.officeName, value: o.id }))}
                                        onChange={handleChange("officeLocationId")}
                                        error={errors.officeLocationId}
                                        required
                                    />
                                )}

                                {/* Assignment */}
                                <Grid item xs={12}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Assign To</FormLabel>
                                        <RadioGroup row value={ticketForm.assignmentType} onChange={(e) => {
                                            const newType = e.target.value;
                                            setTicketForm(prev => ({
                                                ...prev,
                                                assignedTo: null, employeeId: null,
                                                team: null, teamId: null,
                                                assignmentType: newType,
                                            }));
                                        }}>
                                            <FormControlLabel value={TicketAssignmentType.EMPLOYEE} control={<Radio />} label="Employee" />
                                            <FormControlLabel value={TicketAssignmentType.TEAM} control={<Radio />} label="Team" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                {ticketForm.assignmentType === TicketAssignmentType.EMPLOYEE ? (
                                    <SearchableDropdown
                                        label="Assign To Employee"
                                        value={ticketForm.assignedTo}
                                        onChange={(user) => setTicketForm(prev => ({
                                            ...prev, assignedTo: user, employeeId: user?.id,
                                            team: null, teamId: null, assignmentType: TicketAssignmentType.EMPLOYEE,
                                        }))}
                                        fetchOptions={fetchEmployeeOptions}
                                        optionLabel={(o) => o?.name || ''}
                                        renderOptionContent={(o) => (
                                            <>
                                                <Avatar src={`${ApiUrls.imageUrl}${o?.profilePic}`} sx={{ width: 32, height: 32 }} />
                                                <Box>
                                                    <Typography variant="body2">{o?.name}</Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {o?.employeeCode ? `${o.employeeCode} - ` : ""}{o?.email || ""}
                                                    </Typography>
                                                </Box>
                                            </>
                                        )}
                                    />
                                ) : (
                                    <SearchableDropdown
                                        label="Assign To Team"
                                        value={ticketForm.team}
                                        onChange={(team) => setTicketForm(prev => ({
                                            ...prev, team, teamId: team?.id,
                                            assignedTo: null, employeeId: null,
                                            assignmentType: TicketAssignmentType.TEAM,
                                        }))}
                                        fetchOptions={fetchTeamOptions}
                                        optionLabel={(o) => o?.name || ''}
                                        renderOptionContent={(o) => (
                                            <Box>
                                                <Typography variant="body2">{o?.name}</Typography>
                                                <Typography variant="caption" color="textSecondary">{o?.members?.length || 0} members</Typography>
                                            </Box>
                                        )}
                                    />
                                )}

                                {errors.assignee && (
                                    <Grid item xs={12}>
                                        <Typography color="error" variant="caption">{errors.assignee}</Typography>
                                    </Grid>
                                )}

                                <AppFormField
                                    title="Additional Remarks"
                                    value={ticketForm.description}
                                    onChange={handleChange("description")}
                                    error={errors.description}
                                    multiline
                                    rows={4}
                                    required
                                />
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>

                {/* ── Right: summary ── */}
                <Box sx={{ flex: 1, mr: 2 }}>
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Ticket Summary</Typography>
                            <SummaryItem label="Type"        value={typeOptions.find(o => o.id === ticketForm.ticketType)?.title} />
                            <SummaryItem label="Status"      value={ticketForm.status} />
                            <SummaryItem label="Priority"    value={ticketForm.priority} />
                            <SummaryItem label="Fault Reason" value={faultReasons.find(r => r.id === ticketForm.faultReasonId)?.name} />
                            <SummaryItem label="Customer" value={ticketForm.customer?.name} />
                            {isNoc && <SummaryItem label="Office Location" value={selectedOfficeName} />}
                            <SummaryItem label="Assigned To" value={ticketForm.assignedTo?.name || ticketForm.team?.name} />
                            <Box mt={2}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Additional Remarks:</Typography>
                                <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {ticketForm.description || "Not specified"}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default CreateTicketPage;
