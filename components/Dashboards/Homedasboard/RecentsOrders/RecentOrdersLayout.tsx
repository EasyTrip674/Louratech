import { recentOrders } from "@/db/queries/dasboard.query";
import RecentOrders from "./RecentOrders";


export const RecentOrdersLayout = async()=>{
  const recentOrdersClientProcedures = await recentOrders();


    return (
        <>
            <RecentOrders clientProcedureData={recentOrdersClientProcedures} />
        </>
    )
}