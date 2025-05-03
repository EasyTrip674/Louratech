import { Suspense } from "react";
import StatsTransactionLayout from "@/components/Dashboards/FinancesDashboard/StatsTransactions/StatsTransactionLayout";
import TransactionsTableLayout from "@/components/Dashboards/FinancesDashboard/TableTransactions/TransactionsTableLayout";
import StatsTransactionsSkeleton from "@/components/Dashboards/FinancesDashboard/StatsTransactions/StatsTransactionsSkeleton";
import FilteredTransactionsSkeleton from "@/components/Dashboards/FinancesDashboard/TableTransactions/FilteredTransactionsSkeleton";

export default async function FinancesPage() {


  return (
    <div className="container mx-auto py-8 px-4">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Finances</h1>
      <p className="text-gray-600 dark:text-gray-400">Gérez vos entrées et sorties financières</p>
    </div>
    
    {/* Cartes récapitulatives */}
    <Suspense fallback={<StatsTransactionsSkeleton />}>
      <StatsTransactionLayout />
    </Suspense>
    
    {/* Actions et filtres */}
    <Suspense fallback={<FilteredTransactionsSkeleton />}>
      <TransactionsTableLayout />
    </Suspense>
    
  </div>
  );
}