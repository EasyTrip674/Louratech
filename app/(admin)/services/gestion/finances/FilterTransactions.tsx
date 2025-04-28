"use client";

import React, { useState } from "react";


import { 
  ArrowDownCircle,
  ArrowUpCircle,
  Search,
  FileText,
  CheckCircle
} from "lucide-react";
import {   TransactionsTable } from "./TransactionsTable";
import { getTransactionsDB } from "@/db/queries/finances.query";
import CreateDepenseModal from "./transactions/depenses/DepensesModal";
import CreateRevenuModal from "./transactions/revenus/RevenuModal";





// Page principale des finances
export default function FilteredTransactions({
    transactions
}:{
    transactions: getTransactionsDB
}) {
  const [selectedTab, setSelectedTab] = useState<"all" | "expenses" | "revenues">("all");
  const [searchTerm, setSearchTerm] = useState("");
  
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
  const totalRevenues = transactions
    .filter(t => t.type === "REVENUE" && t.status === "APPROVED")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === "EXPENSE" && t.status === "APPROVED")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalRevenues - totalExpenses;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Finances</h1>
        <p className="text-gray-600 dark:text-gray-400">Gérez vos entrées et sorties financières</p>
      </div>
      
      {/* Cartes récapitulatives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium">Entrées</h3>
            <ArrowUpCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalRevenues.toLocaleString('fr-FR')} FNG
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Total des revenus approuvés
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium">Sorties</h3>
            <ArrowDownCircle className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalExpenses.toLocaleString('fr-FR')} FNG
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Total des dépenses approuvées
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium">Balance</h3>
            <CheckCircle className="w-6 h-6 text-blue-500" />
          </div>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {balance.toLocaleString('fr-FR')} FNG
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Différence entrées/sorties
          </div>
        </div>
      </div>
      
      {/* Actions et filtres */}
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
          <CreateRevenuModal />
          <CreateDepenseModal />
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
    </div>
  );
}