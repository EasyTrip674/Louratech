import PaymentStepDetails from "@/app/(admin)/services/gestion/procedures/[procedureId]/clients/[clientProcedureId]/stepClient/payments/PayementStepDetails";
import PaymentStepModal from "@/app/(admin)/services/gestion/procedures/[procedureId]/clients/[clientProcedureId]/stepClient/payments/PayementStepModal";
import ChangerStatutClientProcedure from "@/app/(admin)/services/gestion/procedures/[procedureId]/clients/[clientProcedureId]/stepClient/status/ChangerStatutClientProcedure";
import { getClientProcedureWithSteps } from "@/db/queries/procedures.query";
import { auth } from "@/lib/auth";
import { getStepStatusBadge } from "@/lib/StatusBadge";
import { formatDate } from "@/lib/utils";
import { AlertTriangle, CheckCircle, CircleDashed, CircleDot, Clock, FileText, XCircle } from "lucide-react";
import { headers } from "next/headers";

export default async function StepsClientProcedureLayout(
        {procedureId, clientProcedureId}:{
        procedureId: string;
        clientProcedureId: string;
        }
) {

  const clientProcedure = await getClientProcedureWithSteps(clientProcedureId, procedureId);
    if (!clientProcedure) {
        return null;
    }
    const session  = await auth.api.getSession({
        headers: await headers()
      })

      
    
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white">
      <FileText className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
      Modules du service pour ce client
    </h2>

    <div className="relative">
      {clientProcedure.steps.map((stepClient, index) => (
        <div key={stepClient.id} className="mb-8 last:mb-0">
          <div className="flex">
            {/* Timeline connector */}
            <div className="flex flex-col items-center mr-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full z-10 relative">
                {stepClient.status === "COMPLETED" ? (
                  <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
                ) : stepClient.status === "IN_PROGRESS" ? (
                  <CircleDot className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                ) : stepClient.status === "SKIPPED"  ? (
                  <AlertTriangle className="w-8 h-8 text-amber-500 dark:text-amber-400" />
                ) : stepClient.status === "FAILED"? (
                  <XCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
                ): (
                  <CircleDashed className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              {index < clientProcedure.steps.length - 1 && (
                <div className="w-0.5 bg-gray-200 dark:bg-gray-700 h-full" />
              )}
            </div>

            {/* Step content */}
            <div className="bg-gray-50 dark:bg-gray-850 rounded-lg p-4 border border-gray-200 dark:bg-gray-600 w-full dark:border-gray-700" >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{stepClient.step.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{stepClient.step.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStepStatusBadge(stepClient?.status)}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stepClient.startDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Date de début</p>
                      <p className="text-sm text-gray-900 dark:text-white">{formatDate(stepClient.startDate)}</p>
                    </div>
                  </div>
                )}
                {stepClient.completionDate && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Date de fin</p>
                      <p className="text-sm text-gray-900 dark:text-white">{formatDate(stepClient.completionDate)}</p>
                    </div>
                  </div>
                )}
                {/* {stepClient.assignedTo && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Assignée à</p>
                      <p className="text-sm text-gray-900 dark:text-white">{stepClient.assignedTo}</p>
                    </div>
                  </div>
                )} */}
              </div>

              {stepClient.notes && (
                <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                  <p className="font-medium text-gray-700 dark:text-gray-300">{stepClient.notes}</p>
                </div>
              )}

              {/* Actions rapides */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {/* Changement de statut */}
                {
                  session?.userDetails?.authorize?.canEditClientStep && (
                    <ChangerStatutClientProcedure clientStepId={stepClient.id} />
                  )
                }
                  {/* Paiement pour les étapes impliquant un paiement */}
                 {
                  session?.userDetails?.authorize?.canReadTransaction && (
                    <PaymentStepModal >
                    <PaymentStepDetails  clientStepId={stepClient.id} stepName={stepClient.step.name} 
                    clientName={`${clientProcedure.client.firstName} ${clientProcedure.client.lastName}`} procedureName={clientProcedure.procedure.name}  />
                 </PaymentStepModal>
                  )
                 }


                  {/* Ajouter une note */}
                  {/* <Button variant="outline" size="sm" className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Ajouter une note
                  </Button> */}

                  {/* Assigner à un utilisateur */}
                  {/* <div className="relative group">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Assigner
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                    <div className="hidden group-hover:block absolute left-0 mt-1 z-10 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="py-1">
                        <button className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <User className="w-4 h-4 mr-2" />
                          Sophie Martin
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <User className="w-4 h-4 mr-2" />
                          Thomas Dubois
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <User className="w-4 h-4 mr-2" />
                          Julie Leclerc
                        </button>
                      </div>
                    </div>
                  </div> */}

                  {/* Planifier un rendez-vous */}
                  {/* <Button variant="outline" size="sm" className="flex items-center">
                    <CalendarClock className="w-4 h-4 mr-1" />
                    Planifier RDV
                  </Button> */}

                  {/* Télécharger documents */}
                  {/* <Button variant="outline" size="sm" className="flex items-center">
                    <FileCheck className="w-4 h-4 mr-1" />
                    Factures
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}