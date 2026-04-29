import * as React from "react";
import {Box, Typography} from "@mui/material";
import AppDataGrid from "../../../../common/AppDataGrid.jsx";
import {useVendorData} from "@/hooks/useVendorData.js";
import {useColumnManager} from "@/hooks/useColumnManager.js";
import {formatDate} from "../../../../helper/helper.jsx";
import { useNavigate } from 'react-router-dom';
import VendorDetail from "./VendorDetail.jsx";

const VendorsList = () => {
    const navigate = useNavigate();
    const [isDetailOpen, setIsDetailOpen] = React.useState(false);
    const [selectedVendor, setSelectedVendor] = React.useState(null);

    const {
        pageSize,
        currentPage,
        vendors,
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
        fetchVendors,
    } = useVendorData();

    const handleRowClick = (params) => {
        setSelectedVendor(params.row);
        setIsDetailOpen(true);
    };

    const initialColumns = [
        {field: "id", headerName: "ID", width: 80},
        {field: "vendorCode", headerName: "Code", width: 120},
        {field: "name", headerName: "Name", width: 200},
        {
            field: "email", 
            headerName: "Email", 
            width: 200,
            renderCell: (params) => params.row.contactInformation?.email || 'N/A'
        },
        {
            field: "city", 
            headerName: "City", 
            width: 120,
            renderCell: (params) => params.row.location?.city || 'N/A'
        },
        {
            field: "createdAt", headerName: "Created At", width: 180, renderCell: (params) => {
                return (<Typography>{formatDate(params.row.createdAt)}</Typography>);
            }
        },
    ];

    const columnManager = useColumnManager(initialColumns, 'vendorList');

    const toolbarProps = {
        title: "Vendors List",
        searchQuery: searchQuery,
        onSearchChange: (e) => setSearchQuery(e.target.value),
        searchPlaceholder: "Search vendors...",
        createLabel: "Create Vendor",
        createPermission: "VENDOR_CREATE",
        onCreate: () => navigate('/finance/inventory/vendors/create'),
    };

    return (
        <>
            <Box sx={{height: '100%', width: '100%'}}>
                <AppDataGrid
                    rows={vendors}
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
                    getRowId={(row) => row.id}
                    onRowClick={handleRowClick}
                    onRefresh={() => fetchVendors(searchQuery, currentPage)}
                />
            </Box>
            
            {selectedVendor && (
                <VendorDetail
                    open={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    vendor={selectedVendor}
                />
            )}
        </>
    );
};

export default VendorsList;
