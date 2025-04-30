"use client"

import { Skeleton } from "@/components/ui/Skeleton";

export function ProcedureFinancialSummarySkeleton() {
  return (

    <div className="mb-8">
    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Résumé financier</h2>
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-4">
        {/* title */}
      {[...Array(4)].map((_, i) => (
        <div className="" key={i}>
          <Skeleton className="h-4 w-32 mb-2" /> {/* Label */}
          <Skeleton className="h-8 w-24" />       {/* Value */}
        </div>
      ))}
    </div>
    </div>
  </div>  
 
  );
}
