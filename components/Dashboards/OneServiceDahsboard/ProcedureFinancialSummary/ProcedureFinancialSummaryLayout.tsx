"use client";
import { api } from "@/lib/BackendConfig/api";
import { useQuery } from "@tanstack/react-query";
import { ProcedureFinancialSummary } from "./ProcedureFinancialSummary";

export default function ProcedureFinancialSummaryLayout(
  {procedureId}:{procedureId:string}
){

   
  const { data: procedureData, isLoading, isError } = useQuery({
    queryKey: [`procedure${procedureId}.summary`],
    queryFn: () => api.get(`api/procedures/procedures/${procedureId}/finance/summary`).then(res => res.data),
    retry: false
  });

  const procedure = procedureData?.data;

  console.log(procedure);
  if (!procedure) {
    return null;
  }
  return ( <div className="mb-8">
    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Résumé financier</h2>
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
      <ProcedureFinancialSummary
        totalRevenue={
          procedure?.totalRevenue ?? 0
        }
        pendingRevenue={
          procedure?.pendingRevenue ?? 0
        }
        procedurePrice={procedure?.steps?.reduce((acc : number, step:{price:number}) => acc + (step?.price || 0), 0)}
        totalClients={procedure.totalClients ?? 0}
      />
    </div>
  </div>
  )
}