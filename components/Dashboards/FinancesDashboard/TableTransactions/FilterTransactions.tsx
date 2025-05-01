"use client";

import React, { useState, useEffect } from "react";
import { 
  Search,
  FileText,
  Filter,
  ChevronDown,
  X,
  Calendar,
  DollarSign
} from "lucide-react";
import { TransactionsTable } from "./TransactionsTable";
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
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{from: string, to: string}>({from: "", to: ""});
  const [amountRange, setAmountRange] = useState<{min: string, max: string}>({min: "", max: ""});
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const session = authClient.useSession();
  
  // Appliquer tous les filtres lorsque les critères changent
  useEffect(() => {
    applyFilters();
  }, [selectedTab, searchTerm, dateRange, amountRange, transactions]);

  // Fonction pour appliquer tous les filtres
  const applyFilters = () => {
    let filtered = [...transactions];
    
    // Filtre par type (onglet)
    if (selectedTab === "expenses") {
      filtered = filtered.filter(transaction => transaction.type === "EXPENSE");
    } else if (selectedTab === "revenues") {
      filtered = filtered.filter(transaction => transaction.type === "REVENUE");
    }
    
    // Filtre par recherche
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(transaction => 
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.category?.name.toLowerCase().includes(searchLower) ||
        transaction.createdBy?.name.toLowerCase().includes(searchLower) ||
        transaction.createdBy?.email.toLowerCase().includes(searchLower) ||
        transaction.approvedBy?.name.toLowerCase().includes(searchLower) ||
        transaction.approvedBy?.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtre par date
    if (dateRange.from) {
      filtered = filtered.filter(transaction => 
        new Date(transaction.date) >= new Date(dateRange.from)
      );
    }
    
    if (dateRange.to) {
      filtered = filtered.filter(transaction => 
        new Date(transaction.date) <= new Date(dateRange.to)
      );
    }
    
    // Filtre par montant
    if (amountRange.min) {
      const minAmount = parseFloat(amountRange.min);
      filtered = filtered.filter(transaction => 
        transaction.amount >= minAmount
      );
    }
    
    if (amountRange.max) {
      const maxAmount = parseFloat(amountRange.max);
      filtered = filtered.filter(transaction => 
        transaction.amount <= maxAmount
      );
    }
    
    setFilteredTransactions(filtered);
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchTerm("");
    setDateRange({from: "", to: ""});
    setAmountRange({min: "", max: ""});
    setShowFilters(false);
  };

  // Vérifier si des filtres avancés sont actifs
  const hasActiveFilters = dateRange.from || dateRange.to || amountRange.min || amountRange.max;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex space-x-2 md:space-x-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          <button
            onClick={() => setSelectedTab("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selectedTab === "all" 
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/30"
            }`}
          >
            Toutes les transactions
          </button>
          <button
            onClick={() => setSelectedTab("revenues")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selectedTab === "revenues" 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/30"
            }`}
          >
            Entrées
          </button>
          <button
            onClick={() => setSelectedTab("expenses")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
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
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition-colors dark:text-white ${
              hasActiveFilters || showFilters
                ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/30 dark:text-blue-400"
                : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtres
            {hasActiveFilters && <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">!</span>}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
      
      {/* Filtres avancés */}
      {showFilters && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtre par date - De */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1" /> Date de début
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            
            {/* Filtre par date - À */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1" /> Date de fin
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            
            {/* Filtre par montant - Min */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" /> Montant min
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amountRange.min}
                onChange={(e) => setAmountRange({...amountRange, min: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Ex: 50"
              />
            </div>
            
            {/* Filtre par montant - Max */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" /> Montant max
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amountRange.max}
                onChange={(e) => setAmountRange({...amountRange, max: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Ex: 1000"
              />
            </div>
          </div>
          
          {/* Actions des filtres */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 mr-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}
      
      {/* Résumé des filtres appliqués */}
      {(hasActiveFilters || searchTerm) && (
        <div className="p-3 bg-blue-50 text-blue-800 text-sm flex justify-between items-center dark:bg-blue-900/20 dark:text-blue-300 border-b border-blue-100 dark:border-blue-900/50">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-medium">Filtres appliqués:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs dark:bg-blue-800 dark:text-blue-200">
                Recherche: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-blue-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {dateRange.from && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs dark:bg-blue-800 dark:text-blue-200">
                Depuis: {new Date(dateRange.from).toLocaleDateString()}
                <button onClick={() => setDateRange({...dateRange, from: ""})} className="ml-1 hover:text-blue-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {dateRange.to && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs dark:bg-blue-800 dark:text-blue-200">
                Jusqu'à: {new Date(dateRange.to).toLocaleDateString()}
                <button onClick={() => setDateRange({...dateRange, to: ""})} className="ml-1 hover:text-blue-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {amountRange.min && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs dark:bg-blue-800 dark:text-blue-200">
                Min: {amountRange.min}€
                <button onClick={() => setAmountRange({...amountRange, min: ""})} className="ml-1 hover:text-blue-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {amountRange.max && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs dark:bg-blue-800 dark:text-blue-200">
                Max: {amountRange.max}€
                <button onClick={() => setAmountRange({...amountRange, max: ""})} className="ml-1 hover:text-blue-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          <button
            onClick={resetFilters}
            className="text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300"
          >
            Tout effacer
          </button>
        </div>
      )}
      
      {/* Boutons d'action */}
      <div className="p-4 flex flex-wrap gap-3 justify-end">
        {session.data?.userDetails?.authorize?.canCreateTransaction && session?.data?.userDetails?.authorize?.canCreateRevenue && (
          <CreateRevenuModal />
        )}
        {session.data?.userDetails?.authorize?.canCreateTransaction && session?.data?.userDetails?.authorize?.canCreateExpense && (
          <CreateDepenseModal />
        )}
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
            {searchTerm || hasActiveFilters
              ? "Aucune transaction ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
              : selectedTab === "expenses" 
                ? "Aucune dépense enregistrée. Créez une nouvelle dépense pour commencer."
                : selectedTab === "revenues"
                  ? "Aucun revenu enregistré. Créez un nouveau revenu pour commencer."
                  : "Aucune transaction n'a été enregistrée. Commencez par créer un revenu ou une dépense."
            }
          </p>
          {(searchTerm || hasActiveFilters) && (
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}
      
      {/* Information sur le nombre de résultats */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Affichage de {filteredTransactions.length} transaction(s) {(searchTerm || hasActiveFilters) && "après filtrage"}
        </div>
        {/* Contrôles de pagination ici si nécessaire */}
      </div>
    </div>
  );
}