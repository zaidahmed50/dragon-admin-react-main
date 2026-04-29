import { useState, useEffect } from 'react';
import { getUserByRefNo } from '../../../pages/customers/sales-id/services/salesIdServices.js';
import { ApiUrls } from '../../../services/index.js';

const useCustomerInfo = ({ onDataChange, onValidationChange }) => {
    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [customerData, setCustomerData] = useState(null);

    useEffect(() => {
        const isValid = !!customerData?.id;
        onValidationChange(isValid);
        if (customerData?.id) {
            onDataChange({ customerID: customerData.id });
        }
    }, [customerData, onDataChange, onValidationChange]);

    const handleSearch = async (referenceNumber) => {
        if (!referenceNumber || referenceNumber.trim() === '') {
            setCustomerData(null);
            return;
        }

        setIsLoading(true);
        try {
            const response = await getUserByRefNo(referenceNumber);
            if (response?.data) {
                setCustomerData(response.data);
            } else {
                setCustomerData(null);
            }
        } catch (error) {
            console.error('Error searching customer:', error);
            setCustomerData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchValueChange = (value) => {
        setSearchValue(value);
        if (value) {
            handleSearch(value);
        } else {
            setCustomerData(null);
        }
    };

    return {
        searchValue,
        isLoading,
        customerData,
        handleSearchValueChange,
        ApiUrls,
    };
};

export default useCustomerInfo;
