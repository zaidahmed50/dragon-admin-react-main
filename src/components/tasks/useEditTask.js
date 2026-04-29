import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TaskService } from "../../services/index.js";

export const useEditTask = ({ task }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [taskForm, setTaskForm] = useState({
        title: "",
        description: "",
        dueDate: "",
        assigneeTo: null,
        priority: "LOW",
        status: "CREATED",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (task) {
            setTaskForm({
                title: task.title || "",
                description: task.description || "",
                dueDate: task.dueDate || "",
                assigneeTo: task.assigneeTo || null,
                priority: task.priority || "LOW",
                status: task.status || "CREATED",
            });
        }
    }, [task]);

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setTaskForm((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user types
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!taskForm.title) newErrors.title = "Title is required";
        if (!taskForm.priority) newErrors.priority = "Priority is required";
        if (!taskForm.status) newErrors.status = "Status is required";
        
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
                ...taskForm,
                assigneeTo: taskForm.assigneeTo?.id || 0, // Send ID or 0 if not assigned
            };
            
            await TaskService.createTask(payload);
            setSuccess(true);
            setTimeout(() => {
                navigate("/support/tasks");
            }, 1500);
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTask = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const payload = {
                ...taskForm,
                assigneeTo: taskForm.assigneeTo?.id || 0,
            };

            await TaskService.updateTask(task.id, payload);
            setSuccess(true);
            setTimeout(() => {
                navigate("/support/tasks");
            }, 1500);
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Failed to update task");
        } finally {
            setLoading(false);
        }
    };

    return {
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
    };
};
