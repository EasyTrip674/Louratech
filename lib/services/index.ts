export { BaseService } from "./base.service";
export { ClientService, type CreateClientData, type UpdateClientData } from "./client.service";
export { EmployeeService, type CreateEmployeeData, type UpdateEmployeeData } from "./employee.service";
export { TransactionService, type CreateTransactionData, type UpdateTransactionData } from "./transaction.service";
export { ProcedureService, type CreateProcedureData, type UpdateProcedureData, type CreateStepData, type UpdateStepData } from "./procedure.service";
export { AuthorizationService, type AuthorizationData } from "./authorization.service";
export { DashboardService, type DashboardStats, type MonthlySalesData, type StatisticsData, type RecentOrder } from "./dashboard.service";
export { OrganizationService, type OrganizationData, type ComptaSettingsData, type UpdateOrganizationData } from "./organization.service";

// Instance des services pour utilisation directe
import { ClientService } from "./client.service";
import { EmployeeService } from "./employee.service";
import { TransactionService } from "./transaction.service";
import { ProcedureService } from "./procedure.service";
import { AuthorizationService } from "./authorization.service";
import { DashboardService } from "./dashboard.service";
import { OrganizationService } from "./organization.service";

export const clientService = new ClientService();
export const employeeService = new EmployeeService();
export const transactionService = new TransactionService();
export const procedureService = new ProcedureService();
export const authorizationService = new AuthorizationService();
export const dashboardService = new DashboardService();
export const organizationService = new OrganizationService(); 