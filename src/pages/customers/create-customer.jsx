import {
    Box,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    Snackbar,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import {useNavigate, useLocation} from "react-router-dom";
import AppFormField from "../../common/fromField.jsx";
import AppDropDownField from "../../common/dropdownField.jsx";
import CustomerUploadSection from "../customers/upload-sections.jsx";
import AppButton from "../../common/AppButton.jsx";
import {formatCNIC, formatPKMobile} from "../../helper/formaters.jsx";
import { useCreateCustomer } from "@/hooks/customers/useCreateCustomer.js";

const CreateCustomerPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const customerDataFromState = location.state?.customerData;
    const isEditMode = !!customerDataFromState;

    const {
        userFormType,
        setUserFormType,
        occupationTypes,
        loading,
        submitError,
        setSubmitError,
        submitSuccess,
        setSubmitSuccess,
        validationError,
        setValidationError,
        uploadSectionRef,
        formData,
        handleInputChange,
        handleIdentityTypeChange,
        handleSubmit,
        resetForm,
        getFilteredIdentityTypes,
        getSelectedIdentityType,
        getStatusOptions
    } = useCreateCustomer(navigate, customerDataFromState, isEditMode);

    if (loading && isEditMode && !formData.name) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px'}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{p: 2}}>
            <Typography variant="h6" gutterBottom>
                {isEditMode ? 'Update Customer Details' : 'Add Customer Details'}
            </Typography>
            <Snackbar
                open={submitSuccess}
                autoHideDuration={6000}
                onClose={() => setSubmitSuccess(false)}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <Alert severity="success" onClose={() => setSubmitSuccess(false)}>
                    Customer {isEditMode ? 'updated' : 'created'} successfully!
                </Alert>
            </Snackbar>
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
            <Snackbar
                open={!!submitError}
                autoHideDuration={6000}
                onClose={() => setSubmitError(null)}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <Alert severity="error" onClose={() => setSubmitError(null)}>
                    {submitError}
                </Alert>
            </Snackbar>

            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px"}}>
                <Paper elevation={10} variant="outlined" sx={{p: 2, mb: 3, width: "50%"}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                        <Typography variant="h6">
                            {userFormType === 'Individual' ? 'Personal' : 'Business'} Information
                        </Typography>
                        {!isEditMode && (
                            <ToggleButtonGroup
                                value={userFormType}
                                exclusive
                                onChange={(e, newValue) => {
                                    if (newValue) setUserFormType(newValue);
                                }}
                                size="small"
                            >
                                <ToggleButton value="Individual">Individual</ToggleButton>
                                <ToggleButton value="Business">Business</ToggleButton>
                            </ToggleButtonGroup>
                        )}
                    </Box>
                    <AppFormField
                        title="Reference #"
                        value={formData.referenceNumber}
                        disabled
                        required={true}
                    />
                    <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1}}>
                        <AppFormField
                            title={userFormType === 'Business' ? 'Business Name' : 'Name'}
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required={true}

                        />
                        <AppFormField
                            title={userFormType === 'Business' ? 'Business Short Name' : 'Guardian Name'}
                            value={userFormType === 'Business' ? formData.shortName : formData.sirName}
                            onChange={(e) => handleInputChange(userFormType === 'Business' ? 'shortName' : 'sirName', e.target.value)}
                            required={userFormType === 'Business'}

                        />
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1}}>
                        <AppFormField
                            title="Mobile 1"
                            value={formData.phone1}
                            onChange={(e) => handleInputChange('phone1', formatPKMobile(e.target.value))}
                            required={true}

                        />
                        <AppFormField
                            title="Mobile 2"
                            value={formData.phone2}
                            onChange={(e) => handleInputChange('phone2', formatPKMobile(e.target.value))}
                        />
                    </Box>

                    {/* Mobile 3 and Email */}
                    <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1}}>
                        <AppFormField
                            title="Mobile 3"
                            value={formData.phone3}
                            onChange={(e) => handleInputChange('phone3', formatPKMobile(e.target.value))}
                        />
                        <AppFormField
                            title="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1}}>
                        <AppDropDownField
                            title="Identity Type"
                            options={getFilteredIdentityTypes()}
                            value={formData.identityType}
                            onChange={(e) => handleIdentityTypeChange(e.target.value)}
                            required={true}

                        />
                        <AppFormField
                            title={userFormType === 'Business' ? 'NTN Number' : (getSelectedIdentityType()?.title || 'UUID')}
                            value={formData.uuid}
                            onChange={(e) => {
                                const selectedType = getSelectedIdentityType();
                                const value = selectedType?.title === "CNIC" ? formatCNIC(e.target.value) : e.target.value;
                                handleInputChange('uuid', value);
                            }}
                            disabled={!formData.identityType}
                            required={true}

                        />
                    </Box>


                    {userFormType === 'Individual' && (
                        <>
                            <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1}}>
                                <AppDropDownField
                                    title="Occupation Type"
                                    options={occupationTypes.map(ot => ({label: ot.title, value: ot.id}))}
                                    value={formData.occupationId}
                                    onChange={(e) => handleInputChange('occupationId', e.target.value)}
                                    required={true}

                                />
                                <AppFormField
                                    title="Organization/Business Name"
                                    value={formData.occupationName}
                                    onChange={(e) => handleInputChange('occupationName', e.target.value)}
                                    disabled={!formData.occupationId}

                                />
                            </Box>
                        </>
                    )}

                    <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between",mb:1}}>
                        <AppDropDownField
                            title="Status"
                            options={getStatusOptions()}
                            value={formData.userStatusId}
                            onChange={(e) => handleInputChange('userStatusId', e.target.value)}
                            required={true}
                        />
                        {userFormType === 'Business' ? (
                            <AppFormField
                                title="POC Name"
                                value={formData.pocName}
                                onChange={(e) => handleInputChange('pocName', e.target.value)}
                                required={true}

                            />
                        ):<div style={{width: '102%'}}></div>}




                    </Box>



                    {/* Remarks */}
                    <AppFormField
                        title="Remarks"
                        value={formData.remarks}
                        onChange={(e) => handleInputChange('remarks', e.target.value)}
                    />
                </Paper>

                <Paper elevation={10} variant="outlined" sx={{p: 2, mb: 3, width: "50%"}}>
                    <CustomerUploadSection
                        ref={uploadSectionRef}
                        isEditMode={isEditMode}
                        customerType={userFormType}
                        identityType={getSelectedIdentityType()?.title}
                    />
                </Paper>
            </Box>

            <Box sx={{display: "flex", alignItems: "end", justifyContent: "end", gap: 2}}>
                <AppButton
                    label="Cancel"
                    type="button"
                    onClick={() => navigate('/customers/list')}
                    disabled={loading}
                />
                {!isEditMode && (
                    <AppButton
                        label="Reset"
                        type="button"
                        onClick={resetForm}
                        disabled={loading}
                    />
                )}
                <AppButton
                    label={loading ? <CircularProgress size={20}
                                                       color="inherit"/> : isEditMode ? "Update Customer" : "Save Customer"}
                    type="submit"
                    disabled={loading}
                />
            </Box>
        </Box>
    );
};

export default CreateCustomerPage;
