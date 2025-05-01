"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StatsStepSkeleton() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full">
              <span className="text-blue-600 dark:text-blue-300 font-bold">M</span>
            </div>
            <Link href={`#`}>
              <Button
                href={`#`}
                variant="outline"
                size="sm"
                className="hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="text-sm">Retour au service</span>
              </Button>
            </Link>
          </div>
          <Skeleton className="h-10 w-72 mb-1" />
          <Skeleton className="h-5 w-96 mb-1" />
        </div>
        
        <div className="flex items-center">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Stats overview cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {[...Array(4)].map((_, index) => (
          <div key={`stat-card-${index}`} className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
            <div className="mt-4 flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Detailed stats section skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Status breakdown skeleton */}
        <div className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={`status-${index}`} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/80">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </div>

        {/* Performance metrics skeleton */}
        <div className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm col-span-1 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-48" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-100 dark:border-green-900/30">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-5" />
              </div>
              <Skeleton className="h-10 w-40 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-5" />
              </div>
              <Skeleton className="h-10 w-40 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            
            <div className="sm:col-span-2 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-xl p-6 border border-gray-100 dark:border-gray-900/30">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-5" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={`detail-${index}`}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}