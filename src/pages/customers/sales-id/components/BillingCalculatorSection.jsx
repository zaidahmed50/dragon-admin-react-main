import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Skeleton,
    Checkbox,
    FormControlLabel,
    IconButton,
    Divider,
    Alert,
} from '@mui/material';
import { Wifi as WifiIcon } from '@mui/icons-material';
import AppFormField from '../../../../common/fromField';
import AppDropDownField from '../../../../common/dropdownField';
import useBillingCalculator from '@/hooks/SalesId/hooks/useBillingCalculator';

const BillingRow = ({ label, value }) => (
    <Box sx={{ mb: 0.5 }}>
        <Grid container spacing={2.5}>
            <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
                    {label}
                </Typography>
                <Divider sx={{ mt: 0.5 }} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
                    {value}
                </Typography>
                <Divider sx={{ mt: 0.5 }} />
            </Grid>
        </Grid>
    </Box>
);

const BillingCalculatorSection = ({ connectionType: initialConnectionType, onDataChange, onValidationChange }) => {
    const {
        profiles,
        taxes,
        promotions,
        ipPools,
        ipCuttings,
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
        handleChange,
    } = useBillingCalculator({ initialConnectionType, onDataChange, onValidationChange });

    return (
        <Paper elevation={1} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 18 }}>
                    Billing Calculator
                </Typography>
                <IconButton
                    size="small"
                    onClick={() => {
                        setIsIpSelected(!isIpSelected);
                        if (isIpSelected) {
                            setLocalData(prev => ({
                                ...prev,
                                ipPoolId: '',
                                selectedIpIds: [],
                                pricePerIp: ''
                            }));
                        }
                    }}
                    sx={{
                        bgcolor: isIpSelected ? 'primary.main' : 'transparent',
                        border: '1px solid',
                        borderColor: isIpSelected ? 'primary.main' : 'divider',
                    }}
                >
                    <WifiIcon sx={{ color: isIpSelected ? 'white' : 'inherit', fontSize: 20 }} />
                </IconButton>
            </Box>

            <Grid container spacing={2}>
                {connectionType.id === 1 ? (
                    <Grid item xs={6}>
                        <AppDropDownField
                            title="Profile *"
                            options={profiles.map(p => ({ label: p.name || '', value: p.id }))}
                            value={localData.profileId}
                            onChange={(e) => handleChange('profileId', e.target.value)}
                        />
                    </Grid>
                ) : (
                    <Grid item xs={12}>
                        <AppFormField
                            title="Custom Data (MB) *"
                            type="number"
                            value={localData.customDataInMB}
                            onChange={(e) => handleChange('customDataInMB', e.target.value)}
                            inputProps={{ min: 1 }}
                        />
                    </Grid>
                )}

                <Grid item xs={connectionType.id === 1 ? 6 : 12}>
                    <AppFormField
                        title={`${connectionType.id === 1 ? 'Profile Price' : 'Price Per MB'} *`}
                        type="number"
                        value={localData.pricePerMB}
                        onChange={(e) => handleChange('pricePerMB', e.target.value)}
                        inputProps={{ min: 0.01, step: 0.01 }}
                        helperText={connectionType.id === 1 ? 'Enter total profile price' : 'Enter price per MB'}
                    />
                </Grid>

                {isIpSelected && (
                    <>
                        <Grid item xs={6}>
                            <AppDropDownField
                                title="IP Pool *"
                                options={ipPools.map(p => ({ label: `${p.ipAddress}/${p.ipCutting}`, value: p.id }))}
                                value={localData.ipPoolId}
                                onChange={(e) => handleIpPoolChange(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <AppDropDownField
                                title="IP List *"
                                options={ipCuttings.map(ip => ({ label: ip.ipAddress, value: ip.id }))}
                                value={localData.selectedIpIds[0] || ''}
                                onChange={(e) => handleChange('selectedIpIds', e.target.value ? [e.target.value] : [])}
                                disabled={!localData.ipPoolId}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <AppFormField
                                title="Price Per IP *"
                                type="number"
                                value={localData.pricePerIp}
                                onChange={(e) => handleChange('pricePerIp', e.target.value)}
                                inputProps={{ min: 0, step: 0.01 }}
                            />
                        </Grid>
                    </>
                )}

                <Grid item xs={isIpSelected ? 6 : 12}>
                    <AppFormField
                        title="No of Months *"
                        type="number"
                        value={localData.noOfMonthsToBeBilled}
                        onChange={(e) => handleChange('noOfMonthsToBeBilled', e.target.value)}
                        inputProps={{ min: 1, max: 12 }}
                    />
                </Grid>

                <Grid item xs={connectionType.id === 1 && promotions.length > 0 ? 6 : 12}>
                    <AppFormField
                        title="Month Start Date *"
                        type="date"
                        value={localData.monthStartDate}
                        onChange={(e) => handleChange('monthStartDate', e.target.value)}
                        inputProps={{
                            max: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
                        }}
                    />
                </Grid>

                {connectionType.id === 1 && promotions.length > 0 && (
                    <Grid item xs={6}>
                        <AppDropDownField
                            title="Promotions"
                            options={promotions.map(p => ({ label: p.promotionName, value: p.id }))}
                            value={localData.promotionId || ''}
                            onChange={(e) => handleChange('promotionId', e.target.value || '')}
                        />
                    </Grid>
                )}

                <Grid item xs={isTaxable ? 6 : 12}>
                    <FormControlLabel
                        control={<Checkbox checked={isTaxable} onChange={(e) => setIsTaxable(e.target.checked)} size="small" />}
                        label={<Typography variant="body2" sx={{ fontSize: 12 }}>Taxable</Typography>}
                    />
                    {isTaxable && (
                        <FormControlLabel
                            control={<Checkbox checked={isTaxWithinPrice} onChange={(e) => setIsTaxWithinPrice(e.target.checked)} size="small" />}
                            label={<Typography variant="body2" sx={{ fontSize: 12 }}>Tax Within Price</Typography>}
                            sx={{ ml: 0, display: 'block' }}
                        />
                    )}
                </Grid>

                {isTaxable && (
                    <Grid item xs={6}>
                        <AppDropDownField
                            title="Taxes *"
                            options={taxes.map(t => ({ label: t.title, value: t.id }))}
                            value={localData.taxTypeId}
                            onChange={(e) => handleChange('taxTypeId', e.target.value)}
                        />
                    </Grid>
                )}

                {calculationError && (
                    <Grid item xs={12}>
                        <Alert severity="error" sx={{ mb: 1 }}>
                            {calculationError}
                        </Alert>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Quick Bill
                    </Typography>
                    <Divider sx={{ mb: 1 }} />

                    {isCalculating ? (
                        <Box>
                            {[...Array(10)].map((_, i) => <Skeleton key={i} variant="text" height={24} sx={{ mb: 0.5 }} />)}
                        </Box>
                    ) : billCalculation ? (
                        <Box>
                            {Object.entries(billCalculation).map(([key, value]) => {
                                if (value && typeof value !== 'object') {
                                    return <BillingRow key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} value={value} />;
                                }
                                return null;
                            })}
                            <Box sx={{ mt: 2, pt: 2, borderTop: '2px solid', borderColor: 'divider' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', fontSize: 14 }}>
                                        Total Final Bill
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 14 }}>
                                        {billCalculation.totalFinalBill?.toFixed(2) || '0.00'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        <Typography variant="caption" color="text.secondary">
                            {localData.pricePerMB ? 'Calculating...' : 'Fill all required fields to calculate bill'}
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default BillingCalculatorSection;
