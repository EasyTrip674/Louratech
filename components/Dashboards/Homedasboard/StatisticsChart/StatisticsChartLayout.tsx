"use client"
import useStatisticsData from "@/db/queries/hooks/useStatisticsData";
import StatisticsServiceClient from "./StatisticsServicesClient";

export const StatisticsServiceLayout =  ()=>{
       const ClientServiceData =  useStatisticsData();
    return (
        <>
            <StatisticsServiceClient servicesClientData={ClientServiceData} />
        </>
    )
}