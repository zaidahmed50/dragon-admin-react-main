import { useAuth } from '../contexts/AuthContext';

/**
 * Component to conditionally render children based on permissions
 * 
 * @param {Object} props
 * @param {string} [props.permission] - Single permission to check
 * @param {string[]} [props.permissions] - Multiple permissions to check (requires all by default)
 * @param {boolean} [props.requireAll=true] - When checking multiple permissions, require all or any
 * @param {React.ReactNode} props.children - Content to render if permission check passes
 * @param {React.ReactNode} [props.fallback] - Content to render if permission check fails
 * 
 * @example
 * // Single permission
 * <PermissionGuard permission="EMPLOYEE_CREATE">
 *   <button>Create Employee</button>
 * </PermissionGuard>
 * 
 * @example
 * // Multiple permissions (all required)
 * <PermissionGuard permissions={["EMPLOYEE_CREATE", "EMPLOYEE_UPDATE"]}>
 *   <button>Manage Employees</button>
 * </PermissionGuard>
 * 
 * @example
 * // Multiple permissions (any required)
 * <PermissionGuard permissions={["EMPLOYEE_GET", "CUSTOMER_GET"]} requireAll={false}>
 *   <Dashboard />
 * </PermissionGuard>
 * 
 * @example
 * // With fallback content
 * <PermissionGuard permission="ADMIN_PANEL" fallback={<div>Access Denied</div>}>
 *   <AdminPanel />
 * </PermissionGuard>
 */
const PermissionGuard = ({ 
    permission, 
    permissions, 
    requireAll = true, 
    children, 
    fallback = null 
}) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

    // Check single permission
    if (permission) {
        return hasPermission(permission) ? children : fallback;
    }

    // Check multiple permissions
    if (permissions && permissions.length > 0) {
        const hasAccess = requireAll 
            ? hasAllPermissions(permissions)
            : hasAnyPermission(permissions);
        
        return hasAccess ? children : fallback;
    }

    // No permissions specified, render children
    return children;
};

export default PermissionGuard;
