"use client"
import { Skeleton } from "@/components/ui/Skeleton";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const StatClientProcedureLayoutSkeleton = () => {
  return (
    <div className="space-y-8 mb-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <Link href="/services/gestion" className="hover:text-gray-700 dark:hover:text-gray-300">
          Gestion
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Skeleton className="h-4 w-24" />
        <ChevronRight className="w-4 h-4 mx-2" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-60 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Skeleton className="h-2.5 w-full rounded-full" />
        </div>
      </div>

      {/* Informations Client et Service */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <Skeleton className="h-5 w-48 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, j) => (
                <div key={j}>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
