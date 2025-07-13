import { Suspense } from "react";
import StatsTransactionLayout from "@/components/Dashboards/FinancesDashboard/StatsTransactions/StatsTransactionLayout";
import TransactionsTableLayout from "@/components/Dashboards/FinancesDashboard/TableTransactions/TransactionsTableLayout";
import StatsTransactionsSkeleton from "@/components/Dashboards/FinancesDashboard/StatsTransactions/StatsTransactionsSkeleton";
import FilteredTransactionsSkeleton from "@/components/Dashboards/FinancesDashboard/TableTransactions/FilteredTransactionsSkeleton";
import { transactionService } from "@/lib/services";

// Composant pour récupérer les données financières
async function FinancesDataProvider({ children }: { children: React.ReactNode }) {
  try {
    const transactions = await transactionService.getAllTransactions();
    const financialStats = await transactionService.getFinancialStats();
    
    return (
      <div 
        className="finances-data" 
        data-transactions={JSON.stringify(transactions)}
        data-stats={JSON.stringify(financialStats)}
      >
        {children}
      </div>
    );
  } catch (error) {
    console.error("Erreur lors du chargement des données financières:", error);
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erreur lors du chargement des données financières</p>
      </div>
    );
  }
}

export default async function FinancesPage() {
  return (
    <FinancesDataProvider>
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
    </FinancesDataProvider>
  );
}