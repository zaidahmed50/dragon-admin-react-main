
export const routeConfig = [
    // Admin Routes (highest priority)
    // /access-control is super-admin only — excluded from permission-based routing
    { path: '/sub-admins', permission: 'USER_GET', label: 'Sub Admins' },
    
    // Employee Routes
    { path: '/Employee/list', permission: 'EMPLOYEE_GET', label: 'Employees' },
    
    // Customer Routes
    { path: '/Customers/list', permission: 'CUSTOMER_GET', label: 'Customers' },
    { path: '/SaleId/list', permission: 'USER_CONNECTION_GET', label: 'Sale IDs' },
    
    // Dragon Core Routes
    { path: '/dragon-core/area', permission: 'AREA_GET', label: 'Areas' },
    { path: '/dragon-core/departments-designations', permission: 'DEPARTMENT_GET', label: 'Departments' },
    { path: '/dragon-core/office-locations', permission: 'OFFICE_LOCATION_GET', label: 'Office Locations' },
    { path: '/dragon-core/vendors', permission: 'VENDOR_GET', label: 'Vendors' },
    { path: '/dragon-core/managers', permission: 'MANAGER_GET', label: 'Managers' },
    { path: '/dragon-core/profile-management', permission: 'PROFILE_GET', label: 'Profiles' },
    { path: '/dragon-core/ip-pools', permission: 'IP_POOL_GET', label: 'IP Pools' },
    { path: '/dragon-core/promotions', permission: 'PROMOTION_GET', label: 'Promotions' },
    
    // Inventory Routes
    { path: '/finance/inventory/category', permission: 'ITEM_CATEGORY_GET', label: 'Inventory Categories' },
    { path: '/finance/inventory/subCategory', permission: 'ITEM_SUB_CATEGORY_GET', label: 'Sub Categories' },
    { path: '/finance/inventory/brand', permission: 'BRAND_GET', label: 'Brands' },

    // Stock Routes
    { path: '/stock/StockView', permission: 'STOCK_GET', label: 'Stock' },
    
    // Support Routes
    { path: '/support/tickets', permission: 'TICKET_GET', label: 'Support Tickets' },
];

/**
 * Get the first accessible route for a user based on their permissions
 * @param {Array<string>} userPermissions - User's permission array
 * @param {boolean} isSuperAdmin - Whether user is super admin
 * @returns {Object} - { path, label } of the accessible route, or default dashboard
 */
export const getFirstAccessibleRoute = (userPermissions, isSuperAdmin = false) => {
    // Super admin can access any route, return first one
    if (isSuperAdmin) {
        return routeConfig[0];
    }

    // Find first route user has permission for
    const accessibleRoute = routeConfig.find(route => 
        userPermissions.includes(route.permission)
    );

    // Return accessible route or default dashboard
    return accessibleRoute || { path: '/dashboard', label: 'Dashboard' };
};

/**
 * Get all accessible routes for a user
 * @param {Array<string>} userPermissions - User's permission array
 * @param {boolean} isSuperAdmin - Whether user is super admin
 * @returns {Array<Object>} - Array of accessible routes
 */
export const getAllAccessibleRoutes = (userPermissions, isSuperAdmin = false) => {
    // Super admin can access all routes
    if (isSuperAdmin) {
        return routeConfig;
    }

    // Filter routes user has permission for
    return routeConfig.filter(route => 
        userPermissions.includes(route.permission)
    );
};

/**
 * Check if user can access a specific route
 * @param {string} path - Route path to check
 * @param {Array<string>} userPermissions - User's permission array
 * @param {boolean} isSuperAdmin - Whether user is super admin
 * @returns {boolean} - True if user can access the route
 */
export const canAccessRoute = (path, userPermissions, isSuperAdmin = false) => {
    // Super admin can access any route
    if (isSuperAdmin) {
        return true;
    }

    // Find route config
    const route = routeConfig.find(r => r.path === path);
    
    // If route not in config, allow access (public route)
    if (!route) {
        return true;
    }

    // Check if user has required permission
    return userPermissions.includes(route.permission);
};

/**
 * Get redirect path after login based on user permissions
 * @param {Array<string>} userPermissions - User's permission array
 * @param {boolean} isSuperAdmin - Whether user is super admin
 * @param {string} intendedPath - Path user was trying to access before login
 * @returns {string} - Path to redirect to
 */
export const getLoginRedirectPath = (userPermissions, isSuperAdmin = false, intendedPath = null) => {
    // If user was trying to access a specific route and has permission, go there
    if (intendedPath && intendedPath !== '/login' && intendedPath !== '/') {
        if (canAccessRoute(intendedPath, userPermissions, isSuperAdmin)) {
            return intendedPath;
        }
    }

    // Otherwise, redirect to first accessible route
    const firstRoute = getFirstAccessibleRoute(userPermissions, isSuperAdmin);
    return firstRoute.path;
};
