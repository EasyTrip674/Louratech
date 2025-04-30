"use client";
import { useState, useEffect } from "react";
import { getClientServiceDataType } from "@/db/queries/dasboard.query";
import StatisticsServiceChart from "./StatisticsServicesChart";

// Sample data to demonstrate the component


export default function StatisticsServiceClient(
  {
    servicesClientData
  }:{
    servicesClientData: getClientServiceDataType
  }

) {
  const [clientServicesData, setClientServicesData] = useState<getClientServiceDataType>();

  useEffect(() => {
    setClientServicesData({
      series: servicesClientData.series
    });
  }, []);

  if (!clientServicesData) {
    return null;
  }

  return (
      <div className="mb-8">
        <StatisticsServiceChart clientServicesData={clientServicesData} />
      </div>
  );
}