import * as React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddModelModal from "./add_model.jsx";
import AppDataGrid from "../../../../common/AppDataGrid.jsx";
import { useModelData } from "@/hooks/useModelData.js";
import { useColumnManager } from "@/hooks/useColumnManager.js";
import { formatDate } from "../../../../helper/helper.jsx";
// import { InventoryService } from "../../../../services/index.js";

const ModelList = () => {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(null);

    const { pageSize, currentPage, models, loading, error, totalRecords, totalPages,
        searchQuery, setSearchQuery, handlePageSizeChange, handlePreviousPage,
        handleNextPage, handlePageClick, fetchModels } = useModelData();

    const handleEdit = (row) => { setSelected(row); setOpen(true); };
    // const handleToggle = async (row) => {
    //     try {
    //         await InventoryService.toggleModelStatus(row.id);
    //         fetchModels(searchQuery, currentPage);
    //     } catch (err) { console.error('Toggle failed:', err); }
    // };
    const handleClose = () => { setOpen(false); setSelected(null); };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "modelCode", headerName: "Code", width: 110 },
        { field: "brandName", headerName: "Brand", width: 150,
            renderCell: (params) => params.row.brand?.name || params.row.brandName || '—' },
        { field: "name", headerName: "Model", width: 180 },

        { field: "unitName", headerName: "Unit", width: 120,
            renderCell: (params) => <Typography variant="body2">{params.value || '—'}</Typography> },

        { field: "description", headerName: "Description", width: 220 },
        
        { field: "createdAt", headerName: "Created At", width: 170,
            renderCell: (params) => <Typography variant="body2">{formatDate(params.row.createdAt)}</Typography> },
        { field: "actions", headerName: "Actions", width: 100, sortable: false,
            renderCell: (params) => (
                <Box >
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(params.row)}><EditIcon fontSize="small" /></IconButton>
                    </Tooltip>
                   
                </Box>
            ),
        },
    ];

    const columnManager = useColumnManager(columns, 'modelList');

    const toolbarProps = {
        title: "Models List",
        searchQuery, onSearchChange: (e) => setSearchQuery(e.target.value),
        searchPlaceholder: "Search models...",
        createLabel: "Create Model", createPermission: "MODEL_CREATE",
        onCreate: () => { setSelected(null); setOpen(true); },
    };

    return (
        <>
            <Box sx={{ height: '100%', width: '100%' }}>
                <AppDataGrid rows={models} columns={columns} loading={loading} error={error}
                    totalRecords={totalRecords} totalPages={totalPages} pageSize={pageSize}
                    currentPage={currentPage} handlePageSizeChange={handlePageSizeChange}
                    handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage}
                    handlePageClick={handlePageClick} toolbarProps={toolbarProps}
                    columnManager={columnManager} getRowId={(row) => row.id}
                    onRefresh={() => fetchModels(searchQuery, currentPage)} />
            </Box>
            <AddModelModal open={open} onClose={handleClose} setOpen={setOpen}
                initialModel={selected} onModelAdded={() => fetchModels(searchQuery, currentPage)} />
        </>
    );
};

export default ModelList;
