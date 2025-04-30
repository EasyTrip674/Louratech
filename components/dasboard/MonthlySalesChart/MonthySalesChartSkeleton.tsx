"use client";
import { Skeleton } from "@/components/ui/Skeleton";
import React from "react";

export default function MonthlySalesChartSkeleton() {
  return (
    <Skeleton className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Revenus et Dépenses Mensuels
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {/* Chart skeleton */}
          <div className="py-4">
            {/* Legend skeleton */}
            <div className="flex gap-4 mb-4 items-center">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
            
            {/* Bars skeleton */}
            <div className="flex items-end justify-between h-40 mt-6">
              {Array(12).fill(0).map((_, index) => (
                <div key={index} className="relative flex flex-col items-center w-8 gap-1">
                  {/* First bar in each month */}
                  <Skeleton className={`w-3 h-${Math.floor(Math.random() * 24) + 12}`} />
                  {/* Second bar in each month */}
                  <Skeleton className={`w-3 h-${Math.floor(Math.random() * 16) + 8}`} />
                  
                  {/* Month label */}
                  <Skeleton className="w-8 h-4 mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Skeleton>
  );
}