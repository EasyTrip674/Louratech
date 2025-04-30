import React from "react";
import { Backpack, FileCheck, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StatsServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Card 1 - Total Clients */}
      <Skeleton className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
            <Users className="h-6 w-6 text-blue-300 dark:text-blue-500" />
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Total</div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total Clients</p>
        <Skeleton className="h-9 w-16 mt-1" />
      </Skeleton>
      
      {/* Card 2 - Services actifs */}
      <Skeleton className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
            <Backpack className="h-6 w-6 text-green-300 dark:text-green-500" />
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">En cours</div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Services actifs</p>
        <Skeleton className="h-9 w-16 mt-1" />
      </Skeleton>
      
      {/* Card 3 - Terminées ce mois */}
      <Skeleton className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full">
            <FileCheck className="h-6 w-6 text-amber-300 dark:text-amber-500" />
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Terminé</div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Terminées ce mois</p>
        <Skeleton className="h-9 w-16 mt-1" />
      </Skeleton>
      
      {/* Card 4 - Taux de réussite */}
      <Skeleton className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
            <FileCheck className="h-6 w-6 text-purple-300 dark:text-purple-500" />
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Taux</div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Taux de réussite</p>
        <Skeleton className="h-9 w-24 mt-1" />
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3 dark:bg-gray-700">
          <Skeleton className="h-2.5 w-1/2 rounded-full" />
        </div>
      </Skeleton>
    </div>
  );
}