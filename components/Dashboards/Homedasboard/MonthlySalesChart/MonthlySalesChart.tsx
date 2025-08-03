"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState } from "react";
import { getStatisticsDataType } from "@/db/queries/dasboard.query";
import { useCopilotReadable } from "@copilotkit/react-core";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type ChartType = 'bar' | 'line' | 'area' | 'mixed';
type ViewType = 'monthly' | 'quarterly' | 'yearly';

export default function AdvancedStatisticsChart({
  statisticsData
}: {
  statisticsData: getStatisticsDataType
}) {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [viewType, setViewType] = useState<ViewType>('monthly');
  const [showDataLabels, setShowDataLabels] = useState(false);

  useCopilotReadable({
    description: "AdvancedStatisticsChart with multiple visualization options",
    value: { statisticsData, chartType, viewType },
  });

  // Calcul des données agrégées selon le type de vue
  const getAggregatedData = () => {
    if (viewType === 'quarterly') {
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      return {
        categories: quarters,
        series: statisticsData.series.map(serie => ({
          ...serie,
          data: [
            // Moyenne des 3 premiers mois (Jan-Mar)
            serie.data.slice(0, 3).reduce((a, b) => a + b, 0) / 3,
            // Moyenne des mois 4-6 (Apr-Jun)
            serie.data.slice(3, 6).reduce((a, b) => a + b, 0) / 3,
            // Moyenne des mois 7-9 (Jul-Sep)
            serie.data.slice(6, 9).reduce((a, b) => a + b, 0) / 3,
            // Moyenne des mois 10-12 (Oct-Dec)
            serie.data.slice(9, 12).reduce((a, b) => a + b, 0) / 3,
          ]
        }))
      };
    } else if (viewType === 'yearly') {
      return {
        categories: ['2024'],
        series: statisticsData.series.map(serie => ({
          ...serie,
          data: [serie.data.reduce((a, b) => a + b, 0) / 12] // Moyenne annuelle
        }))
      };
    }
    
    // Vue mensuelle par défaut
    return {
      categories: [
        "Janv", "Fév", "Mars", "Avr", "Mai", "Juin",
        "Juil", "Août", "Sept", "Oct", "Nov", "Déc"
      ],
      series: statisticsData.series
    };
  };

  const { categories, series } = getAggregatedData();

  const getChartOptions = (): ApexOptions => {
    const baseOptions: ApexOptions = {
      colors: ["#10B981", "#EF4444", "#3B82F6", "#F59E0B"],
      chart: {
        fontFamily: "Outfit, sans-serif",
        height: 350,
        type: chartType === 'mixed' ? 'line' : chartType,
        stacked: false,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        },
        animations: {
          enabled: true,
          speed: 800,
        },
        background: 'transparent'
      },
      dataLabels: {
        enabled: showDataLabels,
        style: {
          fontSize: '12px',
          fontWeight: 'bold'
        }
      },
      stroke: {
        show: true,
        width: chartType === 'line' ? 3 : chartType === 'mixed' ? [0, 3, 3] : 2,
        colors: ["transparent"],
        curve: 'smooth'
      },
      xaxis: {
        categories,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            fontSize: '12px',
            fontWeight: '500'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Montant (Kfng)',
          style: {
            fontSize: '14px',
            fontWeight: '600'
          }
        },
        labels: {
          formatter: (val: number) => `${val.toFixed(0)}K`
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        fontFamily: "Outfit",
        fontSize: '14px',
      },
      grid: {
        show: true,
        borderColor: '#e5e7eb',
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      fill: {
        opacity: chartType === 'area' ? 0.6 : chartType === 'mixed' ? [0.85, 0.25, 0.25] : 1,
        gradient: chartType === 'area' ? {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.1,
        } : undefined
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: 'light',
        style: {
          fontSize: '12px',
          fontFamily: 'Outfit'
        },
        y: {
          formatter: (val: number) => `${val?.toFixed(1)}K fng`
        }
      },
      responsive: [{
        breakpoint: 768,
        options: {
          chart: {
            height: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    // Configuration spécifique selon le type de graphique
    if (chartType === 'mixed') {
      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'line'
        },
        stroke: {
          width: [0, 3, 3],
          curve: 'smooth'
        },
        plotOptions: {
          bar: {
            columnWidth: '50%',
            borderRadius: 4
          }
        }
      };
    } else if (chartType === 'bar') {
      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'bar'
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 6,
            borderRadiusApplication: 'end',
            dataLabels: {
              position: 'top'
            }
          }
        }
      };
    } else if (chartType === 'area') {
      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'area'
        },
        stroke: {
          curve: 'smooth',
          width: 2
        }
      };
    }

    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'line'
      },
      stroke: {
        curve: 'smooth',
        width: 3
      }
    };
  };

  const getSeriesForChart = () => {
    if (chartType === 'mixed') {
      return series.map((serie, index) => ({
        ...serie,
        type: index === 0 ? 'column' : 'line'
      }));
    }
    return series;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/80 px-5 p-5 dark:border-gray-800 dark:bg-gray-900/50 sm:px-6 sm:pt-6 shadow-sm">
      {/* En-tête avec contrôles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Analyse Statistique
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Vue {viewType === 'monthly' ? 'mensuelle' : viewType === 'quarterly' ? 'trimestrielle' : 'annuelle'} • 
            Graphique {chartType === 'mixed' ? 'mixte' : chartType === 'bar' ? 'en barres' : chartType === 'line' ? 'linéaire' : 'en aires'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Sélecteur de période */}
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value as ViewType)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="monthly">Mensuel</option>
            <option value="quarterly">Trimestriel</option>
            <option value="yearly">Annuel</option>
          </select>

          {/* Sélecteur de type de graphique */}
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="mixed">Mixte</option>
            <option value="bar">Barres</option>
            <option value="line">Lignes</option>
            <option value="area">Aires</option>
          </select>

          {/* Toggle pour les labels */}
          <button
            onClick={() => setShowDataLabels(!showDataLabels)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
              showDataLabels
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Labels
          </button>
        </div>
      </div>

      {/* Graphique */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            key={`${chartType}-${viewType}-${showDataLabels}`} // Force re-render
            options={getChartOptions()}
            series={getSeriesForChart()}
            type={chartType === 'mixed' ? 'line' : chartType}
            height={350}
          />
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {series.map((serie, index) => {
          const total = serie.data.reduce((a, b) => a + b, 0);
          const average = total / serie.data.length;
          const colorClasses = [
            'text-green-600 bg-green-50 dark:bg-green-900/20',
            'text-red-600 bg-red-50 dark:bg-red-900/20',
            'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
          ];
          
          return (
            <div key={index} className={`p-3 rounded-lg ${colorClasses[index]}`}>
              <div className="text-sm font-medium">{serie.name}</div>
              <div className="text-lg font-bold">{average.toFixed(1)}K</div>
              <div className="text-xs opacity-75">Moyenne {viewType}</div>
            </div>
          );
        })}
      </div>

      {/* Légende informative */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Revenus: Entrées d&apos;argent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Dépenses: Sorties d&apos;argent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Bénéfice: Revenus - Dépenses</span>
          </div>
        </div>
      </div>
    </div>
  );
}