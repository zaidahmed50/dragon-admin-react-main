import {
    Box,
    Typography,
    Paper,
    Grid,
    Checkbox,
    FormControlLabel,
    Snackbar,
    Alert,
} from '@mui/material';
import {Person} from '@mui/icons-material';
import AppFormField from '../../../../common/fromField';
import AppDropDownField from '../../../../common/dropdownField';
import useConnectionForm from '@/hooks/SalesId/hooks/useConnectionForm';
import CopyToClipboardButton from "../../../../common/ContentCopyIcon.jsx";


const ConnectionFormSection = ({customerData, onDataChange, onValidationChange}) => {
    const {
        statuses,
        cities,
        mainAreas,
        subAreas,
        dps,
        networkTypes,
        validationError,
        setValidationError,
        localData,
        handleChange,
        handleMainAreaChange,
        handleSubAreaChange,
        connectionTypes,
    } = useConnectionForm({customerData, onDataChange, onValidationChange});

    return (
        <>
            <Snackbar
                open={!!validationError}
                autoHideDuration={6000}
                onClose={() => setValidationError(null)}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <Alert severity="warning" onClose={() => setValidationError(null)}>
                    {validationError}
                </Alert>
            </Snackbar>

            <Paper elevation={1} sx={{p: 3}}>
                {/* Customer Profile Section */}
                {customerData && (
                    <Paper
                        elevation={0}
                        sx={{
                            mb: 4,
                            p: 3,
                            borderRadius: 3,
                            bgcolor: 'grey.50',
                            border: '1px solid',
                            borderColor: 'divider',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '4px',
                                height: '100%',
                                bgcolor: 'primary.main'
                            }}
                        />
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 3, gap: 1}}>
                            <Person color="primary"/>
                            <Typography variant="h6" sx={{fontWeight: 700, color: 'text.primary'}}>
                                Customer Profile
                            </Typography>

                            <CopyToClipboardButton text={
                                `Reference No: ${customerData.referenceNumber}\nName: ${customerData.shortName || customerData.name}\nIdentity: ${customerData.uuid }\nContact: ${customerData.phone1 }\n`
                            }>
                            </CopyToClipboardButton>

                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box>
                                    <Typography variant="caption" sx={{
                                        color: 'text.secondary',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                        display: 'block',
                                        mb: 0.5
                                    }}>
                                        Reference No
                                    </Typography>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                        <Typography variant="subtitle1" sx={{fontWeight: 600, color: 'text.primary'}}>
                                            {customerData.referenceNumber || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Box>
                                    <Typography variant="caption" sx={{
                                        color: 'text.secondary',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                        display: 'block',
                                        mb: 0.5
                                    }}>
                                        Name
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{fontWeight: 600, color: 'text.primary'}}>
                                        {(customerData.shortName || customerData.name || 'N/A')}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box>
                                    <Typography variant="caption" sx={{
                                        color: 'text.secondary',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                        display: 'block',
                                        mb: 0.5
                                    }}>
                                        Identity
                                    </Typography>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                        <Typography variant="subtitle1" sx={{fontWeight: 600, color: 'text.primary'}}>
                                            {customerData.uuid || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box>
                                    <Typography variant="caption" sx={{
                                        color: 'text.secondary',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                        display: 'block',
                                        mb: 0.5
                                    }}>
                                        Phone
                                    </Typography>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                        <Typography variant="subtitle1" sx={{fontWeight: 600, color: 'text.primary'}}>
                                            {customerData.phone1 || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>


                    </Paper>
                )}

                <Typography variant="h6" sx={{mb: 3, fontWeight: 600}}>
                    Connection Details
                </Typography>

                <div style={{display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '10px'}}>
                    <div style={{flex: 1}}>
                        <AppFormField
                            title="Sale ID"
                            value={localData.saleId}
                            readOnly={true}
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <AppDropDownField
                            title="Connection Type"
                            options={connectionTypes?.map(s => ({label: s.title || '', value: s.id}))}
                            value={localData.connectionTypeId}
                            onChange={(e) => handleChange('connectionTypeId', e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div style={{display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '10px'}}>
                    <div style={{flex: 1}}>
                        <AppDropDownField
                            title="City"
                            options={cities.map(c => ({label: c.title || '', value: c.id}))}
                            value={localData.cityId}
                            onChange={(e) => handleChange('cityId', e.target.value)}
                            required
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <AppDropDownField
                            title="Main Area"
                            options={mainAreas.map(a => ({label: a.areaName || '', value: a.id}))}
                            value={localData.mainAreaId}
                            onChange={handleMainAreaChange}
                            required
                        />
                    </div>
                </div>
                <div style={{display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '10px'}}>
                    <div style={{flex: 1}}>
                        <AppDropDownField
                            title="Sub Area"
                            options={subAreas.map(sa => ({label: sa.subAreaName || '', value: sa.id}))}
                            value={localData.subAreaId}
                            onChange={handleSubAreaChange}
                            disabled={!localData.mainAreaId}
                            required
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <AppDropDownField
                            title="DP Details"
                            options={dps.map(dp => ({label: dp.dpName || '', value: dp.id}))}
                            value={localData.dpId}
                            onChange={(e) => handleChange('dpId', e.target.value)}
                            disabled={!localData.subAreaId}
                            required
                        />
                    </div>
                </div>
                <div style={{display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '10px'}}>
                    <div style={{flex: 1}}>
                        <AppFormField
                            title="Connection Address"
                            value={localData.connectionAddress}
                            onChange={(e) => handleChange('connectionAddress', e.target.value)}
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <AppFormField
                            title="Coordinates"
                            value={localData.connectionGpsPoints}
                            onChange={(e) => handleChange('connectionGpsPoints', e.target.value)}
                            placeholder="Click location icon to select"
                        />
                    </div>
                </div>
                <div style={{display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '10px'}}>
                    <div style={{flex: 1}}>
                        <AppFormField
                            title="Connection Date"
                            type="date"
                            value={localData.dateOfRegistration}
                            onChange={(e) => handleChange('dateOfRegistration', e.target.value)}
                            required
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <AppDropDownField
                            title="Network Type"
                            options={networkTypes.map(nt => ({label: nt.title || '', value: nt.id}))}
                            value={localData.networkTypeId}
                            onChange={(e) => handleChange('networkTypeId', e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div style={{display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '10px'}}>
                    <div style={{flex: 1}}>
                        <AppFormField
                            title="PPPoE ID"
                            value={localData.pppoeId}
                            onChange={(e) => handleChange('pppoeId', e.target.value)}
                            required
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <AppFormField
                            title="PPPoE Password"
                            type="password"
                            value={localData.pppoePassword}
                            onChange={(e) => handleChange('pppoePassword', e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div style={{display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '10px'}}>
                    <div style={{flex: 1}}>
                        <AppDropDownField
                            title="Status"
                            options={statuses.map(s => ({label: s.title || '', value: s.id}))}
                            value={localData.connectionStatusId}
                            onChange={(e) => handleChange('connectionStatusId', e.target.value)}
                            required
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <></>
                    </div>
                </div>

                <Grid item xs={12}>
                    <Paper elevation={0}
                           sx={{p: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider'}}>
                        <Typography variant="subtitle2" sx={{mb: 2, fontWeight: 600}}>
                            Payment Details
                        </Typography>
                        <FormControlLabel
                            control={<Checkbox checked={localData.isAmountPaid}
                                               onChange={(e) => handleChange('isAmountPaid', e.target.checked)}/>}
                            label="Amount Paid...?"
                        />
                        {localData.isAmountPaid && (
                            <Grid container spacing={2} sx={{mt: 1}}>
                                <Grid item xs={12} sm={6}>
                                    <AppFormField
                                        title="Paid Amount"
                                        type="number"
                                        value={localData.paidAmount}
                                        onChange={(e) => handleChange('paidAmount', e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <AppFormField
                                        title="Paid Date"
                                        type="date"
                                        value={localData.paidDate}
                                        onChange={(e) => handleChange('paidDate', e.target.value)}
                                        required
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </Paper>
                </Grid>

            </Paper>
        </>
    );
};

export default ConnectionFormSection;
