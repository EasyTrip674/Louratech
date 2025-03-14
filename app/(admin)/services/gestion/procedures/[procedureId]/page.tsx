import React from 'react';
import { notFound } from 'next/navigation';
import { Users, Clock, CheckCircle, AlertCircle, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react';


import Button from "@/components/ui/button/Button";
import Link from 'next/link';
import { ProcedureFinancialSummary } from '@/components/procedures/ProcedureFinancialSummary';
import TableClientsProcedure from './TableClientsProcedure';
import { getProcedureDetails, getProcedureDetailsStepsDB, getProcedureWithStepsDb, getStepsProcedureDB } from '@/db/queries/procedures.query';
import { getCLientsIdWithNameDB } from '@/db/queries/clients.query';
import AddClientToStepModal from './steps/clientProcedure/AddClientToStepModal';
import TableProcedureSteps from './TableStepProcedure';
import CreateClientFormModal from '../../clients/create/CreateClientFormModal';
import CreateStepFormModal from './steps/step/create/CreateStepFormModal';
// import AddClientToProcedureModal from '@/components/procedures/AddClientToProcedureModal';

// Type pour les paramètres de la page
type PageProps = {
  params: {
    procedureId: string;
  };
};




// Composant principal de la page
export default async function ProcedureDetailPage({ params }: PageProps) {
  const procedure = await getProcedureDetails(params?.procedureId);
  const clients = await getCLientsIdWithNameDB();
  // Données de test pour les étapes d'une procédure
  const procedureDataStep = await getProcedureWithStepsDb(params?.procedureId);

  const stepsProc = await getStepsProcedureDB(params?.procedureId);




  if (!procedure) {
    return notFound();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-start gap-2 ">
          <Link href="/procedures">
            <Button variant="outline" size="sm" className='text-xs'>
              <ArrowLeft className="w-2 h-2 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{procedure.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{procedure.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Button href={`/procedures/${params.procedureId}/edit`} variant="outline">
            Modifier
          </Button>
        </div>
      </div>
      
      {/* Statistiques générales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Total Clients</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{procedure.totalClients}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">En cours</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{procedure.inProgressCount}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Complétées</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{procedure.completedCount}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <CreditCard className="h-6 w-6 text-purple-500" />
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Revenu total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{procedure.totalRevenue} FNG</p>
        </div>
      </div>
      
      {/* Résumé financier */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Résumé financier</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
          <ProcedureFinancialSummary 
            totalRevenue={procedure.totalRevenue}
            pendingRevenue={procedure.pendingRevenue}
            procedurePrice={procedure.price || 0}
            totalClients={procedure.totalClients}
          />
        </div>
      </div>
      
      {/* les modules */}
      <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Modules</h2>
          <div>
           <CreateStepFormModal procedureId={procedure.id}
             />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
           {/* les modules */}

            <TableProcedureSteps
              procedureDetails={procedureDataStep}
            />

          </div>
        </div>
      </div>
      
      {/* Liste des clients */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Clients inscrits</h2>
          <div>
            <AddClientToStepModal
              stepsProcedure={stepsProc}
            procedureId={params.procedureId} clientsDB={clients}   />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-full">
           <TableClientsProcedure procedureDetails={procedure} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}