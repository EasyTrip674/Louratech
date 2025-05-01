"use client";

import React, { useState } from "react";
import { 
  Search,
  FileText,
} from "lucide-react";
import {   TransactionsTable } from "./TransactionsTable";
import { getTransactionsDB } from "@/db/queries/finances.query";
import CreateDepenseModal from "../../../../app/(admin)/services/gestion/finances/transactions/depenses/DepensesModal";
import CreateRevenuModal from "../../../../app/(admin)/services/gestion/finances/transactions/revenus/RevenuModal";
import { authClient } from "@/lib/auth-client";





// Page principale des finances
export default function FilteredTransactions({
    transactions
}:{
    transactions: getTransactionsDB
}) {
  const [selectedTab, setSelectedTab] = useState<"all" | "expenses" | "revenues">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const session = authClient.useSession();
  
  // Filtrage des transactions en fonction de l'onglet sélectionné
  const filteredTransactions = transactions.filter(transaction => {
    // Filtre par type
    if (selectedTab === "expenses" && transaction.type !== "EXPENSE") return false;
    if (selectedTab === "revenues" && transaction.type !== "REVENUE") return false;
    
    // Filtre par recherche
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Calculs des totaux
 
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedTab("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === "all" 
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/30"
            }`}
          >
            Toutes les transactions
          </button>
          <button
            onClick={() => setSelectedTab("revenues")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === "revenues" 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/30"
            }`}
          >
            Entrées
          </button>
          <button
            onClick={() => setSelectedTab("expenses")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === "expenses" 
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/30"
            }`}
          >
            Sorties
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
            />
          </div>
          {/* <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors dark:text-white">
            <Filter className="w-4 h-4" />
            Filtres
            <ChevronDown className="w-4 h-4" />
          </button> */}
        </div>
      </div>
      
      {/* Boutons d'action */}
      <div className="p-4 flex flex-wrap gap-3 justify-end">
     {
      session.data?.userDetails?.authorize?.canCreateTransaction && session?.data?.userDetails?.authorize?.canCreateExpense && (
        <CreateRevenuModal />
      )
     }
      {
      session.data?.userDetails?.authorize?.canCreateTransaction && session?.data?.userDetails?.authorize?.canCreateRevenue && (
        <CreateDepenseModal />
      )
     }
     
      </div>
      
      {/* Tableau des transactions */}
      <TransactionsTable transactions={filteredTransactions} />
      
      {/* Message si aucune transaction */}
      {filteredTransactions.length === 0 && (
        <div className="p-8 text-center">
          <div className="mb-4 flex justify-center">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">
            Aucune transaction trouvée
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {searchTerm 
              ? "Aucune transaction ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
              : selectedTab === "expenses" 
                ? "Aucune dépense enregistrée. Créez une nouvelle dépense pour commencer."
                : selectedTab === "revenues"
                  ? "Aucun revenu enregistré. Créez un nouveau revenu pour commencer."
                  : "Aucune transaction n'a été enregistrée. Commencez par créer un revenu ou une dépense."
            }
          </p>
        </div>
      )}
      
      {/* Pagination - À implémenter si nécessaire */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Affichage de {filteredTransactions.length} transaction(s)
        </div>
        {/* Contrôles de pagination ici si nécessaire */}
      </div>
    </div>
  );
}