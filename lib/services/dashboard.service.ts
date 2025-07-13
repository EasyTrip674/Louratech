import { BaseService } from "./base.service";
import { startOfMonth, endOfMonth } from "date-fns";

export interface DashboardStats {
  monthlyRevenue: number;
  monthlyExpenses: number;
  todayRevenue: number;
  netIncome: number;
  totalClients: number;
  totalEmployees: number;
  totalProcedures: number;
  activeProcedures: number;
  completedProcedures: number;
  pendingProcedures: number;
}

export interface MonthlySalesData {
  series: Array<{
    name: string;
    data: number[];
  }>;
}

export interface StatisticsData {
  series: Array<{
    name: string;
    data: number[];
  }>;
}

export interface RecentOrder {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

export class DashboardService extends BaseService {
  /**
   * Récupère toutes les statistiques du dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const organizationId = await this.getOrganizationId();
      const now = new Date();
      const startOfCurrentMonth = startOfMonth(now);
      const endOfCurrentMonth = endOfMonth(now);

      // Statistiques financières
      const [monthlyRevenue, monthlyExpenses, todayRevenue] = await Promise.all([
        this.getMonthlyRevenue(organizationId, startOfCurrentMonth, endOfCurrentMonth),
        this.getMonthlyExpenses(organizationId, startOfCurrentMonth, endOfCurrentMonth),
        this.getTodayRevenue(organizationId, now),
      ]);

      // Statistiques des entités
      const [totalClients, totalEmployees, totalProcedures] = await Promise.all([
        this.getTotalClients(organizationId),
        this.getTotalEmployees(organizationId),
        this.getTotalProcedures(organizationId),
      ]);

      // Statistiques des procédures
      const [activeProcedures, completedProcedures, pendingProcedures] = await Promise.all([
        this.getActiveProcedures(organizationId),
        this.getCompletedProcedures(organizationId),
        this.getPendingProcedures(organizationId),
      ]);

      return {
        monthlyRevenue,
        monthlyExpenses,
        todayRevenue,
        netIncome: monthlyRevenue - monthlyExpenses,
        totalClients,
        totalEmployees,
        totalProcedures,
        activeProcedures,
        completedProcedures,
        pendingProcedures,
      };
    } catch (error) {
      this.handleDatabaseError(error, "getDashboardStats");
    }
  }

  /**
   * Récupère les données de ventes mensuelles
   */
  async getMonthlySalesData(): Promise<MonthlySalesData> {
    try {
      const organizationId = await this.getOrganizationId();
      const now = new Date();
      const currentYear = now.getFullYear();

      // Récupérer les revenus mensuels pour l'année en cours
      const monthlyRevenues = await this.prisma.transaction.groupBy({
        by: ['date'],
        where: {
          organizationId,
          type: "REVENUE",
          status: "APPROVED",
          date: {
            gte: new Date(currentYear, 0, 1),
            lte: new Date(currentYear, 11, 31),
          },
        },
        _sum: {
          amount: true,
        },
      });

      // Initialiser les données mensuelles
      const monthlyData = Array(12).fill(0);

      // Remplir les données mensuelles
      monthlyRevenues.forEach(revenue => {
        const month = new Date(revenue.date).getMonth();
        monthlyData[month] = (revenue._sum?.amount || 0) / 1000; // Convertir en K
      });

      return {
        series: [{
          name: "Revenue",
          data: monthlyData,
        }],
      };
    } catch (error) {
      this.handleDatabaseError(error, "getMonthlySalesData");
    }
  }

  /**
   * Récupère les données de statistiques
   */
  async getStatisticsData(): Promise<StatisticsData> {
    try {
      const organizationId = await this.getOrganizationId();
      const now = new Date();
      const currentYear = now.getFullYear();

      // Récupérer les transactions approuvées pour l'année en cours
      const monthlyTransactions = await this.prisma.transaction.groupBy({
        by: ['date', 'type'],
        where: {
          organizationId,
          status: "APPROVED",
          type: {
            in: ["REVENUE", "EXPENSE"]
          },
          date: {
            gte: new Date(currentYear, 0, 1),
            lte: new Date(currentYear, 11, 31),
          },
        },
        _sum: {
          amount: true,
        },
      });

      // Initialiser les données mensuelles
      const revenueData = Array(12).fill(0);
      const expenseData = Array(12).fill(0);

      // Remplir les données mensuelles
      monthlyTransactions.forEach(transaction => {
        const month = new Date(transaction?.date).getMonth();
        const amount = (transaction._sum?.amount || 0) / 1000; // Convertir en K
        
        if (transaction.type === "REVENUE") {
          revenueData[month] = amount;
        } else if (transaction.type === "EXPENSE") {
          expenseData[month] = amount;
        }
      });

      return {
        series: [
          {
            name: "Revenue",
            data: revenueData,
          },
          {
            name: "Depense",
            data: expenseData,
          },
        ],
      };
    } catch (error) {
      this.handleDatabaseError(error, "getStatisticsData");
    }
  }

