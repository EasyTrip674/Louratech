import { recentOrders } from "@/db/queries/dasboard.query";
import RecentOrders from "./RecentOrders";


export const RecentOrdersLayout = async()=>{
  const RecentOrgdersData = await recentOrders();


    return (
        <>
            <RecentOrders clientData={RecentOrgdersData} />
        </>
    )
}