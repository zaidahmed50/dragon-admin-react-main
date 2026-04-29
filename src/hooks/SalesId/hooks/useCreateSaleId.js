import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createConnection } from '../../../pages/customers/sales-id/services/salesIdServices.js';

const useCreateSaleId = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const connectionType = location.state?.connectionType || { id: 1, title: 'Residential' };

    const [isConnectionFormValid, setIsConnectionFormValid] = useState(false);
    const [isCustomerInfoValid, setIsCustomerInfoValid] = useState(false);
    const [isBillingValid, setIsBillingValid] = useState(false);

    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [formData, setFormData] = useState({
        saleId: null,
        connectionAddress: '',
        connectionGpsPoints: '',
        pppoeId: '',
        pppoePassword: '',
        paidAmount: null,
        dateOfRegistration: new Date(),
        paidDate: null,
        isAmountPaid: false,
        subAreaId: null,
        dpId: null,
        networkTypeId: null,
        connectionStatusId: null,
        cityId: null,
        // popId: null,
        customerID: null,
        existingCustomer: null,
        profileId: null,
        packageStartDate: null,
        packageEndDate: null,
        customDataInMB: null,
        pricePerMB: null,
        advancedMonthsPayment: 1,
        taxes: [],
        promotion: null,
        staticIpPoolId: null,
        staticIpAddress: null,
        connectionsTypeId: connectionType.id,
    });

    const updateFormData = (data) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const isFormComplete = isConnectionFormValid && isBillingValid;

    const handleSubmit = async () => {
        if (!isFormComplete) {
            const missingFields = [];
            if (!isConnectionFormValid) missingFields.push('Connection Details');
            if (!isBillingValid) missingFields.push('Billing Calculator');
            setSubmitError(`Please complete: ${missingFields.join(', ')}`);
            return;
        }

        setLoading(true);
        setSubmitError(null);

        try {
            const requestData = {
                ...formData,
                dateOfRegistration: formData.dateOfRegistration ? new Date(formData.dateOfRegistration).toISOString().split('T')[0] : null,
                paidDate: formData.paidDate ? new Date(formData.paidDate).toISOString().split('T')[0] : null,
                packageStartDate: formData.packageStartDate ? new Date(formData.packageStartDate).toISOString().split('T')[0] : null,
                packageEndDate: formData.packageEndDate ? new Date(formData.packageEndDate).toISOString().split('T')[0] : null,
                
                // Ensure numeric values
                connectionsTypeId: parseInt(formData.connectionsTypeId),
                pricePerMB: formData.pricePerMB ? parseFloat(formData.pricePerMB) : null,
                customDataInMB: formData.customDataInMB ? parseInt(formData.customDataInMB) : null,
                profileId: formData.profileId ? parseInt(formData.profileId) : null,
                promotionId: formData.promotionId ? parseInt(formData.promotionId) : null,
                noOfMonthsToBeBilled: formData.noOfMonthsToBeBilled ? parseInt(formData.noOfMonthsToBeBilled) : 1,
                taxTypeId: formData.taxTypeId ? parseInt(formData.taxTypeId) : null,
                ipPoolId: formData.ipPoolId ? parseInt(formData.ipPoolId) : null,
                pricePerIp: formData.pricePerIp ? parseFloat(formData.pricePerIp) : null,
            };

            const response = await createConnection(requestData);
            if (response.success !== false) {
                setSubmitSuccess(true);
                setTimeout(() => {
                    navigate('/SaleId/view');
                }, 1500);
            } else {
                let errorMessage = response.message || 'Failed to create connection';
                if (response.data && typeof response.data === 'object') {
                    const details = Object.values(response.data).join(', ');
                    if (details) {
                        errorMessage += `: ${details}`;
                    }
                }
                setSubmitError(errorMessage);
            }
        } catch (error) {
            let errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            if (error.response?.data?.data && typeof error.response.data.data === 'object') {
                const details = Object.values(error.response.data.data).join(', ');
                if (details) {
                    errorMessage += `: ${details}`;
                }
            }
            setSubmitError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        connectionType,
        isConnectionFormValid,
        setIsConnectionFormValid,
        isCustomerInfoValid,
        setIsCustomerInfoValid,
        isBillingValid,
        setIsBillingValid,
        loading,
        submitError,
        setSubmitError,
        submitSuccess,
        setSubmitSuccess,
        formData,
        updateFormData,
        isFormComplete,
        handleSubmit,
    };
};

export default useCreateSaleId;
