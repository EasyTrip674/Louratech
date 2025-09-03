"use client";
import { api } from "@/lib/BackendConfig/api";
import useAuth from "@/lib/BackendConfig/useAuth";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, CreditCard, Users } from "lucide-react";

export interface ServiceDetailResponse {
  success: boolean;
  data?: {
    id: string;
    title: string;
    description: string;
    total_clients: number;
    in_progress: number;
    completed: number;
    failed: number;
    total_revenue: number;
    steps: any[]; // or define a specific Step interface if needed
  };
}

export default function StatsService(
{procedureId}: { procedureId: string },
) {

  const session = useAuth()
  const { data: procedureData, isLoading, isError } = useQuery<ServiceDetailResponse>({
    queryKey: [`procedure${procedureId}.overview`],
    queryFn: () => api.get(`api/procedures/procedures/${procedureId}/overview`).then(res => res.data),
    retry: false
  });

  console.log(procedureData?.data);
  

  
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Total Clients</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{procedureData?.data?.total_clients}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">En cours</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{procedureData?.data?.in_progress}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Complétées</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{procedureData?.data?.completed}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <CreditCard className="h-6 w-6 text-purple-500" />
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Revenu total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {
            formatCurrency(procedureData?.data?.total_revenue ?? 0, session?.user?.compta_settings?.currency)
            }
            </p>
        </div>
      </div>
    )
}