import type { Metadata } from "next";
import { ProceduresMetrics } from "@/components/stats/ProceduresMetrics";
import React from "react";
import MonthlyTarget from "@/components/stats/MonthlyTarget";
import RecentOrders from "@/components/stats/RecentOrders";
import {  getClientServiceData,  getMonthlyTargetStats, getStatisticsData } from "@/db/queries/dasboard.query";
import StatisticsServiceClient from "@/components/stats/StatisticsServicesClient";
import MonthlySalesChart from "@/components/stats/MonthlySalesChart";

export const metadata: Metadata = {
  title:
  
    "Dashboard",
  description:
    "Dashboard page",
};

export default async function  DashboardPage() {

  

  const MonthlyTargetData = await getMonthlyTargetStats();
  const monthlySalesData = await getStatisticsData();
   const ClientServiceData = await getClientServiceData("all");

   

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <ProceduresMetrics />
        {
          monthlySalesData && (
            <MonthlySalesChart statisticsData={monthlySalesData}/>
          )
        }
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget MonthlyTargetData={MonthlyTargetData} />
      </div>

      <div className="col-span-12">
        {/* <StatisticsChart statisticsData={statisticsData} />
         */}
         <StatisticsServiceClient servicesClientData={ClientServiceData} />
      </div>

      {/* <div className="col-span-12 xl:col-span-5"> */}
        {/* <DemographicCard demographicData={demographicData} /> */}
      {/* </div> */}

      <div className="col-span-12 ">
        <RecentOrders />
      </div>
    </div>
  );
}
