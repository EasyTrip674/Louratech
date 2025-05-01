import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { 
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  SlidersHorizontal,
  Clock,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

export const TransactionsTableSkeleton = () => {
  // Simuler 5 lignes pour le squelette
  const skeletonRows = Array(5).fill(null);

  return (
    <div className="max-w-full overflow-x-auto">
      <div className="min-w-[1102px]">
        <Table>
          {/* En-tête du tableau */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-800/50">
            <TableRow>
              <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </div>
              </TableCell>
              <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </div>
              </TableCell>
              <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Catégorie
                </div>
              </TableCell>
              <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Statut
                </div>
              </TableCell>
              <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Paiement
                </div>
              </TableCell>
              <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                <div className="flex items-center gap-2">
                  Montant
                </div>
              </TableCell>
              <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Corps du tableau avec lignes squelette */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {skeletonRows.map((_, index) => (
              <TableRow 
                key={index}
                className="hover:bg-gray-50 transition-colors dark:hover:bg-white/[0.02]"
              >
                <TableCell className="px-5 py-4 text-start">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {index % 2 === 0 ? 
                        <ArrowUpCircle className="w-5 h-5 text-gray-400" /> : 
                        <ArrowDownCircle className="w-5 h-5 text-gray-400" />
                      }
                    </div>
                    <div>
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300">
                  <div>
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Skeleton className="h-6 w-28 rounded-full" />
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-lg">
                  <Skeleton className="h-6 w-28" />
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Skeleton className="h-9 w-24 rounded-lg" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination squelette */}
        <div className="flex items-center justify-between mt-4 px-4">
          <Skeleton className="h-5 w-64" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-md" />
              ))}
            </div>
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};