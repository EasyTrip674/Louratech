import type { Metadata } from "next";
import React, { Suspense } from "react";
import { MonthSalesChartLayout } from "@/components/dasboard/MonthlySalesChart/MonthSalesChartLayout";
import { MonthlyTargetLayout } from "@/components/dasboard/MonthlyTarget/MonthlyTargetLayout";
import MonthlyTargetSkeleton from "@/components/dasboard/MonthlyTarget/MonthlyTargetSkeleton";
import { StatisticsServiceLayout } from "@/components/dasboard/StatisticsChart/StatisticsChartLayout";
import { ProceduresMetrics } from "@/components/dasboard/ProcedureMetrics/ProceduresMetrics";
import StatisticsServiceSkeleton from "@/components/dasboard/StatisticsChart/StatisticsChartSkeleton";
import RecentOrdersSkeleton from "@/components/dasboard/RecentsOrders/RecentOrdersSkeleton";
import { RecentOrdersLayout } from "@/components/dasboard/RecentsOrders/RecentOrdersLayout";
import MonthlySalesChartSkeleton from "@/components/dasboard/MonthlySalesChart/MonthySalesChartSkeleton";
import { ProceduresMetricsSkeleton } from "@/components/dasboard/ProcedureMetrics/ProceduresMetricsSkeleton";

export const metadata: Metadata = {
  title:
  
    "Dashboard",
  description:
    "Dashboard page",
};

export default async function  DashboardPage() {

  


   

  return (
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



      <div className="col-span-12 ">
        <Suspense fallback={<RecentOrdersSkeleton />}>
          <RecentOrdersLayout />
        </Suspense>
      </div>
    </div>
  );
}
