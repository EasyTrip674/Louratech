import { getProcedureDetails } from "@/db/queries/procedures.query";
import { CheckCircle, Clock, CreditCard, Users } from "lucide-react";

export default async function StatsService(
{procedureId}: { procedureId: string },
) {

  const procedure = await getProcedureDetails(procedureId);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Total Clients</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{procedure?.totalClients}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">En cours</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{procedure?.inProgressCount}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Complétées</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{procedure?.completedCount}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <CreditCard className="h-6 w-6 text-purple-500" />
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Revenu total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{procedure?.totalRevenue} FNG</p>
        </div>
      </div>
    )
}