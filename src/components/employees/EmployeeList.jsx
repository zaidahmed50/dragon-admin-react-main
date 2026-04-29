
import * as React from "react";
import {
    Button,
    TextField,
    Box,
    Typography,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    Chip,
    Stack,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useNavigate } from "react-router-dom";
import AppDropDownField from "../../common/dropdownField.jsx";
import { useEmployeeData } from "@/hooks/useEmployeeData.js";
import { useColumnManager } from "@/hooks/useColumnManager.js";
import {handleWhatsAppClick} from "../../helper/whatsAppLauncher.js"
import {formatDateWithDash} from "../../helper/formaters.jsx";
import AppDataGrid from "../../common/AppDataGrid.jsx";
import { employeeService } from "../../services/employeeService.js";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ImportEmployeeDialog from './ImportEmployeeDialog.jsx';


const initialColumns = [
    { field: "employeeCode", headerName: "Code", width: 100 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "phone1", headerName: "Mobile 1", width: 130,
        renderCell: (params) => {
            const phone = params.row.phone1;

            return phone ? (
                <Typography
                    variant="body3"
                    onClick={(event) => handleWhatsAppClick(event, phone)}
                    sx={{
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        color: "primary.main",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    {phone}
                </Typography>
            ) : (
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                    -
                </Typography>
            );
        },



    },
    { field: "phone2", headerName: "Mobile 2", width: 130,
        renderCell: (params) => {
            const phone = params.row.phone2;

            return phone ? (
                <Typography
                    variant="body3"
                    onClick={(event) => handleWhatsAppClick(event, phone)}
                    sx={{
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        color: "primary.main",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    {phone}
                </Typography>
            ) : (
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                    -
                </Typography>
            );
        },



    },
    { field: "phone3", headerName: "Mobile 3", width: 130,
        renderCell: (params) => {
            const phone = params.row.phone3;

            return phone ? (
                <Typography
                    variant="body3"
                    onClick={(event) => handleWhatsAppClick(event, phone)}
                    sx={{
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        color: "primary.main",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    {phone}
                </Typography>
            ) : (
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                    -
                </Typography>
            );
        },



    },
    {
        field: "email",
        headerName: "Email",
        width: 220,
        renderCell: (params) => {
            return params.value ? (
                <Typography
                    variant="body3"
                    sx={{
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        color: "primary.main",

                    }}
                >
                    {params.value}
                </Typography>
            ) : <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>-</Typography>;
        },
    },
    { field: "uuid", headerName: "CNIC", width: 150 },

    {
        field: "department",
        headerName: "Department",
        width: 200,
        renderCell: (params) => {
            const designationArr = Array.isArray(params.row?.designation) ? params.row.designation : [];
            const deptNames = [...new Set(designationArr.map(d => d.department?.name).filter(Boolean))];
            const fallback = params.row?.department?.name;

            if (deptNames.length === 0 && !fallback) {
                return <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>-</Typography>;
            }

            const names = deptNames.length > 0 ? deptNames : [fallback];

            if (names.length === 1) {
                return (
                    <Typography sx={{ fontSize: "0.8rem" }}>{names[0]}</Typography>
                );
            }

            return (
                <Tooltip
                    title={
                        <Stack spacing={0.5}>
                            {names.map((n, i) => <span key={i}>{n}</span>)}
                        </Stack>
                    }
                    arrow
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'default' }}>
                        <Chip label={names[0]} size="small" sx={{ fontSize: '0.72rem', maxWidth: 120 }} />
                        <Chip label={`+${names.length - 1}`} size="small" color="primary" sx={{ fontSize: '0.72rem' }} />
                    </Box>
                </Tooltip>
            );
        },
    },
    {
        field: "designation",
        headerName: "Designation",
        width: 220,
        renderCell: (params) => {
            const designationArr = Array.isArray(params.row?.designation) ? params.row.designation : [];

            if (designationArr.length === 0) {
                const fallback = params.row?.designation?.name;
                return fallback
                    ? <Typography sx={{ fontSize: "0.8rem" }}>{fallback}</Typography>
                    : <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>-</Typography>;
            }

            if (designationArr.length === 1) {
                return (
                    <Typography sx={{ fontSize: "0.8rem" }}>{designationArr[0].name}</Typography>
                );
            }

            return (
                <Tooltip
                    title={
                        <Stack spacing={0.5}>
                            {designationArr.map((d, i) => (
                                <span key={i}>
                                    <strong>{d.name}</strong>
                                    {d.department?.name && ` · ${d.department.name}`}
                                </span>
                            ))}
                        </Stack>
                    }
                    arrow
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'default' }}>
                        <Chip label={designationArr[0].name} size="small" sx={{ fontSize: '0.72rem', maxWidth: 130 }} />
                        <Chip label={`+${designationArr.length - 1}`} size="small" color="warning" sx={{ fontSize: '0.72rem' }} />
                    </Box>
                </Tooltip>
            );
        },
    },

    { field: "bloodGroup", headerName: "Blood Group", width: 110 },
    { field: "education", headerName: "Education", width: 160 },
    { field: formatDateWithDash("joiningDate"), headerName: "Joining Date", width: 120 },
    { field: "dutyStartTime", headerName: "Duty Start", width: 110 },
    { field: "dutyEndTime", headerName: "Duty End", width: 110 },
    {
        field: "userStatus",
        headerName: "Status",
        width: 120,
        renderCell: (params) => {
            return (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FiberManualRecordIcon
                        fontSize="inherit"
                        sx={{
                            color: params.value === "Active" ? "#10b981"  : "#f44336",
                            fontSize: "0.6rem",
                            mr: 0.5
                        }}
                    />
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                        {params.value || '-'}
                    </Typography>
                </Box>
            );
        },
    },
];

const EmployeeDataGrid = () => {
    const navigate = useNavigate();
    const {
        pageSize,
        currentPage,
        employees,
        loading,
        error,
        totalRecords,
        totalPages,
        searchQuery,
        filters,
        designations,
        departments,
        tempFilters,
        setSearchQuery,
        setFilters,
        setTempFilters,
        handlePageSizeChange,
        handlePreviousPage,
        handleNextPage,
        handlePageClick,
        fetchEmployees,
        setCurrentPage,
    } = useEmployeeData();

    const columnManager = useColumnManager(initialColumns);

    const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
    const [importDialogOpen, setImportDialogOpen] = React.useState(false);

    const handleFilterDialogOpen = () => {
        setTempFilters(filters);
        setFilterDialogOpen(true);
    };

    const handleFilterDialogClose = () => {
        setFilterDialogOpen(false);
    };

    const handleApplyFilters = () => {
        setFilters(tempFilters);
        setCurrentPage(0);
        setFilterDialogOpen(false);
    };

    const handleResetFilters = () => {
        const resetFilters = {
            designationId: null,
            departmentId: null,
            bloodGroup: "",
            userStatus: "",
        };
        setTempFilters(resetFilters);
        setFilters(resetFilters);
        setCurrentPage(0);
        setFilterDialogOpen(false);
    };

    const handleExport = async () => {
        try {
            await employeeService.exportEmployee();
        } catch (error) {
            console.error("Failed to export employees", error);
        }
    };

    const toolbarProps = {
        title: "Employee List",
        searchQuery: searchQuery,
        onSearchChange: (e) => setSearchQuery(e.target.value),
        searchPlaceholder: "Search employees...",
        createLabel: "Create Employee",
        createPermission: "EMPLOYEE_CREATE",
        onCreate: () => navigate("/employee/create"),
        onFilterDialogOpen: handleFilterDialogOpen,
        extraActions: (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    onClick={() => setImportDialogOpen(true)}
                >
                    Import Excel
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExport}
                >
                    Export Excel
                </Button>
            </Box>
        )
    };

    return (
        <>
            <AppDataGrid
                rows={employees}
                columns={initialColumns}
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
                onRowClick={(params) => {
                    navigate('/employee/view', {
                        state: {
                            employeeData: params.row,
                            userId: params.row.userId
                        }
                    });
                }}
                getRowId={(row) => row.userId}
                onRefresh={() => fetchEmployees(searchQuery, currentPage)}
            />

            <ImportEmployeeDialog
                open={importDialogOpen}
                onClose={() => setImportDialogOpen(false)}
                onImportSuccess={() => {
                    fetchEmployees(searchQuery, currentPage);
                    setImportDialogOpen(false);
                }}
            />

            <Dialog
                open={filterDialogOpen}
                onClose={handleFilterDialogClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                    }
                }}
            >
                <DialogTitle sx={{ color: 'text.primary' }}>Filter Employees</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <AppDropDownField
                            title={"Department"}
                            options={departments}
                            value={tempFilters.departmentId}
                            onChange={(e) => {
                                setTempFilters({
                                    ...tempFilters, departmentId: e.target.value, designationId: null

                                });
                            }}
                            required={true}

                        />
                        <AppDropDownField
                            title="Designation"
                            options={designations}
                            value={tempFilters.designationId}
                            onChange={(e) => setTempFilters({ ...tempFilters, designationId: e.target.value })}
                            disabled={!tempFilters.departmentId}
                            required={true}
                        />
                        <TextField
                            label="Blood Group"
                            fullWidth
                            value={tempFilters.bloodGroup}
                            onChange={(e) => setTempFilters({ ...tempFilters, bloodGroup: e.target.value })}
                            placeholder="e.g., A+, B-, O+"
                            sx={{
                                '& .MuiInputLabel-root': { color: 'text.secondary' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'text.primary',
                                    '& fieldset': { borderColor: 'divider' },
                                    '&:hover fieldset': { borderColor: 'text.secondary' },
                                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                },
                            }}
                        />
                        <Select
                            value={tempFilters.userStatus}
                            onChange={(e) => setTempFilters({ ...tempFilters, userStatus: e.target.value })}
                            displayEmpty
                            fullWidth
                            sx={{
                                color: 'text.primary',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'text.secondary' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                            }}
                        >
                            <MenuItem value="">All Status</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleResetFilters} sx={{ color: 'text.secondary' }}>
                        Reset
                    </Button>
                    <Button onClick={handleFilterDialogClose} sx={{ color: 'text.secondary' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApplyFilters}
                        variant="contained"
                        sx={{
                            bgcolor: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            }
                        }}
                    >
                        Apply Filters
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EmployeeDataGrid;
