"use client";
import { Skeleton } from "@/components/ui/Skeleton";
import React from "react";

export default function StatisticsServiceSkeleton() {
  return (
    <Skeleton className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
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
          {/* Les boutons de filtre sont commentés dans le composant original */}
        </div>
      </div>
      
      <div className="max-w-full overflow-hidden">
        <div className="min-w-full h-[350px] relative">
          {/* Chart area skeleton */}
          <div className="absolute inset-0 flex flex-col">
            {/* Chart title skeleton (to match the chart's internal title) */}
            <div className="h-8 flex items-center pl-2 mb-4">
              <Skeleton className="h-5 w-20" />
            </div>
            
            {/* Legend skeleton */}
            <div className="flex justify-end mb-8 gap-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
            
            {/* Chart area skeleton */}
            <div className="flex-1 relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between py-2">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-8" />
                ))}
              </div>
              
              {/* X-axis labels */}
              <div className="absolute left-12 right-0 bottom-0 h-6 flex justify-between">
                {[1, 2, 3, 4, 5, 6].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-12" />
                ))}
              </div>
              
              {/* Chart grid lines */}
              <div className="absolute left-12 right-5 top-5 bottom-8 flex flex-col justify-between">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="w-full h-px bg-gray-200 dark:bg-gray-700" />
                ))}
              </div>
              
              {/* Chart area animation */}
              <div className="absolute left-12 right-5 top-20 bottom-8">
                <div className="relative h-full">
                  {/* Animated wave skeleton for area charts */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-700 animate-pulse" 
                       style={{clipPath: "polygon(0% 80%, 10% 70%, 20% 85%, 30% 60%, 40% 70%, 50% 50%, 60% 65%, 70% 40%, 80% 50%, 90% 35%, 100% 50%, 100% 100%, 0% 100%)"}}></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600 animate-pulse" 
                       style={{clipPath: "polygon(0% 90%, 10% 80%, 20% 95%, 30% 70%, 40% 80%, 50% 60%, 60% 75%, 70% 50%, 80% 60%, 90% 45%, 100% 60%, 100% 100%, 0% 100%)"}}></div>
                </div>
              </div>
              
              {/* Toolbar skeleton */}
              <div className="absolute right-5 top-5">
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Skeleton>
  );
}