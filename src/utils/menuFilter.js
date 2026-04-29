/**
 * Utility functions for filtering menu items based on user permissions
 */

/**
 * Check if user has access to a menu item
 * @param {Array<string>} userPermissions - User's permissions array
 * @param {Array<string>} requiredPermissions - Required permissions for the menu item
 * @param {boolean} isSuperAdmin - Whether user is super admin
 * @returns {boolean} - True if user has access
 */
export const hasMenuAccess = (userPermissions, requiredPermissions, isSuperAdmin) => {
    // Super admin has access to everything
    if (isSuperAdmin) {
        return true;
    }

    // If no permissions required, show to everyone
    if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
    }

    // User needs at least ONE of the required permissions
    return requiredPermissions.some(permission => 
        userPermissions.includes(permission)
    );
};

/**
 * Filter a single menu item and its children
 * @param {Object} menuItem - Menu item to filter
 * @param {Array<string>} userPermissions - User's permissions
 * @param {boolean} isSuperAdmin - Whether user is super admin
 * @returns {Object|null} - Filtered menu item or null if no access
 */
export const filterMenuItem = (menuItem, userPermissions, isSuperAdmin) => {
    // Check if user has access to the menu item
    const hasAccess = hasMenuAccess(
        userPermissions, 
        menuItem.requiredPermissions, 
        isSuperAdmin
    );

    if (!hasAccess) {
        return null;
    }

    // If menu item has dropdown, filter children
    if (menuItem.dropdownMenu && menuItem.dropdownMenu.length > 0) {
        const filteredChildren = menuItem.dropdownMenu
            .map(child => filterMenuItem(child, userPermissions, isSuperAdmin))
            .filter(child => child !== null);

        // If no children are visible, hide the parent
        if (filteredChildren.length === 0) {
            return null;
        }

        // Return menu item with filtered children
        return {
            ...menuItem,
            dropdownMenu: filteredChildren
        };
    }

    // Return menu item as is (leaf node with access)
    return menuItem;
};

/**
 * Filter entire menu list based on user permissions
 * @param {Array<Object>} menuList - Complete menu list
 * @param {Array<string>} userPermissions - User's permissions
 * @param {boolean} isSuperAdmin - Whether user is super admin
 * @returns {Array<Object>} - Filtered menu list
 */
export const filterMenuByPermissions = (menuList, userPermissions, isSuperAdmin) => {
    if (!menuList || menuList.length === 0) {
        return [];
    }

    return menuList
        .map(menuItem => filterMenuItem(menuItem, userPermissions, isSuperAdmin))
        .filter(menuItem => menuItem !== null);
};

/**
 * Get visible menu count for analytics
 * @param {Array<Object>} menuList - Filtered menu list
 * @returns {Object} - Statistics about visible menus
 */
export const getMenuStats = (menuList) => {
    let totalParents = 0;
    let totalChildren = 0;

    menuList.forEach(parent => {
        totalParents++;
        if (parent.dropdownMenu) {
            totalChildren += parent.dropdownMenu.length;
        }
    });

    return {
        totalParents,
        totalChildren,
        totalItems: totalParents + totalChildren
    };
};
