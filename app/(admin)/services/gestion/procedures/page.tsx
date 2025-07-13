import React, { Suspense } from 'react'
import CreateProcedureFormModal from './create/CreateProcedureModalForm'
import StatsServices from '@/components/Dashboards/ServicesDasboard/StatsServices/StatsServices'
import StatsServicesSkeleton from '@/components/Dashboards/ServicesDasboard/StatsServices/StatsServicesSkeleton'
import ServicesCardLayout from '@/components/Dashboards/ServicesDasboard/ServicesCards/ServicesCardLayout'
import ServicesCardsSkeleton from '@/components/Dashboards/ServicesDasboard/ServicesCards/ServicesCardSkeleton'
import { procedureService } from '@/lib/services'

// Composant pour récupérer les données des procédures
async function ProceduresDataProvider({ children }: { children: React.ReactNode }) {
  try {
    const procedures = await procedureService.getAllProcedures();
    
    return (
      <div className="procedures-data" data-procedures={JSON.stringify(procedures)}>
        {children}
      </div>
    );
  } catch (error) {
    console.error("Erreur lors du chargement des procédures:", error);
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erreur lors du chargement des procédures</p>
      </div>
    );
  }
}

const ProceduresPage = async () => {
  return (
    <ProceduresDataProvider>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Aperçu des Services</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Gérez vos services et suivez leur progression</p>
              </div>
              
              <div className="flex items-center gap-3 mt-6 md:mt-0">
                <CreateProcedureFormModal />
              </div>
            </div>
            <Suspense fallback={<StatsServicesSkeleton />}>
              <StatsServices />
            </Suspense>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Liste des Services</h2>
            </div>
            
            <Suspense fallback={<ServicesCardsSkeleton />}>
              <ServicesCardLayout />
            </Suspense>

            <div className="mt-8 text-center flex justify-center items-center">
              <CreateProcedureFormModal />
            </div>
          </div>
        </div>
      </div>
    </ProceduresDataProvider>
  )
}

export default ProceduresPage