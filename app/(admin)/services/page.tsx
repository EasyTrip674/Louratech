import type { Metadata } from "next";
import React, { Suspense } from "react";
import { dashboardService } from "@/lib/services";

// Composants du dashboard
import { MonthSalesChartLayout } from "@/components/Dashboards/Homedasboard/MonthlySalesChart/MonthSalesChartLayout";
import { MonthlyTargetLayout } from "@/components/Dashboards/Homedasboard/MonthlyTarget/MonthlyTargetLayout";
import MonthlyTargetSkeleton from "@/components/Dashboards/Homedasboard/MonthlyTarget/MonthlyTargetSkeleton";
import { StatisticsServiceLayout } from "@/components/Dashboards/Homedasboard/StatisticsChart/StatisticsChartLayout";
import { ProceduresMetrics } from "@/components/Dashboards/Homedasboard/ProcedureMetrics/ProceduresMetrics";
import StatisticsServiceSkeleton from "@/components/Dashboards/Homedasboard/StatisticsChart/StatisticsChartSkeleton";
// import RecentOrdersSkeleton from "@/components/Dashboards/Homedasboard/RecentsOrders/RecentOrdersSkeleton";
// import { RecentOrdersLayout } from "@/components/Dashboards/Homedasboard/RecentsOrders/RecentOrdersLayout";
import MonthlySalesChartSkeleton from "@/components/Dashboards/Homedasboard/MonthlySalesChart/MonthySalesChartSkeleton";
import { ProceduresMetricsSkeleton } from "@/components/Dashboards/Homedasboard/ProcedureMetrics/ProceduresMetricsSkeleton";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard page",
};

// Composant pour récupérer les données du dashboard
async function DashboardDataProvider({ children }: { children: React.ReactNode }) {
  try {
    // Récupérer les données du dashboard
    // const dashboardStats = await dashboardService.getDashboardStats();

    // Passer les données aux composants enfants via un contexte ou props
    return (
      // <div className="dashboard-data" data-stats={JSON.stringify(dashboardStats)}>
      //   {children}
      // </div>
      <div>
        {children}
      </div>
    );
  } catch (error) {
    console.error("Erreur lors du chargement des données du dashboard:", error);
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erreur lors du chargement des données</p>
      </div>
    );
  }
}




export default async function DashboardPage() {
  return (
    <DashboardDataProvider>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <Suspense fallback={<ProceduresMetricsSkeleton />}>
            <ProceduresMetrics />
          </Suspense>
          
          <Suspense fallback={<MonthlySalesChartSkeleton />}>
            <MonthSalesChartLayout />
          </Suspense>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <Suspense fallback={<MonthlyTargetSkeleton />}>
            <MonthlyTargetLayout />
          </Suspense>
        </div>

        <div className="col-span-12">
          <Suspense fallback={<StatisticsServiceSkeleton />}>
            <StatisticsServiceLayout />
          </Suspense>
        </div>

        {/* <div className="col-span-12">
          <Suspense fallback={<RecentOrdersSkeleton />}>
            <RecentOrdersLayout />
          </Suspense>
        </div> */}
      </div>
    </DashboardDataProvider>
  );
}
