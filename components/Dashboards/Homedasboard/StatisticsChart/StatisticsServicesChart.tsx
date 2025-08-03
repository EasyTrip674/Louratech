"use client";
import React, { useState, useEffect, useMemo } from "react";
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

interface StatisticsChartProps {
  clientServicesData: getClientServiceDataType;
}

// Période de temps pour le filtrage
type TimePeriod = 'week' | 'month' | 'quarter' | 'year' | 'all';

// Type de vue du graphique
type ChartViewType = 'area' | 'line' | 'bar';

export default function StatisticsServiceChart({ clientServicesData }: StatisticsChartProps) {
  const [chartData, setChartData] = useState<ServiceClientData[]>([]);
  const [chartOptions, setChartOptions] = useState<ApexOptions>({});
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('year');
  const [chartView, setChartView] = useState<ChartViewType>('area');
  const [showDataLabels, setShowDataLabels] = useState(false);
  const [stackedMode, setStackedMode] = useState(false);

  // Calcul des statistiques globales
  const statistics = useMemo(() => {
    if (!clientServicesData?.series?.length) return null;

    const allData = clientServicesData.series.flatMap(series => series.data);
    const totalClients = allData.reduce((sum, point) => sum + point.y, 0);
    const avgPerService = totalClients / clientServicesData.series.length;
    
    // Service le plus performant
    const serviceStats = clientServicesData.series.map(series => ({
      name: series.name,
      total: series.data.reduce((sum, point) => sum + point.y, 0),
      avg: series.data.reduce((sum, point) => sum + point.y, 0) / series.data.length,
      growth: series.data.length > 1 ? 
        ((series.data[series.data.length - 1].y - series.data[0].y) / series.data[0].y) * 100 : 0
    }));

    const topService = serviceStats.reduce((max, current) => 
      current.total > max.total ? current : max, serviceStats[0]);

    const fastestGrowth = serviceStats.reduce((max, current) => 
      current.growth > max.growth ? current : max, serviceStats[0]);

    return {
      totalClients,
      avgPerService: Math.round(avgPerService),
      topService,
      fastestGrowth,
      serviceCount: clientServicesData.series.length
    };
  }, [clientServicesData]);

  // Filtrage des données selon la période
  const filteredData = useMemo(() => {
    if (!clientServicesData?.series) return [];

    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return clientServicesData.series;
    }

    return clientServicesData.series.map(series => ({
      ...series,
      data: series.data.filter(point => new Date(point.x) >= startDate)
    }));
  }, [clientServicesData, selectedPeriod]);

  useEffect(() => {
    setChartData(filteredData);

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
        type: chartView,
        stacked: stackedMode,
        height: 400,
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
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
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#F97316", "#84CC16"],
      dataLabels: {
        enabled: showDataLabels,
        formatter: function(val) {
          return Math.round(val as number).toString();
        },
        style: {
          fontSize: '10px',
          colors: ['#374151']
        }
      },
      markers: {
        size: chartView === 'line' ? 4 : 0,
        strokeWidth: 2,
        strokeColors: '#fff',
        hover: {
          size: 6,
          sizeOffset: 2
        }
      },
      stroke: {
        curve: 'smooth',
        width: chartView === 'line' ? 3 : chartView === 'area' ? 2 : 0
      },
      fill: {
        type: chartView === 'area' ? "gradient" : chartView === 'bar' ? 'solid' : 'solid',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.6,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        },
        opacity: chartView === 'bar' ? 0.8 : 1
      },
      yaxis: {
        title: {
          text: stackedMode ? "Total cumulé de clients" : "Nombre de clients",
          style: {
            fontWeight: 600,
            fontSize: '12px'
          }
        },
        labels: {
          formatter: function(val) {
            return Math.round(val).toLocaleString('fr-FR');
          },
          style: {
            fontSize: '11px'
          }
        },
        min: 0
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM \'yy',
            day: 'dd MMM',
            hour: 'HH:mm'
          },
          style: {
            fontSize: '11px'
          }
        },
        tooltip: {
          enabled: false
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: 'light',
        style: {
          fontSize: '12px'
        },
        y: {
          formatter: function(val, { seriesIndex, dataPointIndex, w }) {
            console.log(dataPointIndex);
            
            const seriesName = w.config.series[seriesIndex].name;
            console.log(seriesName);
            
            return `<strong>${val.toLocaleString('fr-FR')} clients</strong>`;
          }
        },
        x: {
          formatter: function(val) {
            return new Date(val).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });
          }
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        floating: false,
        offsetY: 0,
        offsetX: 0,
        fontSize: '12px',
        fontWeight: 500,
      },
      grid: {
        borderColor: "#E5E7EB",
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 300
            },
            legend: {
              position: 'bottom',
              offsetY: 0
            }
          }
        }
      ]
    };

    setChartOptions(options);
  }, [filteredData, chartView, showDataLabels, stackedMode]);

  const periodButtons = [
    { key: 'week' as TimePeriod, label: '7j' },
    { key: 'month' as TimePeriod, label: '1M' },
    { key: 'quarter' as TimePeriod, label: '3M' },
    { key: 'year' as TimePeriod, label: '1A' },
    { key: 'all' as TimePeriod, label: 'Tout' }
  ];

  const viewButtons = [
    { key: 'area' as ChartViewType, label: 'Aires', icon: '📊' },
    { key: 'line' as ChartViewType, label: 'Lignes', icon: '📈' },
    { key: 'bar' as ChartViewType, label: 'Barres', icon: '📋' }
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-6 pb-6 pt-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
      {/* En-tête avec statistiques */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white/90">
              Évolution des Inscriptions par Service
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Analyse détaillée des performances de chaque service
            </p>
          </div>
          
          {/* Statistiques rapides */}
          {statistics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                <div className="text-blue-600 dark:text-blue-400 font-medium">Total</div>
                <div className="text-blue-900 dark:text-blue-100 font-semibold">
                  {statistics.totalClients.toLocaleString('fr-FR')}
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                <div className="text-green-600 dark:text-green-400 font-medium">Services</div>
                <div className="text-green-900 dark:text-green-100 font-semibold">
                  {statistics.serviceCount}
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg">
                <div className="text-orange-600 dark:text-orange-400 font-medium">Top Service</div>
                <div className="text-orange-900 dark:text-orange-100 font-semibold text-xs">
                  {statistics.topService.name}
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg">
                <div className="text-purple-600 dark:text-purple-400 font-medium">Croissance</div>
                <div className="text-purple-900 dark:text-purple-100 font-semibold">
                  +{Math.round(statistics.fastestGrowth.growth)}%
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contrôles */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Sélection de période */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {periodButtons.map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  selectedPeriod === period.key
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Type de vue et options */}
          <div className="flex items-center gap-3">
            {/* Type de graphique */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {viewButtons.map((view) => (
                <button
                  key={view.key}
                  onClick={() => setChartView(view.key)}
                  className={`px-2 py-1.5 text-xs rounded-md transition-colors flex items-center gap-1 ${
                    chartView === view.key
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title={view.label}
                >
                  <span>{view.icon}</span>
                  <span className="hidden sm:inline">{view.label}</span>
                </button>
              ))}
            </div>

            {/* Options supplémentaires */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={stackedMode}
                  onChange={(e) => setStackedMode(e.target.checked)}
                  className="rounded"
                />
                <span className="text-gray-600 dark:text-gray-400">Empilé</span>
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDataLabels}
                  onChange={(e) => setShowDataLabels(e.target.checked)}
                  className="rounded"
                />
                <span className="text-gray-600 dark:text-gray-400">Étiquettes</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique */}
      <div className="max-w-full overflow-hidden">
        <div className="min-w-full" style={{ height: '400px' }}>
          {typeof window !== 'undefined' && chartData.length > 0 && (
            <ReactApexChart
              options={chartOptions}
              series={chartData}
              type={chartView}
              height={400}
            />
          )}
        </div>
      </div>

      {/* Informations complémentaires */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div>
            💡 <strong>Conseil :</strong> Utilisez le zoom pour analyser des périodes spécifiques, 
            ou changez le type de vue pour différentes perspectives.
          </div>
          <div className="flex items-center gap-4">
            <span>📊 Mode {stackedMode ? 'Empilé' : 'Comparatif'}</span>
            <span>🎯 Période : {periodButtons.find(p => p.key === selectedPeriod)?.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}