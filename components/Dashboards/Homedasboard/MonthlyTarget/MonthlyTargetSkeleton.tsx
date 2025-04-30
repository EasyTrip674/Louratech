"use client";
import { Skeleton } from "@/components/ui/Skeleton";
import React from "react";

export default function MonthlyTargetSkeleton() {
  return (
    <Skeleton className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Objectif Mensuel
            </h3>
            <div className="mt-1">
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="mt-1">
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
        </div>
        
        <div className="relative mt-6">
          {/* Circular chart skeleton */}
          <div className="flex justify-center items-center max-h-[230px] h-[330px]">
            <div className="relative w-60 h-60 flex items-center justify-center">
              {/* Outer circle (track) */}
              <div className="absolute w-60 h-60 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              
              {/* Inner circle (empty center) */}
              <div className="absolute w-48 h-48 rounded-full bg-white dark:bg-gray-900"></div>
              
              {/* Percentage text placeholder */}
              <div className="absolute">
                <Skeleton className="h-10 w-20 rounded-md" />
              </div>
            </div>
          </div>

          {/* Growth badge skeleton */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%]">
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
        
        {/* Target message skeleton */}
        <div className="mx-auto mt-10 w-full max-w-[380px] text-center">
          <Skeleton className="h-5 w-full mx-auto" />
        </div>
      </div>

      {/* Bottom metrics section */}
      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Objectif
          </p>
          <div className="flex items-center justify-center">
            <Skeleton className="h-6 w-20" />
          </div>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Actuel
          </p>
          <div className="flex items-center justify-center">
            <Skeleton className="h-6 w-20" />
          </div>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Aujourd&apos;hui
          </p>
          <div className="flex items-center justify-center">
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>
    </Skeleton>
  );
}