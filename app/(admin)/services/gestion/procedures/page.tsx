import React, { Suspense } from 'react'
import CreateProcedureFormModal from './create/CreateProcedureModalForm'
import StatsServices from '@/components/ServicesDasboard/StatsServices/StatsServices'
import StatsServicesSkeleton from '@/components/ServicesDasboard/StatsServices/StatsServicesSkeleton'
import ServicesCardLayout from '@/components/ServicesDasboard/ServicesCards/ServicesCardLayout'
import ServicesCardsSkeleton from '@/components/ServicesDasboard/ServicesCards/ServicesCardSkeleton'

const ProceduresPage = async () => {
  // Données simulées pour les procédures






  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Aperçu des Services</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Gérez vos services et suivez leur progression</p>
            </div>
            
            <div className="flex items-center gap-3 mt-6 md:mt-0">
              {/* <div className="relative flex-grow md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher un service..." 
                  className="pl-10 pr-4 py-3 text-md border border-gray-200 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                />
              </div>
              <button className="p-3 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300">
                <Filter className="h-5 w-5" />
              </button> */}
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
            {/* <button className="flex items-center gap-2 text-brand-600 hover:text-brand-800 dark:text-brand-400 font-medium transition-colors">
              Voir tout <ArrowRight className="h-4 w-4" />
            </button> */}
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
  )
}

export default ProceduresPage