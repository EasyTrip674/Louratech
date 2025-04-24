import React from "react";
import { getClientProcedureWithSteps } from "@/db/queries/procedures.query";
import { 
  Clock, CheckCircle, FileText, AlertCircle,  
   User,  Clipboard,   
  ChevronRight, Calendar, FileCheck, 
  XCircle, AlertTriangle,  ArrowLeft, 
  CircleDashed, CircleDot,
  Plus
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { getStatusIcon, getStepStatusBadge } from "@/lib/StatusBadge";
import ChangerStatutClientProcedure from "./stepClient/status/ChangerStatutClientProcedure";
import PaymentStepModal from "./stepClient/payments/PayementStepModal";
import PaymentStepDetails from "./stepClient/payments/PayementStepDetails";

// Helper function to format dates
const formatDate = (dateString: string | null | Date) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Helper function to get step status badge


// Helper function to get status icon


// Helper function to calculate progress percentage
const calculateProgress = (steps: any[]) => {
  if (!steps.length) return 0;
  const completed = steps.filter(step => step.status === "COMPLETED").length;
  return Math.round((completed / steps.length) * 100);
};

export default async function ClientProcedurePage({
  params
}: {
  params: {
    procedureId: string;
    clientProcedureId: string;
  }
}) {
  const procedureId = params.procedureId;
  const clientProcedureId = params.clientProcedureId;

  const clientProcedure = await getClientProcedureWithSteps(clientProcedureId, procedureId);

  if (!clientProcedure) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mb-4" />
        <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Procédure client non trouvée</h1>
        <p className="text-gray-500 dark:text-gray-400">La procédure demandée n'existe pas ou a été supprimée.</p>
        <Link href={`/services/gestion/procedures/${procedureId}`} className="mt-6">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux procédures
          </Button>
        </Link>
      </div>
    );
  }

  const progressPercentage = calculateProgress(clientProcedure.steps);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête de la page avec breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/services/gestion" className="hover:text-gray-700 dark:hover:text-gray-300">
            Gestion
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href={`/services/gestion/procedures/${procedureId}`} className="hover:text-gray-700 dark:hover:text-gray-300">
            Procédures
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-700 dark:text-gray-300">Détails</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {clientProcedure.client.user.firstName} {clientProcedure.client.user.lastName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
            {clientProcedure.procedure.name}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/services/gestion/procedures/${procedureId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <FileCheck className="w-4 h-4 mr-2" />
              Exporter PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Carte de statut et progression */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            {getStatusIcon(clientProcedure?.status)}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Statut global</p>
              <p className="font-medium text-gray-900 dark:text-white">{getStepStatusBadge(clientProcedure.status)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Calendar className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date de début</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatDate(clientProcedure.startDate)}</p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Progression</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{progressPercentage}%</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Informations du client et détails */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
            <User className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
            Informations du client
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
                <p className="font-medium text-gray-900 dark:text-white">{clientProcedure.client?.user.firstName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
                <p className="font-medium text-gray-900 dark:text-white">{clientProcedure.client?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{clientProcedure.client?.user.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Référence</p>
                <p className="font-medium text-gray-900 dark:text-white">{clientProcedure.reference || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
            <Clipboard className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
            Détails de la procédure
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Type de procédure</p>
              <p className="font-medium text-gray-900 dark:text-white">{clientProcedure.procedure.category || "Standard"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Prix</p>
              <p className="font-medium text-emerald-600 dark:text-emerald-400">
                {formatCurrency(clientProcedure.procedure.price || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nombre d'étapes</p>
              <p className="font-medium text-gray-900 dark:text-white">{clientProcedure.steps.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Créé le</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatDate(String(clientProcedure.createdAt))}</p>
            </div>
          </div>
        </div>
      </div>

   

          {/* Liste des étapes en timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white">
          <FileText className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
          Étapes de la procédure
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
                    <ChangerStatutClientProcedure clientStepId={stepClient.id} />
                      {/* Paiement pour les étapes impliquant un paiement */}
                       <PaymentStepModal >
                          <PaymentStepDetails  clientStepId={stepClient.id} stepName={stepClient.step.name} 
                          clientName={`${clientProcedure.client.user.firstName} ${clientProcedure.client.user.lastName}`} procedureName={clientProcedure.procedure.name}  />
                       </PaymentStepModal>


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
  </div>
);

}