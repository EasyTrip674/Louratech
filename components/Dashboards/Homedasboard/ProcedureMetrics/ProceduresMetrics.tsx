"use client";
import React from "react";
import { BoxIcon, Users2 } from "lucide-react";
import Button from "@/components/ui/button/Button";
import {  useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@/lib/BackendConfig/api";

type OrganizationProceduresSummary = {
  succes: boolean;
  data: {
    id: string;
    name: string;
    totalsClients: number;
    proceduresCount: number;
  };
};

export const ProceduresMetrics = () => {
  const { data, isLoading, isError } = useSuspenseQuery<OrganizationProceduresSummary>({
    queryKey: ["organization-procedures-summary"],
    queryFn: () => api.get("api/procedures/procedures/organization").then(res => res.data),
    retry: false,
  });

  if (isLoading || isError || !data?.data) return null;
  const { totalsClients, proceduresCount } = data.data;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Métrique Item Début --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Users2 className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Clients
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{totalsClients}</h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
          <Button variant={"outline"} href="/services/gestion/clients">
            Voir
          </Button>
        </div>
      </div>
      {/* <!-- Métrique Item Fin --> */}

      {/* <!-- Métrique Item Début --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Services
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{proceduresCount}</h4>
          </div>
          {/* <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge> */}
          <Button variant={"outline"} href="/services/gestion/procedures">
            Voir
          </Button>
        </div>
      </div>
      {/* <!-- Métrique Item Fin --> */}
    </div>
  );
};
