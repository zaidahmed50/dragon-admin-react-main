
import * as React from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCustomerList } from "@/hooks/customers/useCustomerList.js";
import { useColumnManager } from "@/hooks/useColumnManager.js";
import { handleWhatsAppClick } from "../../../helper/whatsAppLauncher.js";
import { formatDate } from "../../../helper/helper.jsx";
import AppDataGrid from "../../../common/AppDataGrid.jsx";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ImportCustomerDialog from "./ImportCustomerDialog.jsx";

const initialColumns = [
    {
        field: "createdAt", headerName: "Created At", width: 120,
        renderCell: (params) => {
            const createdAt = params.row.createdAt;
            return createdAt ? (
                <Typography variant="body3">
                    {formatDate(createdAt)}
                </Typography>
            ) : (
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>-</Typography>
            );
        },
    },
    { field: "referenceNumber", headerName: "Code", width: 80 },
    {
        field: "name", headerName: "Name", width: 130,
        renderCell: (params) => {
            const name = params.row.shortName === null ? params.row.name : params.row.shortName;
            return name ? (
                <Typography
                    variant="body3"
                    color={params.row.shortName === null ? null : "primary"}
                >
                    {name}
                </Typography>
            ) : (
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>-</Typography>
            );
        },
    },
    {
        field: "phone1", headerName: "Phone 1", width: 130,
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
                        "&:hover": { textDecoration: "underline" },
                    }}
                >
                    {phone}
                </Typography>
            ) : (
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>-</Typography>
            );
        },
    },
    {
        field: "phone2", headerName: "Phone 2", width: 130,
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
                        "&:hover": { textDecoration: "underline" },
                    }}
                >
                    {phone}
                </Typography>
            ) : (
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>-</Typography>
            );
        },
    },
    {
        field: "phone3", headerName: "Phone 3", width: 130,
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
                        "&:hover": { textDecoration: "underline" },
                    }}
                >
                    {phone}
                </Typography>
            ) : (
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>-</Typography>
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
                    sx={{ fontSize: "0.8rem", display: "flex", alignItems: "center", color: "primary.main" }}
                >
                    {params.value}
                </Typography>
            ) : <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>-</Typography>;
        },
    },
    { field: "uuid", headerName: "UUID", width: 200 },
    { field: "remarks", headerName: "Remarks", width: 110 },
    { field: "userStatus", headerName: "Status", width: 120 },
];

const CustomerList = () => {
    const navigate = useNavigate();
    const [importDialogOpen, setImportDialogOpen] = React.useState(false);

    const {
        pageSize,
        currentPage,
        customers,
        loading,
        error,
        totalRecords,
        totalPages,
        searchQuery,
        setSearchQuery,
        fetchCustomers,
        handlePageSizeChange,
        handlePreviousPage,
        handleNextPage,
        handlePageClick,
    } = useCustomerList(initialColumns);

    const columnManager = useColumnManager(initialColumns, "customerList");

    const toolbarProps = {
        title: "Customer List",
        searchQuery: searchQuery,
        onSearchChange: (e) => setSearchQuery(e.target.value),
        searchPlaceholder: "Search customers...",
        createLabel: "Create Customer",
        extraActions: (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    onClick={() => setImportDialogOpen(true)}
                >
                    Import Excel
                </Button>
            </Box>
        ),
        createPermission: "CUSTOMER_CREATE",
        onCreate: () => navigate("/Customers/create"),
    };

    return (
        <>
            <AppDataGrid
                rows={customers}
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
                    navigate("/Customers/view", {
                        state: {
                            customerData: params.row,
                            userId: params.row.userId,
                        },
                    });
                }}
                getRowId={(row) => row.userId}
                onRefresh={() => fetchCustomers(searchQuery, currentPage)}
            />

            <ImportCustomerDialog
                open={importDialogOpen}
                onClose={() => setImportDialogOpen(false)}
                onImportSuccess={() => fetchCustomers(searchQuery, currentPage)}
            />
        </>
    );
};

export default CustomerList;
