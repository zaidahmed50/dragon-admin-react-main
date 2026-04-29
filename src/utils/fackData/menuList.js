/**
 * DEPRECATED: This file now imports from menuListWithPermissions.js
 * For new code, use useFilteredMenu hook instead
 * 
 * @example
 * import { useFilteredMenu } from '@/hooks/useFilteredMenu';
 * 
 * const { filteredMenu } = useFilteredMenu();
 * // Use filteredMenu in your component
 */

// Import permission-aware menu configuration
import { menuListWithPermissions } from './menuListWithPermissions';

// Export for backward compatibility
// WARNING: This export does not filter by permissions
// Use useFilteredMenu hook for permission-based filtering
export const menuList = menuListWithPermissions;

// Legacy menu list without permissions (kept for reference)
export const menuListLegacy = [
    {
        id: 5,
        name: "Employee",
        path: "#",
        icon: 'employee',
        dropdownMenu: [
            {
                id: 1,
                name: "Employee",
                path: "/Employee/list",
                icon: 'list',
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Team",
                path: "#",
                icon: 'group',
                subdropdownMenu: [
                    {
                        id: 1,
                        name: "Teams",
                        path: "/team/list",
                        icon: 'list'
                    },
                ]
            },
        ]
    },
    {
        id: 6,
        name: "Customers",
        path: "#",
        icon: 'customer',
        dropdownMenu: [
            {
                id: 1,
                name: "Customer",
                path: "/Customers/list",
                icon: 'list',
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Sale ID",
                path: "/SaleId/list",
                icon: 'list',
                subdropdownMenu: false
            },
        ]
    },
    {
        id: 12,
        name: "Dragon Core",
        path: "#",
        icon: 'core',
        dropdownMenu: [
            { id: 1, name: "Area Management", path: "/dragon-core/area", icon: 'map', subdropdownMenu: false },
            { id: 2, name: "Departments", path: "/dragon-core/departments-designations", icon: 'org', subdropdownMenu: false },
            { id: 3, name: "Office Locations", path: "/dragon-core/office-locations", icon: 'location', subdropdownMenu: false },
            { id: 4, name: "Employee Allowance", path: "/dragon-core/employee-allowance", icon: 'money', subdropdownMenu: false },
            { id: 5, name: "Promotions", path: "/dragon-core/promotions", icon: 'trending', subdropdownMenu: false },
            { id: 6, name: "Vendors", path: "/dragon-core/vendors", icon: 'vendor', subdropdownMenu: false },
            { id: 7, name: "Managers", path: "/dragon-core/managers", icon: 'manager', subdropdownMenu: false },
            { id: 8, name: "Profile Management", path: "/dragon-core/profile-management", icon: 'user-settings', subdropdownMenu: false },
            { id: 9, name: "Permission Groups", path: "/dragon-core/permission-groups", icon: 'lock', subdropdownMenu: false },
            { id: 10, name: "IP Pools", path: "/dragon-core/ip-pools", icon: 'network', subdropdownMenu: false },

        ]
    },
    {
        id: 13,
        name: "Inventory",
        path: "#",
        icon: 'inventory',
        dropdownMenu: [
            { id: 1, name: "Category", path: "/finance/inventory/category", icon: 'category', subdropdownMenu: false },
            { id: 2, name: "Sub Category", path: "/finance/inventory/subCategory/", icon: 'sub-category', subdropdownMenu: false },
            { id: 3, name: "Brands", path: "/finance/inventory/brand/", icon: 'brand', subdropdownMenu: false },
        ]
    },
    {
        id: 14,
        name: "Stock",
        path: "#",
        icon: 'stock',
        dropdownMenu: [
            { id: 1, name: "Stock", path: "/stock/StockView", icon: 'box', subdropdownMenu: false },
        ]
    },
    {
        id: 15,
        name: "Help Center",
        path: "#",
        icon: 'help',
        dropdownMenu: [
            { id: 1, name: "Support", path: "support/tickets", icon: 'support', subdropdownMenu: false },
        ]
    },
    {
        id: 16,
        name: "Access Control",
        path: "#",
        icon: 'lock',
        dropdownMenu: [
            { id: 1, name: "Admins", path: "/sub-admins", icon: 'customer', subdropdownMenu: false },
            { id: 2, name: "Roles & Permissions", path: "/access-control", icon: 'lock', subdropdownMenu: false },
        ]
    },
];

// Default export (permission-aware)
export default menuListWithPermissions;