import type { Metadata } from "next";
import React, { Suspense } from "react";
import { MonthSalesChartLayout } from "@/components/Dashboards/Homedasboard/MonthlySalesChart/MonthSalesChartLayout";
import { MonthlyTargetLayout } from "@/components/Dashboards/Homedasboard/MonthlyTarget/MonthlyTargetLayout";
import MonthlyTargetSkeleton from "@/components/Dashboards/Homedasboard/MonthlyTarget/MonthlyTargetSkeleton";
import { StatisticsServiceLayout } from "@/components/Dashboards/Homedasboard/StatisticsChart/StatisticsChartLayout";
import { ProceduresMetrics } from "@/components/Dashboards/Homedasboard/ProcedureMetrics/ProceduresMetrics";
import StatisticsServiceSkeleton from "@/components/Dashboards/Homedasboard/StatisticsChart/StatisticsChartSkeleton";
import RecentOrdersSkeleton from "@/components/Dashboards/Homedasboard/RecentsOrders/RecentOrdersSkeleton";
import { RecentOrdersLayout } from "@/components/Dashboards/Homedasboard/RecentsOrders/RecentOrdersLayout";
import MonthlySalesChartSkeleton from "@/components/Dashboards/Homedasboard/MonthlySalesChart/MonthySalesChartSkeleton";
import { ProceduresMetricsSkeleton } from "@/components/Dashboards/Homedasboard/ProcedureMetrics/ProceduresMetricsSkeleton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title:
  
    "Dashboard",
  description:
    "Dashboard page",
};

export default async function  DashboardPage() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.userDetails) {
    redirect("/auth/signin");
  }

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
