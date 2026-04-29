import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    Grid,
    IconButton,
    Typography,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppFormField from "../../common/fromField.jsx";
import AppDropDownField from "../../common/dropdownField.jsx";
import { ApiUrls, EmployeeService, TaskService } from "../../services/index.js";
import useEnumOptions from "../../hooks/useEnumOptions.js";
import SearchableDropdown from "../../common/SearchDropDown.jsx";
import AppButton from "../../common/AppButton.jsx";
import { useEditTask } from "./useEditTask.js";
import { formatDateTime } from "../../helper/helper.jsx";

const SummaryItem = ({ label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{label}:</Typography>
        <Typography variant="body1">{value || "Not specified"}</Typography>
    </Box>
);

const CreateTaskPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const isEditMode = id !== undefined;
    const navigate = useNavigate();
    const [initialTask, setInitialTask] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            const passedTaskData = location.state?.taskData;
            if (passedTaskData) {
                setInitialTask(passedTaskData);
            } else {
                const fetchTask = async () => {
                    const response = await TaskService.searchTasks({ id, page: 0, size: 1 });
                    if (response.success && response.data.content.length > 0) {
                        setInitialTask(response.data.content[0]);
                    }
                };
                fetchTask();
            }
        }
    }, [id, isEditMode, location.state]);

    const {
        loading,
        error,
        success,
        taskForm,
        setTaskForm,
        errors,
        handleChange,
        handleSubmit,
        handleUpdateTask,
        setError,
    } = useEditTask({ task: initialTask });

    // ── Dynamic enum options from backend ──────────────────────────────────────
    const { options: priorityOptions } = useEnumOptions(TaskService.getPriorities, [
        { id: "LOW", title: "Low" }, { id: "MEDIUM", title: "Medium" },
        { id: "HIGH", title: "High" }, { id: "CRITICAL", title: "Critical" },
    ]);
    const { options: statusOptions } = useEnumOptions(TaskService.getStatuses, [
        { id: "CREATED", title: "Created" }, { id: "ASSIGNED", title: "Assigned" },
        { id: "INPROGRESS", title: "In Progress" }, { id: "ONHOLD", title: "On Hold" },
        { id: "COMPLETED", title: "Completed" }, { id: "CANCELLED", title: "Cancelled" },
    ]);

    const onFormSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            handleUpdateTask();
        } else {
            handleSubmit(e);
        }
    };

    const fetchEmployeeOptions = useCallback(async (search) => {
        const res = await EmployeeService.fetchEmployee({ search, size: 10, page: 0 });
        return res?.data?.content || [];
    }, []);

    return (
        <Box component="form" onSubmit={onFormSubmit} sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <IconButton onClick={() => navigate("/support/tasks")}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                    {isEditMode ? "Edit Task" : "Create New Task"}
                </Typography>
                <AppButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    loading={loading}
                    label={isEditMode ? "Update" : "Create"}
                />
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{`Task ${isEditMode ? 'updated' : 'created'} successfully! Redirecting...`}</Alert>}

            <Box sx={{ display: "flex", justifyContent: "center", p: 5, alignItems: 'stretch' }}>
                <Box sx={{ flex: 1, mr: 2 }}>
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Task Information</Typography>
                            <Grid container spacing={2}>
                                <AppFormField title="Title" value={taskForm.title} onChange={handleChange("title")} error={errors.title} required />
                                <AppDropDownField
                                    label="Status"
                                    value={taskForm.status}
                                    options={statusOptions.map(o => ({ label: o.title, value: o.id }))}
                                    onChange={handleChange("status")}
                                    error={errors.status}
                                    required
                                />
                                <AppDropDownField
                                    label="Priority"
                                    value={taskForm.priority}
                                    options={priorityOptions.map(o => ({ label: o.title, value: o.id }))}
                                    onChange={handleChange("priority")}
                                    error={errors.priority}
                                    required
                                />
                                <AppFormField
                                    title="Due Date"
                                    type="datetime-local"
                                    value={taskForm.dueDate}
                                    onChange={handleChange("dueDate")}
                                    error={errors.dueDate}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <SearchableDropdown
                                    label="Assign To"
                                    value={taskForm.assigneeTo}
                                    onChange={(user) => setTaskForm(prev => ({ ...prev, assigneeTo: user }))}
                                    fetchOptions={fetchEmployeeOptions}
                                    optionLabel={(o) => o?.name || ''}
                                    renderOptionContent={(o) => (
                                        <><Avatar src={`${ApiUrls.imageUrl}${o?.profilePic}`} sx={{ width: 32, height: 32 }} /><Box><Typography variant="body2">{o?.name}</Typography><Typography variant="caption" color="textSecondary">{o?.employeeCode ? `${o.employeeCode} - ` : ""}{o?.email || ""}</Typography></Box></>
                                    )}
                                />
                                <AppFormField title="Description" value={taskForm.description} onChange={handleChange("description")} error={errors.description} multiline rows={4} />
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{ flex: 1, mr: 2 }}>
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Task Summary</Typography>
                            <SummaryItem label="Title" value={taskForm.title} />
                            <SummaryItem label="Status" value={taskForm.status} />
                            <SummaryItem label="Priority" value={taskForm.priority} />
                            <SummaryItem label="Due Date" value={taskForm.dueDate ? formatDateTime(taskForm.dueDate) : "N/A"} />
                            <SummaryItem label="Assigned To" value={taskForm.assigneeTo?.name} />
                            <Box mt={2}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Description:</Typography>
                                <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{taskForm.description || "Not specified"}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}
export default CreateTaskPage;
