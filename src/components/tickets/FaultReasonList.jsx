import { useState, useEffect } from "react";
import { Box, IconButton, Tooltip, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AppDataGrid from "../../common/AppDataGrid.jsx";
import { useColumnManager } from "@/hooks/useColumnManager.js";
import FaultReasonService from "../../services/faultReasonService.js";
import FaultReasonModal from "./FaultReasonModal.jsx";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext.jsx";

const FaultReasonList = () => {
    const { isSuperAdmin, hasPermission } = useAuth();
    const canCreate = isSuperAdmin() || hasPermission("FAULT_REASON_CREATE");
    const canUpdate = isSuperAdmin() || hasPermission("FAULT_REASON_UPDATE");
    const canDelete = isSuperAdmin() || hasPermission("FAULT_REASON_DELETE");

    const [faultReasons, setFaultReasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState(null);

    const fetchFaultReasons = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await FaultReasonService.getAllFaultReasons();
            if (response.success) {
                setFaultReasons(response.data);
            } else {
                setError(response.message || "Failed to fetch fault reasons");
            }
        } catch (err) {
            setError(err.message || "Failed to fetch fault reasons");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaultReasons();
    }, []);

    const handleCreate = () => {
        setSelectedReason(null);
        setModalOpen(true);
    };

    const handleEdit = (reason) => {
        setSelectedReason(reason);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                const response = await FaultReasonService.deleteFaultReason(id);
                if (response.success !== false) {
                    Swal.fire("Deleted!", "Fault reason has been deleted.", "success");
                    fetchFaultReasons();
                } else {
                    Swal.fire("Error!", response.message || "Failed to delete fault reason.", "error");
                }
            } catch (err) {
                Swal.fire("Error!", err.message || "Failed to delete fault reason.", "error");
            }
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedReason(null);
    };

    const handleModalSuccess = () => {
        handleModalClose();
        fetchFaultReasons();
    };

    const initialColumns = [
        {
            field: "id",
            headerName: "ID",
            width: 100,
        },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    {canUpdate && (
                        <Tooltip title="Edit">
                            <IconButton onClick={() => handleEdit(params.row)} color="primary">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {canDelete && (
                        <Tooltip title="Delete">
                            <IconButton onClick={() => handleDelete(params.row.id)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            ),
        },
    ];

    const columnManager = useColumnManager(initialColumns, "faultReasonList");

    const toolbarProps = {
        title: "Fault Reasons",
        createLabel: "Create Fault Reason",
        createPermission: "FAULT_REASON_CREATE",
        onCreate: canCreate ? handleCreate : undefined,
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
                <AppDataGrid
                    rows={faultReasons}
                    columns={initialColumns}
                    loading={loading}
                    error={error}
                    columnManager={columnManager}
                    getRowId={(row) => row.id}
                    onRefresh={fetchFaultReasons}
                    toolbarProps={toolbarProps}
                    // hideFooterPagination={true}
                    pagination={false}
                />
            </Box>

            <FaultReasonModal
                open={modalOpen}
                onClose={handleModalClose}
                faultReason={selectedReason}
                onSuccess={handleModalSuccess}
            />
        </Box>
    );
};

export default FaultReasonList;
