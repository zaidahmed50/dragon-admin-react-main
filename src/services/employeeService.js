import apiService from "./apiService.js";
import {ApiUrls} from "./index.js";
import accessGroupService from "./accessGroupService.js";

const fetchEmployeeCode = async () => {
    try {
        const response = await apiService.get(ApiUrls.createEmployeeCode);
        return response.data;
    } catch (error) {
        console.error("Error getting employee code:", error);
        throw error;
    }
};

const fetchEmployee = async (params={}) => {
    try {
        const response = await apiService.post(ApiUrls.getEmployee,params);
        if (response?.data) {
            return response;
        }
        return [];
    } catch (error) {
        console.error("Error getting Employees:", error);
        throw error;
    }
};

const fetchDepartments = async () => {
    try {
        const response = await apiService.get(ApiUrls.getDepartments);
        if (response?.data) {
            return response.data.map((item) => ({
                label: item.name,
                value: item.id,
            }));
        }
        return [];
    } catch (error) {
        console.error("Error getting departments:", error);
        throw error;
    }
};

const fetchDesignationsByDepartment = async (departmentId) => {
    if (!departmentId) return [];
    try {
        const response = await apiService.get(
            `${ApiUrls.getDesignationsByDepartment}${departmentId}`
        );
        if (response?.data) {
            return response.data.map((item) => ({
                label: item.name,
                value: item.id,
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching designations:", error);
        throw error;
    }
};

const fetchOffices = async () => {
    try {
        const response = await apiService.get(ApiUrls.getOffices);
        if (response?.data) {
            return response.data.map((item) => ({
                label: item.officeName,
                value: item.id,
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching offices:", error);
        throw error;
    }
};

const fetchAccessGroups = async () => {
    try {
        const response = await accessGroupService.getAllAccessGroups();
        const data = response?.data || response?.body?.data || [];
        return data.map((item) => ({
            label: item.groupName,
            value: item.id,
        }));
    } catch (error) {
        console.error("Error fetching access groups:", error);
        return [];
    }
};

const fetchUserTypes = async () => {
    try {
        const response = await apiService.get(ApiUrls.getUserStatus);
        if (response?.data) {
            return response.data.map((item) => ({
                label: item.name,
                value: item.id,
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching user status:", error);
        throw error;
    }
};

const createEmployee = async (formData, files) => {
    try {
        const formDataToSend = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                if (Array.isArray(formData[key])) {
                    formData[key].forEach(val => formDataToSend.append(key, val));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            }
        });
        
        // Append files if they exist
        if (files) {
            if (files.cnicFront instanceof File) formDataToSend.append('cnicFront', files.cnicFront);
            if (files.cnicBack instanceof File) formDataToSend.append('cnicBack', files.cnicBack);
            if (files.profilePicture instanceof File) formDataToSend.append('profilePicture', files.profilePicture);
            if (files.educationProof instanceof File) formDataToSend.append('educationProof', files.educationProof);
            if (files.experienceLetter instanceof File) formDataToSend.append('experienceLetter', files.experienceLetter);
        }
        
        console.log('=== CREATING EMPLOYEE - FILES TO UPLOAD ===');
        console.log('Files object:', files);
        if (files) {
            console.log('CNIC Front:', files.cnicFront instanceof File ? files.cnicFront.name : 'Not a file');
            console.log('CNIC Back:', files.cnicBack instanceof File ? files.cnicBack.name : 'Not a file');
            console.log('Profile Picture:', files.profilePicture instanceof File ? files.profilePicture.name : 'Not a file');
            console.log('Education Proof:', files.educationProof instanceof File ? files.educationProof.name : 'Not a file');
            console.log('Experience Letter:', files.experienceLetter instanceof File ? files.experienceLetter.name : 'Not a file');
        }
        console.log('=== END FILES ===');
        
        return await apiService.upload(ApiUrls.createEmployee, formDataToSend);
    } catch (error) {
        console.error("Error creating employee:", error);
        throw error;
    }
};

const updateEmployee = async (formData, files) => {
    try {
        const formDataToSend = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                if (Array.isArray(formData[key])) {
                    formData[key].forEach(val => formDataToSend.append(key, val));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            }
        });
        
        // Append files if they exist and are new files (File instances)
        if (files) {
            if (files.cnicFront instanceof File) formDataToSend.append('cnicFront', files.cnicFront);
            if (files.cnicBack instanceof File) formDataToSend.append('cnicBack', files.cnicBack);
            if (files.profilePicture instanceof File) formDataToSend.append('profilePicture', files.profilePicture);
            if (files.educationProof instanceof File) formDataToSend.append('educationProof', files.educationProof);
            if (files.experienceLetter instanceof File) formDataToSend.append('experienceLetter', files.experienceLetter);
        }
        
        console.log('=== UPDATING EMPLOYEE - FILES TO UPLOAD ===');
        console.log('Files object:', files);
        if (files) {
            console.log('CNIC Front:', files.cnicFront instanceof File ? files.cnicFront.name : files.cnicFront || 'Not uploaded');
            console.log('CNIC Back:', files.cnicBack instanceof File ? files.cnicBack.name : files.cnicBack || 'Not uploaded');
            console.log('Profile Picture:', files.profilePicture instanceof File ? files.profilePicture.name : files.profilePicture || 'Not uploaded');
            console.log('Education Proof:', files.educationProof instanceof File ? files.educationProof.name : files.educationProof || 'Not uploaded');
            console.log('Experience Letter:', files.experienceLetter instanceof File ? files.experienceLetter.name : files.experienceLetter || 'Not uploaded');
        }
        console.log('=== END FILES ===');
        
        return await apiService.upload(ApiUrls.updateEmployee, formDataToSend);
    } catch (error) {
        console.error("Error updating employee:", error);
        throw error;
    }
};

const getPerformanceReport = async (employeeId, period = 'MONTHLY') => {
    try {
        const url = ApiUrls.employeePerformance(employeeId, period);
        const response = await apiService.get(url);
        return response?.data ?? response;
    } catch (error) {
        console.error('Error fetching performance report:', error);
        throw error;
    }
};

const importEmployee = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        return await apiService.upload(ApiUrls.importEmployee, formData);
    } catch (error) {
        console.error("Error importing employees:", error);
        throw error;
    }
};

const exportEmployee = async () => {
    try {
        return await apiService.download(ApiUrls.exportEmployee, `employees_export.zip`, {});
    } catch (error) {
        console.error("Error exporting employees:", error);
        throw error;
    }
};

export const employeeService = {
    fetchEmployeeCode,
    fetchEmployee,
    fetchDepartments,
    fetchDesignationsByDepartment,
    fetchOffices,
    fetchUserTypes,
    fetchAccessGroups,
    createEmployee,
    updateEmployee,
    importEmployee,
    exportEmployee,
    getPerformanceReport,
};
export default employeeService;
