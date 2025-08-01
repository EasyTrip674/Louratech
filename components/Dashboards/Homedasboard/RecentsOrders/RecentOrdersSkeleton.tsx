import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../../ui/table";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";

export default function RecentOrdersSkeleton() {
  // Array to render multiple skeleton rows
  const skeletonRows = Array(2).fill(0);

  return (
    <Skeleton className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Derniers clients
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/services/gestion/clients" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Voir plus
          </Link>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Prenom et Nom
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Date d&apos;inscription
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Statut
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {skeletonRows.map((_, index) => (
              <TableRow key={index} className="">
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <Skeleton className="h-5 w-32" />
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Skeleton className="h-5 w-40" />
                </TableCell>
                <TableCell className="py-3">
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell className="py-3">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Skeleton>
  );
}