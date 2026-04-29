import ActivityLogPage from './activity-log-page';
import { Box, Typography } from '@mui/material';
import {useAuth} from "../../contexts/AuthContext.jsx";

const MyActivityLogPage = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <Box className='main-content'>
                <Typography>Please log in to view your activity logs.</Typography>
            </Box>
        );
    }

    return <ActivityLogPage isCurrentUser={true} />;
};

export default MyActivityLogPage;
