import {useState, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {validateEmployeeForm} from "../helper/validationHelper.js";
import {employeeService} from "../services/employeeService.js";
import {useDivisions} from "./useDivisions.js";
import {transformEmployeeData} from "@/components/employees/hooks/employeeUtils.js";

// Enable custom parse format plugin for dayjs
dayjs.extend(customParseFormat);

// Helper function to parse dates from various formats
const parseDate = (dateString, defaultDate) => {
    if (!dateString) return defaultDate;
    
    // Try different date formats
    const formats = ['YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY', 'DD/MM/YYYY', 'MM/DD/YYYY'];
    
    for (const format of formats) {
        const parsed = dayjs(dateString, format, true);
        if (parsed.isValid()) {
            console.log(`Parsed date "${dateString}" using format ${format}:`, parsed.format('YYYY-MM-DD'));
            return parsed;
        }
    }
    
    // Fallback to default dayjs parsing
    const parsed = dayjs(dateString);
    if (parsed.isValid()) {
        console.log(`Parsed date "${dateString}" using default parsing:`, parsed.format('YYYY-MM-DD'));
        return parsed;
    }
    
    console.warn(`Failed to parse date: "${dateString}", using default`);
    return defaultDate;
};

// Helper function to parse time from various formats
const parseTime = (timeString, defaultTime) => {
    if (!timeString) return defaultTime;
    
    // Try different time formats
    const formats = ['h:mm a', 'h:mm A', 'HH:mm:ss', 'HH:mm', 'hh:mm a', 'hh:mm A'];
    
    for (const format of formats) {
        const parsed = dayjs(timeString, format, true);
        if (parsed.isValid()) {
            console.log(`Parsed time "${timeString}" using format ${format}:`, parsed.format('HH:mm:ss'));
            return parsed;
        }
    }
    
    console.warn(`Failed to parse time: "${timeString}", using default`);
    return defaultTime;
};

const useEmployeeForm = (files) => {
    const {divisions} = useDivisions();
    const location = useLocation();
    const navigate = useNavigate();
    const employeeDataFromState = location.state?.employeeData;
    const isEditMode = !!employeeDataFromState;

    const [formData, setFormData] = useState({
        employeeCode: "",
        firstName: "",
        sirName: "",
        mobile1: "",
        mobile2: "",
        mobile3: "",
        divisionId: "",
        accessGroupId: "",
        email: "",
        temporaryAddress: "",
        permanentAddress: "",
        cnicNumber: "",
        education: "",
        emergencyContactName: "",
        emergencyContactNo: "",
        dob: dayjs().year(1970).month(1).date(1),
        bloodGroup: "",
        joiningDate: dayjs(),
        dutyStartTime: dayjs().hour(9).minute(0),
        dutyEndTime: dayjs().hour(17).minute(0),
        basicSalary: "",
        referredBy: "",
        departmentId: "",
        designationIds: [],
        officeId: "",
        statusId: "",
        userTypeId:"1",
        password: "",
        confirmPassword: "",
    });

    const [designations, setDesignations] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [offices, setOffices] = useState([]);
    const [userTypes, setUserTypes] = useState([]);
    const [accessGroups, setAccessGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [previousDepartmentId, setPreviousDepartmentId] = useState("");

    useEffect(() => {
        if (!isEditMode) {
            employeeService.fetchEmployeeCode().then((code) => {
                setFormData((prev) => ({...prev, employeeCode: code}));
            });
        } else if (employeeDataFromState) {
            // Populate form data in edit mode, leaving statusId and divisionId to be set by other effects
            console.log('Loading employee data for edit:', employeeDataFromState);
            
            setFormData(prev => ({
                ...prev,
                employeeCode: employeeDataFromState.employeeCode || "",
                firstName: employeeDataFromState.name || "",
                sirName: employeeDataFromState.sirName || "",
                mobile1: employeeDataFromState.phone1 || "",
                mobile2: employeeDataFromState.phone2 || "",
                mobile3: employeeDataFromState.phone3 || "",
                email: employeeDataFromState.email || "",
                temporaryAddress: employeeDataFromState.temporaryAddress || "",
                permanentAddress: employeeDataFromState.permanentAddress || "",
                cnicNumber: employeeDataFromState.uuid || "",
                education: employeeDataFromState.education || "",
                emergencyContactName: employeeDataFromState.emergencyContactName || "",
                emergencyContactNo: employeeDataFromState.emergencyContactNo || "",
                // Parse dates using helper function to handle multiple formats
                dob: parseDate(employeeDataFromState.dob, dayjs().year(1970).month(1).date(1)),
                bloodGroup: employeeDataFromState.bloodGroup || "",
                joiningDate: parseDate(employeeDataFromState.joiningDate, dayjs()),
                // Parse times using helper function to handle multiple formats
                dutyStartTime: parseTime(employeeDataFromState.dutyStartTime, dayjs().hour(9).minute(0)),
                dutyEndTime: parseTime(employeeDataFromState.dutyEndTime, dayjs().hour(17).minute(0)),
                basicSalary: employeeDataFromState.basicSalaryPerMonth || "",
                referredBy: employeeDataFromState.referredBy || "",
                departmentId: employeeDataFromState.department?.id || "",
                designationIds: Array.isArray(employeeDataFromState.designation)
                    ? employeeDataFromState.designation.map(d => d.id)
                    : employeeDataFromState.designation?.id ? [employeeDataFromState.designation.id] : [],
                departmentId: Array.isArray(employeeDataFromState.designation) && employeeDataFromState.designation.length > 0
                    ? (employeeDataFromState.designation[0].department?.id || employeeDataFromState.department?.id || "")
                    : employeeDataFromState.department?.id || "",
                officeId: employeeDataFromState.officesLocations?.id || "",
                accessGroupId: employeeDataFromState.accessGroupId || "",
                userTypeId: "1",
            }));
            const resolvedDeptId = Array.isArray(employeeDataFromState.designation) && employeeDataFromState.designation.length > 0
                ? (employeeDataFromState.designation[0].department?.id || employeeDataFromState.department?.id || "")
                : employeeDataFromState.department?.id || "";
            setPreviousDepartmentId(resolvedDeptId);
        }
    }, [isEditMode, employeeDataFromState]);

    useEffect(() => {
        employeeService.fetchDepartments().then(setDepartments);
        employeeService.fetchOffices().then(setOffices);
        employeeService.fetchUserTypes().then(setUserTypes);
        employeeService.fetchAccessGroups().then(setAccessGroups);
    }, []);

    // Effect to set division from employee data
    useEffect(() => {
        console.log('Division effect triggered');
        console.log('isEditMode:', isEditMode);
        console.log('divisions.length:', divisions.length);
        console.log('employeeDataFromState?.division:', employeeDataFromState?.division);
        
        if (isEditMode && divisions.length > 0 && employeeDataFromState?.division) {
            const divisionValue = employeeDataFromState.division;
            console.log('=== DIVISION MATCHING START ===');
            console.log('Looking for division:', divisionValue);
            console.log('Type of division value:', typeof divisionValue);
            console.log('Available divisions:', JSON.stringify(divisions, null, 2));
            
            // Try to match by: 1) value (id), 2) code, 3) label (title)
            const division = divisions.find(d => {
                const labelUpper = d.label?.toUpperCase();
                const valueUpper = String(divisionValue).toUpperCase();
                const codeUpper = d.code?.toUpperCase();
                
                console.log(`Checking division:`, {
                    id: d.value,
                    code: d.code,
                    label: d.label,
                    matches: {
                        byValue: d.value === divisionValue,
                        byCode: d.code === divisionValue,
                        byCodeUpper: codeUpper === valueUpper,
                        byLabel: d.label === divisionValue,
                        byLabelUpper: labelUpper === valueUpper
                    }
                });
                
                return d.value === divisionValue ||
                       d.code === divisionValue ||
                       codeUpper === valueUpper ||
                       d.label === divisionValue ||
                       labelUpper === valueUpper ||
                       labelUpper?.includes(valueUpper) ||
                       valueUpper?.includes(labelUpper);
            });
            
            if (division) {
                console.log('✓ Found division:', division);
                console.log('Setting divisionId to:', division.value);
                setFormData(prev => {
                    console.log('Previous divisionId:', prev.divisionId);
                    return { ...prev, divisionId: division.value };
                });
            } else {
                console.error('✗ Division NOT found for value:', divisionValue);
                console.error('Available division codes:', divisions.map(d => d.code));
                console.error('Available division IDs:', divisions.map(d => d.value));
            }
            console.log('=== DIVISION MATCHING END ===');
        } else {
            if (!isEditMode) console.log('Not in edit mode');
            if (divisions.length === 0) console.log('Divisions not loaded yet');
            if (!employeeDataFromState?.division) console.log('No division in employee data');
        }
    }, [isEditMode, divisions, employeeDataFromState]);

    // Effect to set status from employee data
    useEffect(() => {
        if (isEditMode && userTypes.length > 0 && employeeDataFromState?.status) {
            const statusValue = employeeDataFromState.status;
            // Try to match by value (id) first, then by label (name), case-insensitive
            const status = userTypes.find(s => 
                s.value === statusValue || 
                s.label === statusValue ||
                s.label?.toUpperCase() === statusValue?.toUpperCase() ||
                s.label?.replace(/\s+/g, '_').toUpperCase() === statusValue?.toUpperCase()
            );
            if (status) {
                setFormData(prev => ({ ...prev, statusId: status.value }));
            } else {
                console.warn(`Status not found for value: ${statusValue}`);
            }
        }
    }, [isEditMode, userTypes, employeeDataFromState]);

    useEffect(() => {
        if (formData.departmentId) {
            employeeService
                .fetchDesignationsByDepartment(formData.departmentId)
                .then(setDesignations);
        }
    }, [formData.departmentId]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDepartmentChange = (newDepartmentId) => {
        handleInputChange("departmentId", newDepartmentId);
        setPreviousDepartmentId(newDepartmentId);
        // Do NOT reset designationIds — user may have already selected some
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError(null);
        setSubmitError(null);

        const validationErrorMsg = validateEmployeeForm(formData);
        if (validationErrorMsg) {
            setValidationError(validationErrorMsg);
            return;
        }

        // Password validation
        if (!isEditMode && !formData.password) {
            setValidationError("Password is required.");
            return;
        }
        if (formData.password && formData.password.length < 6) {
            setValidationError("Password must be at least 6 characters.");
            return;
        }
        if (formData.password && formData.password !== formData.confirmPassword) {
            setValidationError("Password and Confirm Password do not match.");
            return;
        }

        setLoading(true);

        try {
            const formDataToSend = transformEmployeeData(formData, files, isEditMode, employeeDataFromState);
            console.log(formDataToSend);
            const response = isEditMode
                ? await employeeService.updateEmployee(formDataToSend, files)
                : await employeeService.createEmployee(formDataToSend, files);

            if (response.success !== false) {
                setSubmitSuccess(true);
                setTimeout(() => {
                    navigate("/employee/list");
                }, 1500);
            } else {
                setSubmitError(
                    response.message ||
                    `Failed to ${isEditMode ? "update" : "create"} employee. Please try again.`
                );
            }
        } catch (error) {
            setSubmitError(
                error.message ||
                `An error occurred while ${isEditMode ? "updating" : "creating"
                } the employee. Please check your connection and try again.`
            );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            employeeCode: "",
            firstName: "",
            guardianName: "",
            mobile1: "",
            mobile2: "",
            mobile3: "",
            divisionId: "",
            email: "",
            temporaryAddress: "",
            permanentAddress: "",
            cnicNumber: "",
            education: "",
            emergencyContactName: "",
            emergencyContactNumber: "",
            dateOfBirth: dayjs().year(1970).month(1).date(1),
            bloodGroup: "",
            joiningDate: dayjs(),
            dutyStartTime: dayjs().hour(9).minute(0),
            dutyEndTime: dayjs().hour(17).minute(0),
            basicSalary: "",
            referredBy: "",
            departmentId: "",
            designationIds: [],
            officeId: "",
            statusId: "",
            password: "",
            confirmPassword: "",
        });
        setValidationError(null);
        setSubmitError(null);
        setPreviousDepartmentId("");
    };

    return {
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
    };
};

export default useEmployeeForm;