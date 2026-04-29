import {useState, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Dialog, DialogTitle, DialogContent, Typography, IconButton} from '@mui/material';
import AppDataGrid from '../../common/AppDataGrid.jsx';
import SubAdminCreate from './SubAdminCreate';
import {useSubAdminData} from '@/hooks/useSubAdminData.js';
import {useColumnManager} from '@/hooks/useColumnManager.js';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {formatDate} from "../../helper/helper.jsx";
import EditIcon from '@mui/icons-material/Edit';

const SubAdminList = () => {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const navigate = useNavigate();

    const handleOpen = (data = null) => {
        setEditData(data);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditData(null);
        fetchSubAdmins();
    };

    const handleRowClick = (params) => {
        navigate(`/sub-admin/activity-log/${params.id}`);
    };

    const initialColumns = useMemo(() => [
        {
            field: 'createdAt', headerName: 'Created At', width: 150,
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
        {field: 'name', headerName: 'Name', width: 200},
        {field: 'email', headerName: 'Email', width: 250},
        {
            field: 'userStatus',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <FiberManualRecordIcon
                        fontSize="inherit"
                        sx={{
                            color: params.value === 'ACTIVE' ? '#10b981' : '#f44336',
                            fontSize: '0.5rem',
                        }}
                    />
                    <Typography sx={{fontSize: '0.8rem'}}>
                        {params.value || '-'}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'accessGroup',
            headerName: 'Access Group',
            width: 120,
            renderCell: (params) => {
                const groupName = params.value?.groupName;
                return (
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography sx={{
                            fontSize: '0.8rem',
                            color: groupName === undefined ? '#f44336' : '#10b981',
                        }}>
                            {groupName || "Not Assigned"}
                        </Typography>
                    </Box>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <IconButton onClick={(e) => {
                    e.stopPropagation();
                    handleOpen(params.row)
                }}>
                    <EditIcon/>
                </IconButton>
            ),
        },
    ], []);

    const {
        pageSize,
        currentPage,
        subAdmins,
        loading,
        error,
        totalRecords,
        totalPages,
        searchQuery,
        setSearchQuery,
        handlePageSizeChange,
        handlePreviousPage,
        handleNextPage,
        handlePageClick,
        fetchSubAdmins,
    } = useSubAdminData();

    const columnManager = useColumnManager(initialColumns, 'subAdminList');

    const toolbarProps = {
        title: 'Sub-Admins',
        searchQuery: searchQuery,
        onSearchChange: (e) => setSearchQuery(e.target.value),
        searchPlaceholder: 'Search sub-admins...',
        createLabel: 'Create Sub-Admin',
        onCreate: () => handleOpen(),
    };

    return (
        <Box>
            <AppDataGrid
                rows={subAdmins}
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
                getRowId={(row) => row.id}
                onRefresh={fetchSubAdmins}
                onRowClick={handleRowClick}
            />
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editData ? 'Edit Sub-Admin' : 'Create Sub-Admin'}</DialogTitle>
                <DialogContent>
                    <SubAdminCreate onSuccess={handleClose} editData={editData}/>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default SubAdminList;
