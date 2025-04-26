import { ProcedureCard } from '@/components/procedures/ProcedureCard'
import React from 'react'
import { Users, Plane, FileCheck, Filter, Search, PlusCircle, ArrowRight } from 'lucide-react'
import CreateProcedureFormModal from './create/CreateProcedureModalForm'
import { getProcedureWithStats } from '@/db/queries/procedures.query'
import { notFound } from 'next/navigation'
import { getOrgnaizationId } from '@/db/queries/utils.query'
import prisma from '@/db/prisma'

const ProceduresPage = async () => {
  // Données simulées pour les procédures
  const procedureData = await getProcedureWithStats();
  if (!procedureData) {
    return notFound()
  }

  const organizationId = await getOrgnaizationId()

  const totalClients = await prisma.client.count({
    where: {
      organizationId,
    },
  });
  const pendingServices = await prisma.clientProcedure.count({
    where: {
      status: {
        in: ["IN_PROGRESS"],
      },
      procedure: {
        organizationId,
      }
    },
  });

  const finishServices = await prisma.clientProcedure.count({
    where: {
      status: {
        in: ["COMPLETED"],
      },
      procedure: {
        organizationId,
      }
    },
  });

  // taux de réussite
  const successRate = (finishServices / (pendingServices + finishServices) || 0) * 100;
  const formattedSuccessRate = successRate.toFixed(1);

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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Total</div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalClients}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <Plane className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">En cours</div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Procédures en cours</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingServices}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                  <FileCheck className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Terminé</div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Terminées ce mois</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{finishServices}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <FileCheck className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Taux</div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Taux de réussite</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{formattedSuccessRate}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3 dark:bg-gray-700">
                <div className="bg-purple-600 h-2.5 rounded-full dark:bg-purple-500" style={{ width: `${formattedSuccessRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Liste des Services</h2>
            {/* <button className="flex items-center gap-2 text-brand-600 hover:text-brand-800 dark:text-brand-400 font-medium transition-colors">
              Voir tout <ArrowRight className="h-4 w-4" />
            </button> */}
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
            {procedureData.map((procedure, index) => (
              <ProcedureCard
                procedureId={procedure.id}
                key={index}
                title={procedure.title}
                totalClients={procedure.totalClients}
                inProgress={procedure.inProgress}
                completed={procedure.completed}
                failed={procedure.failed}
              />
            ))}
          </div>

          <div className="mt-8 text-center flex justify-center items-center">
          <CreateProcedureFormModal />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProceduresPage