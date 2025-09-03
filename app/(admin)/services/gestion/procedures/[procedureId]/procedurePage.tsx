"use client";
import React, { Suspense } from 'react';
// import { ArrowLeft } from 'lucide-react';
import Button from "@/components/ui/button/Button";
import Link from 'next/link';
import AddClientToStepModal from './clients/[clientProcedureId]/clientProcedure/AddClientToStepModal';
import CreateStepFormModal from './steps/step/create/CreateStepFormModal';
import StatsServiceSkeleton from '@/components/Dashboards/OneServiceDahsboard/StatsService/StatsServiceSkeleton';
import ProcedureFinancialSummaryLayout from '@/components/Dashboards/OneServiceDahsboard/ProcedureFinancialSummary/ProcedureFinancialSummaryLayout';
import TableClientsProcedureLayout from '@/components/Dashboards/OneServiceDahsboard/TableClientsProcedure/TableClientsProcedureLayout';
import StatsService from '@/components/Dashboards/OneServiceDahsboard/StatsService/StatsService';
import { ProcedureFinancialSummarySkeleton } from '@/components/Dashboards/OneServiceDahsboard/ProcedureFinancialSummary/ProcedureFinancialSummarySkeleton';
import TableClientsProcedureSkeleton from '@/components/Dashboards/OneServiceDahsboard/TableClientsProcedure/TableClientsProcedureSkeleton';
import TableProcedureStepsSkeleton from '@/components/Dashboards/OneServiceDahsboard/TableProcedureSteps/TableProcedureStepsSkeleton';
import TableProcedureStepsLayout from '@/components/Dashboards/OneServiceDahsboard/TableProcedureSteps/TableProcedureStepsLayout';
import EditProcedureFormModal from './edit/CreateEditModalForm';
import DeleteProcedureFormModal from './delete/DeleteProcedureFormModal';
import useAuth from '@/lib/BackendConfig/useAuth';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/BackendConfig/api';
import { ArrowLeft } from 'lucide-react';
// import AddClientToProcedureModal from '@/components/procedures/AddClientToProcedureModal';

// Type pour les paramètres de la page;

export type procedureDetailsType = {
  success: boolean,
  data: {
      id: string;
      steps: any[];
      created_at: string;
      updated_at: string;
      name: string;
      description: string;
      price: number;
      estimated_duration: number | null;
      category: string | null;
      is_active: boolean;
      organization: string;
    }
}



export default function ProcedureDetailPage({procedureId}:{
    procedureId:string
}) {
    // const session  = useAuth()


  const { data: procedureData, isLoading, isError } = useQuery<procedureDetailsType>({
    queryKey: [`procedure${procedureId}`],
    queryFn: () => api.get(`api/procedures/procedures/${procedureId}`).then(res => res.data),
    retry: false
  });

  const procedure = procedureData?.data;

  
  

//   const clients = await clientService.getClientsForSelect();
//   Données de test pour les étapes d'une procédure
//   const stepsProc = await procedureService.getSteps(procedureId);


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex gap-2 justify-end">
          <Link href="/services/gestion/procedures">
            <Button variant="outline" size="sm" className='text-xs'>
              <ArrowLeft className="w-2 h-2 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{procedure?.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{procedure?.description}</p>
          </div>
       
        </div>
        <div className='flex gap-2 items-center'>
        {/* {
          session?.user?.authorization?.can_edit_procedure && (
            <EditProcedureFormModal procedure={
              { procedureId: procedure.id, name:procedure.name ?? "", description: procedure.description ?? "" }
            } />
          )
         } */}
           <div className="flex items-center gap-3 mt-4 md:mt-0">
              {/* <DeleteProcedureFormModal 
              procedureId={procedure.id} 
              procedureName={procedure.name} 
              authozise={session?.user?.authorization.can_delete_client_procedure ?? false} 
              countClient={procedure._count.clientProcedures}
              /> */}
          </div>

        </div>
      
      </div>
      
      {/* Statistiques générales */}
      <Suspense fallback={<StatsServiceSkeleton />}>
        <StatsService procedureId={procedureId} />
      </Suspense>
     
      
      {/* Résumé financier */}
      <Suspense fallback={<ProcedureFinancialSummarySkeleton />} >
        <ProcedureFinancialSummaryLayout procedureId={procedureId} />
      </Suspense>
     
      {/* les modules */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Modules</h2>
          <div>
            {/* {
              session?.user?.authorization?.can_create_step && (
                <CreateStepFormModal procedureId={procedureId} />
              )
            } */}
          </div>
        </div>
        <div className="rounded-lg overflow-hidden">
            <Suspense fallback={<TableProcedureStepsSkeleton />}>
              <TableProcedureStepsLayout procedureId={procedureId} />
            </Suspense>
        </div>
      </div>
      
      {/* Liste des clients */}
      {/* <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Clients inscrits</h2>
          <div>
           {
            session?.userDetails?.authorize?.canCreateClientProcedure && ( <AddClientToStepModal
              stepsProcedure={{
                steps: (stepsProc?.steps ?? []).map(step => ({
                  id: step.id,
                  name: step.name,
                  price: step.price ?? undefined
                }))
              }}
              procedureId={procedureId}
              clientsDB={clients}
            />
            )
           }
          </div>
        </div>
        
        <Suspense fallback={<TableClientsProcedureSkeleton />} >
          <TableClientsProcedureLayout procedureId={procedureId} />
        </Suspense>
      </div> */}
    </div>
  );
}