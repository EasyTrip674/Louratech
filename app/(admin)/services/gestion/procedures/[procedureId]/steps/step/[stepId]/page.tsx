import React from 'react';
import { notFound } from 'next/navigation';
import { Users, CreditCard, ArrowLeft, Eye, FileText, ListChecks, Calendar, Clock, CheckCircle } from 'lucide-react';
import Button from "@/components/ui/button/Button";
import Link from 'next/link';
import { getStepProcedureDetails } from '@/db/queries/procedures.query';
import EditStepFormModal from '../edit/EditStepFormModal';
import { formatDate } from '@/lib/utils';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

type PageProps = {
  params: {
    procedureId: string;
    stepId: string;
  };
};

export default async function StepDetailPage({ params }: PageProps) {
  const step = await getStepProcedureDetails(params.stepId);

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

  const getStatusBadgeClasses = (status:string) => {
    switch(status) {
      case 'COMPLETED': 
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800';
      case 'IN_PROGRESS': 
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
      case 'WAITING': 
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800';
      default: 
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
    }
  };



  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header section with breadcrumb and actions */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
            {/* met un badge pour ffaire savoir que c'est un module */}
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full">
              <span className="text-blue-600 dark:text-blue-300 font-bold">M</span>
            </div>
            <Link href={`/services/gestion/procedures/${params.procedureId}`}>
              <Button
                href={`/services/gestion/procedures/${params.procedureId}`}
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
            procedureId={params.procedureId}
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
              <p className="text-3xl font-bold mt-2 dark:text-white">{totalRevenue.toLocaleString()} FNG</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Prix moyen :</span>
            <span className="text-green-600 dark:text-green-400 font-medium">{averagePrice.toLocaleString()} FNG</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prix de base</p>
              <p className="text-3xl font-bold mt-2 dark:text-white">{step.price ? `${step.price.toLocaleString()} FNG` : 'Non défini'}</p>
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
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">{totalRevenue.toLocaleString()} FNG</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                {totalClients} client{totalClients > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Prix moyen facturé</h3>
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{averagePrice.toLocaleString()} FNG</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                {step.price ? `Prix de base: ${step.price.toLocaleString()} FNG` : 'Prix de base non défini'}
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

      {/* Client table */}
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
              {!step.clientSteps?.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Aucun client inscrit pour cette étape
                  </td>
                </tr>
              )}
              
              {step.clientSteps?.map((clientStep) => (
                <tr key={clientStep.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        {clientStep.clientProcedure.client.user.firstName?.[0]}{clientStep.clientProcedure.client.user.lastName?.[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {clientStep.clientProcedure.client.user.firstName} {clientStep.clientProcedure.client.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {clientStep.clientProcedure.client.user.email}
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
                    {clientStep.price ? `${clientStep.price.toLocaleString()} FNG` : '-'}
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
              ))}
            </tbody>
          </table>
        </div>
        
        {step.clientSteps?.length > 0 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Affichage de {step.clientSteps.length} client{step.clientSteps.length > 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}