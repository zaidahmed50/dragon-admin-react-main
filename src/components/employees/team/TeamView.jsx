import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTeamDetails, useTeamData } from "@/hooks/useTeamData.js";
import { employeeService } from "@/services/employeeService.js";
import { toast } from "react-hot-toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import topTost from "../../../utils/topTost.jsx";
import AppDropDownField from "../../../common/dropdownField.jsx";

const TeamView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { team, loading, refetch } = useTeamDetails(id);
    const { addMembers, removeMembers } = useTeamData();

    const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
    const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleOpenAddMemberDialog = async () => {
        setLoadingEmployees(true);
        setAddMemberDialogOpen(true);
        try {
            const response = await employeeService.fetchEmployee({
                page: 0,
                size: 1000,
            });
            if (response?.data?.content) {
                // Filter out employees already in the team
                const currentMemberIds = team?.members?.map((m) => m.userId) || [];
                const available = response.data.content.filter(
                    (emp) => !currentMemberIds.includes(emp.userId) && emp.userId !== team?.leader?.userId
                );
                setAvailableEmployees(available);
            }
        } catch (error) {
            topTost("Failed to load employees", "error");
        } finally {
            setLoadingEmployees(false);
        }
    };

    const handleOpenRemoveMemberDialog = () => {
        setRemoveMemberDialogOpen(true);
        setSelectedEmployees([]);
    };

    const handleAddMembers = async () => {
        if (selectedEmployees.length === 0) {
            topTost("Please select at least one employee", "error");
            return;
        }

        setProcessing(true);
        try {
            await addMembers(id, selectedEmployees);
            setAddMemberDialogOpen(false);
            setSelectedEmployees([]);
            await refetch();
        } catch (error) {
            console.error("Error adding members:", error);
        } finally {
            setProcessing(false);
        }
    };

    const handleRemoveMembers = async () => {
        if (selectedEmployees.length === 0) {
            topTost("Please select at least one member to remove", "error");
            return;
        }

        setProcessing(true);
        try {
            await removeMembers(id, selectedEmployees);
            setRemoveMemberDialogOpen(false);
            setSelectedEmployees([]);
            await refetch();
        } catch (error) {
            console.error("Error removing members:", error);
        } finally {
            setProcessing(false);
        }
    };

    const toggleEmployeeSelection = (userId) => {
        setSelectedEmployees((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!team) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography>Team not found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/team")}
                        sx={{ textTransform: "none" }}
                    >
                        Back to Teams
                    </Button>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <GroupIcon sx={{ fontSize: "2rem", color: "primary.main" }} />
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {team.name}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        startIcon={<PersonAddIcon />}
                        variant="outlined"
                        onClick={handleOpenAddMemberDialog}
                        sx={{ textTransform: "none" }}
                    >
                        Add Members
                    </Button>
                    <Button
                        startIcon={<PersonRemoveIcon />}
                        variant="outlined"
                        color="error"
                        onClick={handleOpenRemoveMemberDialog}
                        sx={{ textTransform: "none" }}
                        disabled={!team.members || team.members.length === 0}
                    >
                        Remove Members
                    </Button>
                    <IconButton
                        color="primary"
                        onClick={() => navigate(`/team/edit/${id}`)}
                        sx={{ ml: 1 }}
                    >
                        <EditIcon />
                    </IconButton>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Team Leader */}
                <Grid item xs={12} md={6}>
                    <Card elevation={2}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                <PersonIcon /> Team Leader
                            </Typography>
                            {team.leader ? (
                                <Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                        <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
                                            {team.leader.name?.charAt(0)?.toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6">{team.leader.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {team.leader.employeeCode}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                        {team.leader.email && (
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <EmailIcon fontSize="small" color="action" />
                                                <Typography variant="body2">{team.leader.email}</Typography>
                                            </Box>
                                        )}
                                        {team.leader.phone1 && (
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <PhoneIcon fontSize="small" color="action" />
                                                <Typography variant="body2">{team.leader.phone1}</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            ) : (
                                <Typography color="text.secondary">No leader assigned</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Team Stats */}
                <Grid item xs={12} md={6}>
                    <Card elevation={2}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Team Statistics</Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Members
                                    </Typography>
                                    <Typography variant="h4" color="primary.main">
                                        {team.members?.length || 0}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Last Updated
                                    </Typography>
                                    <Typography variant="body1">
                                        {team.updatedAt ? new Date(team.updatedAt).toLocaleDateString() : "N/A"}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Team Members */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Team Members ({team.members?.length || 0})
                        </Typography>
                        {team.members && team.members.length > 0 ? (
                            <Grid container spacing={2}>
                                {team.members.map((member) => (
                                    <Grid item xs={12} sm={6} md={4} key={member.userId}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                                                    <Avatar sx={{ bgcolor: "secondary.main" }}>
                                                        {member.name?.charAt(0)?.toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1">{member.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {member.employeeCode}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                {member.email && (
                                                    <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                                                        {member.email}
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography color="text.secondary">No members in this team yet</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Add Members Dialog */}
            <Dialog
                open={addMemberDialogOpen}
                onClose={() => setAddMemberDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ pb: 1 }}>Add Team Members</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {loadingEmployees ? (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box sx={{ mt: 1 }}>
                            <AppDropDownField
                                label="Select Employees"
                                multiple={true}
                                value={selectedEmployees}
                                onChange={(e) => setSelectedEmployees(e.target.value)}
                                options={availableEmployees.map(emp => ({
                                    label: `${emp.name} (${emp.employeeCode})`,
                                    value: emp.userId
                                }))}
                                searchable={true}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddMemberDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleAddMembers}
                        variant="contained"
                        disabled={selectedEmployees.length === 0 || processing}
                    >
                        {processing ? <CircularProgress size={24} /> : "Add Members"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Remove Members Dialog */}
            <Dialog
                open={removeMemberDialogOpen}
                onClose={() => setRemoveMemberDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ pb: 1 }}>Remove Team Members</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {team.members && team.members.length > 0 ? (
                        <Box sx={{ mt: 1 }}>
                            <AppDropDownField
                                label="Select Members to Remove"
                                multiple={true}
                                value={selectedEmployees}
                                onChange={(e) => setSelectedEmployees(e.target.value)}
                                options={team.members.map(member => ({
                                    label: `${member.name} (${member.employeeCode})`,
                                    value: member.userId
                                }))}
                                searchable={true}
                            />
                        </Box>
                    ) : (
                        <Typography>No members to remove</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRemoveMemberDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleRemoveMembers}
                        variant="contained"
                        color="error"
                        disabled={selectedEmployees.length === 0 || processing}
                    >
                        {processing ? <CircularProgress size={24} /> : "Remove Members"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TeamView;
