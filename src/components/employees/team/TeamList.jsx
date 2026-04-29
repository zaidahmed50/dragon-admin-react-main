import {useState, useEffect} from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Avatar,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Autocomplete,
    Tooltip, ListItemButton, ListItemIcon, alpha,
} from "@mui/material";
import {useTeamData} from "@/hooks/useTeamData.js";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import employeeService from "../../../services/employeeService.js";
import AppButton from "../../../common/AppButton.jsx";
import TeamCreateEdit from "./TeamCreateEdit.jsx";
import AppDropDownField from "../../../common/dropdownField.jsx";
import topTost from "../../../utils/topTost.jsx";

const TeamList = () => {
    const {
        teams,
        fetchTeams,
        createTeam,
        updateTeam,
        addMembers,
        removeMembers,
        deleteTeam,
    } = useTeamData();

    const [selectedTeam, setSelectedTeam] = useState(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
    const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Form states
    const [teamName, setTeamName] = useState("");
    const [selectedLeader, setSelectedLeader] = useState(null);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Member management states
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [employeesToAdd, setEmployeesToAdd] = useState([]);
    const [employeesToRemove, setEmployeesToRemove] = useState([]);

    // Load employees
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
        } catch (error) {

        } finally {
            setLoadingEmployees(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Select first team by default
    useEffect(() => {
        if (teams.length > 0 && !selectedTeam) {
            setSelectedTeam(teams[0]);
        }
    }, [teams]);

    // Handle create team dialog
    const handleOpenCreateDialog = () => {
        setTeamName("");
        setSelectedLeader(null);
        setSelectedMembers([]);
        setCreateDialogOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setCreateDialogOpen(false);
        setTeamName("");
        setSelectedLeader(null);
        setSelectedMembers([]);
        fetchTeams();
    };

    const handleCreateTeam = async () => {
        if (!teamName.trim()) {

            return;
        }
        if (!selectedLeader) {

            return;
        }

        setSubmitting(true);
        try {
            const teamResponse = await createTeam({
                name: teamName,
                leaderId: selectedLeader.userId,
            });

            if (selectedMembers.length > 0 && teamResponse?.id) {
                await addMembers(
                    teamResponse.id,
                    selectedMembers.map((m) => m.userId)
                );
            }

            await fetchTeams();
            handleCloseCreateDialog();

        } catch (error) {

            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle edit team dialog
    const handleOpenEditDialog = () => {
        if (!selectedTeam) return;
        setTeamName(selectedTeam.name);
        const leader = employees.find((e) => e.userId === selectedTeam.leader?.userId);
        setSelectedLeader(leader || null);
        const members = selectedTeam.members
            ?.map((m) => employees.find((e) => e.userId === m.userId))
            .filter(Boolean) || [];
        setSelectedMembers(members);
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setTeamName("");
        setSelectedLeader(null);
        setSelectedMembers([]);
    };

    const handleUpdateTeam = async () => {
        if (!teamName.trim()) {
            topTost("Team name is required", "error");
            return;
        }
        if (!selectedLeader) {

            return;
        }

        setSubmitting(true);
        try {
            await updateTeam({
                teamId: selectedTeam.id,
                name: teamName,
                leaderId: selectedLeader.userId,
            });

            await fetchTeams();
            handleCloseEditDialog();

        } catch (error) {

            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle add members dialog
    const handleOpenAddMemberDialog = () => {
        if (!selectedTeam) return;
        const currentMemberIds = selectedTeam.members?.map((m) => m.userId) || [];
        const available = employees.filter(
            (emp) =>
                !currentMemberIds.includes(emp.userId) &&
                emp.userId !== selectedTeam.leader?.userId
        );
        setAvailableEmployees(available);
        setEmployeesToAdd([]);
        setAddMemberDialogOpen(true);
    };

    const handleAddMembersToTeam = async () => {
        if (employeesToAdd.length === 0) {
            topTost("Please select at least one employee", "error");
            return;
        }

        setSubmitting(true);
        try {
            await addMembers(selectedTeam.id, employeesToAdd);
            await fetchTeams();
            setAddMemberDialogOpen(false);
            setEmployeesToAdd([]);

        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle remove members dialog
    const handleOpenRemoveMemberDialog = () => {
        if (!selectedTeam) return;
        setEmployeesToRemove([]);
        setRemoveMemberDialogOpen(true);
    };

    const handleRemoveMembersFromTeam = async () => {
        if (employeesToRemove.length === 0) {
            return;
        }

        setSubmitting(true);
        try {
            await removeMembers(selectedTeam.id, employeesToRemove);
            await fetchTeams();
            setRemoveMemberDialogOpen(false);
            setEmployeesToRemove([]);

        } catch (error) {

            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle delete team
    const handleOpenDeleteDialog = () => {
        if (!selectedTeam) return;
        setDeleteDialogOpen(true);
    };

    const handleDeleteTeam = async () => {
        if (!selectedTeam) return;

        setSubmitting(true);
        try {
            await deleteTeam(selectedTeam.id);
            await fetchTeams();
            setDeleteDialogOpen(false);
            setSelectedTeam(null);

        } catch (error) {

            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleEmployeeSelection = (userId, list, setList) => {
        setList((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#121A2D', minHeight: '100vh' }}>
            {/* Top Header - Aligned with your UI Screenshot */}
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a2027' }}>
                    Team Management
                </Typography>

            </Box>

            <Box sx={{ display: 'flex', gap: 3, height: "calc(100vh - 200px)" }}>
                {/* Left Sidebar: Team List */}
                <Box sx={{ width: '320px', display: 'flex', flexDirection: 'column' }}>
                    <Paper elevation={0} sx={{ p: 2, flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 1, // Reduced margin for a tighter look
                            px: 1
                        }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05rem'
                                }}
                            >
                                Teams ({teams.length})
                            </Typography>

                            <AppButton
                                label="Create Team"
                                size="small"
                                onClick={handleOpenCreateDialog}
                            />
                        </Box>


                        <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
                            {teams.length === 0 ? (
                                <Typography color="text.secondary" align="center" sx={{ mt: 1 }}>No teams found</Typography>
                            ) : (
                                teams.map((team) => {
                                    const isSelected = selectedTeam?.id === team.id;
                                    return (
                                        <ListItemButton
                                            key={team.id}
                                            selected={isSelected}
                                            onClick={() => setSelectedTeam(team)}
                                            sx={{
                                                mb: 0.5,
                                                borderRadius: 1.5,
                                                border: '1px solid',
                                                borderColor: isSelected ? (theme) => alpha(theme.palette.primary.main, 0.3) : 'transparent',
                                                '&.Mui-selected': {
                                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                                    color: 'primary.dark',
                                                    '&:hover': {
                                                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                                                    }
                                                }
                                            }}
                                        >
                                            <ListItemText
                                                primary={team.name}
                                                secondary={`${team.members?.length || 0} Members`}
                                                primaryTypographyProps={{ fontWeight: isSelected ? 700 : 500, variant: 'body2' }}
                                                secondaryTypographyProps={{ variant: 'caption' }}
                                            />
                                            <GroupIcon sx={{ fontSize: '1.2rem', opacity: 0.5 }} />
                                        </ListItemButton>
                                    );
                                })
                            )}
                        </List>
                    </Paper>
                </Box>

                {/* Right Side: Detail View (The "Order Table" style) */}
                <Box sx={{ flex: 1 }}>
                    {selectedTeam ? (
                        <Paper elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            {/* Detail Header */}
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#1E293B' }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedTeam.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Last Update: {selectedTeam.updatedAt ? new Date(selectedTeam.updatedAt).toLocaleDateString() : "N/A"}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Tooltip title="Edit"><IconButton size="small" onClick={handleOpenEditDialog}><EditIcon fontSize="small" /></IconButton></Tooltip>
                                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={handleOpenDeleteDialog}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                                </Box>
                            </Box>

                            <Box sx={{ p: 2, overflow: 'auto', flex: 1, bgcolor: '#1E293B' }}>
                                {/* Leader Section - Extremely Compact */}
                                <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary' }}>Team Leader</Typography>
                                {selectedTeam?.leader?.user ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, mb: 2, borderRadius: 1, bgcolor: 'action.hover' }}>
                                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>{selectedTeam.leader.user.name?.charAt(0)}</Avatar>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedTeam.leader.user.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{selectedTeam.leader.user.email}</Typography>
                                        </Box>
                                    </Box>
                                ) : <Typography variant="body2" sx={{ mb: 2 }}>Unassigned</Typography>}

                                {/* Members Section - List/Table Hybrid Style */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary' }}>Members</Typography>
                                    <Box>
                                        <Button size="small" variant="text" startIcon={<PersonAddIcon />} onClick={handleOpenAddMemberDialog}>Add</Button>
                                        <Button size="small" variant="text" color="error" startIcon={<PersonRemoveIcon />} onClick={handleOpenRemoveMemberDialog} disabled={!selectedTeam.members?.length}>Remove</Button>
                                    </Box>
                                </Box>

                                <List dense disablePadding>
                                    {selectedTeam.members?.map((member) => (
                                        <ListItem
                                            key={member.userId}
                                            divider
                                            sx={{
                                                py: 0.5,
                                                px: 1,
                                                '&:hover': { bgcolor: 'action.hover' }
                                            }}
                                        >
                                            <ListItemAvatar sx={{ minWidth: 40 }}>
                                                <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'secondary.main' }}>
                                                    {member.user.name?.charAt(0)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>{member.name}</Typography>}
                                                secondary={member.user.name}
                                                sx={{ m: 0 }}
                                            />
                                            <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'none', md: 'block' } }}>
                                                {member.employeeCode}
                                            </Typography>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Paper>
                    ) : (
                        <Paper variant="outlined" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', bgcolor: 'action.hover' }}>
                            <Typography color="text.secondary">Select a team from the left to view details</Typography>
                        </Paper>
                    )}
                </Box>
            </Box>

            {/* Create Team Dialog */}

            <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
                <TeamCreateEdit onClose={handleCloseCreateDialog} />
            </Dialog>



            {/* Edit Team Dialog */}

            <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>

                <DialogTitle>Edit Team</DialogTitle>

                <DialogContent>

                    <Box sx={{display: "flex", flexDirection: "column", gap: 2, mt: 2}}>

                        <TextField

                            fullWidth

                            label="Team Name"

                            value={teamName}

                            onChange={(e) => setTeamName(e.target.value)}

                            required

                        />

                        <Autocomplete

                            value={selectedLeader}

                            onChange={(_, value) => setSelectedLeader(value)}

                            options={employees}

                            getOptionLabel={(option) => `${option.name} (${option.employeeCode})`}

                            loading={loadingEmployees}

                            renderInput={(params) => (

                                <TextField

                                    {...params}

                                    label="Team Leader"

                                    required

                                />

                            )}

                        />

                    </Box>

                </DialogContent>

                <DialogActions>

                    <Button onClick={handleCloseEditDialog} disabled={submitting}>

                        Cancel

                    </Button>

                    <Button

                        onClick={handleUpdateTeam}

                        variant="contained"

                        disabled={submitting}

                    >

                        {submitting ? <CircularProgress size={24}/> : "Update"}

                    </Button>

                </DialogActions>

            </Dialog>



            {/* Add Members Dialog */}

            <Dialog open={addMemberDialogOpen} onClose={() => setAddMemberDialogOpen(false)} maxWidth="xs" fullWidth>

                <DialogTitle sx={{ pb: 1 }}>Add Team Members</DialogTitle>

                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ mt: 1 }}>
                        <AppDropDownField
                            label="Select Employees"
                            multiple={true}
                            value={employeesToAdd}
                            onChange={(e) => setEmployeesToAdd(e.target.value)}
                            options={availableEmployees.map(emp => ({
                                label: `${emp.name} (${emp.employeeCode})`,
                                value: emp.userId
                            }))}
                            searchable={true}
                        />
                    </Box>
                </DialogContent>

                <DialogActions>

                    <Button onClick={() => setAddMemberDialogOpen(false)}>Cancel</Button>

                    <Button

                        onClick={handleAddMembersToTeam}

                        variant="contained"

                        disabled={employeesToAdd.length === 0 || submitting}

                    >

                        {submitting ? <CircularProgress size={24}/> : "Add"}

                    </Button>

                </DialogActions>

            </Dialog>



            {/* Remove Members Dialog */}

            <Dialog open={removeMemberDialogOpen} onClose={() => setRemoveMemberDialogOpen(false)} maxWidth="xs"

                    fullWidth>

                <DialogTitle sx={{ pb: 1 }}>Remove Team Members</DialogTitle>

                <DialogContent sx={{ pt: 2 }}>

                    {selectedTeam?.members && selectedTeam.members.length > 0 ? (

                        <Box sx={{ mt: 1 }}>
                            <AppDropDownField
                                label="Select Members to Remove"
                                multiple={true}
                                value={employeesToRemove}
                                onChange={(e) => setEmployeesToRemove(e.target.value)}
                                options={selectedTeam.members.map(member => ({
                                    label: `${member.user.name} (${member.employeeCode})`,
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

                        onClick={handleRemoveMembersFromTeam}

                        variant="contained"

                        color="error"

                        disabled={employeesToRemove.length === 0 || submitting}

                    >

                        {submitting ? <CircularProgress size={24}/> : "Remove"}

                    </Button>

                </DialogActions>

            </Dialog>



            {/* Delete Team Dialog */}

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>

                <DialogTitle>Delete Team</DialogTitle>

                <DialogContent>

                    <Typography>

                        Are you sure you want to delete "{selectedTeam?.name}"? This action cannot be undone.

                    </Typography>

                </DialogContent>

                <DialogActions>

                    <Button onClick={() => setDeleteDialogOpen(false)} disabled={submitting}>
                        Cancel
                    </Button>

                    <Button
                        onClick={handleDeleteTeam}
                        variant="contained"
                        color="error"
                        disabled={submitting}

                    >{submitting ? <CircularProgress size={24}/> : "Delete"}

                    </Button>

                </DialogActions>

            </Dialog>
        </Box>
    );
};

export default TeamList;
