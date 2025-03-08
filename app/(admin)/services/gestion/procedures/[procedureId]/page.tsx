import React from 'react';
import { notFound } from 'next/navigation';
import { Users, Clock, CheckCircle, AlertCircle, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react';


import Button from "@/components/ui/button/Button";
import Link from 'next/link';
import { ProcedureFinancialSummary } from '@/components/procedures/ProcedureFinancialSummary';
import TableClientsProcedure from './TableClientsProcedure';
import { getProcedureDetails } from '@/db/queries/procedures.query';
import AddClientToProcedureModal from './clientProcedure/AddClientToProcedureModal';
// import AddClientToProcedureModal from '@/components/procedures/AddClientToProcedureModal';

// Type pour les paramètres de la page
type PageProps = {
  params: {
    procedureId: string;
  };
};

// Type pour les données d'une procédure
type ProcedureDetails = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  estimatedDuration: number | null;
  category: string | null;
  isActive: boolean;
  steps: StepProcedure[];
  clientProcedures: ClientProcedureWithClient[];
  totalClients: number;
  inProgressCount: number;
  completedCount: number;
  cancelledCount: number;
  totalRevenue: number;
  pendingRevenue: number;
};

// Type pour une étape de procédure
type StepProcedure = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  order: number;
  estimatedDuration: number | null;
  required: boolean;
};

// Type pour un client avec sa procédure
type ClientProcedureWithClient = {
  id: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  startDate: string;
  completionDate: string | null;
  dueDate: string | null;
  reference: string | null;
  client: {
    id: string;
    user: {
      firstName: string | null;
      lastName: string;
      email: string;
      active: boolean;
    };
  };
  steps: ClientStep[];
  invoice: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    status: 'DRAFT' | 'SENT' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  } | null;
  stepProgress: number;
};

// Type pour une étape client
type ClientStep = {
  id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'WAITING' | 'COMPLETED' | 'SKIPPED' | 'FAILED';
  startDate: string | null;
  completionDate: string | null;
};

// Fonction pour récupérer les détails d'une procédure spécifique

// Fonction pour calculer le statut d'un paiement
function getPaymentStatus(status: string) {
  switch(status) {
    case 'PAID':
      return { text: 'Payée', color: 'success' };
    case 'PARTIALLY_PAID':
      return { text: 'Partiellement payée', color: 'warning' };
    case 'OVERDUE':
      return { text: 'En retard', color: 'error' };
    case 'SENT':
      return { text: 'Envoyée', color: 'info' };
    case 'DRAFT':
      return { text: 'Brouillon', color: 'default' };
    case 'CANCELLED':
      return { text: 'Annulée', color: 'error' };
    default:
      return { text: 'Inconnue', color: 'default' };
  }
}

// Fonction pour calculer le statut de la procédure
function getProcedureStatus(status: string)  {
  switch(status) {
    case 'NOT_STARTED':
      return { text: 'Non démarrée', color: 'primary' };
    case 'IN_PROGRESS':
      return { text: 'En cours', color: 'info' };
    case 'ON_HOLD':
      return { text: 'En attente', color: 'info' };
    case 'COMPLETED':
      return { text: 'Terminée', color: 'success' };
    case 'CANCELLED':
      return { text: 'Annulée', color: 'warning' };
    case 'REJECTED':
      return { text: 'Rejetée', color: 'error' };
    default:
      return { text: 'Inconnue', color: 'info' };
  }
}

// Composant principal de la page
export default async function ProcedureDetailPage({ params }: PageProps) {
  const procedureId = params.procedureId;
  const procedure = await getProcedureDetails(procedureId);


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
          <Button href={`/procedures/${procedureId}/edit`} variant="outline">
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
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Modules</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
           {/* les modules */}
          </div>
        </div>
      </div>
      
      {/* Liste des clients */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Clients inscrits</h2>
          <div>
        <AddClientToProcedureModal procedureId={procedureId}   />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-full">
           <TableClientsProcedure procedureDetails={  {
                id: procedure.id,
                name: procedure.name,
                totalClients: procedure.totalClients,
                inProgressCount: procedure.inProgressCount,
                completedCount: procedure.completedCount,
                cancelledCount: procedure.cancelledCount,
                totalRevenue: procedure.totalRevenue,
                pendingRevenue: procedure.pendingRevenue,
                clientProcedures: procedure.clientProcedures
                }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}