"use client";
import { authClient } from '@/lib/auth-client';
import { formatCurrency } from '@/lib/utils';
import React from 'react';

interface ProcedureFinancialSummaryProps {
  totalRevenue: number;
  pendingRevenue: number;
  procedurePrice: number;
  totalClients: number;
}

export const ProcedureFinancialSummary: React.FC<ProcedureFinancialSummaryProps> = ({ 
  totalRevenue, 
  pendingRevenue, 
  procedurePrice,
  totalClients
}) => {
  // Calcul des revenus potentiels si tous les clients payaient le prix complet
  const potentialRevenue = procedurePrice * totalClients;
  
  // Calcul du taux de recouvrement (revenus perçus / revenus potentiels)
  const recoveryRate = potentialRevenue > 0 ? Math.round((totalRevenue / potentialRevenue) * 100) : 0;
  const session = authClient.useSession();
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Prix Standard</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{
          formatCurrency(procedurePrice, session?.data?.userDetails?.organization?.comptaSettings?.currency)
          }</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Revenus Perçus</h3>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalRevenue, session?.data?.userDetails?.organization?.comptaSettings?.currency)}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Revenus en Attente</h3>
        <p className="text-2xl font-bold text-amber-500">{formatCurrency(pendingRevenue, session?.data?.userDetails?.organization?.comptaSettings?.currency)}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Taux de Recouvrement</h3>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{recoveryRate}%</p>
      </div>
    </div>
  );
};