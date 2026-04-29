import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for checking permissions
 * @returns {Object} Permission checking functions
 */
export const usePermission = () => {
    const { hasPermission, hasAnyPermission, hasAllPermissions, isSuperAdmin } = useAuth();

    return {
        /**
         * Check if user has a specific permission
         * @param {string} permission - Permission name
         * @returns {boolean}
         */
        can: hasPermission,

        /**
         * Check if user has any of the provided permissions
         * @param {string[]} permissions - Array of permission names
         * @returns {boolean}
         */
        canAny: hasAnyPermission,

        /**
         * Check if user has all of the provided permissions
         * @param {string[]} permissions - Array of permission names
         * @returns {boolean}
         */
        canAll: hasAllPermissions,

        /**
         * Check if user is a super admin
         * @returns {boolean}
         */
        isSuperAdmin,
    };
};
