/**
 * Central export file for all API services
 * Import services from here in your components
 */


export { default as EmployeeService } from './employeeService';
export { default as DepartmentDesignationService } from './departmentDesignationService';
export { default as DistributionPortService } from './distributionPortService';
export { default as AreaService } from './areaService';
export { default as AllowanceService } from './allowanceService';
export { default as IpPoolService } from './ipPoolService';
export { default as ManagerService } from './managerService';
export { default as OfficeLocationService } from './officeLocationService';
export { default as PermissionGroupService } from './permissionGroupService';
export { default as ProfileService } from './profileService';
export { default as PromotionService } from './promotionService';
export { default as AccessGroupService } from './accessGroupService';
export { default as TeamService } from './teamService';
export { default as FaultReasonService } from './faultReasonService';
export { default as CustomerService } from './customerService.js';
export { default as TicketService } from './ticketService.js';
export { default as TaskService } from './taskService.js';
export { default as InventoryService } from './inventoryService.js';
export { default as axiosInstance, apiConfig, buildQueryString } from './axiosConfig';

// Re-export for backward compatibility
export { default as ApiUrls } from './DragonApi';
