import { getClientServiceData } from "@/db/queries/dasboard.query";
import StatisticsServiceClient from "./StatisticsServicesClient";

export const StatisticsServiceLayout = async ()=>{
       const ClientServiceData = await getClientServiceData("all");
    return (
        <>
            <StatisticsServiceClient servicesClientData={ClientServiceData} />
        </>
    )
}