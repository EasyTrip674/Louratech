"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { Users } from "lucide-react";

export default function ClientsStepLayoutSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700/50">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          <Skeleton className="w-32 h-5" />
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/80">
            <tr>
              <Th><Skeleton className="w-24 h-4" /></Th>
              <Th><Skeleton className="w-16 h-4" /></Th>
              <Th><Skeleton className="w-20 h-4" /></Th>
              <Th><Skeleton className="w-20 h-4" /></Th>
              <Th><Skeleton className="w-20 h-4" /></Th>
              <Th align="right"><Skeleton className="w-16 h-4" /></Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-transparent">
            {[...Array(3)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="ml-4">
                      <Skeleton className="w-32 h-4" />
                      <Skeleton className="w-24 h-4 mt-1" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="w-20 h-5" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="w-24 h-4" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="w-24 h-4" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="w-24 h-4" />
                </td>
                <td className="px-6 py-4 text-right">
                  <Skeleton className="w-16 h-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
        <Skeleton className="w-32 h-4" />
      </div>
    </div>
  );
}

// Component helpers
function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className={`px-6 py-3 text-${align} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}
    >
      {children}
    </th>
  );
}
