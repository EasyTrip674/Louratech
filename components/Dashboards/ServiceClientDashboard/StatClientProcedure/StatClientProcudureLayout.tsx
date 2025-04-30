import Button from "@/components/ui/button/Button";
import { getClientProcedureWithSteps } from "@/db/queries/procedures.query";
import BackButton from "@/layout/BackButton";
import { getStatusIcon, getStepStatusBadge } from "@/lib/StatusBadge";
import { calculateProgress, formatCurrency, formatDate } from "@/lib/utils";
import { AlertCircle, ArrowLeft, Calendar, ChevronRight, Clipboard, User } from "lucide-react"
import Link from "next/link"

export  const StatClientProcedureLayout = async ({clientProcedureId,procedureId}:{    clientProcedureId: string;    procedureId: string;}) => {

  const clientProcedure = await getClientProcedureWithSteps(clientProcedureId, procedureId);

  if (!clientProcedure) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mb-4" />
        <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Procédure client non trouvée</h1>
        <p className="text-gray-500 dark:text-gray-400">La procédure demandée n&apos;existe pas ou a été supprimée.</p>
        <Link href={`/services/gestion/procedures/${procedureId}`} className="mt-6">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la procédure
          </Button>
        </Link>
      </div>
    );
  }


  const progressPercentage = calculateProgress(clientProcedure.steps);


    return (
      <>
          {/* En-tête de la page avec breadcrumb */}
          <div className="mb-8">
        <div className="flex items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/services/gestion" className="hover:text-gray-700 dark:hover:text-gray-300">
            Gestion
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href={`/services/gestion/procedures/${procedureId}`} className="hover:text-gray-700 dark:hover:text-gray-300">
            Procédure
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
            <BackButton />
            </Link>
            {/* <Button variant="outline" size="sm">
              <FileCheck className="w-4 h-4 mr-2" />
              Exporter PDF
            </Button> */}
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
              <p className="font-medium text-gray-900 dark:text-white">{getStepStatusBadge(String(clientProcedure.status))}</p>
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
            { clientProcedure.client?.user.firstName &&
                <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
                <p className="font-medium text-gray-900 dark:text-white">{clientProcedure.client?.user.firstName}</p>
              </div>
            }
            {
              clientProcedure.client?.user.lastName &&
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nom</p>
                <p className="font-medium text-gray-900 dark:text-white">{clientProcedure.client?.user.lastName}</p>
              </div>
            }
             {
              clientProcedure.client?.user.email &&
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{clientProcedure.client?.user.email}</p>
              </div>
             }
             {
              clientProcedure.reference &&
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Reference</p>
                <p className="font-medium text-gray-900 dark:text-white">{clientProcedure.reference}</p>
              </div>
             }
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
            <Clipboard className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
            Détails du service pour ce client
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Type de service</p>
              <p className="font-medium text-gray-900 dark:text-white">{clientProcedure.procedure.category || "Standard"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Prix totale</p>
              <p className="font-medium text-emerald-600 dark:text-emerald-400">
                {/* somme de tous les prix des etapes */}
                {formatCurrency(
                  clientProcedure.steps.reduce((total, step) => total + (step.step.price || 0), 0)
                )} 
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nombre d&apos;étapes</p>
              <p className="font-medium text-gray-900 dark:text-white">{clientProcedure.steps.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Créé le</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatDate(String(clientProcedure.createdAt))}</p>
            </div>
          </div>
        </div>
      </div>

      </>
    )
}