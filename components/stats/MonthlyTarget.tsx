"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { getMonthlyTargetStatsType } from "@/db/queries/dasboard.query";
import { formatCurrency } from "@/lib/utils";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget({MonthlyTargetData}:{MonthlyTargetData:getMonthlyTargetStatsType}) {
  // Calculer le pourcentage de progression vers l'objectif (au lieu du pourcentage de changement)
  const progressToTarget = Math.min(100, Math.round((MonthlyTargetData.currentMonthAmount / MonthlyTargetData.target) * 100));
  
  const series = [progressToTarget];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progression"],
  };

  // Déterminer la couleur du badge de croissance en fonction du pourcentage
  const getBadgeClass = () => {
    if (MonthlyTargetData.growth > 0) {
      return "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500";
    } else if (MonthlyTargetData.growth < 0) {
      return "bg-danger-50 text-danger-600 dark:bg-danger-500/15 dark:text-danger-500";
    }
    return "bg-gray-50 text-gray-600 dark:bg-gray-500/15 dark:text-gray-500";
  };

  // Génération du message d'objectif
  const getTargetMessage = () => {
    const remaining = MonthlyTargetData.target - MonthlyTargetData.currentMonthAmount;
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const currentDay = new Date().getDate();
    const remainingDays = daysInMonth - currentDay;
    
    if (MonthlyTargetData.currentMonthAmount >= MonthlyTargetData.target) {
      return `🎉 Bravo! Vous avez atteint votre objectif mensuel de ${formatCurrency(MonthlyTargetData.target)}.`;
    } else {
      return `🎯 Il vous reste ${formatCurrency(remaining)} pour atteindre votre objectif mensuel (${remainingDays} jours restants).`;
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        {/* met une descriotion pour dire que le prochaine objectif est de 120% du CA du mois precedent */}
      
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Objectif Mensuel
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Progression vers l&apos;objectif de {formatCurrency(MonthlyTargetData.target)}
            </p>
            <p className="mt-1 font-normal text-gray-500 text-theme-xs dark:text-gray-400">
              Objectif de {formatCurrency(MonthlyTargetData.target)} basé sur le <span className="text-brand-300">120% </span> du Chiffre d&apos;Affaire du mois dernier 
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="max-h-[330px]">
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>

          <span className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium ${getBadgeClass()}`}>
            {MonthlyTargetData?.growth > 0 ? '+' : ''}{MonthlyTargetData.growth}%
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          {getTargetMessage()}
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Objectif
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {formatCurrency(MonthlyTargetData.target)}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Actuel
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {formatCurrency(MonthlyTargetData.currentMonthAmount)}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Aujourd&apos;hui
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {formatCurrency(MonthlyTargetData.today)}
          </p>
        </div>
      </div>
    </div>
  );
}