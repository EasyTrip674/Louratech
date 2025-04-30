// layout

import { getStatisticsData } from "@/db/queries/dasboard.query";
import MonthlySalesChart from "./MonthlySalesChart";

export const MonthSalesChartLayout = async()=>{

  const monthlySalesData = await getStatisticsData();


    return (
        <>
            <MonthlySalesChart statisticsData={monthlySalesData}/>
        </>
    )
}