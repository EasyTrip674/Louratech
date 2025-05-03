import React from "react";
import { 
  Search,
} from "lucide-react";
import { TransactionsTableSkeleton } from "./TableTransactionSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function FilteredTransactionsSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      {/* En-tête avec les onglets */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex space-x-4">
          <Skeleton className="w-36 h-10 rounded-lg" />
          <Skeleton className="w-24 h-10 rounded-lg" />
          <Skeleton className="w-24 h-10 rounded-lg" />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>
        </div>
      </div>
      
      {/* Boutons d'action */}
      <div className="p-4 flex flex-wrap gap-3 justify-end">
        <Skeleton className="w-32 h-10 rounded-lg" />
        <Skeleton className="w-32 h-10 rounded-lg" />
      </div>
      
      {/* Tableau des transactions */}
      <TransactionsTableSkeleton />
      
      {/* Pagination */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <Skeleton className="w-48 h-6 rounded-md" />
      </div>
    </div>
  );
}