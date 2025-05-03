"use client";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TableClientsProcedureSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-white/[0.05] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-9 w-full md:w-64 rounded-lg" />
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {Array.from({ length: 5 }).map((_, i) => (
                  <th key={i} className="px-5 py-3 text-start">
                    <Skeleton className="h-4 w-24" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {Array.from({ length: 4 }).map((_, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  {Array.from({ length: 5 }).map((_, colIdx) => (
                    <td key={colIdx} className="px-5 py-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
