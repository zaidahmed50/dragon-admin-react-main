
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_PREFIX = '/api';
const VERSION = '/v1';

export const ApiUrls = {
    baseUrl: BASE_URL,
    baseApi: `${BASE_URL}${API_PREFIX}/`,
    sasLogin: `${BASE_URL}${API_PREFIX}/sasLogin`,
    imageUrl: `${BASE_URL}${API_PREFIX}/`,

    // User
    loginUser: `${BASE_URL}${API_PREFIX}${VERSION}/authentication/login-user`,
    getUserStatus: `${BASE_URL}${API_PREFIX}${VERSION}/users/get-all-user-statutes-types`,
    getUserTypes: `${BASE_URL}${API_PREFIX}${VERSION}/users/get-all-user-types`,
    getOccupations: `${BASE_URL}${API_PREFIX}${VERSION}/users/get-all-user-occupation-types`,
    getSubAdmins: `${BASE_URL}${API_PREFIX}${VERSION}/admin`,
    searchUserByEmail: `${BASE_URL}${API_PREFIX}${VERSION}/search-user-by-email`,
    searchInAllUser: `${BASE_URL}${API_PREFIX}${VERSION}/users/search-in-all-users`,
    checkUserExistenceByUUID: `${BASE_URL}${API_PREFIX}${VERSION}/users/search-user-by-uuid`,

    /// Access Group ///
    createAccessGroup: `${BASE_URL}${API_PREFIX}${VERSION}/accessGroup/create`,
    getAllAccessGroups: `${BASE_URL}${API_PREFIX}${VERSION}/accessGroup/get-all`,
    getAccessGroupById: `${BASE_URL}${API_PREFIX}${VERSION}/accessGroup/get-by-id?id=`,
    updateAccessGroup: `${BASE_URL}${API_PREFIX}${VERSION}/accessGroup/update`,
    deleteAccessGroup: `${BASE_URL}${API_PREFIX}${VERSION}/accessGroup/delete?id=`,
    assignPermissions: `${BASE_URL}${API_PREFIX}${VERSION}/accessGroup/accessPermissions`,
    removePermissions: `${BASE_URL}${API_PREFIX}${VERSION}/accessGroup/accessPermissions/remove`,

    // Employee
    createEmployeeCode: `${BASE_URL}${API_PREFIX}${VERSION}/employees/generate-employee-code`,
    createEmployee: `${BASE_URL}${API_PREFIX}${VERSION}/employees/create-employee`,
    updateEmployee: `${BASE_URL}${API_PREFIX}${VERSION}/employees/update-employee`,
    getEmployee: `${BASE_URL}${API_PREFIX}${VERSION}/employees/get-employee`,
    getEmployeeById: `${BASE_URL}${API_PREFIX}${VERSION}/employees/get-employee-by-id?userId=`,
    importEmployee: `${BASE_URL}${API_PREFIX}${VERSION}/employees/import-employee`,
    exportEmployee: `${BASE_URL}${API_PREFIX}${VERSION}/employees/export-employee`,
    employeePerformance: (id, period) => `${BASE_URL}${API_PREFIX}${VERSION}/employees/performance/${id}?period=${period}`,
    ringEmployee: (id) => `${BASE_URL}${API_PREFIX}${VERSION}/employees/ring/${id}`,

    // Departments
    getDepartments: `${BASE_URL}${API_PREFIX}${VERSION}/get-all-departments`,
    addDepartment: `${BASE_URL}${API_PREFIX}${VERSION}/add-new-department`,
    updateDepartment: `${BASE_URL}${API_PREFIX}${VERSION}/update-department`,
    deleteDepartment: `${BASE_URL}${API_PREFIX}${VERSION}/delete-department?departmentId=`,

    // Designations
    addDesignation: `${BASE_URL}${API_PREFIX}${VERSION}/add-new-designation`,
    updateDesignation: `${BASE_URL}${API_PREFIX}${VERSION}/update-designation`,
    getDesignations: `${BASE_URL}${API_PREFIX}${VERSION}/get-all-designations`,
    deleteDesignation: `${BASE_URL}${API_PREFIX}${VERSION}/delete-designation?designationId=`,
    getDesignationsByDepartment: `${BASE_URL}${API_PREFIX}${VERSION}/get-designations-by-department-id?departmentId=`,

    // Office Locations
    getOfficeTypes: `${BASE_URL}${API_PREFIX}${VERSION}/office-types`,
    getOffices: `${BASE_URL}${API_PREFIX}${VERSION}/get-all-offices`,
    getOfficesBySubArea: `${BASE_URL}${API_PREFIX}${VERSION}/get-all-offices-sub-area?subAreaId=`,
    createNewOfficeLocations: `${BASE_URL}${API_PREFIX}${VERSION}/add-new-office`,
    updateOfficeLocations: `${BASE_URL}${API_PREFIX}${VERSION}/update-office`,
    deleteOfficeLocation: `${BASE_URL}${API_PREFIX}${VERSION}/delete-office?officeId=`,
    getOfficeRoles: `${BASE_URL}${API_PREFIX}${VERSION}/office-roles`,

    

    // NetworkTypes
    getAllNetworkTypes: `${BASE_URL}${API_PREFIX}${VERSION}/customer/network-types`,
    getAllConnectionsTypes: `${BASE_URL}${API_PREFIX}${VERSION}/customer/connection-types`,

    // Profiles
    getAllProfiles: `${BASE_URL}${API_PREFIX}${VERSION}/profiles`,
    addNewProfile: `${BASE_URL}${API_PREFIX}${VERSION}/profiles/create-profile`,
    updateProfiles: `${BASE_URL}${API_PREFIX}${VERSION}/profiles/`,
    deleteProfile: `${BASE_URL}${API_PREFIX}${VERSION}/profiles/`,

    // Areas
    createMainAreas: `${BASE_URL}${API_PREFIX}${VERSION}/main-areas/create-main-area`,
    updateMainAreas: `${BASE_URL}${API_PREFIX}${VERSION}/main-areas/update/`,
    deleteMainAreas: `${BASE_URL}${API_PREFIX}${VERSION}/main-areas/delete/`,
    createSubArea: `${BASE_URL}${API_PREFIX}${VERSION}/sub-area/subarea/create`,
    deleteSubArea: `${BASE_URL}${API_PREFIX}${VERSION}/sub-area/subarea/delete/`,
    updateSubArea: `${BASE_URL}${API_PREFIX}${VERSION}/sub-area/subarea/update/`,
    getAllMainAreas: `${BASE_URL}${API_PREFIX}${VERSION}/main-areas/get-all`,
    getSubAreasByMainArea: `${BASE_URL}${API_PREFIX}${VERSION}/sub-area/get-all/`,

    // Customers
    createCustomer: `${BASE_URL}${API_PREFIX}${VERSION}/customer/create-customer`,
    getCustomers: `${BASE_URL}${API_PREFIX}${VERSION}/customer/get-customers`,
    createCustomerRefNo: `${BASE_URL}${API_PREFIX}${VERSION}/customer/generate-reference-no`,
    getCustomerById: `${BASE_URL}${API_PREFIX}${VERSION}/customer/get-customers-by-user-id?userId=`,
    updateCustomer: `${BASE_URL}${API_PREFIX}${VERSION}/customer/update-customer`,
    importCustomer: `${BASE_URL}${API_PREFIX}${VERSION}/customer/import-customer`,

    // Distribution Port
    createDP: `${BASE_URL}${API_PREFIX}${VERSION}/distribution-points/create`,
    deleteDP: `${BASE_URL}${API_PREFIX}${VERSION}/distribution-points/delete?dpId=`,
    getAllDpPorts: `${BASE_URL}${API_PREFIX}${VERSION}/distribution-points/get-all`,
    getAllDpPortsBySubAreaId: `${BASE_URL}${API_PREFIX}${VERSION}/distribution-points/getbySubAreaId?subAreaId=`,
    getDpNameBySubAreaId: `${BASE_URL}${API_PREFIX}${VERSION}/distribution-points/getsubAreaId?subAreaId=`,

    // Allowance
    addAllowance: `${BASE_URL}${API_PREFIX}${VERSION}/add-allowance`,
    updateAllowance: `${BASE_URL}${API_PREFIX}${VERSION}/update-allowance`,
    deleteAllowance: `${BASE_URL}${API_PREFIX}${VERSION}/delete-allowance?allowanceId=`,
    getAllAllowances: `${BASE_URL}${API_PREFIX}${VERSION}/get-all-allowance`,

    // Geo Coding
    fromLatLngToAddress: `${BASE_URL}${API_PREFIX}${VERSION}/geo-coding/to-lat-lng?address=`,
    fromAddressToLatLng: `${BASE_URL}${API_PREFIX}${VERSION}/geo-coding/to-address?`,

    // Promotions
    getAllPromotions: `${BASE_URL}${API_PREFIX}${VERSION}/promotions/get-all`,
    addNewPromotion: `${BASE_URL}${API_PREFIX}${VERSION}/promotions/create`,
    deletePromotion: `${BASE_URL}${API_PREFIX}${VERSION}/promotions/delete?id=`,
    updatePromotion: `${BASE_URL}${API_PREFIX}${VERSION}/promotions/update`,

    // IP Pools
    getAllPools: `${BASE_URL}${API_PREFIX}${VERSION}/ip/ip-pool/get-all`,
    getAllIpCuttingsByPool: `${BASE_URL}${API_PREFIX}${VERSION}/ip/ip-cutting/get-all?poolId=`,
    createIpPool: `${BASE_URL}${API_PREFIX}${VERSION}/ip/ip-pool/create-ip-pool`,
    updateIpPool: `${BASE_URL}${API_PREFIX}${VERSION}/ip/ip-pool/update`,
    deleteIpPool: `${BASE_URL}${API_PREFIX}${VERSION}/ip/ip-pool/delete?id=`,

    getUserOccupationTypes: `${BASE_URL}${API_PREFIX}${VERSION}/users/get-all-user-occupation-types`,
    getUserIdentityTypes: `${BASE_URL}${API_PREFIX}${VERSION}/users/get-all-user-identity-types`,
    isUserExists: `${BASE_URL}${API_PREFIX}${VERSION}/users/search-user-by-uuid-phones?value=`,
    getUserByRefNo: `${BASE_URL}${API_PREFIX}${VERSION}/users/search-user-by-ref-no?referenceNumber=`,

    // Sale IDs / Connections
    getAllTaxes: `${BASE_URL}${API_PREFIX}${VERSION}/calculate/get-taxes`,
    calculateBill: `${BASE_URL}${API_PREFIX}${VERSION}/calculate/bill`,
    getFreshSaleId: `${BASE_URL}${API_PREFIX}${VERSION}/user-connections/fresh-sid`,
    getConnectionAllStatuses: `${BASE_URL}${API_PREFIX}${VERSION}/user-connections/get-all-connection-statuses`,
    getAllCities: `${BASE_URL}${API_PREFIX}${VERSION}/user-connections/get-all-cities`,
    createConnection: `${BASE_URL}${API_PREFIX}${VERSION}/user-connections/create`,
    getSaleIdConnectionList: `${BASE_URL}${API_PREFIX}${VERSION}/user-connections/search-user-connections`,

    // Permissions
    createGroupName: `${BASE_URL}${API_PREFIX}${VERSION}/permissionGroup/groupName`,
    getAllPermissionGroups: `${BASE_URL}${API_PREFIX}${VERSION}/permissionGroup/get`,
    updatePermissionGroup: `${BASE_URL}${API_PREFIX}${VERSION}/permissionGroup/update/`,
    deletePermissionGroup: `${BASE_URL}${API_PREFIX}${VERSION}/permissionGroup/delete/`,
    addPermissionsToGroup: `${BASE_URL}${API_PREFIX}${VERSION}/permissionGroup/addPermissions`,
    getAvailablePermissions: `${BASE_URL}${API_PREFIX}${VERSION}/permissionGroup/available?groupId=`,
    getAssignedPermissions: `${BASE_URL}${API_PREFIX}${VERSION}/permissionGroup/assign?groupId=`,

    // Managers
    addManager: `${BASE_URL}${API_PREFIX}${VERSION}/managers/addManger`,
    getManagers: `${BASE_URL}${API_PREFIX}${VERSION}/managers`,
    deleteManager: `${BASE_URL}${API_PREFIX}${VERSION}/managers/delete`,
    getManagerDetail: `${BASE_URL}${API_PREFIX}${VERSION}/managers/`,
    editManager: `${BASE_URL}${API_PREFIX}${VERSION}/managers/edit`,

    // Inventory — Categories
    getCategories:    `${BASE_URL}${API_PREFIX}${VERSION}/item-category/category`,
    createCategory:   `${BASE_URL}${API_PREFIX}${VERSION}/item-category/category`,
    updateCategory:   `${BASE_URL}${API_PREFIX}${VERSION}/item-category/category`,
    deleteCategory:   `${BASE_URL}${API_PREFIX}${VERSION}/item-category/category`,

    // Inventory — Sub-Categories
    getSubCategories:    `${BASE_URL}${API_PREFIX}${VERSION}/item-sub-category/get-all`,
    createSubCategory:   `${BASE_URL}${API_PREFIX}${VERSION}/item-sub-category/sub-category`,
    updateSubCategory:   `${BASE_URL}${API_PREFIX}${VERSION}/item-sub-category/sub-category`,
    deleteSubCategory:   `${BASE_URL}${API_PREFIX}${VERSION}/item-sub-category/sub-category`,

    // Inventory — Items / Products
    getAllItems:  `${BASE_URL}${API_PREFIX}${VERSION}/items/get-all`,
    createItem:  `${BASE_URL}${API_PREFIX}${VERSION}/items/create`,
    updateItem:  `${BASE_URL}${API_PREFIX}${VERSION}/items/update`,
    deleteItem:  `${BASE_URL}${API_PREFIX}${VERSION}/items/delete`,
    getItemById: `${BASE_URL}${API_PREFIX}${VERSION}/items/get-by-id`,

    // Inventory — Stock Operations
    getMainOfficeStock: `${BASE_URL}${API_PREFIX}${VERSION}/stock/main-office`,

    // Inventory — Centralized Operations
    inventoryPurchase: `${BASE_URL}${API_PREFIX}${VERSION}/inventory/operations/purchase`,
    inventorySell: `${BASE_URL}${API_PREFIX}${VERSION}/inventory/operations/sell`,
    inventoryRentOut: `${BASE_URL}${API_PREFIX}${VERSION}/inventory/operations/rent-out`,
    inventoryRentReturn: `${BASE_URL}${API_PREFIX}${VERSION}/inventory/operations/rent-return`,
    inventoryIssueToOffice: `${BASE_URL}${API_PREFIX}${VERSION}/inventory/operations/issue-to-office`,
    inventoryReturnFromOffice: `${BASE_URL}${API_PREFIX}${VERSION}/inventory/operations/return-from-office`,
    inventoryDamage: `${BASE_URL}${API_PREFIX}${VERSION}/inventory/operations/damage`,
    inventoryStolen: `${BASE_URL}${API_PREFIX}${VERSION}/inventory/operations/stolen`,
    inventoryAdjust: `${BASE_URL}${API_PREFIX}${VERSION}/inventory/operations/adjust`,

    // Inventory — Rentals
    getRentals: `${BASE_URL}${API_PREFIX}${VERSION}/inventory/rentals/get-all`,
    getActiveRentals: `${BASE_URL}${API_PREFIX}${VERSION}/inventory/rentals/active`,
    getOverdueRentals: `${BASE_URL}${API_PREFIX}${VERSION}/inventory/rentals/overdue`,
    getRentalById: (id) => `${BASE_URL}${API_PREFIX}${VERSION}/inventory/rentals/${id}`,

    // Inventory — Balance Sheet
    getBalanceSummary: `${BASE_URL}${API_PREFIX}${VERSION}/inventory/balance-sheet/summary`,
    getBalanceSummaryByRange: (from, to) => `${BASE_URL}${API_PREFIX}${VERSION}/inventory/balance-sheet/summary/range?from=${from}&to=${to}`,

    // Inventory — Stock Sheet
    getFullStockSheet: `${BASE_URL}${API_PREFIX}${VERSION}/inventory/stock-sheet/all`,
    getMainOfficeStockSheet: `${BASE_URL}${API_PREFIX}${VERSION}/inventory/stock-sheet/main-office`,
    getStockSheetByOffice: (id) => `${BASE_URL}${API_PREFIX}${VERSION}/inventory/stock-sheet/office/${id}`,
    getStockSheetByItem: (id) => `${BASE_URL}${API_PREFIX}${VERSION}/inventory/stock-sheet/item/${id}`,

    // Vendors
    getAllVendors: `${BASE_URL}${API_PREFIX}${VERSION}/vendors/get-all`,
    createNewVendor: `${BASE_URL}${API_PREFIX}${VERSION}/vendors/create`,
    updateVendor: `${BASE_URL}${API_PREFIX}${VERSION}/vendors/update`,
    deleteVendor: `${BASE_URL}${API_PREFIX}${VERSION}/vendors/delete?id=`,

    // Orders
    createOrder: `${BASE_URL}${API_PREFIX}${VERSION}/orders/create`,
    getAllOrders: `${BASE_URL}${API_PREFIX}${VERSION}/orders/get-all`,
    getOrdersByType: `${BASE_URL}${API_PREFIX}${VERSION}/orders`,

    // Brands
    getAllBrands: `${BASE_URL}${API_PREFIX}${VERSION}/brands/get-all`,
    createBrand: `${BASE_URL}${API_PREFIX}${VERSION}/brands/create`,
    updateBrand: `${BASE_URL}${API_PREFIX}${VERSION}/brands/update`,
    toggleBrandStatus: `${BASE_URL}${API_PREFIX}${VERSION}/brands/delete`,
    getStocks: `${BASE_URL}${API_PREFIX}${VERSION}/stock/get-all`,
    adjustStock: `${BASE_URL}${API_PREFIX}${VERSION}/stock/adjust`,

    // Units
    getAllUnits: `${BASE_URL}${API_PREFIX}${VERSION}/units/get-all`,
    createUnit: `${BASE_URL}${API_PREFIX}${VERSION}/units/create`,
    updateUnit: `${BASE_URL}${API_PREFIX}${VERSION}/units/update`,
    deleteUnit: `${BASE_URL}${API_PREFIX}${VERSION}/units/delete`,
    getUnitById: `${BASE_URL}${API_PREFIX}${VERSION}/units/`,

    // Models
    getAllModels: `${BASE_URL}${API_PREFIX}${VERSION}/models/get-all`,
    createModel: `${BASE_URL}${API_PREFIX}${VERSION}/models/create`,
    updateModel: `${BASE_URL}${API_PREFIX}${VERSION}/models/update`,
    deleteModel: `${BASE_URL}${API_PREFIX}${VERSION}/models/delete`,

    // Support Tickets
    searchTickets:    `${BASE_URL}${API_PREFIX}${VERSION}/support/search`,
    createTicket:     `${BASE_URL}${API_PREFIX}${VERSION}/support/create`,
    updateTicket:     `${BASE_URL}${API_PREFIX}${VERSION}/support/update/`,
    deleteTicket:     `${BASE_URL}${API_PREFIX}${VERSION}/support/delete/`,
    ticketDashboard:  `${BASE_URL}${API_PREFIX}${VERSION}/support/dashboard`,
    ticketPriorities: `${BASE_URL}${API_PREFIX}${VERSION}/support/priorities`,
    ticketStatuses:   `${BASE_URL}${API_PREFIX}${VERSION}/support/statuses`,
    ticketTypes:      `${BASE_URL}${API_PREFIX}${VERSION}/support/types`,

    // ── Ticket Chat (MQTT-backed) ─────────────────────────────────────────────
    // MQTT broker WebSocket:  ws://<host>:8084  (subscribe to ticket/chat/{ticketId})
    // REST fallback:
    ticketChatSendMessage:   (ticketId) => `${BASE_URL}${API_PREFIX}${VERSION}/support/chat/${ticketId}/message`,
    ticketChatSendAudio:     (ticketId) => `${BASE_URL}${API_PREFIX}${VERSION}/support/chat/${ticketId}/audio`,
    ticketChatHistory:       (ticketId) => `${BASE_URL}${API_PREFIX}${VERSION}/support/chat/${ticketId}/history`,
    ticketChatParticipants:  (ticketId) => `${BASE_URL}${API_PREFIX}${VERSION}/support/chat/${ticketId}/participants`,
    ticketChatAudioFile:     (ticketId, filename) => `${BASE_URL}${API_PREFIX}${VERSION}/support/chat/audio/${ticketId}/${filename}`,

    // Tasks
    searchTasks:   `${BASE_URL}${API_PREFIX}${VERSION}/tasks/get-all`,
    createTask:    `${BASE_URL}${API_PREFIX}${VERSION}/tasks/create`,
    updateTask:    `${BASE_URL}${API_PREFIX}${VERSION}/tasks/update/`,
    deleteTask:    `${BASE_URL}${API_PREFIX}${VERSION}/tasks/delete/`,
    approveTask:   `${BASE_URL}${API_PREFIX}${VERSION}/tasks/approve?taskId=`,
    cancelTask:    `${BASE_URL}${API_PREFIX}${VERSION}/tasks/cancel?taskId=`,
    taskDashboard: `${BASE_URL}${API_PREFIX}${VERSION}/tasks/dashboard`,
    taskPriorities:`${BASE_URL}${API_PREFIX}${VERSION}/tasks/priorities`,
    taskStatuses:  `${BASE_URL}${API_PREFIX}${VERSION}/tasks/statuses`,

    // Fault Reasons
    createFaultReason: `${BASE_URL}${API_PREFIX}${VERSION}/fault-reasons/create`,
    deleteFaultReason: `${BASE_URL}${API_PREFIX}${VERSION}/fault-reasons/delete/`,
    updateFaultReason: `${BASE_URL}${API_PREFIX}${VERSION}/fault-reasons/update`,
    getAllFaultReasons: `${BASE_URL}${API_PREFIX}${VERSION}/fault-reasons/get-all`,

    // Divisions
    getAllDivisions: `${BASE_URL}${API_PREFIX}${VERSION}/divisions/get-all`,

    // Teams
    createTeam:      `${BASE_URL}${API_PREFIX}${VERSION}/team/create`,
    updateTeam:      `${BASE_URL}${API_PREFIX}${VERSION}/team/update`,
    addTeamMember:   `${BASE_URL}${API_PREFIX}${VERSION}/team/member`,
    removeTeamMember:`${BASE_URL}${API_PREFIX}${VERSION}/team/member`,
    getAllTeams:      `${BASE_URL}${API_PREFIX}${VERSION}/team/get-all`,
    getTeamById:     `${BASE_URL}${API_PREFIX}${VERSION}/team/get-by-id?id=`,
    deleteTeam:      `${BASE_URL}${API_PREFIX}${VERSION}/team/delete/`,
    getTeamHistory:  `${BASE_URL}${API_PREFIX}${VERSION}/team/history?id=`,

    // Activity Logs
    getActivityLogsByUser: `${BASE_URL}/api/activity-logs/user/`,
    getActivityLogs:       `${BASE_URL}/api/activity-logs`,
};

export default ApiUrls;
