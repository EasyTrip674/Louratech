"use client"
import { Skeleton } from "@/components/ui/Skeleton";
import { FileText } from "lucide-react";

export default function StepsClientProcedureSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white">
        <FileText className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
        Modules du service pour ce client
      </h2>

      {[...Array(3)].map((_, index) => (
        <div key={index} className="mb-8 last:mb-0">
          <div className="flex">
            <div className="flex flex-col items-center mr-4">
              <Skeleton className="w-8 h-8 rounded-full" />
              {index < 2 && <div className="w-0.5 bg-gray-200 dark:bg-gray-700 h-full" />}
            </div>

            <div className="bg-gray-50 dark:bg-gray-850 rounded-lg p-4 border border-gray-200 dark:bg-gray-600 w-full dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <div>
                      <Skeleton className="h-3 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                <Skeleton className="h-4 w-full" />
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-32 rounded-md" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
