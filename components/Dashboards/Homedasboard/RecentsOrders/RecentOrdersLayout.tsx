"use client";
import useRecentOrders from "@/db/queries/hooks/useRecentOrders";
import RecentOrders from "./RecentOrders";


export const RecentOrdersLayout = ()=>{
  const recentOrdersClientProcedures = useRecentOrders();


    return (
        <>
            <RecentOrders clientProcedureData={recentOrdersClientProcedures} />
        </>
    )
}