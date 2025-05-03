import { ProcedureFinancialSummary } from "@/components/Dashboards/OneServiceDahsboard/ProcedureFinancialSummary/ProcedureFinancialSummary";
import { getProcedureDetails } from "@/db/queries/procedures.query";

export default async function ProcedureFinancialSummaryLayout(
  {procedureId}:{procedureId:string}
){

    const procedure = await getProcedureDetails(procedureId)
    if (!procedure) {
      return null;
    }


    return   <div className="mb-8">
    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Résumé financier</h2>
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
      <ProcedureFinancialSummary
        totalRevenue={
          procedure.totalRevenue
        }
        pendingRevenue={
          procedure.pendingRevenue
        }
        procedurePrice={procedure.steps.reduce((acc, step) => acc + (step.price || 0), 0)}
        totalClients={procedure.totalClients}
      />
    </div>
  </div>
  
}