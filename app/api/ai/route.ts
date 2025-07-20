import { NextResponse } from "next/server";
import {
  clientService,
  employeeService,
  transactionService,
  procedureService,
  dashboardService,
  organizationService,
  authorizationService,
} from "@/lib/services";

export async function GET() {
  try {
    // Appels en parallèle pour chaque service
    const [
      clients,
      employees,
      transactions,
      procedures,
      dashboardStats,
      monthlySales,
      statistics,
      recentOrders,
      organization,
      authorizations,
    ] = await Promise.all([
      clientService.getAllClients(),
      employeeService.getAllEmployees(),
      transactionService.getAllTransactions ? transactionService.getAllTransactions() : [],
      procedureService.getAllProcedures(),
      dashboardService.getDashboardStats(),
      dashboardService.getClientServiceData ? dashboardService.getClientServiceData() : [],
      dashboardService.getStatisticsData ? dashboardService.getStatisticsData() : [],
      dashboardService.getRecentOrders ? dashboardService.getRecentOrders() : [],
      organizationService.getCurrentOrganization ? organizationService.getCurrentOrganization() : {},
      authorizationService.getUserAuthorization ? authorizationService.getUserAuthorization("") : {},
    ]);

    return NextResponse.json({
      clientService: { clients },
      employeeService: { employees },
      transactionService: { transactions },
      procedureService: { procedures },
      dashboardService: {
        dashboardStats,
        monthlySales,
        statistics,
        recentOrders,
      },
      organizationService: { organization },
      authorizationService: { authorizations },
    });
  } catch (error) {
    console.error("Erreur lors du fetch global des services:", error);
    return NextResponse.json({ error: "Erreur lors du fetch global des services" }, { status: 500 });
  }
}
