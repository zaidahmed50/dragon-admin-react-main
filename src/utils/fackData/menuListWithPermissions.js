/**
 * Menu configuration with permission requirements
 * Each menu item has requiredPermissions array
 * User needs at least ONE of the permissions to see the menu item
 */
export const menuListWithPermissions = [
    {
        id: 5,
        name: "Employee",
        path: "#",
        icon: 'employee',
        requiredPermissions: ['EMPLOYEE_GET', 'TEAM_GET'],
        dropdownMenu: [
            {
                id: 1,
                name: "Employee",
                path: "/Employee/list",
                icon: 'list',
                requiredPermissions: ['EMPLOYEE_GET'],
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Team",
                path: "/team/list",
                icon: 'list',
                requiredPermissions: ['TEAM_GET'],
                subdropdownMenu: false,
            },
        ]
    },
    {
        id: 6,
        name: "Customers",
        path: "#",
        icon: 'customer',
        requiredPermissions: ['CUSTOMER_GET', 'USER_CONNECTION_GET'], // Show if has any customer-related permission
        dropdownMenu: [
            {
                id: 1,
                name: "Customer",
                path: "/Customers/list",
                icon: 'list',
                requiredPermissions: ['CUSTOMER_GET'],
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Sale ID",
                path: "/SaleId/list",
                icon: 'list',
                requiredPermissions: ['USER_CONNECTION_GET'],
                subdropdownMenu: false
            },
        ]
    },
    {
        id: 12,
        name: "Dragon Core",
        path: "#",
        icon: 'core',
        requiredPermissions: [
            'AREA_GET',
            'DEPARTMENT_GET',
            'OFFICE_LOCATION_GET',
            'EMPLOYEE_GET',
            'PROMOTION_GET',
            'MANAGER_GET',
            'PROFILE_GET',
            'ACCESS_GROUP_GET',
            'IP_POOL_GET'
        ],
        dropdownMenu: [
            {
                id: 1,
                name: "Area Management",
                path: "/dragon-core/area",
                icon: 'map',
                requiredPermissions: ['AREA_GET'],
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Departments",
                path: "/dragon-core/departments-designations",
                icon: 'org',
                requiredPermissions: ['DEPARTMENT_GET'],
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Office Locations",
                path: "/dragon-core/office-locations",
                icon: 'location',
                requiredPermissions: ['OFFICE_LOCATION_GET'],
                subdropdownMenu: false
            },
            {
                id: 4,
                name: "Employee Allowance",
                path: "/dragon-core/employee-allowance",
                icon: 'money',
                requiredPermissions: ['EMPLOYEE_GET'],
                subdropdownMenu: false
            },
            {
                id: 5,
                name: "Promotions",
                path: "/dragon-core/promotions",
                icon: 'trending',
                requiredPermissions: ['PROMOTION_GET'],
                subdropdownMenu: false
            },

            {
                id: 7,
                name: "Managers",
                path: "/dragon-core/managers",
                icon: 'manager',
                requiredPermissions: ['MANAGER_GET'],
                subdropdownMenu: false
            },
            {
                id: 8,
                name: "Profile Management",
                path: "/dragon-core/profile-management",
                icon: 'user-settings',
                requiredPermissions: ['PROFILE_GET'],
                subdropdownMenu: false
            },
            {
                id: 9,
                name: "Permission Groups",
                path: "/dragon-core/permission-groups",
                icon: 'lock',
                requiredPermissions: ['ACCESS_GROUP_GET'],
                subdropdownMenu: false
            },
            {
                id: 10,
                name: "IP Pools",
                path: "/dragon-core/ip-pools",
                icon: 'network',
                requiredPermissions: ['IP_POOL_GET'],
                subdropdownMenu: false
            },
        ]
    },
    {
        id: 13,
        name: "Inventory",
        path: "#",
        icon: 'inventory',
        requiredPermissions: ['ITEM_CATEGORY_GET', 'ITEM_SUB_CATEGORY_GET', 'BRAND_GET', 'ORDER_GET', 'MODEL_GET', 'UNIT_GET', 'VENDOR_GET'],
        dropdownMenu: [
            {
                id: 1,
                name: "Core",
                path: "#",
                icon: 'core',
                requiredPermissions: ['ITEM_CATEGORY_GET', 'ITEM_SUB_CATEGORY_GET', 'BRAND_GET', 'MODEL_GET', 'UNIT_GET', 'VENDOR_GET'],
                subdropdownMenu: true,
                dropdownMenu: [
                    {
                        id: 1,
                        name: "Category",
                        path: "/finance/inventory/category",
                        icon: 'category',
                        requiredPermissions: ['ITEM_CATEGORY_GET'],
                        subdropdownMenu: false
                    },
                    {
                        id: 2,
                        name: "Sub Category",
                        path: "/finance/inventory/subCategory/",
                        icon: 'sub-category',
                        requiredPermissions: ['ITEM_SUB_CATEGORY_GET'],
                        subdropdownMenu: false
                    },
                    {
                        id: 3,
                        name: "Brands",
                        path: "/finance/inventory/brand/",
                        icon: 'brand',
                        requiredPermissions: ['BRAND_GET'],
                        subdropdownMenu: false
                    },
                    {
                        id: 4,
                        name: "Models",
                        path: "/finance/inventory/model/",
                        icon: 'brand',
                        requiredPermissions: ['MODEL_GET'],
                        subdropdownMenu: false
                    },
                    {
                        id: 5,
                        name: "Units",
                        path: "/finance/inventory/units/",
                        icon: 'brand',
                        requiredPermissions: ['UNIT_GET'],
                        subdropdownMenu: false
                    },
                    {
                        id: 6,
                        name: "Products",
                        path: "/finance/inventory/Products/",
                        icon: 'brand',
                        requiredPermissions: ['UNIT_GET'],
                        subdropdownMenu: false
                    },
                    {
                        id: 7,
                        name: "Vendors",
                        path: "/finance/inventory/vendors",
                        icon: 'vendor',
                        requiredPermissions: ['VENDOR_GET'],
                        subdropdownMenu: false
                    },
                ]
            },


            {
                id: 14,
                name: "Stock",
                path: "#",
                icon: 'stock',
                subdropdownMenu: true,
                requiredPermissions: [
                    'INVENTORY_VIEW_STOCK', 'INVENTORY_PURCHASE', 'INVENTORY_SELL',
                    'INVENTORY_RENT', 'INVENTORY_ISSUE', 'INVENTORY_VIEW_BALANCE', 'STOCK_GET'
                ],
                dropdownMenu: [
                    {
                        id: 1,
                        name: "Stock Sheet",
                        path: "/inventory/stock-sheet",
                        icon: 'box',
                        requiredPermissions: ['INVENTORY_VIEW_STOCK'],
                        subdropdownMenu: false
                    },
                    {
                        id: 2,
                        name: "Purchase (Buy)",
                        path: "/inventory/purchase",
                        icon: 'box',
                        requiredPermissions: ['INVENTORY_PURCHASE'],
                        subdropdownMenu: false
                    },
                    {
                        id: 3,
                        name: "Sell",
                        path: "/inventory/sell",
                        icon: 'order',
                        requiredPermissions: ['INVENTORY_SELL'],
                        subdropdownMenu: false
                    },
                    {
                        id: 4,
                        name: "Rentals",
                        path: "/inventory/rentals",
                        icon: 'box',
                        requiredPermissions: ['INVENTORY_RENT'],
                        subdropdownMenu: false
                    },
                    {
                        id: 5,
                        name: "Issue / Transfer",
                        path: "/inventory/issue",
                        icon: 'box',
                        requiredPermissions: ['INVENTORY_ISSUE'],
                        subdropdownMenu: false
                    },
                    {
                        id: 6,
                        name: "Balance Sheet",
                        path: "/inventory/balance-sheet",
                        icon: 'money',
                        requiredPermissions: ['INVENTORY_VIEW_BALANCE'],
                        subdropdownMenu: false
                    },
                ]
            },


         
        ]
    },
    {
        id: 15,
        name: "Help Center",
        path: "#",
        icon: 'help',
        requiredPermissions: ['SUPPORT_DASHBOARD'],
        dropdownMenu: [
            {
                id: 0,
                name: "Dashboard",
                path: "/support/dashboard",
                icon: 'dashboard',
                requiredPermissions: ['SUPPORT_DASHBOARD'],
                subdropdownMenu: false
            },
            {
                id: 1,
                name: "Support",
                path: "support/tickets",
                icon: 'support',
                requiredPermissions: ['TICKET_GET'],
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Fault Reasons",
                path: "support/fault-reasons",
                icon: 'support',
                requiredPermissions: ['FAULT_REASON_GET'],
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Operations / Tasks",
                path: "support/tasks",
                icon: 'task',
                requiredPermissions: ['GET_ALL_TASK'],
                subdropdownMenu: false


            },
        ]
    },
    {
        id: 19,
        name: "Tracking",
        path: "#",
        icon: 'location',
        requiredPermissions: [],
        dropdownMenu: [
            {
                id: 1,
                name: "Device Map",
                path: "/tracking/map",
                icon: 'map',
                requiredPermissions: [],
                subdropdownMenu: false
            },
        ]
    },
    {
        id: 18,
        name: "Backup",
        path: "/backup",
        icon: 'backup',
        // Only Super Admin sees this — matched via ROLE_SUPER_ADMIN in useFilteredMenu
        requiredPermissions: ['ROLE_SUPER_ADMIN'],
        dropdownMenu: false,
    },
    {
        id: 17,
        name: "Access Control",
        path: "#",
        icon: 'lock',
        // Entire section is Super Admin only
        requiredPermissions: ['ROLE_SUPER_ADMIN'],
        dropdownMenu: [
            {
                id: 1,
                name: "Admins",
                path: "/sub-admins",
                icon: 'customer',
                requiredPermissions: ['ROLE_SUPER_ADMIN'],
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Roles & Permissions",
                path: "/access-control",
                icon: 'lock',
                requiredPermissions: ['ROLE_SUPER_ADMIN'],
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "View Logs",
                path: "/my-activity-logs",
                icon: 'list',
                requiredPermissions: ['ROLE_SUPER_ADMIN'],
                subdropdownMenu: false
            },
        ]
    },
];
export const menuList = menuListWithPermissions;
