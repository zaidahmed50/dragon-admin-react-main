import {useState, useEffect, useCallback} from 'react';
import {
    getFreshSaleId,
    getConnectionAllStatuses,
    getAllCities,
    getAllMainAreas,
    getSubAreasByMainArea,
    getAllDpPortsBySubAreaId,
    getAllNetworkTypes,
    getOffices, getAllConnectionTypes,
} from '../../../pages/customers/sales-id/services/salesIdServices.js';
import {validateRequired} from '../../../helper/validationHelper.js';
import {reduceLatLng} from "../../../helper/formaters.jsx";

const useConnectionForm = ({connectionType, customerData, onDataChange, onValidationChange}) => {
    const [statuses, setStatuses] = useState([]);
    const [connectionTypes, setConnectionTypes] = useState([]);
    const [cities, setCities] = useState([]);
    const [mainAreas, setMainAreas] = useState([]);
    const [subAreas, setSubAreas] = useState([]);
    const [dps, setDps] = useState([]);
    const [networkTypes, setNetworkTypes] = useState([]);
    const [popLocations, setPopLocations] = useState([]);
    const [validationError, setValidationError] = useState(null);

    const [loading, setLoading] = useState({
        statuses: false,
        cities: false,
        mainAreas: false,
        subAreas: false,
        dps: false,
        networkTypes: false,
        popLocations: false,
    });

    const [localData, setLocalData] = useState({
        saleId: '',
        connectionStatusId: '',
        cityId: '',
        mainAreaId: '',
        subAreaId: '',
        dpId: '',
        connectionAddress: '',
        connectionGpsPoints: '',
        dateOfRegistration: new Date().toISOString().split('T')[0],
        networkTypeId: '',
        pppoeId: '',
        pppoePassword: '',
        // popId: '',
        isAmountPaid: false,
        paidAmount: '',
        paidDate: '',
        connectionTypeId: '',
        customerID: customerData?.userId || null, // Initialize customerID
    });

    useEffect(() => {
        loadInitialData().then(() => {
        });


    }, []);

    useEffect(() => {
        if (statuses.length && !localData.connectionStatusId) {
            const activeStatus = statuses.find(
                s => s.title === "Active"
            );

            if (activeStatus) {
                setLocalData(prev => ({
                    ...prev,
                    connectionStatusId: Number(activeStatus.id),
                }));
            }
        }
    }, [localData.connectionStatusId, statuses]);
    const loadInitialData = async () => {
        try {
            const saleIdRes = await getFreshSaleId();
            if (saleIdRes?.data) {
                setLocalData(prev => ({...prev, saleId: saleIdRes.data}));
                onDataChange({saleId: saleIdRes.data});
            }

            setLoading(prev => ({...prev, statuses: true}));
            const statusesRes = await getConnectionAllStatuses();
            if (statusesRes?.data) setStatuses(statusesRes.data);

            setLoading(prev => ({...prev, statuses: false}));


            const connectionTypes = await getAllConnectionTypes();
            if (statusesRes?.data) setConnectionTypes(connectionTypes.data);
            setLoading(prev => ({...prev, connectionTypes: false}));


            setLoading(prev => ({...prev, cities: true}));
            const citiesRes = await getAllCities();
            if (citiesRes?.data) setCities(citiesRes.data);
            setLoading(prev => ({...prev, cities: false}));

            setLoading(prev => ({...prev, mainAreas: true}));
            const mainAreasRes = await getAllMainAreas();
            if (mainAreasRes?.data) setMainAreas(mainAreasRes.data);
            setLoading(prev => ({...prev, mainAreas: false}));

            setLoading(prev => ({...prev, networkTypes: true}));
            const networkTypesRes = await getAllNetworkTypes();
            if (networkTypesRes?.data) setNetworkTypes(networkTypesRes.data);
            setLoading(prev => ({...prev, networkTypes: false}));

            if (connectionType?.id !== 1) {
                setLoading(prev => ({...prev, popLocations: true}));
                const popRes = await getOffices();
                if (popRes?.data) setPopLocations(popRes.data);
                setLoading(prev => ({...prev, popLocations: false}));
            }
            if (customerData?.userId) {
                onDataChange({customerID: customerData.userId});
            }

        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    };

    const handleMainAreaChange = async (e) => {
        const value = e.target.value;
        setLocalData(prev => ({...prev, mainAreaId: value, subAreaId: '', dpId: ''}));
        onDataChange({mainAreaId: value, subAreaId: null, dpId: null});
        if (value) {
            setLoading(prev => ({...prev, subAreas: true}));
            try {
                const response = await getSubAreasByMainArea(value);
                if (response?.data) setSubAreas(response.data);
            } catch (error) {
                console.error('Error fetching sub areas:', error);
            }
            setLoading(prev => ({...prev, subAreas: false}));
        }
    };

    const handleSubAreaChange = async (e) => {
        const value = e.target.value;
        setLocalData(prev => ({...prev, subAreaId: value, dpId: ''}));
        onDataChange({subAreaId: value, dpId: null});


        setLoading(prev => ({...prev, dps: true}));
        try {
            const response = await getAllDpPortsBySubAreaId(value);
            if (response?.data) setDps(response.data);
        } catch (error) {
            console.error('Error fetching DPs:', error);
        }
        setLoading(prev => ({...prev, dps: false}));

    };

    const handleChange = (field, value) => {
        setLocalData(prev => ({...prev, [field]: value}));
        onDataChange({[field]: value});
        // setValidationError(null);

        if (field === 'dpId') {
            const selectedDp = dps.find(dp => dp.id === value);
            if (selectedDp) {
                const newAddress = selectedDp.address || '';
                const newGpsPoints = `${reduceLatLng(selectedDp.lat)}, ${reduceLatLng(selectedDp.lng)}`;

                setLocalData(prev => ({
                    ...prev,
                    connectionAddress: newAddress,
                    connectionGpsPoints: newGpsPoints
                }));
                onDataChange({
                    connectionAddress: newAddress,
                    connectionGpsPoints: newGpsPoints
                });
            }
        }
    };

    const validateForm = useCallback(() => {
        const fields = [
            {value: localData.customerID, name: 'Customer'}, // Added customerID validation
            {value: localData.saleId, name: 'Sale ID'},
            {value: localData.connectionStatusId, name: 'Status'},
            {value: localData.cityId, name: 'City'},
            {value: localData.mainAreaId, name: 'Main Area'},
            {value: localData.subAreaId, name: 'Sub Area'},
            {value: localData.dateOfRegistration, name: 'Connection Date'},
            {value: localData.networkTypeId, name: 'Network Type'},
        ];

        if (connectionType?.id === 1) {
            fields.push({value: localData.dpId, name: 'DP Details'});
            fields.push({value: localData.pppoeId, name: 'PPPoE ID'});
            fields.push({value: localData.pppoePassword, name: 'PPPoE Password'});
        } else {
            // fields.push({ value: localData.popId, name: 'POP (Office Location)' });
        }

        if (localData.isAmountPaid) {
            fields.push({value: localData.paidAmount, name: 'Paid Amount'});
            fields.push({value: localData.paidDate, name: 'Paid Date'});
            if (localData.paidAmount && parseFloat(localData.paidAmount) <= 0) {
                return false;
            }
        }

        for (const field of fields) {
            if (validateRequired(field.value, field.name)) {
                // setValidationError(`${field.name} is required.`);
                return false;
            }
        }
        setValidationError(null);
        return true;
    }, [localData, connectionType]);

    useEffect(() => {
        const isValid = validateForm();
        onValidationChange(isValid);
    }, [localData, validateForm, onValidationChange]); // Added dependencies for useEffect

    return {
        statuses,
        cities,
        mainAreas,
        subAreas,
        dps,
        networkTypes,
        popLocations,
        validationError,
        setValidationError,
        loading,
        localData,
        handleChange,
        handleMainAreaChange,
        handleSubAreaChange,
        connectionTypes
    };
};

export default useConnectionForm;
