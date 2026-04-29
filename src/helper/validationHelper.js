/**
 * Validation Patterns and Utility Functions
 * Central location for all validation rules and patterns
 */


export const ValidationPatterns = {
    // Pakistani mobile number: 03XXXXXXXXX (11 digits starting with 03)
    pakistaniMobile: /^03[0-9]{9}$/,
    
    // Email validation
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    
    // CNIC: 13 digits (e.g., 3520212345678)
    cnic: /^[0-9]{13}$/,
    
    // Letters only (including spaces)
    lettersOnly: /^[a-zA-Z\s]+$/,
    
    // Alphanumeric with spaces
    alphanumeric: /^[a-zA-Z0-9\s]+$/,
    
    // Numbers only
    numbersOnly: /^[0-9]+$/,
    
    // Decimal numbers (for prices, amounts)
    decimal: /^\d+(\.\d{1,2})?$/,
    
    // IP Address (IPv4)
    ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    
    // URL validation
    url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    
    // Postal code (Pakistan: 5 digits)
    postalCode: /^[0-9]{5}$/,
};

// ============================================
// VALIDATION MESSAGES
// ============================================

export const ValidationMessages = {
    required: (field) => `${field} is required`,
    minLength: (field, length) => `${field} must be at least ${length} characters`,
    maxLength: (field, length) => `${field} cannot exceed ${length} characters`,
    invalidFormat: (field) => `Invalid ${field} format`,
    
    email: {
        required: "Email is required",
        invalid: "Invalid email format",
    },
    
    mobile: {
        required: "Mobile number is required",
        invalid: "Mobile number must be a valid Pakistani number (03XXXXXXXXX)",
    },
    
    cnic: {
        required: "CNIC number is required",
        invalid: "CNIC must be 13 digits (e.g., 3520212345678)",
    },
    
    name: {
        required: "Name is required",
        minLength: "Name must be at least 2 characters",
        maxLength: "Name cannot exceed 50 characters",
        lettersOnly: "Name can only contain letters",
    },
    
    address: {
        required: "Address is required",
        minLength: "Address must be at least 10 characters",
        maxLength: "Address cannot exceed 200 characters",
    },
    
    salary: {
        required: "Salary is required",
        positive: "Salary must be a positive number",
        min: "Salary must be at least 1000",
        max: "Salary cannot exceed 1,000,000",
    },
    
    date: {
        required: "Date is required",
        futureNotAllowed: "Date cannot be in the future",
        pastNotAllowed: "Date cannot be in the past",
    },
    
    time: {
        required: "Time is required",
        endAfterStart: "End time must be after start time",
    },
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return ValidationMessages.required(fieldName);
    }
    return null;
};

/**
 * Validate minimum length
 */
export const validateMinLength = (value, minLength, fieldName) => {
    if (value && typeof value === 'string' && value.trim().length < minLength) {
        return ValidationMessages.minLength(fieldName, minLength);
    }
    return null;
};

/**
 * Validate maximum length
 */
export const validateMaxLength = (value, maxLength, fieldName) => {
    if (value && typeof value === 'string' && value.trim().length > maxLength) {
        return ValidationMessages.maxLength(fieldName, maxLength);
    }
    return null;
};

/**
 * Validate pattern match
 */
export const validatePattern = (value, pattern, errorMessage) => {
    if (value && !pattern.test(value)) {
        return errorMessage;
    }
    return null;
};

/**
 * Validate email
 */
export const validateEmail = (email, isRequired = true) => {
    if (isRequired) {
        const requiredError = validateRequired(email, 'Email');
        if (requiredError) return requiredError;
    }
    
    if (email && !ValidationPatterns.email.test(email)) {
        return ValidationMessages.email.invalid;
    }
    return null;
};

/**
 * Validate name (letters only)
 */
export const validateName = (name, fieldName = 'Name', minLength = 2, maxLength = 50, isRequired = true) => {
    if (isRequired) {
        const requiredError = validateRequired(name, fieldName);
        if (requiredError) return requiredError;
    }
    
    // if (name) {
    //     const minLengthError = validateMinLength(name, minLength, fieldName);
    //     if (minLengthError) return minLengthError;
    //
    //     const maxLengthError = validateMaxLength(name, maxLength, fieldName);
    //     if (maxLengthError) return maxLengthError;
    //
    //     if (!ValidationPatterns.lettersOnly.test(name)) {
    //         return `${fieldName} can only contain letters`;
    //     }
    // }
    return null;
};

/**
 * Validate address
 */
export const validateAddress = (address, fieldName = 'Address', minLength = 10, maxLength = 200, isRequired = true) => {
    if (isRequired) {
        const requiredError = validateRequired(address, fieldName);
        if (requiredError) return requiredError;
    }
    
    if (address) {
        const minLengthError = validateMinLength(address, minLength, fieldName);
        if (minLengthError) return minLengthError;
        
        const maxLengthError = validateMaxLength(address, maxLength, fieldName);
        if (maxLengthError) return maxLengthError;
    }
    return null;
};

