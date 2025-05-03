import React from "react";
import { BoxIcon, Users2 } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export const ProceduresMetricsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Métrique Item Début --> */}
      <Skeleton className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Users2 className="text-gray-300 size-6 dark:text-gray-600" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Clients
            </span>
            <div className="mt-2">
              <Skeleton className="h-7 w-16" />
            </div>
          </div>
          <Button variant={"outline"} href="/services/gestion/clients" disabled>
            Voir
          </Button>
        </div>
      </Skeleton>
      {/* <!-- Métrique Item Fin --> */}

      {/* <!-- Métrique Item Début --> */}
      <Skeleton className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIcon className="text-gray-300 dark:text-gray-600" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Services
            </span>
            <div className="mt-2">
              <Skeleton className="h-7 w-16" />
            </div>
          </div>
          <Button variant={"outline"} href="/services/gestion/procedures" disabled>
            Voir
          </Button>
        </div>
      </Skeleton>
      {/* <!-- Métrique Item Fin --> */}
    </div>
  );
};