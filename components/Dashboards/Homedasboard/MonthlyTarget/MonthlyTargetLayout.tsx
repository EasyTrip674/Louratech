"use client"
import useMonthlyTargetStats from "@/db/queries/hooks/useMonthlyTargetStats";
import MonthlyTarget from "./MonthlyTarget";


export const MonthlyTargetLayout = ()=>{
  const MonthlyTargetData =  useMonthlyTargetStats();

    return (
        <>
            <MonthlyTarget MonthlyTargetData={MonthlyTargetData} />
        </>
    )
}