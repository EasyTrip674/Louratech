"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { getStatisticsDataType } from "@/db/queries/dasboard.query";
import { useCopilotReadable } from "@copilotkit/react-core";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart({statisticsData}:{statisticsData:getStatisticsDataType}) {
  

  useCopilotReadable({
    description: "MonthlySalesChart",
    value: statisticsData,
  });
  
  const options: ApexOptions = {
    colors: ["#10B981", "#EF4444"], // Green for revenue, Red for expenses
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
    toolbar: {
        show: false,
      },
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Janv",
        "Fév",
        "Mars",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Août",
        "Sept",
        "Oct",
        "Nov",
        "Déc",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}K`,
      },
    },
  };
  


  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Revenus et Dépenses Mensuels
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={statisticsData.series}
            type="bar"
            height={180}
          />
        </div>
      </div>
    </div>
  );
}