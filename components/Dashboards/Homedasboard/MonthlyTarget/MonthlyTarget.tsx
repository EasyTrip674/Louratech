"use client";
import { getMonthlyTargetStatsType } from "@/db/queries/dasboard.query";
import { Users, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Composant pour le diagramme semi-circulaire avec ApexCharts
const SemiCircularChart = ({ percentage, title, color = "#465FFF" }: { percentage: number, title: string, color?: string }) => {
  const chartOptions = {
    chart: {
      type: 'radialBar' as const,
      height: 200,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#E4E7EC",
          strokeWidth: '12px',
          margin: 5,
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '12px',
            fontWeight: '400',
            color: '#64748B',
            offsetY: 30
          },
          value: {
            show: true,
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1F2937',
            offsetY: -10,
            formatter: function (val: number) {
              return val + "%";
            }
          }
        },
        hollow: {
          size: '60%'
        }
      }
    },
    fill: {
      colors: [color]
    },
    stroke: {
      lineCap: 'round' as const
    },
    labels: [title]
  };

  const series = [percentage];

  return (
    <div className="w-48 h-32 mx-auto">
      <ReactApexChart
        options={chartOptions}
        series={series}
        type="radialBar"
        height={200}
      />
    </div>
  );
};

export default function MonthlyTarget({ MonthlyTargetData }: { MonthlyTargetData: getMonthlyTargetStatsType }) {
  const data = MonthlyTargetData;

  return (
    <div className="space-y-6">
      {/* Statistiques des Employés */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-gray-900 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Performance Équipe
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aperçu de l&apos;activité et de l&apos;efficacité de votre équipe
            </p>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.employeeMetrics.totalActiveEmployees}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Employés Actifs
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.employeeMetrics.totalActiveProcedures}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Services en Cours
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.employeeMetrics.totalCompletedProcedures}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Terminées ce Mois
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.employeeMetrics.averageWorkload}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Charge Moyenne
            </div>
          </div>
        </div>

        {/* Diagramme d'efficacité */}
        <div className="flex justify-center mb-8">
          <SemiCircularChart 
            percentage={data.employeeMetrics.efficiencyRate} 
            title="Taux d'Efficacité"
            color="#10B981"
          />
        </div>

        {/* Top Performers */}
        <div>
          <h4 className="text-md font-semibold text-gray-800 dark:text-white/90 mb-4">
            Top Performers ce Mois
          </h4>
          <div className="space-y-3">
            {data.employeeMetrics.topPerformers.map((employee, index) => (
              <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {employee.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {employee.completedSteps} étapes terminées
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {employee.totalWorkload} dossiers
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    en charge
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}