import { getMonthlyTargetStats } from "@/db/queries/dasboard.query";
import MonthlyTarget from "./MonthlyTarget";


export const MonthlyTargetLayout = async()=>{
  const MonthlyTargetData = await getMonthlyTargetStats();


    return (
        <>
            <MonthlyTarget MonthlyTargetData={MonthlyTargetData} />
        </>
    )
}