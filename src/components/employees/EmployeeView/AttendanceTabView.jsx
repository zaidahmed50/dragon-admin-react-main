import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

// Dummy attendance data for 10 days
const attendanceData = [
    { id: 1,checkIn:"10:30",checkOut:"6:50", date: '2025-12-01', status: 'Present' },
    { id: 2,checkIn:"10:30",checkOut:"6:50", date: '2025-12-01', status: 'Present' },
    { id: 3,checkIn:"10:30",checkOut:"6:50", date: '2025-12-01', status: 'Present' },
    { id: 4,checkIn:"10:30",checkOut:"6:50", date: '2025-12-01', status: 'Present' },
    { id: 5,checkIn:"10:30",checkOut:"6:50", date: '2025-12-01', status: 'Present' },
    { id: 6,checkIn:"10:30",checkOut:"6:50", date: '2025-12-01', status: 'Present' },
    { id: 7,checkIn:"10:30",checkOut:"6:50", date: '2025-12-01', status: 'Present' },


];

// Columns for DataGrid
const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'checkIn', headerName: 'Check In', width: 120 },
    { field: 'checkOut', headerName: 'Check Out', width: 120 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
];

const AttendanceTabView = ({employeeData}) => {
    return (
        <Box sx={{ height: 1000, width: '100%', marginTop: 3 }}>
            <h2>Monthly Attendance - Current Employee</h2>
            <DataGrid
                rows={attendanceData}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                rowHeight={30}
            />
        </Box>
    );
};

export default AttendanceTabView;
