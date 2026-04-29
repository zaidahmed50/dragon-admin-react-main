import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Card} from "@mui/material";
import AppDataGrid from "../../../common/AppDataGrid.jsx";
import useCustomerSalesId from "../../../hooks/SalesId/useCustomerSalesId.js";
import {useColumnManager} from "@/hooks/useColumnManager.js";

const initialColumns = [
    {field: 'saleId', headerName: 'Sale ID', flex: 1},
    {field: 'pppoeId', headerName: 'PPPOE ID', flex: 1},
    {field: 'customerName', headerName: 'Customer Name', flex: 1},
    {field: 'connectionStatus', headerName: 'Status', flex: 1},
    {field: 'profileName', headerName: 'Profile', flex: 1},
    {field: 'networkType', headerName: 'Network Type', flex: 1},
    {field: 'connectionType', headerName: 'Connection Type', flex: 1},
];

export const CustomerSalesIdList = (props) => {
    const customerId = props.customerData.userId;
    const {loading, data, totalElements, fetchSalesIds, error} = useCustomerSalesId();
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const columnManager = useColumnManager(initialColumns);

    useEffect(() => {
        if (customerId) {
            fetchSalesIds(customerId, "", "", paginationModel.pageSize, paginationModel.page + 1);
        }
    }, []);

    const handlePageSizeChange = (newPageSize) => {
        setPaginationModel((prev) => ({...prev, pageSize: newPageSize, page: 0}));
    };

    const handlePreviousPage = () => {
        setPaginationModel((prev) => ({...prev, page: Math.max(0, prev.page - 1)}));
    };

    const handleNextPage = () => {
        setPaginationModel((prev) => ({...prev, page: prev.page + 1}));
    };

    const handlePageClick = (page) => {
        setPaginationModel((prev) => ({...prev, page}));
    };

    const totalPages = Math.ceil(totalElements / paginationModel.pageSize);

    return (
        <Card>
            <AppDataGrid
                rows={data}
                columns={initialColumns}
                loading={loading}
                error={error}
                totalRecords={totalElements}
                totalPages={totalPages}
                pageSize={paginationModel.pageSize}
                currentPage={paginationModel.page}
                handlePageSizeChange={handlePageSizeChange}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                handlePageClick={handlePageClick}
                columnManager={columnManager}
                getRowId={(row) => row.id || row.saleId}
                onRefresh={() => fetchSalesIds(customerId, "", "", paginationModel.pageSize, paginationModel.page + 1)}
            />
        </Card>
    );
}

CustomerSalesIdList.propTypes = {
    customerId: PropTypes.any,
    customerData: PropTypes.object
};
