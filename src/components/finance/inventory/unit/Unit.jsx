import * as React from "react";
import { Box, Typography, IconButton, Chip, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import AddUnitModal from "./add_unit.jsx";
import AppDataGrid from "../../../../common/AppDataGrid.jsx";
import { useUnitData } from "@/hooks/useUnitData.js";
import { useColumnManager } from "@/hooks/useColumnManager.js";
import { formatDate } from "../../../../helper/helper.jsx";
import { InventoryService } from "../../../../services/index.js";

const Unit = () => {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(null);

    const { pageSize, currentPage, units, loading, error, totalRecords, totalPages,
        searchQuery, setSearchQuery, handlePageSizeChange, handlePreviousPage,
        handleNextPage, handlePageClick, fetchUnits } = useUnitData();

    const handleEdit = (row) => { setSelected(row); setOpen(true); };
    const handleToggle = async (row) => {
        try {
            await InventoryService.toggleUnitStatus(row.id);
            fetchUnits(searchQuery, currentPage);
        } catch (err) { console.error('Toggle failed:', err); }
    };
    const handleClose = () => { setOpen(false); setSelected(null); };

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "name", headerName: "Name", width: 200 },
        { field: "shortName", headerName: "Short Name", width: 130 },
        { field: "active", headerName: "Status", width: 110,
            renderCell: (params) => (
                <Chip label={params.value ? "Active" : "Inactive"}
                    color={params.value ? "success" : "default"} size="small" />
            ),
        },
        { field: "createdAt", headerName: "Created At", width: 180,
            renderCell: (params) => <Typography variant="body2">{formatDate(params.row.createdAt)}</Typography> },
        { field: "actions", headerName: "Actions", width: 100, sortable: false,
            renderCell: (params) => (
                <Box display="flex" gap={0.5}>
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(params.row)}><EditIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title={params.row.active ? "Deactivate" : "Activate"}>
                        <IconButton size="small" color={params.row.active ? "success" : "default"}
                            onClick={() => handleToggle(params.row)}>
                            {params.row.active ? <ToggleOnIcon fontSize="small" /> : <ToggleOffIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    const columnManager = useColumnManager(columns, 'unitList');

    const toolbarProps = {
        title: "Units List",
        searchQuery, onSearchChange: (e) => setSearchQuery(e.target.value),
        searchPlaceholder: "Search units...",
        createLabel: "Create Unit", createPermission: "UNIT_CREATE",
        onCreate: () => { setSelected(null); setOpen(true); },
    };

    return (
        <>
            <Box sx={{ height: '100%', width: '100%' }}>
                <AppDataGrid rows={units} columns={columns} loading={loading} error={error}
                    totalRecords={totalRecords} totalPages={totalPages} pageSize={pageSize}
                    currentPage={currentPage} handlePageSizeChange={handlePageSizeChange}
                    handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage}
                    handlePageClick={handlePageClick} toolbarProps={toolbarProps}
                    columnManager={columnManager} getRowId={(row) => row.id}
                    onRefresh={() => fetchUnits(searchQuery, currentPage)} />
            </Box>
            <AddUnitModal open={open} onClose={handleClose} setOpen={setOpen}
                initialUnit={selected} onUnitAdded={() => fetchUnits(searchQuery, currentPage)} />
        </>
    );
};

export default Unit;
