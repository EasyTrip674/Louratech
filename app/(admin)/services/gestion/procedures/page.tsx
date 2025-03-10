import { ProcedureCard } from '@/components/procedures/ProcedureCard'
import React from 'react'
import { Users, Plane, FileCheck, Filter, Plus, Search } from 'lucide-react'
import CreateProcedureFormModal from './create/CreateProcedureModalForm'
import { getProcedureWithStats } from '@/db/queries/procedures.query'
import { notFound } from 'next/navigation'

type Props = {}

const ProceduresPage = async (props: Props) => {
  // Données simulées pour les procédures
  const procedureData = await getProcedureWithStats();
  if (!procedureData) {
    return notFound()
  }

  console.log(procedureData);
  

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Aperçu</h1>
            <p className="text-gray-500 dark:text-gray-400">Gérez vos services et voir leur details</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full md:w-64 dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
              />
            </div>
            <button className="p-2 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300">
              <Filter className="h-5 w-5" />
            </button>
           <CreateProcedureFormModal />
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Total Clients</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">10,310</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <Plane className="h-6 w-6 text-green-500" />
            </div>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Procédures en cours</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">675</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <FileCheck className="h-6 w-6 text-amber-500" />
            </div>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Terminées ce mois</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">9,065</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <FileCheck className="h-6 w-6 text-red-500" />
            </div>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Taux de réussite</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">87.9%</p>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Liste des Services</h2>
          <button className="text-sm text-brand-600 hover:text-brand-800 dark:text-brand-400 font-medium">Voir tout</button>
        </div>
        
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:gap-6 ">
          {procedureData.map((procedure, index) => (
            <ProcedureCard
              procedureId={procedure.id}
              key={index}
              title={procedure.title}
              totalClients={procedure.totalClients}
              change={procedure.change}
              inProgress={procedure.inProgress}
              completed={procedure.completed}
              failed={procedure.failed}
              timeframe={procedure.timeframe}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProceduresPage