/**
 * API Endpoints Configuration
 * Centralized location for all API endpoints
 */

const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/authentication/login-user',
        LOGOUT: '/authentication/logout',
        REFRESH_TOKEN: '/authentication/refresh-token',
        FORGOT_PASSWORD: '/authentication/forgot-password',
        RESET_PASSWORD: '/authentication/reset-password',
        CHANGE_PASSWORD: '/authentication/change-password',
        VERIFY_EMAIL: '/authentication/verify-email',
        RESEND_VERIFICATION: '/authentication/resend-verification',
    },

    // Users
    USERS: {
        GET_ALL: '/users',
        GET_BY_ID: (id) => `/users/${id}`,
        CREATE: '/users',
        UPDATE: (id) => `/users/${id}`,
        DELETE: (id) => `/users/${id}`,
        SEARCH: '/users/search',
        GET_STATUS_TYPES: '/users/get-all-user-statutes-types',
        GET_USER_TYPES: '/users/get-all-user-types',
        SEARCH_BY_EMAIL: '/search-user-by-email',
        SEARCH_BY_UUID: '/users/search-user-by-uuid',
        GET_OCCUPATION_TYPES: '/users/get-all-user-occupation-types',
        GET_IDENTITY_TYPES: '/users/get-all-user-identity-types',
        CHECK_EXISTS: '/users/search-user-by-uuid-phones',
        GET_BY_REF_NO: '/users/search-user-by-ref-no',
    },

    // Employees
    EMPLOYEES: {
        GET_ALL: '/employees',
        GET_BY_ID: (id) => `/employees/${id}`,
        CREATE: '/employees/create-employee',
        UPDATE: '/employees/update-employee',
        DELETE: (id) => `/employees/${id}`,
        GENERATE_CODE: '/employees/generate-employee-code',
        GET_EMPLOYEE: '/employees/get-employee',
        GET_BY_USER_ID: '/employees/get-employee-by-id',
    },

    // Departments
    DEPARTMENTS: {
        GET_ALL: '/get-all-departments',
        GET_BY_ID: (id) => `/departments/${id}`,
        CREATE: '/add-new-department',
        UPDATE: '/update-department',
        DELETE: '/delete-department',
    },

    // Designations
    DESIGNATIONS: {
        GET_ALL: '/get-all-designations',
        GET_BY_ID: (id) => `/designations/${id}`,
        CREATE: '/add-new-designation',
        UPDATE: '/update-designation',
        DELETE: '/delete-designation',
        GET_BY_DEPARTMENT: '/get-designations-by-department-id',
    },

    // Office Locations
    OFFICES: {
        GET_ALL: '/get-all-offices',
        GET_BY_ID: (id) => `/offices/${id}`,
        CREATE: '/add-new-office',
        UPDATE: '/update-office',
        DELETE: '/delete-office',
        GET_TYPES: '/office-types',
        GET_ROLES: '/office-roles',
        GET_BY_SUB_AREA: '/get-all-offices-sub-area',
    },

    // Customers
    CUSTOMERS: {
        GET_ALL: '/customer/get-customers',
        GET_BY_ID: (id) => `/customer/${id}`,
        CREATE: '/customer/create-customer',
        UPDATE: '/customer/update-customer',
        DELETE: (id) => `/customer/${id}`,
        GENERATE_REF_NO: '/customer/generate-reference-no',
        GET_BY_USER_ID: '/customer/get-customers-by-user-id',
        GET_NETWORK_TYPES: '/customer/network-types',
        GET_CONNECTION_TYPES: '/customer/connection-types',
    },

    // Profiles
    PROFILES: {
        GET_ALL: '/profiles',
        GET_BY_ID: (id) => `/profiles/${id}`,
        CREATE: '/profiles/create-profile',
        UPDATE: (id) => `/profiles/${id}`,
        DELETE: (id) => `/profiles/${id}`,
    },

    // Areas
    AREAS: {
        MAIN: {
            GET_ALL: '/main-areas/get-all',
            GET_BY_ID: (id) => `/main-areas/${id}`,
            CREATE: '/main-areas/create-main-area',
            UPDATE: (id) => `/main-areas/update/${id}`,
            DELETE: (id) => `/main-areas/delete/${id}`,
        },
        SUB: {
            GET_ALL: '/sub-area/get-all',
            GET_BY_ID: (id) => `/sub-area/${id}`,
            CREATE: '/sub-area/subarea/create',
            UPDATE: (id) => `/sub-area/subarea/update/${id}`,
            DELETE: (id) => `/sub-area/subarea/delete/${id}`,
            GET_BY_MAIN_AREA: (mainAreaId) => `/sub-area/get-all/${mainAreaId}`,
        },
    },

    // Distribution Points
    DISTRIBUTION_POINTS: {
        GET_ALL: '/distribution-points/get-all',
        GET_BY_ID: (id) => `/distribution-points/${id}`,
        CREATE: '/distribution-points/create',
        UPDATE: (id) => `/distribution-points/${id}`,
        DELETE: '/distribution-points/delete',
        GET_BY_SUB_AREA: '/distribution-points/getbySubAreaId',
    },

    // Allowances
    ALLOWANCES: {
        GET_ALL: '/get-all-allowance',
        GET_BY_ID: (id) => `/allowances/${id}`,
        CREATE: '/add-allowance',
        UPDATE: '/update-allowance',
        DELETE: '/delete-allowance',
    },

    // Promotions
    PROMOTIONS: {
        GET_ALL: '/promotions/get-all',
        GET_BY_ID: (id) => `/promotions/${id}`,
        CREATE: '/promotions/create',
        UPDATE: '/promotions/update',
        DELETE: '/promotions/delete',
    },

    // IP Pools
    IP_POOLS: {
        GET_ALL: '/ip/ip-pool/get-all',
        GET_BY_ID: (id) => `/ip/ip-pool/${id}`,
        CREATE: '/ip/ip-pool/create-ip-pool',
        UPDATE: '/ip/ip-pool/update',
        DELETE: '/ip/ip-pool/delete',
        GET_CUTTINGS: '/ip/ip-cutting/get-all',
    },

    // Geo Coding
    GEO_CODING: {
        LAT_LNG_TO_ADDRESS: '/geo-coding/to-lat-lng',
        ADDRESS_TO_LAT_LNG: '/geo-coding/to-address',
    },

    // User Connections
    USER_CONNECTIONS: {
        GET_ALL: '/user-connections',
        GET_BY_ID: (id) => `/user-connections/${id}`,
        CREATE: '/user-connections/create',
        UPDATE: (id) => `/user-connections/${id}`,
        DELETE: (id) => `/user-connections/${id}`,
        GENERATE_SALE_ID: '/user-connections/fresh-sid',
        GET_STATUSES: '/user-connections/get-all-connection-statuses',
        GET_CITIES: '/user-connections/get-all-cities',
        SEARCH: '/user-connections/search-user-connections',
    },

    // Calculations
    CALCULATIONS: {
        GET_TAXES: '/calculate/get-taxes',
        CALCULATE_BILL: '/calculate/bill',
    },

    // Permissions
    PERMISSIONS: {
        GROUPS: {
            GET_ALL: '/permissionGroup/get',
            GET_BY_ID: (id) => `/permissionGroup/${id}`,
            CREATE: '/permissionGroup/groupName',
            UPDATE: (id) => `/permissionGroup/update/${id}`,
            DELETE: (id) => `/permissionGroup/delete/${id}`,
            ADD_PERMISSIONS: '/permissionGroup/addPermissions',
            GET_AVAILABLE: '/permissionGroup/available',
            GET_ASSIGNED: '/permissionGroup/assign',
        },
    },

    // Managers
    MANAGERS: {
        GET_ALL: '/managers',
        GET_BY_ID: (id) => `/managers/${id}`,
        CREATE: '/managers/addManger',
        UPDATE: '/managers/edit',
        DELETE: '/managers/delete',
    },

    // File Upload/Download
    FILES: {
        UPLOAD: '/files/upload',
        DOWNLOAD: (id) => `/files/download/${id}`,
        DELETE: (id) => `/files/${id}`,
    },

    // Reports
    REPORTS: {
        SALES: '/reports/sales',
        CUSTOMERS: '/reports/customers',
        EMPLOYEES: '/reports/employees',
        REVENUE: '/reports/revenue',
        EXPORT: '/reports/export',
    },

    // Support Tickets
    TICKETS: {
        SEARCH: '/support/search',
        CREATE: '/support/create',
        ASSIGN: '/support/assign-ticket',
        UPDATE_PRIORITY: '/support/update-priority',
        UPDATE_STATUS: '/support/update',
    },
};

export default API_ENDPOINTS;
