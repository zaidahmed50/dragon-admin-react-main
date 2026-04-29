import {
    Box,
    Typography,
    Snackbar,
    Alert,
    Chip,
    CircularProgress,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import ConnectionFormSection from './components/ConnectionFormSection';
import BillingCalculatorSection from './components/BillingCalculatorSection';
import AppButton from "../../../common/AppButton.jsx";
import useCreateSaleId from '@/hooks/SalesId/hooks/useCreateSaleId';
import { useLocation } from "react-router-dom";
const CreateSaleId = () => {
    const {
        connectionType,
        isConnectionFormValid,
        setIsConnectionFormValid,
        isBillingValid,
        setIsBillingValid,
        loading,
        submitError,
        setSubmitError,
        submitSuccess,
        setSubmitSuccess,
        formData,
        updateFormData,
        handleSubmit,
    } = useCreateSaleId();
    const location = useLocation();
    const customer = location.state;
    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Create Connection Details
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip
                            icon={isConnectionFormValid ? <CheckCircle /> : <Cancel />}
                            label="Connection"
                            size="small"
                            color={isConnectionFormValid ? "success" : "default"}
                            variant={isConnectionFormValid ? "filled" : "outlined"}
                        />
                        <Chip
                            icon={isBillingValid ? <CheckCircle /> : <Cancel />}
                            label="Billing"
                            size="small"
                            color={isBillingValid ? "success" : "default"}
                            variant={isBillingValid ? "filled" : "outlined"}
                        />
                    </Box>
                </Box>
                <AppButton
                    onClick={handleSubmit}
                    label={"Submit"}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                </AppButton>
            </Box>

            <Snackbar
                open={submitSuccess}
                autoHideDuration={6000}
                onClose={() => setSubmitSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="success" onClose={() => setSubmitSuccess(false)}>
                    Connection created successfully!
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!submitError}
                autoHideDuration={6000}
                onClose={() => setSubmitError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="error" onClose={() => setSubmitError(null)}>
                    {submitError}
                </Alert>
            </Snackbar>

            <Box display="flex" gap={2} width="100%">
                <Box flex={2}>
                    <ConnectionFormSection
                        formData={formData}
                        onDataChange={updateFormData}
                        onValidationChange={setIsConnectionFormValid}
                        customerData={customer}
                    />
                </Box>

                <Box flex={1}>
                    <BillingCalculatorSection
                        connectionType={connectionType}
                        formData={formData}
                        onDataChange={updateFormData}
                        onValidationChange={setIsBillingValid}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default CreateSaleId;
