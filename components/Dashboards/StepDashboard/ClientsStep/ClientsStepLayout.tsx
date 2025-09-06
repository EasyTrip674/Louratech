"use client";
import Button from "@/components/ui/button/Button";
import useAuth from "@/lib/BackendConfig/useAuth";
import { formatCurrency, formatDate, getStatusBadgeClasses } from "@/lib/utils";
import { Eye,  Users } from "lucide-react";

export default function ClientsStepLayout({
stepId
}:{
    stepId:string
}) {

    // const step = await getStepProcedureDetails(stepId);

    // if (!step) {
    //   return null
    // }
    const session = useAuth();
  
    return null;
    return (
        <div className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700/50">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            Liste des clients inscrits
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date début</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date fin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prix appliqué</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-transparent">
              {/* {!step.clientSteps?.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Aucun client inscrit pour cette étape
                  </td>
                </tr>
              )} */}
              
              {/* {step.clientSteps?.map((clientStep) => (
                <tr key={clientStep.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        {clientStep.clientProcedure.client.firstName?.[0]}{clientStep.clientProcedure.client.lastName?.[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {clientStep.clientProcedure.client.firstName} {clientStep.clientProcedure.client.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {clientStep.clientProcedure.client.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(clientStep.status)}`}>
                      {clientStep.status === 'IN_PROGRESS' && 'En cours'}
                      {clientStep.status === 'COMPLETED' && 'Complété'}
                      {clientStep.status === 'WAITING' && 'En attente externe'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(String(clientStep.startDate))}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(String(clientStep.completionDate))}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {clientStep.price ? `${formatCurrency(clientStep.price,session?.userDetails?.organization?.comptaSettings?.currency)}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/services/gestion/procedures/${clientStep.clientProcedure.procedureId}/clients/${clientStep.clientProcedure.id}`}>
                   {
                      session?.userDetails?.authorize?.canReadClientProcedure && (
                        <Button
                        size="sm"
                        variant="outline"
                        className="hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Détails</span>
                        </Button>
                      )
                   }
                    </Link>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
        
        {/* {step.clientSteps?.length > 0 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Affichage de {step.clientSteps.length} client{step.clientSteps.length > 1 ? 's' : ''}
            </div>
          </div>
        )} */}
      </div>
    );
    }