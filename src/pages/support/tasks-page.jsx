import { Box, Typography } from "@mui/material";
import TaskList from "@/components/tasks/TaskList.jsx";

const TasksPage = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, p: 3, pb: 0 }}>
                Task Management
            </Typography>
            <TaskList />
        </Box>
    );
};

export default TasksPage;
