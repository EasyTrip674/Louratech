import { Skeleton } from "@/components/ui/Skeleton";
import { ArrowDownCircle, ArrowUpCircle, CheckCircle } from "lucide-react";

export default function StatsTransactionLayoutSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Carte des revenus */}
      <Skeleton className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium">Entrées</h3>
          <ArrowUpCircle className="w-6 h-6 text-green-500" />
        </div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-48 mt-2" />
      </Skeleton>

      {/* Carte des dépenses */}
      <Skeleton className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium">Sorties</h3>
          <ArrowDownCircle className="w-6 h-6 text-red-500" />
        </div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-48 mt-2" />
      </Skeleton>

      {/* Carte de la balance */}
      <Skeleton className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium">Balance</h3>
          <CheckCircle className="w-6 h-6 text-blue-500" />
        </div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-48 mt-2" />
      </Skeleton>
    </div>
  );
}