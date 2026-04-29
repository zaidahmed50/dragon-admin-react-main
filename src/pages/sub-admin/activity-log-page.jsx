import { useParams } from 'react-router-dom';
import AppDataGrid from '../../common/AppDataGrid.jsx';
import { Box, Typography } from '@mui/material';
import { useActivityLogData } from '@/hooks/useActivityLogData.js';
import { useColumnManager } from '@/hooks/useColumnManager.js';
import {formatDate} from "../../helper/helper.jsx";

const ActivityLogPage = ({ userId, isCurrentUser = false }) => {
    const params = useParams();
    const id = (userId !== undefined && userId !== null) ? userId : params.id;

    const {
        logs,
        loading,
        error,
        pageSize,
        currentPage,
        totalRecords,
        totalPages,
        searchQuery,
        setSearchQuery,
        handlePageSizeChange,
        handlePreviousPage,
        handleNextPage,
        handlePageClick,
        fetchLogs,
    } = useActivityLogData(id, isCurrentUser);

    const columns = [
        {
            field: 'createdAt', headerName: 'Timestamp', width: 200,
            renderCell: (params) => {
                const createdAt = params.row.createdAt;
                return createdAt ? (
                    <Typography
                        variant="body3"
                    >
                        {formatDate(createdAt)}
                    </Typography>
                ) : (
                    <Typography sx={{fontSize: "0.8rem", color: "text.secondary"}}>
                        -
                    </Typography>
                );
            },
        },
        { field: 'action', headerName: 'Action', width: 150 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'ipAddress', headerName: 'IP Address', width: 150 },
    ];

    const columnManager = useColumnManager(columns, 'activityLogColumns');

    const toolbarProps = {
        title: isCurrentUser ? 'My Activity Logs' : `Activity Log for Sub-Admin ${id}`,
        searchQuery: searchQuery,
        onSearchChange: (e) => setSearchQuery(e.target.value),
        searchPlaceholder: 'Search logs...',
    };

    return (
        <Box className='main-content'>
            <AppDataGrid
                rows={logs}
                columns={columnManager.columns}
                loading={loading}
                error={error}
                totalRecords={totalRecords}
                totalPages={totalPages}
                pageSize={pageSize}
                currentPage={currentPage}
                handlePageSizeChange={handlePageSizeChange}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                handlePageClick={handlePageClick}
                toolbarProps={toolbarProps}
                columnManager={columnManager}
                onRefresh={fetchLogs}
                getRowId={(row) => row.id}
            />
        </Box>
    );
};

export default ActivityLogPage;
