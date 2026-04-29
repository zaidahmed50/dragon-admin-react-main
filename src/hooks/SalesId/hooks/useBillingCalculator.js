import { useState, useEffect, useCallback, useRef } from 'react';
import {
    getAllProfiles,
    getAllTaxes,
    getAllPromotions,
    getAllPools,
    getAllIpCuttingsByPool,
    calculateBill,
} from '../../../pages/customers/sales-id/services/salesIdServices.js';

const useBillingCalculator = ({ initialConnectionType, onDataChange, onValidationChange }) => {
    const [profiles, setProfiles] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [ipPools, setIpPools] = useState([]);
    const [ipCuttings, setIpCuttings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCalculating, setIsCalculating] = useState(false);
    const [calculationError, setCalculationError] = useState(null);

    const [connectionType, setConnectionType] = useState(initialConnectionType);
    const [isIpSelected, setIsIpSelected] = useState(false);
    const [isTaxable, setIsTaxable] = useState(false);
    const [isTaxWithinPrice, setIsTaxWithinPrice] = useState(false);

    const previousValidationRef = useRef(null);

    const [localData, setLocalData] = useState({
        connectionsTypeId: initialConnectionType.id,
        profileId: '',
        customDataInMB: '',
        pricePerMB: null,
        noOfMonthsToBeBilled: 1,
        monthStartDate: new Date().toISOString().split('T')[0],
        promotionId: '',
        ipPoolId: '',
        selectedIpIds: [],
        pricePerIp: '',
        taxTypeId: '',
    });

    const [billCalculation, setBillCalculation] = useState(null);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [profilesRes, taxesRes, promotionsRes, ipPoolsRes] = await Promise.all([
                getAllProfiles(),
                getAllTaxes(),
                getAllPromotions(),
                getAllPools(),
            ]);

            if (profilesRes?.data) setProfiles(profilesRes.data);
            if (taxesRes?.data) setTaxes(taxesRes.data);
            if (promotionsRes?.data) setPromotions(promotionsRes.data);
            if (ipPoolsRes?.data) setIpPools(ipPoolsRes.data);
        } catch (error) {
            console.error('Error loading billing data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIpPoolChange = async (poolId) => {
        const update = { ipPoolId: poolId, selectedIpIds: [], pricePerIp: '' };
        setLocalData(prev => ({ ...prev, ...update }));
        onDataChange(update);
        setIpCuttings([]);

        if (poolId) {
            try {
                const response = await getAllIpCuttingsByPool(poolId);
                if (response?.data) {
                    const activeIps = response.data
                        .filter(ip => ip.ipStatus?.toUpperCase() !== 'INACTIVE')
                        .sort((a, b) => (a.ipAddress || '').localeCompare(b.ipAddress || ''));
                    setIpCuttings(activeIps);
                }
            } catch (error) {
                console.error('Error fetching IP cuttings:', error);
            }
        }
    };

    const handleConnectionTypeChange = (typeId) => {
        // const newType = CONNECTION_TYPES.find(t => t.id === typeId);
        // setConnectionType(newType);

        const update = { connectionsTypeId: typeId };
        if (typeId !== 1) {
            update.profileId = '';
            update.promotionId = '';
        } else {
            update.customDataInMB = '';
        }
        setLocalData(prev => ({ ...prev, ...update }));
        onDataChange(update);
    };

    const calculateBillApi = useCallback(async () => {
        setIsCalculating(true);
        setCalculationError(null);

        try {
            const requestData = {
                connectionTypeId: parseInt(localData.connectionsTypeId),
                profileId: connectionType.id === 1 && localData.profileId ? parseInt(localData.profileId) : null,
                customDataInMB: connectionType.id !== 1 && localData.customDataInMB ? parseInt(localData.customDataInMB) : null,
                pricePerMB: parseFloat(localData.pricePerMB),
                pricePerIp: localData.pricePerIp ? parseFloat(localData.pricePerIp) : null,
                isTaxable,
                isTaxWithinPrice,
                promotionId: localData.promotionId ? parseInt(localData.promotionId) : null,
                monthStartDate: localData.monthStartDate,
                noOfMonthsToBeBilled: parseInt(localData.noOfMonthsToBeBilled) || 1,
                taxTypeId: isTaxable && localData.taxTypeId ? parseInt(localData.taxTypeId) : null,
                ipIds: localData.selectedIpIds.length > 0 ? localData.selectedIpIds.map(id => parseInt(id)) : [],
            };

            const response = await calculateBill(requestData);

            if (response?.data) {
                setBillCalculation(response.data);
                // Pass the data back to the parent form, ensuring field names match what the API expects
                onDataChange({ 
                    ...requestData, 
                    connectionsTypeId: requestData.connectionTypeId, // Ensure this matches the parent's state key
                    packageStartDate: localData.monthStartDate 
                });
            }
        } catch (error) {
            setCalculationError(error.response?.data?.message || error.message || 'Failed to calculate bill');
            setBillCalculation(null);
        } finally {
            setIsCalculating(false);
        }
    }, [connectionType.id, isTaxWithinPrice, isTaxable, localData.connectionsTypeId, localData.customDataInMB, localData.monthStartDate, localData.noOfMonthsToBeBilled, localData.pricePerIp, localData.pricePerMB, localData.profileId, localData.promotionId, localData.selectedIpIds, localData.taxTypeId]);

    useEffect(() => {
        const pricePerMB = parseFloat(localData.pricePerMB);
        const isValidPrice = pricePerMB && pricePerMB > 0;

        const isValid =
            !!localData.connectionsTypeId &&
            isValidPrice &&
            (connectionType.id === 1 ? !!localData.profileId : (!!localData.customDataInMB && parseInt(localData.customDataInMB) > 0)) &&
            (!isIpSelected || (!!localData.ipPoolId && localData.selectedIpIds.length > 0 && !!localData.pricePerIp)) &&
            localData.noOfMonthsToBeBilled >= 1 &&
            !!localData.monthStartDate &&
            (!isTaxable || !!localData.taxTypeId);

        if (previousValidationRef.current !== isValid) {
            previousValidationRef.current = isValid;
            onValidationChange(isValid);
        }

        if (isValid) {
            const debounceTimer = setTimeout(() => {
                calculateBillApi();
            }, 500);
            return () => clearTimeout(debounceTimer);
        } else {
            setBillCalculation(null);
            setCalculationError(null);
        }
    }, [localData, isTaxable, isTaxWithinPrice, isIpSelected, connectionType.id, onValidationChange, calculateBillApi]);

    const handleChange = (field, value) => {
        let updates = { [field]: value };

        if (field === "profileId") {
            const selectedProfile = profiles.find(p => p.id === value);
            console.log(selectedProfile)
            if (selectedProfile) {
                updates.pricePerMB = selectedProfile.unitPrice;
            }
        }

        setLocalData(prev => ({ ...prev, ...updates }));
        onDataChange(updates);
    };

    return {
        profiles,
        taxes,
        promotions,
        ipPools,
        ipCuttings,
        loading,
        isCalculating,
        calculationError,
        connectionType,
        isIpSelected,
        setIsIpSelected,
        isTaxable,
        setIsTaxable,
        isTaxWithinPrice,
        setIsTaxWithinPrice,
        localData,
        setLocalData,
        billCalculation,
        handleIpPoolChange,
        handleConnectionTypeChange,
        handleChange,
    };
};

export default useBillingCalculator;
