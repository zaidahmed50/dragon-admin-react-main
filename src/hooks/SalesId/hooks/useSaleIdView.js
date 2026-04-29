import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAllMainAreas,
    getConnectionAllStatuses,
    getAllCities,
    getAllNetworkTypes,
    getOffices,
    getAllPromotions,
    getAllProfiles,
    getSubAreasByMainArea,
    getSaleIdConnectionList,
} from '../../../pages/customers/sales-id/services/salesIdServices.js';

const useSaleIdView = () => {
    const navigate = useNavigate();

    // State
    const [loading, setLoading] = useState(false);
    const [connections, setConnections] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [totalElements, setTotalElements] = useState(0);
    const [sortModel, setSortModel] = useState([
        { field: 'saleId', sort: 'desc' },
    ]);

    // Filter state
    const [filters, setFilters] = useState({
        mainAreaId: null,
        subAreaId: null,
        connectionStatusId: null,
        cityId: null,
        networkTypeId: null,
        officeLocationId: null,
        promotionId: null,
        connectionTypeId: null,
        profileId: null,
        expiryFromDate: null,
        expiryToDate: null,
        registrationFromDate: null,
        registrationToDate: null,
    });

    // Filter dialog state
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [filterData, setFilterData] = useState({
        mainAreas: [],
        subAreas: [],
        statuses: [],
        cities: [],
        networkTypes: [],
        offices: [],
        promotions: [],
        profiles: [],
    });

    // Menu state
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    // Fetch filter dropdown data
    const fetchFilterData = async () => {
        try {
            const [
                mainAreasRes,
                statusesRes,
                citiesRes,
                networkTypesRes,
                officesRes,
                promotionsRes,
                profilesRes,
            ] = await Promise.all([
                getAllMainAreas(),
                getConnectionAllStatuses(),
                getAllCities(),
                getAllNetworkTypes(),
                getOffices(),
                getAllPromotions(),
                getAllProfiles(),
            ]);

            setFilterData({
                mainAreas: mainAreasRes?.data || [],
                subAreas: [],
                statuses: statusesRes?.data || [],
                cities: citiesRes?.data || [],
                networkTypes: networkTypesRes?.data || [],
                offices: officesRes?.data || [],
                promotions: promotionsRes?.data || [],
                profiles: profilesRes?.data || [],
            });
        } catch (error) {
            console.error('Error fetching filter data:', error);
        }
    };

    // Load sub areas when main area changes
    const handleMainAreaFilterChange = async (mainAreaId) => {
        if (mainAreaId) {
            try {
                const response = await getSubAreasByMainArea(mainAreaId);
                if (response?.data) {
                    setFilterData(prev => ({ ...prev, subAreas: response.data }));
                }
            } catch (error) {
                console.error('Error fetching sub areas:', error);
            }
        } else {
            setFilterData(prev => ({ ...prev, subAreas: [] }));
        }
    };

    // Fetch connections
    const fetchConnections = useCallback(async () => {
        setLoading(true);
        try {
            const requestBody = {
                search: searchText || null,
                page: paginationModel.page + 1,
                size: paginationModel.pageSize,
                sortBy: sortModel[0]?.field || 'saleId',
                sortOrder: sortModel[0]?.sort || 'desc',
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null)),
            };

            const response = await getSaleIdConnectionList(requestBody);

            if (response?.data?.connections) {
                setConnections(response.data.connections);
                setTotalElements(response.data.totalElements || 0);
            } else if (response?.connections) {
                setConnections(response.connections);
                setTotalElements(response.totalElements || 0);
            }
        } catch (error) {
            console.error('Error fetching connections:', error);
        } finally {
            setLoading(false);
        }
    }, [searchText, paginationModel, sortModel, filters]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchConnections();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [fetchConnections]);

    // Handlers
    const handleCreateConnection = (connectionType) => {
        navigate('/SaleId/create', { state: { connectionType } });
        setAnchorEl(null);
    };

    const handleRowClick = (params) => {
        navigate(`/SaleId/view`);
    };
    const handleOpenFilterDialog = () => {
        fetchFilterData();
        setFilterDialogOpen(true);
    };

    const handleApplyFilters = () => {
        setFilterDialogOpen(false);
        setPaginationModel(prev => ({ ...prev, page: 0 }));
    };

    const handleResetFilters = () => {
        setFilters({
            mainAreaId: null,
            subAreaId: null,
            connectionStatusId: null,
            cityId: null,
            networkTypeId: null,
            officeLocationId: null,
            promotionId: null,
            connectionTypeId: null,
            profileId: null,
            expiryFromDate: null,
            expiryToDate: null,
            registrationFromDate: null,
            registrationToDate: null,
        });
        setFilterData(prev => ({ ...prev, subAreas: [] }));
    };

    return {
        loading,
        connections,
        searchText,
        setSearchText,
        paginationModel,
        setPaginationModel,
        totalElements,
        sortModel,
        setSortModel,
        filters,
        setFilters,
        filterDialogOpen,
        setFilterDialogOpen,
        filterData,
        anchorEl,
        setAnchorEl,
        openMenu,
        handleCreateConnection,
        handleRowClick,
        handleOpenFilterDialog,
        handleApplyFilters,
        handleResetFilters,
        handleMainAreaFilterChange,
    };
};

export default useSaleIdView;
