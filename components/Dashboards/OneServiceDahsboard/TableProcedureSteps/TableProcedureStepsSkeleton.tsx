"use client";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TableProcedureStepsSkeleton() {
  return (
    <div className="space-y-6 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* Header */}
            <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center">
                <Skeleton className="w-8 h-8 rounded-full mr-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Body */}
            <div className="p-5 space-y-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />

              {/* Extra info */}
              <div className="flex space-x-4 pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
