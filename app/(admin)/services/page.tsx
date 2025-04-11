import type { Metadata } from "next";
import { ProceduresMetrics } from "@/components/stats/ProceduresMetrics";
import React from "react";
import MonthlyTarget from "@/components/stats/MonthlyTarget";
import MonthlySalesChart from "@/components/stats/MonthlySalesChart";
import StatisticsChart from "@/components/stats/StatisticsChart";
import RecentOrders from "@/components/stats/RecentOrders";
import DemographicCard from "@/components/stats/DemographicCard";
import { getDemographicData, getMonthlySalesData, getMonthlyTargetStats, getStatisticsData } from "@/db/queries/dasboard.query";

export const metadata: Metadata = {
  title:
  
    "Dashboard",
  description:
    "Dashboard page",
};

export default async function  DashboardPage() {

  

  const MonthlyTargetData = await getMonthlyTargetStats();
  const monthlySalesData = await getMonthlySalesData();
   const statisticsData = await getStatisticsData()
   const demographicData = await getDemographicData();

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <ProceduresMetrics />
        <MonthlySalesChart monthlySalesData={monthlySalesData}/>
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget MonthlyTargetData={MonthlyTargetData} />
      </div>

      <div className="col-span-12">
        <StatisticsChart statisticsData={statisticsData} />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard demographicData={demographicData} />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}
