import React from 'react';
import { notFound } from 'next/navigation';
import { Users, Clock, CheckCircle, AlertCircle, CreditCard, ChevronRight, ArrowLeft, Eye, Calendar, FileText, ListChecks } from 'lucide-react';
import Button from "@/components/ui/button/Button";
import Link from 'next/link';
import { getStepProcedureDetails } from '@/db/queries/procedures.query';
import EditStepFormModal from '../edit/EditStepFormModal';

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 ">
        <div className="flex items-start gap-2">
          <Link href={`/services/gestion/procedures/${params.procedureId}`}>
            <Button variant="outline" size="sm" className='text-xs dark:border-gray-700 dark:hover:bg-gray-800'>
              <ArrowLeft className="w-2 h-2 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{step.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200  dark:border-gray-700/50">
          <h2 className="text-lg font-medium mb-4 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Informations générales
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Prix de base</p>
              <p className="font-medium dark:text-white">{step.price ? `${step.price.toLocaleString()} FNG` : 'Non défini'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Durée estimée</p>
              <p className="font-medium dark:text-white">{step.estimatedDuration ? `${step.estimatedDuration} jours` : 'Non définie'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ordre dans la procédure</p>
              <p className="font-medium dark:text-white">{step.order}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Statut</p>
              <p className="font-medium dark:text-white">{step.required ? 'Obligatoire' : 'Optionnel'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date de création</p>
              <p className="font-medium dark:text-white">{new Date(step.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dernière modification</p>
              <p className="font-medium dark:text-white">{new Date(step.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-lg font-medium mb-4 dark:text-white flex items-center gap-2">
            <ListChecks className="w-5 h-5" />
            Statistiques des clients
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/80">
              <p className="text-sm text-gray-500 dark:text-gray-400">En attente</p>
              <p className="text-2xl font-bold dark:text-white">{step.clientSteps?.filter(cs => cs.status === 'PENDING').length || 0}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/80">
              <p className="text-sm text-gray-500 dark:text-gray-400">En cours</p>
              <p className="text-2xl font-bold dark:text-white">{step.clientSteps?.filter(cs => cs.status === 'IN_PROGRESS').length || 0}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/80">
              <p className="text-sm text-gray-500 dark:text-gray-400">Complétés</p>
              <p className="text-2xl font-bold dark:text-white">{step.clientSteps?.filter(cs => cs.status === 'COMPLETED').length || 0}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/80">
              <p className="text-sm text-gray-500 dark:text-gray-400">En attente externe</p>
              <p className="text-2xl font-bold dark:text-white">{step.clientSteps?.filter(cs => cs.status === 'WAITING').length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-lg font-medium mb-4 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Statistiques financières
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/80">
              <p className="text-sm text-gray-500 dark:text-gray-400">Revenu total</p>
              <p className="text-2xl font-bold dark:text-white">
                {step.clientSteps?.reduce((sum, cs) => sum + (cs.price || 0), 0).toLocaleString()} FNG
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/80">
              <p className="text-sm text-gray-500 dark:text-gray-400">Prix moyen appliqué</p>
              <p className="text-2xl font-bold dark:text-white">
                {step.clientSteps?.length ? 
                  Math.round(step.clientSteps.reduce((sum, cs) => sum + (cs.price || 0), 0) / step.clientSteps.length).toLocaleString() 
                  : 0} FNG
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Liste des clients inscrits
        </h2>
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date début</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date fin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prix appliqué</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {step.clientSteps?.map((clientStep) => (
                <tr key={clientStep.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {clientStep.clientProcedure.client.user.firstName} {clientStep.clientProcedure.client.user.lastName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {clientStep.clientProcedure.client.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${clientStep.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 
                      clientStep.status === 'IN_PROGRESS' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                      clientStep.status === 'WAITING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                      'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'}`}>
                      {clientStep.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {clientStep.startDate ? new Date(clientStep.startDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {clientStep.completionDate ? new Date(clientStep.completionDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {clientStep.price ? `${clientStep.price.toLocaleString()} FNG` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      href={`/services/gestion/procedures/${params.procedureId}/steps/step/${params.stepId}/client/${clientStep.id}`}
                      size="sm"
                      variant="outline"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
