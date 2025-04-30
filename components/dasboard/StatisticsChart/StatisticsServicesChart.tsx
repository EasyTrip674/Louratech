"use client";
import React, { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { getClientServiceDataType } from "@/db/queries/dasboard.query";

// Import react-apexcharts dynamically to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Define the type for service client data
interface ServiceClientData {
  name: string;
  data: Array<{
    x: Date;
    y: number;
  }>;
}

// Define props type with sample data structure for services over time
interface StatisticsChartProps {
  clientServicesData: getClientServiceDataType
}

export default function StatisticsServiceChart({ clientServicesData }: StatisticsChartProps) {
  const [chartData, setChartData] = useState<ServiceClientData[]>([]);
  const [chartOptions, setChartOptions] = useState<ApexOptions>({});

  useEffect(() => {
    // Set the chart data from props
    setChartData(clientServicesData.series);

    // Configure chart options
    const options: ApexOptions = {
      chart: {
        locales: [
          {
            "name": "fr",
            "options": {
              "months": ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
              "shortMonths": ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
              "days": ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
              "shortDays": ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
              "toolbar": {
                "exportToSVG": "Télécharger SVG",
                "exportToPNG": "Télécharger PNG",
                "exportToCSV": "Télécharger CSV",
                "selection": "Sélection",
                "selectionZoom": "Zoom sur sélection",
                "zoomIn": "Zoom avant",
                "zoomOut": "Zoom arrière",
                "pan": "Déplacement",
                "reset": "Réinitialiser le zoom"
              }
            }
          }
          
        ],
        defaultLocale: "fr",
        fontFamily: "Outfit, sans-serif",
        type: "area",
        stacked: false,
        height: 350,
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: "zoom",
          offsetX: -50,
          offsetY: 35,
         
        }
      },
      colors: ["#465FFF", "#9CB9FF", "#FF6B8A", "#50C878", "#FFD700", "#800080"],
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
        strokeWidth: 2,
        hover: {
          size: 6
        }
      },
      title: {
        text: "Services",
        align: "left",
        style: {
          fontWeight: 600,
          fontFamily: "Outfit, sans-serif",
          color: "#1F2937"
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        }
      },
      yaxis: {
        title: {
          text: "Nombre de clients"
        },
        labels: {
          formatter: function(val) {
            return val.toFixed(0);
          }
        }
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM \'yy',
            day: 'dd MMM',
            hour: 'HH:mm'
          }
        },
        tooltip: {
          enabled: false
        }
      },
      tooltip: {
        shared: true,
        y: {
          formatter: function(val) {
            return val.toFixed(0) + " clients";
          }
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      },
      grid: {
        borderColor: "#e0e0e0",
        strokeDashArray: 5,
        yaxis: {
          lines: {
            show: true
          }
        }
      }
    };

    setChartOptions(options);
  }, [clientServicesData]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Évolution des Inscriptions par Service
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Zoomez pour voir les détails d&apos;une période spécifique
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <button className="px-3 py-1 text-sm border rounded-md border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            Ce mois
          </button>
          <button className="px-3 py-1 text-sm border rounded-md border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            Cette année
          </button>
          <button className="px-3 py-1 text-sm border rounded-md border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            Tout
          </button> */}
        </div>
      </div>
      <div className="max-w-full overflow-hidden">
        <div className="min-w-full h-[350px]">
          {typeof window !== 'undefined' && chartData.length > 0 && (
            <ReactApexChart
              options={chartOptions}
              series={chartData}
              type="area"
              height={350}
              
            />
          )}
        </div>
      </div>
    </div>
  );
}