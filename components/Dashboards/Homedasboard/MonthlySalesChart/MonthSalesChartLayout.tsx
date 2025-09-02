// layout
"use client"

import useMonthlySalesData from "@/db/queries/hooks/useMonthlySalesData";
import MonthlySalesChart from "./MonthlySalesChart";

export const MonthSalesChartLayout = ()=>{

  const monthlySalesData = useMonthlySalesData();


    return (
        <>
            <MonthlySalesChart statisticsData={monthlySalesData}/>
        </>
    )
}