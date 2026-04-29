import {createBrowserRouter} from "react-router-dom";
import RootLayout from "../layout/root";
import LoginCover from "../pages/auth/login-cover.jsx";
import EmployeePage from "../pages/employee/employee-page.jsx";
import EmployeeView from "../pages/employee/employee-view.jsx";
import EmployeeCreate from "../pages/employee/employee-create.jsx";
import LayoutAuth from "../layout/layoutAuth";
import ProtectedRoute from "../components/ProtectedRoute";
import DragonCoreArea from "../pages/dragonCore/dragon-core-area.jsx";
import Category from "../pages/finance/Category.jsx";
import StockView from "@/components/stock/StockView.jsx";
import DepartmentDesignationPage from "../pages/department-designation-page.jsx";
import DragonCoreIpPools from "../pages/dragonCore/dragon-core-ip-pools.jsx";
import DragonCoreOfficeLocations from "../pages/dragonCore/dragon-core-office-locations.jsx";
import DragonCoreProfileManagement from "../pages/dragonCore/dragon-core-profile-management.jsx";
import DragonCoreEmployeeAllowance from "../pages/dragonCore/dragon-core-employee-allowance.jsx";
import DragonCorePromotions from "../pages/dragonCore/dragon-core-promotions.jsx";
import CreateVendor from "@/components/finance/inventory/Vendors/CreateVendor.jsx";
import Products from "../pages/finance/Products.jsx";
import CustomerList from "../pages/customers/customers-page.jsx";
import CustomerView from "../pages/customers/customer-view.jsx";
import CreateCustomerPage from "../pages/customers/create-customer.jsx";
import SaleIdList from "../pages/customers/sales-id/saleId-list.jsx";
import CreateSaleId from "../pages/customers/sales-id/create-saleId.jsx";
import DragonCoreManagers from "../pages/dragonCore/dragon-core-managers.jsx";
import ManagerDetail from "@/components/dragonCore/Managers/ManagerDetail.jsx";
import ManagerEdit from "@/components/dragonCore/Managers/ManagerEdit.jsx";
import DragonCorePermissionGroups from "../pages/dragonCore/dragon-core-permission-groups.jsx";
import DragonCoreAccessControl from "../pages/access-control.jsx";
import TicketsPage from "../pages/support/tickets-page.jsx";
import CreateTicketPage from "@/components/tickets/TicketCreate.jsx";
import SaleIdView from "../pages/customers/sales-id/salesIdView.jsx";
import SubAdminPage from "../pages/sub-admin/sub-admin-page.jsx";
import SubAdminCreate from "@/components/sub-admin/SubAdminCreate.jsx";
import ActivityLogPage from "../pages/sub-admin/activity-log-page.jsx";
import MyActivityLogPage from "../pages/sub-admin/my-activity-log-page.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import SupportDashboard from "../pages/SupportDashboard.jsx";
import TeamPage from "../pages/employee/team/team-page.jsx";
import TeamCreate from "../pages/employee/team/team-create.jsx";
import FaultReasonsPage from "../pages/support/fault-reasons-page.jsx";
import SubCategory from "../pages/finance/SubCategory.jsx";
import Brands from "../pages/finance/Brands.jsx";
import Units from "../pages/finance/Units.jsx";
import Vendors from "../pages/finance/Vendors.jsx";
import Models from "../pages/finance/Models.jsx";
import TasksPage from "../pages/support/tasks-page.jsx";
import CreateTaskPage from "@/components/tasks/TaskCreate.jsx";
import BackupPageRoute from "../pages/backup/backup-page.jsx";
import StockSheet from "../pages/inventory/StockSheet.jsx";
import PurchaseStock from "../pages/inventory/PurchaseStock.jsx";
import SellStock from "../pages/inventory/SellStock.jsx";
import Rentals from "../pages/inventory/Rentals.jsx";
import IssueStock from "../pages/inventory/IssueStock.jsx";
import BalanceSheet from "../pages/inventory/BalanceSheet.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutAuth/>,
        children: [
            {
                path: "/",
                element: <LoginCover/>
            },
            {
                path: "/login",
                element: <LoginCover/>
            },
            {
                path: "/authentication/login/cover",
                element: <LoginCover/>
            },
            {
                path: "/unauthorized",
                element: <Unauthorized/>
            }
        ]
    },
    {
        path: "/",
        element: <ProtectedRoute><RootLayout/></ProtectedRoute>,
        children: [
            {
                path: "/",
                element: <Dashboard />
            },
            // {
            //     path: "/dashboard",
            //     element: <ProtectedRoute requiredPermission="SUPPORT_DASHBOARD"><SupportDashboard/></ProtectedRoute>
            //
            // },
            {
                path: "/support/dashboard",
                element: <SupportDashboard />
            },
            {
                path: "/Employee/list",
                element: <ProtectedRoute requiredPermission="EMPLOYEE_GET"><EmployeePage/></ProtectedRoute>
            },
            {
                path: "/Employee/view",
                element: <ProtectedRoute requiredPermission="EMPLOYEE_GET"><EmployeeView/></ProtectedRoute>
            },
            {
                path: "/Employee/create",
                element: <ProtectedRoute requiredPermission="EMPLOYEE_CREATE"><EmployeeCreate/></ProtectedRoute>
            },
            {
                path: "/team/list",
                element: <ProtectedRoute requiredPermission="TEAM_GET"><TeamPage/></ProtectedRoute>
            },
            {
                path: "/team/create",
                element: <ProtectedRoute requiredPermission="TEAM_CREATE"><TeamCreate/></ProtectedRoute>
            },



            {
                path: "/Employee/create/",
                element: <ProtectedRoute requiredPermission="EMPLOYEE_CREATE"><EmployeeCreate/></ProtectedRoute>
            },
            {
                path: "/Customers/list",
                element: <ProtectedRoute requiredPermission="CUSTOMER_GET"><CustomerList/></ProtectedRoute>
            },
            {
                path: "/Customers/view",
                element: <ProtectedRoute requiredPermission="CUSTOMER_GET"><CustomerView/></ProtectedRoute>
            },
            {
                path: "/Customers/create",
                element: <ProtectedRoute requiredPermission="CUSTOMER_CREATE"><CreateCustomerPage/></ProtectedRoute>
            },
            {
                path: "/SaleId/list",
                element: <ProtectedRoute requiredPermission="USER_CONNECTION_GET"><SaleIdList/></ProtectedRoute>
            }, {
                path: "/SaleId/view",
                element: <ProtectedRoute requiredPermission="USER_CONNECTION_GET"><SaleIdView/></ProtectedRoute>
            },
            {
                path: "/SaleId/create",
                element: <ProtectedRoute requiredPermission="USER_CONNECTION_CREATE"><CreateSaleId/></ProtectedRoute>
            },
            {
                path: "/dragon-core/area",
                element: <ProtectedRoute requiredPermission="AREA_GET"><DragonCoreArea/></ProtectedRoute>
            },
            {
                path: "/dragon-core/departments-designations",
                element: <ProtectedRoute requiredPermission="DEPARTMENT_GET"><DepartmentDesignationPage/></ProtectedRoute>
            },
            {
                path: "/dragon-core/ip-pools",
                element: <ProtectedRoute requiredPermission="IP_POOL_GET"><DragonCoreIpPools/></ProtectedRoute>
            },
            {
                path: "/dragon-core/office-locations",
                element: <ProtectedRoute requiredPermission="OFFICE_LOCATION_GET"><DragonCoreOfficeLocations/></ProtectedRoute>
            },
            {
                path: "/dragon-core/profile-management",
                element: <ProtectedRoute requiredPermission="PROFILE_GET"><DragonCoreProfileManagement/></ProtectedRoute>
            },
            {
                path: "/dragon-core/employee-allowance",
                element: <ProtectedRoute requiredPermission="EMPLOYEE_GET"><DragonCoreEmployeeAllowance/></ProtectedRoute>
            },
            {
                path: "/dragon-core/promotions",
                element: <ProtectedRoute requiredPermission="PROMOTION_GET"><DragonCorePromotions/></ProtectedRoute>
            },
            {
                path: "/finance/inventory/vendors/create",
                element: <ProtectedRoute requiredPermission="VENDOR_CREATE"><CreateVendor/></ProtectedRoute>
            },
            {
                path: "/dragon-core/managers",
                element: <ProtectedRoute requiredPermission="MANAGER_GET"><DragonCoreManagers/></ProtectedRoute>
            },
            {
                path: "/dragon-core/manager-detail",
                element: <ProtectedRoute requiredPermission="MANAGER_GET"><ManagerDetail/></ProtectedRoute>
            },
            {
                path: "/dragon-core/manager-edit",
                element: <ProtectedRoute requiredPermission="MANAGER_UPDATE"><ManagerEdit/></ProtectedRoute>
            },
            {
                path: "/dragon-core/permission-groups",
                element: <ProtectedRoute requiredPermission="ACCESS_GROUP_GET"><DragonCorePermissionGroups/></ProtectedRoute>
            },
            {
                path: "/finance/inventory/category",
                element: <ProtectedRoute requiredPermission="ITEM_CATEGORY_GET"><Category/></ProtectedRoute>
            },{
                path: "/finance/inventory/vendors",
                element: <ProtectedRoute requiredPermission="VENDOR_GET"><Vendors/></ProtectedRoute>
            },
            {
                path: "/finance/inventory/products",
                element: <ProtectedRoute requiredPermission="ITEM_GET"><Products/></ProtectedRoute>
            },
            {
                path: "/stock/StockView",
                element: <ProtectedRoute requiredPermission="STOCK_GET"><StockView/></ProtectedRoute>
            },
            {
                path: "/finance/inventory/subCategory/",
                element: <ProtectedRoute requiredPermission="ITEM_SUB_CATEGORY_GET"><SubCategory/></ProtectedRoute>
            },
            {
                path: "/finance/inventory/brand/",
                element: <ProtectedRoute requiredPermission="BRAND_GET"><Brands/></ProtectedRoute>
            },
            {
                path: "/finance/inventory/model//",
                element: <ProtectedRoute requiredPermission="MODEL_GET"><Models/></ProtectedRoute>
            },
            {
                path: "/finance/inventory/units/",
                element: <ProtectedRoute requiredPermission="UNIT_GET"><Units/></ProtectedRoute>
            },
            {
                path: "/inventory/stock-sheet",
                element: <ProtectedRoute requiredPermission="INVENTORY_VIEW_STOCK"><StockSheet/></ProtectedRoute>
            },
            {
                path: "/inventory/purchase",
                element: <ProtectedRoute requiredPermission="INVENTORY_PURCHASE"><PurchaseStock/></ProtectedRoute>
            },
            {
                path: "/inventory/sell",
                element: <ProtectedRoute requiredPermission="INVENTORY_SELL"><SellStock/></ProtectedRoute>
            },
            {
                path: "/inventory/rentals",
                element: <ProtectedRoute requiredPermission="INVENTORY_RENT"><Rentals/></ProtectedRoute>
            },
            {
                path: "/inventory/issue",
                element: <ProtectedRoute requiredPermission="INVENTORY_ISSUE"><IssueStock/></ProtectedRoute>
            },
            {
                path: "/inventory/balance-sheet",
                element: <ProtectedRoute requiredPermission="INVENTORY_VIEW_BALANCE"><BalanceSheet/></ProtectedRoute>
            },
            {
                path: "/support/tickets",
                element: <ProtectedRoute requiredPermission="TICKET_GET"><TicketsPage/></ProtectedRoute>
            },
            {
                path: "/support/tickets/create",
                element: <ProtectedRoute requiredPermission="TICKET_CREATE"><CreateTicketPage/></ProtectedRoute>
            },
            {
                path: "/support/tickets/edit/:id",
                element: <ProtectedRoute requiredPermission="TICKET_UPDATE"><CreateTicketPage/></ProtectedRoute>
            },
            {
                path: "/support/fault-reasons",
                element: <ProtectedRoute requiredPermission="FAULT_REASON_GET"><FaultReasonsPage/></ProtectedRoute>
            },
            {
                path: "/support/tasks",
                element: <ProtectedRoute requiredPermission="GET_ALL_TASK"><TasksPage/></ProtectedRoute>
            },
            {
                path: "/support/tasks/create",
                element: <ProtectedRoute requiredPermission="CREATE_TASK"><CreateTaskPage/></ProtectedRoute>
            },
            {
                path: "/support/tasks/edit/:id",
                element: <ProtectedRoute requiredPermission="TASK_UPDATE"><CreateTaskPage/></ProtectedRoute>
            },


            {
                path: "/access-control",
                element: <ProtectedRoute superAdminOnly><DragonCoreAccessControl/></ProtectedRoute>
            },

            {
                path: "/sub-admins",
                element: <ProtectedRoute requiredPermission="USER_GET"><SubAdminPage/></ProtectedRoute>
            },
            {
                path: "/sub-admin/create",
                element: <ProtectedRoute requiredPermission="USER_CREATE"><SubAdminCreate/></ProtectedRoute>
            },
            {
                path: "/sub-admin/activity-log/:id",
                element: <ProtectedRoute requiredPermission="USER_GET"><ActivityLogPage/></ProtectedRoute>
            },
            {
                path: "/my-activity-logs",
                element: <ProtectedRoute requiredPermission="VIEW_LOGS"><MyActivityLogPage/></ProtectedRoute>
            },
            {
                // Super Admin only — enforced inside BackupPage via isSuperAdmin()
                path: "/backup",
                element: <ProtectedRoute><BackupPageRoute/></ProtectedRoute>
            },
        ]
    },
])
