import type { Metadata } from "next";
import { ProceduresMetrics } from "@/components/stats/ProceduresMetrics";
import React from "react";
import MonthlyTarget from "@/components/stats/MonthlyTarget";
import MonthlySalesChart from "@/components/stats/MonthlySalesChart";
import StatisticsChart from "@/components/stats/StatisticsChart";
import RecentOrders from "@/components/stats/RecentOrders";
import DemographicCard from "@/components/stats/DemographicCard";

export const metadata: Metadata = {
  title:
    "Dashboard",
  description:
    "Dashboard page",
};

export default function Home() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <ProceduresMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}