/**
 * Validate number range
 */
export const validateNumberRange = (value, min, max, fieldName, isRequired = true) => {
    if (isRequired) {
        const requiredError = validateRequired(value, fieldName);
        if (requiredError) return requiredError;
    }
    
    if (value !== null && value !== undefined && value !== '') {
        const numValue = parseFloat(value);
        
        if (isNaN(numValue)) {
            return `${fieldName} must be a valid number`;
        }
        
        if (numValue < min) {
            return `${fieldName} must be at least ${min}`;
        }
        
        if (numValue > max) {
            return `${fieldName} cannot exceed ${max.toLocaleString()}`;
        }
    }
    return null;
};

/**
 * Validate salary
 */
export const validateSalary = (salary, min = 1000, max = 1000000, isRequired = true) => {
    return validateNumberRange(salary, min, max, 'Salary', isRequired);
};

/**
 * Validate date
 */
export const validateDate = (date, fieldName = 'Date', options = {}) => {
    const { isRequired = true, allowFuture = true, allowPast = true } = options;
    
    if (isRequired) {
        const requiredError = validateRequired(date, fieldName);
        if (requiredError) return requiredError;
    }
    
    if (date) {
        const dateObj = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (!allowFuture && dateObj > today) {
            return ValidationMessages.date.futureNotAllowed;
        }
        
        if (!allowPast && dateObj < today) {
            return ValidationMessages.date.pastNotAllowed;
        }
    }
    return null;
};

/**
 * Validate time comparison (end time after start time)
 */
export const validateTimeComparison = (startTime, endTime, startLabel = 'Start time', endLabel = 'End time') => {
    if (!startTime || !endTime) {
        return null; // Let individual validations handle missing values
    }
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (end <= start) {
        return `${endLabel} must be after ${startLabel}`;
    }
    return null;
};

/**
 * Validate IP address
 */
export const validateIPAddress = (ip, isRequired = true) => {
    if (isRequired) {
        const requiredError = validateRequired(ip, 'IP Address');
        if (requiredError) return requiredError;
    }
    
    if (ip && !ValidationPatterns.ipv4.test(ip)) {
        return 'Invalid IP address format';
    }
    return null;
};

/**
 * Validate URL
 */
export const validateURL = (url, isRequired = true) => {
    if (isRequired) {
        const requiredError = validateRequired(url, 'URL');
        if (requiredError) return requiredError;
    }
    
    if (url && !ValidationPatterns.url.test(url)) {
        return 'Invalid URL format';
    }
    return null;
};

// ============================================
// COMPOSITE VALIDATION FUNCTIONS
// ============================================

/**
 * Validate employee form
 */
export const validateEmployeeForm = (formData) => {
    // Employee Code
    let error = validateMinLength(formData.employeeCode, 3, 'Employee code');
    if (error) return error;
    
    // First Name
    error = validateName(formData.firstName, 'First name');
    if (error) return error;
    
    // Guardian Name
    error = validateName(formData.sirName, 'Guardian name');
    if (error) return error;

    // Temporary Address
    error = validateAddress(formData.temporaryAddress, 'Temporary address');
    if (error) return error;
    
    // Permanent Address
    error = validateAddress(formData.permanentAddress, 'Permanent address');
    if (error) return error;

    // Emergency Contact Name
    error = validateName(formData.emergencyContactName, 'Emergency contact name');
    if (error) return error;
    
    // Date of Birth
    error = validateDate(formData.dob, 'Date of birth', { allowFuture: false });
    if (error) return error;
    
    // Blood Group
    error = validateRequired(formData.bloodGroup, 'Blood group');
    if (error) return error;
    
    // Joining Date
    error = validateDate(formData.joiningDate, 'Joining date', { allowFuture: true });
    if (error) return error;
    
    // Duty Times
    error = validateRequired(formData.dutyStartTime, 'Duty start time');
    if (error) return error;
    
    error = validateRequired(formData.dutyEndTime, 'Duty end time');
    if (error) return error;
    
    error = validateTimeComparison(formData.dutyStartTime, formData.dutyEndTime, 'Duty start time', 'Duty end time');
    if (error) return error;
    
    // Basic Salary
    error = validateSalary(formData.basicSalary, 1000, 1000000, true);
    if (error) return error;

    // Designation
    error = validateRequired(formData.designationIds, 'Designation');
    if (error) return error;
    
    // Office
    error = validateRequired(formData.officeId, 'Office location');
    if (error) return error;
    
    // Status
    error = validateRequired(formData.statusId, 'Status');
    if (error) return error;
    
    return null; // No errors
};

export default {
    ValidationPatterns,
    ValidationMessages,
    validateRequired,
    validateMinLength,
    validateMaxLength,
    validatePattern,
    validateEmail,
    validateName,
    validateAddress,
    validateNumberRange,
    validateSalary,
    validateDate,
    validateTimeComparison,
    validateIPAddress,
    validateURL,
    validateEmployeeForm,
};