  /**
   * Récupère les commandes récentes
   */
  async getRecentOrders(): Promise<RecentOrder[]> {
    try {
      const organizationId = await this.getOrganizationId();
      
      const clients = await this.prisma.client.findMany({
        where: {
          organizationId,
        },
        select: {
          id: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });

      return clients.map(client => ({
        id: client.id,
        firstName: client.user.firstName || "",
        lastName: client.user.lastName || "",
        email: client.user.email || "",
        createdAt: client.createdAt,
      }));
    } catch (error) {
      this.handleDatabaseError(error, "getRecentOrders");
    }
  }

  /**
   * Récupère les données des services clients
   */
  async getClientServiceData(timeRange: 'month' | 'year' | 'all' = 'all') {
    try {
      const organizationId = await this.getOrganizationId();
      const now = new Date();
      
      // Définir la période
      let startDate;
      switch (timeRange) {
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'all':
        default:
          startDate = new Date(2000, 0, 1);
          break;
      }

      // Récupérer toutes les procédures de l'organisation
      const procedures = await this.prisma.procedure.findMany({
        where: {
          organizationId,
          isActive: true
        },
        select: {
          id: true,
          name: true
        }
      });

      // Pour chaque procédure, récupérer les données d'inscription des clients
      const seriesData = await Promise.all(
        procedures.map(async (procedure) => {
          const clientProcedures = await this.prisma.clientProcedure.findMany({
            where: {
              organizationId,
              procedureId: procedure.id,
              startDate: {
                gte: startDate
              }
            },
            orderBy: {
              startDate: 'asc'
            },
            select: {
              startDate: true,
              procedureId: true
            }
          });

          // Grouper les données par date
          const groupedByDate = clientProcedures.reduce((acc, cp) => {
            const dateKey = cp.startDate.toISOString().split('T')[0];
            
            if (!acc[dateKey]) {
              acc[dateKey] = 0;
            }
            acc[dateKey]++;
            
            return acc;
          }, {} as Record<string, number>);

          // Convertir en données cumulatives
          const cumulativeData: Array<{
            x: Date;
            y: number;
          }> = [];
          let cumulativeCount = 0;
          
          Object.keys(groupedByDate).sort().forEach(date => {
            cumulativeCount += groupedByDate[date];
            cumulativeData.push({
              x: new Date(date),
              y: cumulativeCount
            });
          });

          return {
            name: procedure.name,
            data: cumulativeData
          };
        })
      );

      // Filtrer les procédures sans données client
      const filteredSeriesData = seriesData.filter(series => series.data.length > 0);

      return {
        series: filteredSeriesData
      };
    } catch (error) {
      this.handleDatabaseError(error, "getClientServiceData");
    }
  }

  // Méthodes privées pour les calculs

  private async getMonthlyRevenue(organizationId: string, startDate: Date, endDate: Date): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        organizationId,
        type: "REVENUE",
        status: "APPROVED",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });
    return result._sum?.amount || 0;
  }

  private async getMonthlyExpenses(organizationId: string, startDate: Date, endDate: Date): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        organizationId,
        type: "EXPENSE",
        status: "APPROVED",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });
    return result._sum?.amount || 0;
  }

  private async getTodayRevenue(organizationId: string, now: Date): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        organizationId,
        type: "REVENUE",
        status: "APPROVED",
        date: {
          gte: new Date(now.setHours(0, 0, 0, 0)),
          lte: new Date(now.setHours(23, 59, 59, 999)),
        },
      },
      _sum: {
        amount: true,
      },
    });
    return result._sum?.amount || 0;
  }

  private async getTotalClients(organizationId: string): Promise<number> {
    return await this.prisma.client.count({
      where: { organizationId }
    });
  }

  private async getTotalEmployees(organizationId: string): Promise<number> {
    return await this.prisma.admin.count({
      where: { organizationId }
    });
  }

  private async getTotalProcedures(organizationId: string): Promise<number> {
    return await this.prisma.procedure.count({
      where: { organizationId }
    });
  }

  private async getActiveProcedures(organizationId: string): Promise<number> {
    return await this.prisma.clientProcedure.count({
      where: {
        organizationId,
        status: "IN_PROGRESS"
      }
    });
  }

  private async getCompletedProcedures(organizationId: string): Promise<number> {
    return await this.prisma.clientProcedure.count({
      where: {
        organizationId,
        status: "COMPLETED"
      }
    });
  }

  private async getPendingProcedures(organizationId: string): Promise<number> {
    return await this.prisma.clientProcedure.count({
      where: {
        organizationId,
        status: "IN_PROGRESS"
      }
    });
  }
} 