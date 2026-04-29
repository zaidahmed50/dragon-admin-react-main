import { Box, Typography, Paper, Alert, CircularProgress, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppFormField from "../../common/fromField.jsx";
import AppDropDownField from "../../common/dropdownField.jsx";
import AppDatePicker from "../../common/AppDatePicker.jsx";
import AppTimePicker from "../../common/AppTimePicker.jsx";
import AppButton from "../../common/AppButton.jsx";
import { formatCNIC, formatPKMobile } from "../../helper/formaters.jsx";
import useEmployeeForm from "../../hooks/useEmployeeForm.js";
import { bloodGroups } from "@/utils/constants.js";
import DocumentUploadList from "@/components/employees/EmployeeUploadSection/EmployeeUploadSection.jsx";
import useEmployeeUpload from "./hooks/useUploadSection.js";

const CreateEmployee = () => {
    const navigate = useNavigate();
    const { files, progress, errors, uploadFile, removeFile } = useEmployeeUpload();
    const {
        formData,
        isEditMode,
        designations,
        departments,
        offices,
        userTypes,
        loading,
        submitError,
        submitSuccess,
        validationError,
        accessGroups,
        divisions,
        handleInputChange,
        handleDepartmentChange,
        handleSubmit,
        resetForm,
        setSubmitSuccess,
        setValidationError,
        setSubmitError,
    } = useEmployeeForm(files);
    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 0 }}>
            <Typography variant="h5" gutterBottom>
                {isEditMode ? 'Update Employee Details' : 'Add Employee Details'}
            </Typography>
            <Snackbar
                open={submitSuccess}
                autoHideDuration={6000}
                onClose={() => setSubmitSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="success" onClose={() => setSubmitSuccess(false)}>
                    Employee {isEditMode ? 'updated' : 'created'} successfully!
                </Alert>
            </Snackbar>
            <Snackbar
                open={!!validationError}
                autoHideDuration={6000}
                onClose={() => setValidationError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="warning" onClose={() => setValidationError(null)}>
                    {validationError}
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

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                <Paper elevation={10} variant="outlined" sx={{ p: 2, mb: 3, width: "50%" }}>
                    <Typography variant="h6" gutterBottom>
                        Personal Information
                    </Typography>

                    <AppFormField
                        title={"Employee Code"}
                        value={formData.employeeCode}
                        onChange={(e) => handleInputChange('employeeCode', e.target.value)}
                        disabled={isEditMode}
                        required={true}
                        type={"number"}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <AppFormField
                            title={isEditMode ? "New Password (optional)" : "Password"}
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            required={!isEditMode}
                        />
                        <AppFormField
                            title="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            required={!isEditMode}
                        />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <AppFormField
                            type={"text"}
                            title={"First Name"}
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            required={true}
                        />
                        <AppFormField
                            title={"Guardian Name"}
                            value={formData.sirName}
                            onChange={(e) => handleInputChange('sirName', e.target.value)}
                            required={true}
                        />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <AppFormField
                            title={"Mobile 1"}
                            value={formData.mobile1}
                            required={true}
                            onChange={(e) => handleInputChange('mobile1', formatPKMobile(e.target.value))}
                        />
                        <AppFormField
                            title={"Mobile 2"}
                            value={formData.mobile2}
                            onChange={(e) => handleInputChange('mobile2', formatPKMobile(e.target.value))}
                        />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <AppFormField
                            title={"Mobile 3"}
                            value={formData.mobile3}
                            onChange={(e) => handleInputChange('mobile3', formatPKMobile(e.target.value))}
                        />
                        <AppFormField
                            title={"Email"}
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <AppFormField
                            title={"Temporary Address"}
                            value={formData.temporaryAddress}
                            onChange={(e) => handleInputChange('temporaryAddress', e.target.value)}
                            required={true}
                        />

                        <AppFormField
                            title={"Permanent Address"}
                            value={formData.permanentAddress}
                            onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                            required={true}
                        />
                    </Box>



                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <AppFormField
                            title={"CNIC Number"}
                            value={formData.cnicNumber}
                            onChange={(e) => {
                                handleInputChange('cnicNumber', formatCNIC(e.target.value));
                            }}
                            required={true}
                        />
                        <AppFormField
                            title={"Education"}
                            value={formData.education}
                            onChange={(e) => handleInputChange('education', e.target.value)}
                        />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <AppFormField
                            title={"Emergency Contact Name"}
                            value={formData.emergencyContactName}
                            onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                            required={true}
                        />
                        <AppFormField
                            title={"Emergency Contact Number"}
                            value={formData.emergencyContactNo}
                            onChange={(e) => handleInputChange('emergencyContactNo', formatPKMobile(e.target.value))}
                            required={true}
                        />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <AppDatePicker
                            title="Date of Birth"
                            value={formData.dob}
                            onChange={(newValue) => handleInputChange('dob', newValue)}
                            format="DD-MM-YYYY"
                            required={true}
                        />
                        <AppDropDownField
                            title={"Blood Group"}
                            options={bloodGroups}
                            value={formData.bloodGroup}
                            onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                        />
                    </Box>
                </Paper>

                <Paper elevation={10} variant="outlined" sx={{ p: 2, mb: 3, width: "50%" }}>
                    <DocumentUploadList
                        files={files}
                        progress={progress}
                        errors={errors}
                        uploadFile={uploadFile}
                        removeFile={removeFile}
                    />
                </Paper>
            </Box>

            <Paper elevation={10} variant="outlined" sx={{ p: 2, mb: 3, width: "100%" }}>
                <Typography variant="h5" gutterBottom>
                    Employment Details
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <AppDatePicker
                        title="Joining Date"
                        value={formData.joiningDate}
                        onChange={(newValue) => handleInputChange('joiningDate', newValue)}
                        format="DD-MM-YYYY"
                        required={true}
                    />
                    <AppTimePicker
                        title={"Duty Start Time"}
                        value={formData.dutyStartTime}
                        onChange={(newValue) => handleInputChange('dutyStartTime', newValue)}
                        format="hh:mm A"
                        required={true}
                        ampm={true}
                    />
                    <AppTimePicker
                        title={"Duty End Time"}
                        value={formData.dutyEndTime}
                        onChange={(newValue) => handleInputChange('dutyEndTime', newValue)}
                        format="hh:mm A"
                        required={true}
                        ampm={true}

                    />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <AppFormField
                        title={"Basic Salary Per Month"}
                        type="number"
                        value={formData.basicSalary}
                        onChange={(e) => handleInputChange('basicSalary', e.target.value)}
                        required={true}
                    />
                    <AppFormField
                        title={"Referred by"}
                        value={formData.referredBy}
                        onChange={(e) => handleInputChange('referredBy', e.target.value)}
                    />
                    <AppDropDownField
                        title={"Department"}
                        options={departments}
                        value={formData.departmentId}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        required={true}
                    />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <AppDropDownField
                        title="Designation(s)"
                        options={designations}
                        value={formData.designationIds}
                        onChange={(e) => handleInputChange('designationIds', e.target.value)}
                        disabled={!formData.departmentId}
                        required={true}
                        multiple={true}
                    />
                    <AppDropDownField
                        title={"Office Location"}
                        options={offices}
                        value={formData.officeId}
                        onChange={(e) => handleInputChange('officeId', e.target.value)}
                        required={true}
                    />
                    <AppDropDownField
                        title={"Status"}
                        options={userTypes}
                        value={formData.statusId}
                        onChange={(e) => handleInputChange('statusId', e.target.value)}
                        required={true}
                    />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ width: "33%" }}>
                        <AppDropDownField
                            title="Division"
                            options={divisions}
                            value={formData.divisionId}
                            onChange={(e) => handleInputChange('divisionId', e.target.value)}
                            required
                        />
                    </Box>
                    <Box sx={{ width: "33%" }}>
                        <AppDropDownField
                            title="Access Group"
                            options={accessGroups}
                            value={formData.accessGroupId}
                            onChange={(e) => handleInputChange('accessGroupId', e.target.value)}
                        />
                    </Box>
                </Box>
            </Paper>

            <Box sx={{ display: "flex", alignItems: "end", justifyContent: "end",gap:3}}>
                <AppButton
                    label={"Cancel"}
                    type="button"
                    onClick={() => navigate('/employee/list')}
                    disabled={loading}

                />
                {!isEditMode && (
                    <AppButton
                        label={"Reset"}
                        type="button"
                        onClick={resetForm}
                        disabled={loading}
                        color={"red"}
                    />
                )}
                <AppButton
                    label={loading ? <CircularProgress size={20} color="inherit" /> : isEditMode ? "Update Employee" : "Save Employee"}
                    type="submit"
                    disabled={loading}

                />
            </Box>
        </Box>
    );
};

export default CreateEmployee;