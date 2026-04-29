import  { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTeamData, useTeamDetails } from "@/hooks/useTeamData.js";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import employeeService from "../../../services/employeeService.js";
import AppFormField from "../../../common/fromField.jsx";
import AppDropDownField from "../../../common/dropdownField.jsx";

const TeamCreateEdit = ({ onClose }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const { createTeam, updateTeam, addMembers } = useTeamData();
    const { team, loading: teamLoading } = useTeamDetails(id);

    const [formData, setFormData] = useState({
        teamName: "",
        leaderId: null,
        memberIds: [],
    });

    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Load employees
    useEffect(() => {
        const fetchEmployees = async () => {
            setLoadingEmployees(true);
            try {
                const response = await employeeService.fetchEmployee({
                    page: 0,
                    size: 1000,
                });
                if (response?.data?.content) {
                    setEmployees(response.data.content);
                }
            } finally {
                setLoadingEmployees(false);
            }
        };
        fetchEmployees();
    }, []);

    // Populate form in edit mode
    useEffect(() => {
        if (isEditMode && team && employees.length > 0) {
            setFormData({
                teamName: team.name || "",
                leaderId: team.leader?.userId || null,
                memberIds: team.members?.map((m) => m.userId) || [],
            });
        }
    }, [isEditMode, team, employees]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.teamName.trim()) {

            return;
        }

        if (!formData.leaderId) {
            return;
        }

        setSubmitting(true);
        try {
            if (isEditMode) {
                // Update team
                await updateTeam({
                    teamId: id,
                    name: formData.teamName,
                    leaderId: formData.leaderId,
                });

                // Update members if changed
                if (formData.memberIds.length > 0) {
                    await addMembers(id, formData.memberIds);
                }
            } else {
                // Create team
                await createTeam({
                    name: formData.teamName,
                    leaderId: formData.leaderId,
                });
            }

            if (onClose) {
                onClose();
            } else {
                navigate("/team");
            }
        } catch (error) {
            console.error("Error saving team:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLeaderChange = (event) => {
        const value = event.target.value;
        setFormData((prev) => ({
            ...prev,
            leaderId: value,
        }));
    };

    const handleMembersChange = (event) => {
        const value = event.target.value;
        setFormData((prev) => ({
            ...prev,
            memberIds: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    if (isEditMode && teamLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    const employeeOptions = employees.map(emp => ({
        value: emp.userId,
        label: `${emp.name} (${emp.employeeCode})`
    }));

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
                {!onClose && (
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/team")}
                        sx={{ textTransform: "none" }}
                    >
                        Back to Teams
                    </Button>
                )}
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {isEditMode ? "Edit Team" : "Create New Team"}
                </Typography>
            </Box>

            <Paper sx={{ p: 4, maxWidth: 800 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <AppFormField
                                fullWidth
                                title="Team Name"
                                value={formData.teamName}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        teamName: e.target.value,
                                    }))
                                }
                                required
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <AppDropDownField
                                title="Team Leader"
                                value={formData.leaderId}
                                onChange={handleLeaderChange}
                                options={employeeOptions}
                                required
                                searchable
                            />
                        </Grid>

                        {isEditMode && (
                            <Grid item xs={12}>
                                <AppDropDownField
                                    title="Team Members"
                                    multiple
                                    value={formData.memberIds}
                                    onChange={handleMembersChange}
                                    options={employeeOptions.filter(
                                        (opt) => opt.value !== formData.leaderId
                                    )}
                                    searchable
                                />
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => onClose ? onClose() : navigate("/team")}
                                    disabled={submitting}
                                    sx={{ textTransform: "none", minWidth: 100 }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={submitting}
                                    sx={{ textTransform: "none", minWidth: 100 }}
                                >
                                    {submitting ? (
                                        <CircularProgress size={24} />
                                    ) : isEditMode ? (
                                        "Update Team"
                                    ) : (
                                        "Create Team"
                                    )}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default TeamCreateEdit;
