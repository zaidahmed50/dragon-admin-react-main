import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const ManagerList = ({ managers }) => {
    const columns = [
        { field: 'sasUserId', headerName: 'SAS ID', width: 100 },
        { field: 'username', headerName: 'Username', width: 150 },
        { field: 'firstname', headerName: 'First Name', width: 150 },
        { field: 'lastname', headerName: 'Last Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 220 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        {
            field: 'enabled',
            headerName: 'Enabled',
            width: 100,
            renderCell: (params) => (params.value === 1 ? 'Yes' : 'No'),
        },
    ];

    return (
        <Paper sx={{ p: 3, border: '1px solid #D1DFDB' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Managers List
            </Typography>

            <Box sx={{ height: 450 }}>
                <DataGrid
                    rows={managers}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    disableRowSelectionOnClick
                    getRowId={(row) => row.sasUserId}   // ✅ FIX
                />
            </Box>
        </Paper>
    );
};

export default ManagerList;
