"use client";

import React from "react";
import { CheckCircle, Clock, CreditCard, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StatsServiceSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {/* Total Clients */}
      <Skeleton className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <Users className="h-6 w-6 text-blue-300 dark:text-blue-700" />
        </div>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Total Clients</p>
        <Skeleton className="h-8 w-16 mt-1" />
      </Skeleton>
      
      {/* En cours */}
      <Skeleton className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <Clock className="h-6 w-6 text-amber-300 dark:text-amber-700" />
        </div>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">En cours</p>
        <Skeleton className="h-8 w-16 mt-1" />
      </Skeleton>
      
      {/* Complétées */}
      <Skeleton className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <CheckCircle className="h-6 w-6 text-green-300 dark:text-green-700" />
        </div>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Complétées</p>
        <Skeleton className="h-8 w-16 mt-1" />
      </Skeleton>
      
      {/* Revenu total */}
      <Skeleton className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <CreditCard className="h-6 w-6 text-purple-300 dark:text-purple-700" />
        </div>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Revenu total</p>
        <Skeleton className="h-8 w-24 mt-1" />
      </Skeleton>
    </div>
  );
}