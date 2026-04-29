import {
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Button,
} from '@mui/material';
import {
    Close as CloseIcon,
} from '@mui/icons-material';
import AppDropDownField from '../../../common/dropdownField';
import AppFormField from '../../../common/fromField';
import useSaleIdView from '@/hooks/SalesId/hooks/useSaleIdView';
import AppDataGrid from '../../../common/AppDataGrid.jsx';
import { useColumnManager } from '@/hooks/useColumnManager.js';
import {handleWhatsAppClick} from "../../../helper/whatsAppLauncher.js";



const SaleIdList = () => {
    const {
        loading,
        connections,
        searchText,
        setSearchText,
        paginationModel,
        setPaginationModel,
        totalElements,
        filters,
        setFilters,
        filterDialogOpen,
        setFilterDialogOpen,
        filterData,
        handleRowClick,
        handleOpenFilterDialog,
        handleApplyFilters,
        handleResetFilters,
        handleMainAreaFilterChange,
    } = useSaleIdView();

    const initialColumns = [
        { field: 'saleId', headerName: 'Sale ID', width: 120, sortable: true },
        { field: 'profileName', headerName: 'Profile', width: 150, sortable: true },
        { field: 'customerReferenceNumber', headerName: 'Code', width: 150, sortable: true },
        { field: 'customerName', headerName: 'Customer Name', width: 200, sortable: true },
        {
            field: 'customerPhone',
            headerName: 'Phone',
            width: 150,
            sortable: true,
            renderCell: (params) => {
                const phone = params.value;
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
        { field: 'cityName', headerName: 'City', width: 130, sortable: true },
        { field: 'businessName', headerName: 'Business', width: 150, sortable: true },
        { field: 'pppoeId', headerName: 'PPPoE ID', width: 150, sortable: true },
        { field: 'customDataInMB', headerName: 'Data (MB)', width: 120, sortable: true, type: 'number' },
        { field: 'monthStartDate', headerName: 'Start Date', width: 130, sortable: true },
        { field: 'connectionExpiryDate', headerName: 'Expiry Date', width: 130, sortable: true },
    ];

    const columnManager = useColumnManager(initialColumns, "saleIdView");

    const totalPages = Math.ceil(totalElements / paginationModel.pageSize);

    const toolbarProps = {
        title: "Sales ID View",
        searchQuery: searchText,
        onSearchChange: (e) => setSearchText(e.target.value),
        searchPlaceholder: "Search...",
        createLabel: "Create",
        // onCreate: (e) => setAnchorEl(e.currentTarget),
        onFilterDialogOpen: handleOpenFilterDialog,
    };

    return (
        <div className='main-content'>
            <div>
                <>
                    <AppDataGrid
                        rows={connections}
                        columns={initialColumns}
                        loading={loading}
                        totalRecords={totalElements}
                        totalPages={totalPages}
                        pageSize={paginationModel.pageSize}
                        currentPage={paginationModel.page}
                        handlePageSizeChange={(newPageSize) => setPaginationModel({ ...paginationModel, pageSize: newPageSize })}
                        handlePreviousPage={() => setPaginationModel({ ...paginationModel, page: paginationModel.page - 1 })}
                        handleNextPage={() => setPaginationModel({ ...paginationModel, page: paginationModel.page + 1 })}
                        handlePageClick={(page) => setPaginationModel({ ...paginationModel, page: page })}
                        toolbarProps={toolbarProps}
                        columnManager={columnManager}
                        onRowClick={handleRowClick}
                        getRowId={(row) => row.id} // Assuming 'id' is the unique identifier
                        onRefresh={() => { /* Implement refresh logic if needed, or pass a dummy function */ }}
                    />


                    <Dialog
                        open={filterDialogOpen}
                        onClose={() => setFilterDialogOpen(false)}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">Filters</Typography>
                            <Box>
                                <Button size="small" onClick={handleResetFilters}>
                                    Reset
                                </Button>
                                <IconButton size="small" onClick={() => setFilterDialogOpen(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ bgcolor: 'primary.light', p: 1, mb: 2, borderRadius: 1 }}>
                                <Typography variant="caption">
                                    Apply filters to narrow down the results.
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <AppDropDownField
                                        title="Network Type"
                                        options={filterData.networkTypes.map(nt => ({ label: nt.title, value: nt.id }))}
                                        value={filters.networkTypeId || ''}
                                        onChange={(e) => setFilters(prev => ({ ...prev, networkTypeId: e.target.value || null }))}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <AppDropDownField
                                        title="Connection Status"
                                        options={filterData.statuses.map(s => ({ label: s.title, value: s.id }))}
                                        value={filters.connectionStatusId || ''}
                                        onChange={(e) => setFilters(prev => ({ ...prev, connectionStatusId: e.target.value || null }))}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <AppDropDownField
                                        title="Office Location"
                                        options={filterData.offices.map(o => ({ label: o.officeName, value: o.id }))}
                                        value={filters.officeLocationId || ''}
                                        onChange={(e) => setFilters(prev => ({ ...prev, officeLocationId: e.target.value || null }))}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <AppDropDownField
                                        title="Promotion"
                                        options={filterData.promotions.map(p => ({ label: p.promotionName, value: p.id }))}
                                        value={filters.promotionId || ''}
                                        onChange={(e) => setFilters(prev => ({ ...prev, promotionId: e.target.value || null }))}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <AppDropDownField
                                        title="City"
                                        options={filterData.cities.map(c => ({ label: c.title || c.name, value: c.id }))}
                                        value={filters.cityId || ''}
                                        onChange={(e) => setFilters(prev => ({ ...prev, cityId: e.target.value || null }))}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                        Expiry Date Range
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <AppFormField
                                                title="From"
                                                type="date"
                                                value={filters.expiryFromDate || ''}
                                                onChange={(e) => setFilters(prev => ({ ...prev, expiryFromDate: e.target.value || null }))}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <AppFormField
                                                title="To"
                                                type="date"
                                                value={filters.expiryToDate || ''}
                                                onChange={(e) => setFilters(prev => ({ ...prev, expiryToDate: e.target.value || null }))}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                        Registration Date Range
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <AppFormField
                                                title="From"
                                                type="date"
                                                value={filters.registrationFromDate || ''}
                                                onChange={(e) => setFilters(prev => ({ ...prev, registrationFromDate: e.target.value || null }))}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <AppFormField
                                                title="To"
                                                type="date"
                                                value={filters.registrationToDate || ''}
                                                onChange={(e) => setFilters(prev => ({ ...prev, registrationToDate: e.target.value || null }))}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <AppDropDownField
                                        title="Profile"
                                        options={filterData.profiles.map(p => ({ label: p.name, value: p.id }))}
                                        value={filters.profileId || ''}
                                        onChange={(e) => setFilters(prev => ({ ...prev, profileId: e.target.value || null }))}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <AppDropDownField
                                        title="Main Area"
                                        options={filterData.mainAreas.map(ma => ({ label: ma.areaName, value: ma.id }))}
                                        value={filters.mainAreaId || ''}
                                        onChange={(e) => {
                                            const value = e.target.value || null;
                                            setFilters(prev => ({ ...prev, mainAreaId: value, subAreaId: null }));
                                            handleMainAreaFilterChange(value);
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <AppDropDownField
                                        title="Sub Area"
                                        options={filterData.subAreas.map(sa => ({ label: sa.subAreaName, value: sa.id }))}
                                        value={filters.subAreaId || ''}
                                        onChange={(e) => setFilters(prev => ({ ...prev, subAreaId: e.target.value || null }))}
                                        disabled={!filters.mainAreaId}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setFilterDialogOpen(false)}>Close</Button>
                            <Button variant="contained" onClick={handleApplyFilters}>Apply</Button>
                        </DialogActions>
                    </Dialog>
                </>
            </div>
        </div>
    );



};

export default SaleIdList;
