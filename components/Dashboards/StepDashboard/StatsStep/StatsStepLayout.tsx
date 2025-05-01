import EditStepFormModal from "@/app/(admin)/services/gestion/procedures/[procedureId]/steps/step/edit/EditStepFormModal";
import Button from "@/components/ui/button/Button";
import { getStepProcedureDetails } from "@/db/queries/procedures.query";
import { auth } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Calendar, CheckCircle, Clock, CreditCard, FileText, ListChecks, Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StatsStepLayout(
    {stepId}:{stepId:string}
) {
    const step = await getStepProcedureDetails(stepId);

    if (!step) {
      return notFound();
    }
    const session = await auth.api.getSession({
      headers: await headers()
    })
  
    // Calculate stats for the dashboard
    const inProgressCount = step.clientSteps?.filter(cs => cs.status === 'IN_PROGRESS').length || 0;
    const completedCount = step.clientSteps?.filter(cs => cs.status === 'COMPLETED').length || 0;
    const waitingCount = step.clientSteps?.filter(cs => cs.status === 'WAITING').length || 0;
    const totalClients = step.clientSteps?.length || 0;
    const totalRevenue = step.clientSteps?.reduce((sum, cs) => sum + (cs.price || 0), 0) || 0;
    const averagePrice = totalClients ? Math.round(totalRevenue / totalClients) : 0;
  

    return (
      <>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
            {/* met un badge pour ffaire savoir que c'est un module */}
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full">
              <span className="text-blue-600 dark:text-blue-300 font-bold">M</span>
            </div>
            <Link href={`/services/gestion/procedures/${step.procedureId}`}>
              <Button
                href={`/services/gestion/procedures/${step.procedureId}`}
              variant="outline" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all">
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="text-sm">Retour au service</span>
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
         
            {step.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl">{step.description}</p>
        </div>
        
        <div className="flex items-center">
        {
          session?.userDetails?.authorize?.canEditStep && (
            <EditStepFormModal
            procedureId={step.procedureId}
            stepId={step.id}
            name={step.name}
            description={step.description || ''}
            price={step.price}
            estimatedDuration={step.estimatedDuration}
            order={step.order}
            isRequired={step.required}
          />
          )
        }
        </div>
      </div>

      {/* Stats overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Clients</p>
              <p className="text-3xl font-bold mt-2 dark:text-white">{totalClients}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Répartition :</span>
            <div className="flex gap-2">
              <span className="text-green-600 dark:text-green-400 font-medium">{completedCount} terminés</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">{inProgressCount} en cours</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenu total</p>
              <p className="text-3xl font-bold mt-2 dark:text-white">{formatCurrency(totalRevenue,session?.userDetails?.organization?.comptaSettings?.currency)}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Prix moyen :</span>
            <span className="text-green-600 dark:text-green-400 font-medium">{formatCurrency(averagePrice,session?.userDetails?.organization?.comptaSettings?.currency)}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prix de base</p>
              <p className="text-3xl font-bold mt-2 dark:text-white">{step.price ? formatCurrency(step.price,session?.userDetails?.organization?.comptaSettings?.currency) : 'Non défini'}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Position :</span>
            <span className="text-purple-600 dark:text-purple-400 font-medium">Étape {step.order} {step.required ? ' (obligatoire)' : ''}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Délai estimé</p>
              <p className="text-3xl font-bold mt-2 dark:text-white">{step.estimatedDuration || '–'} <span className="text-base font-normal">{step.estimatedDuration ? 'jours' : ''}</span></p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Mise à jour :</span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">{formatDate(step.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Detailed stats section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status breakdown */}
        <div className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm">
          <h2 className="text-lg font-medium mb-6 dark:text-white flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            Statuts des dossiers
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                <span className="text-sm font-medium dark:text-white">En attente</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                <span className="text-sm font-medium dark:text-white">En cours</span>
              </div>
              <span className="text-2xl font-bold dark:text-white">{inProgressCount}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-yellow-500 dark:bg-yellow-400"></div>
                <span className="text-sm font-medium dark:text-white">En attente externe</span>
              </div>
              <span className="text-2xl font-bold dark:text-white">{waitingCount}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500 dark:bg-green-400"></div>
                <span className="text-sm font-medium dark:text-white">Complétés</span>
              </div>
              <span className="text-2xl font-bold dark:text-white">{completedCount}</span>
            </div>
          </div>
        </div>

        {/* Performance metrics */}
        <div className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm col-span-1 lg:col-span-2">
          <h2 className="text-lg font-medium mb-6 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            Performance financière
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-100 dark:border-green-900/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Revenu total</h3>
                <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">{formatCurrency(totalRevenue,session?.userDetails?.organization?.comptaSettings?.currency)} </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                {totalClients} client{totalClients > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Prix moyen facturé</h3>
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(averagePrice,session?.userDetails?.organization?.comptaSettings?.currency)}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                {step.price ? `Prix de base: ${formatCurrency(step.price,session?.userDetails?.organization?.comptaSettings?.currency)}` : 'Prix de base non défini'}
              </p>
            </div>
            
            <div className="sm:col-span-2 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-xl p-6 border border-gray-100 dark:border-gray-900/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-300">Détails additionnels</h3>
                <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Création</p>
                  <p className="font-medium dark:text-white">{formatDate(step.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mise à jour</p>
                  <p className="font-medium dark:text-white">{formatDate(step.updatedAt)}</p>
                </div>
                {step.estimatedDuration && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Durée estimée</p>
                    <p className="font-medium dark:text-white">{step.estimatedDuration} jours</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Obligatoire</p>
                  <p className="font-medium dark:text-white flex items-center gap-1">
                    {step.required ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" /> Oui
                      </>
                    ) : 'Non'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
    }