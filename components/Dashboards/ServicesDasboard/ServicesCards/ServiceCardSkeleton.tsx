"use client";

import React from "react";
import { CheckCircle, XCircle, Clock, Eye, Hammer } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

export const ServiceCardSkeleton = () => {
  return (
    <Skeleton className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <Hammer className="text-gray-300 size-6 dark:text-gray-600" />
          </div>
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg dark:bg-amber-900/10">
          <Clock className="text-amber-200 size-5 mb-1 dark:text-amber-800" />
          <Skeleton className="h-6 w-8 mb-1" />
          <div className="text-xs text-amber-300 font-medium dark:text-amber-700">En cours</div>
        </div>
        <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg dark:bg-green-900/10">
          <CheckCircle className="text-green-200 size-5 mb-1 dark:text-green-800" />
          <Skeleton className="h-6 w-8 mb-1" />
          <div className="text-xs text-green-300 font-medium dark:text-green-700">Terminée</div>
        </div>
        <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg dark:bg-red-900/10">
          <XCircle className="text-red-200 size-5 mb-1 dark:text-red-800" />
          <Skeleton className="h-6 w-8 mb-1" />
          <div className="text-xs text-red-300 font-medium dark:text-red-700">Échouée</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        
        <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-600">
          Voir les détails
          <Eye className="size-4 ml-2" />
        </div>
      </div>
      
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-200 rounded-full hidden md:block dark:bg-gray-700"></div>
    </Skeleton>
  );
};