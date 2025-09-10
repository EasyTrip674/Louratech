"use client"
import { api } from "@/lib/BackendConfig/api";
import { ProceduresWithStatsResponse } from "@/lib/services/procedure.service";
import { useSuspenseQuery} from "@tanstack/react-query";
import { Backpack, FileCheck, Users } from "lucide-react";

export default  function StatsServices() {

  const { data: procedureData, isLoading, isError } = useSuspenseQuery<ProceduresWithStatsResponse>({
    queryKey: ["proceduresServices"],
    queryFn: () => api.get("api/procedures/procedures/with-stats/").then(res => res.data),
    retry: false
  });



  const totalClients = procedureData?.data?.reduce((acc, item) => acc + (item.total_clients), 0) ?? 0;
  const pendingServices = procedureData?.data.reduce((acc, item)=> acc + item.in_progress,0) ?? 0;

  const finishServices = procedureData?.data.reduce((acc, item)=> acc + item.completed,0) ?? 0;

  // taux de réussite
  const successRate = (finishServices / (pendingServices + finishServices) || 0) * 100;
  const formattedSuccessRate = successRate.toFixed(1);

    return   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <Backpack className="h-6 w-6 text-green-600 dark:text-green-300" />
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">En cours</div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Services actifs</p>
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
}
