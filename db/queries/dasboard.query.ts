// services/statsService.ts
import { api } from "../../lib/BackendConfig/api"; // Votre configuration API existante

// Types correspondant aux données retournées par Django
export interface TopPerformer {
  id: number;
  name: string;
  activeProcedures: number;
  managedProcedures: number;
  completedSteps: number;
  totalWorkload: number;
}

export interface EmployeeMetrics {
  totalActiveEmployees: number;
  totalActiveProcedures: number;
  totalCompletedProcedures: number;
  averageWorkload: number;
  efficiencyRate: number;
  topPerformers: TopPerformer[];
}

export interface MonthlyTargetStats {
  target: number;
  lastMonthAmount: number;
  revenue: number;
  progress: number;
  growth: number;
  message: string;
  currentMonthAmount: number;
  today: number;
  employeeMetrics: EmployeeMetrics;
}

export interface SeriesData {
  name: string;
  data: number[];
}

export interface ChartData {
  series: SeriesData[];
}

export interface ClientServiceDataPoint {
  x: string;
  y: number;
}

export interface ClientServiceSeries {
  name: string;
  data: ClientServiceDataPoint[];
}

export interface ClientServiceData {
  series: ClientServiceSeries[];
}

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
}

export interface RecentOrder {
  id: number;
  createdAt: string;
  status: string;
  startDate: string | null;
  completionDate: string | null;
  client: Client;
}

export interface RecentOrders {
  orders: RecentOrder[];
}

// Services pour les statistiques
class StatsService {
  /**
   * Récupère les statistiques mensuelles d'objectifs
   * Équivalent à getMonthlyTargetStats()
   */
  async getMonthlyTargetStats(): Promise<MonthlyTargetStats> {
    try {
      const response = await api.get<MonthlyTargetStats>("/api/core/dashboard/monthly-target/");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques mensuelles:", error);
      throw error;
    }
  }

  /**
   * Récupère les données de vente mensuelles
   * Équivalent à getMonthlySalesData()
   */
  async getMonthlySalesData(): Promise<ChartData> {
    try {
      const response = await api.get<ChartData>("/api/core/dashboard/monthly-sales/");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des données de ventes mensuelles:", error);
      throw error;
    }
  }

  /**
   * Récupère les données statistiques (revenus vs dépenses)
   * Équivalent à getStatisticsData()
   */
  async getStatisticsData(): Promise<ChartData> {
    try {
      const response = await api.get<ChartData>("/api/core/dashboard/statistics/");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des données statistiques:", error);
      throw error;
    }
  }

  /**
   * Récupère les données de service client
   * Équivalent à getClientServiceData()
   * @param timeRange - 'month' | 'year' | 'all'
   */
  async getClientServiceData(timeRange: 'month' | 'year' | 'all' = 'all'): Promise<ClientServiceData> {
    try {
      const response = await api.get<ClientServiceData>("/api/core/dashboard/client-service/", {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des données de service client:", error);
      throw error;
    }
  }

  /**
   * Récupère les commandes récentes
   * Équivalent à recentOrders()
   */
  async getRecentOrders(): Promise<RecentOrders> {
    try {
      const response = await api.get<RecentOrders>("/api/core/dashboard/recent-orders/");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes récentes:", error);
      throw error;
    }
  }

  /**
   * Récupère toutes les données du dashboard en une seule fois
   * Utile pour optimiser les appels API
   */
  async getAllDashboardData(timeRange: 'month' | 'year' | 'all' = 'all') {
    try {
      const [
        monthlyTargetStats,
        monthlySalesData,
        statisticsData,
        clientServiceData,
        recentOrders
      ] = await Promise.all([
        this.getMonthlyTargetStats(),
        this.getMonthlySalesData(),
        this.getStatisticsData(),
        this.getClientServiceData(timeRange),
        this.getRecentOrders()
      ]);

      return {
        monthlyTargetStats,
        monthlySalesData,
        statisticsData,
        clientServiceData,
        recentOrders
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des données du dashboard:", error);
      throw error;
    }
  }
}

// Instance singleton
export const statsService = new StatsService();

// Hooks are defined under `db/queries/hooks/`. Import them directly from their files to avoid circular dependencies.