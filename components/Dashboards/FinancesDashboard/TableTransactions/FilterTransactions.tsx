"use client";

import React, { useState, useEffect } from "react";
import { 
  Search,
  FileText,
  Filter,
  ChevronDown,
  X,
  Calendar,
  DollarSign,
  User,
  Tag,
  CheckCircle,
  Clock
} from "lucide-react";
import { TransactionsTable } from "./TransactionsTable";
import { getTransactionsDB } from "@/db/queries/finances.query";
import CreateDepenseModal from "../../../../app/(admin)/services/gestion/finances/transactions/depenses/DepensesModal";
import CreateRevenuModal from "../../../../app/(admin)/services/gestion/finances/transactions/revenus/RevenuModal";
import { authClient } from "@/lib/auth-client";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";

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
  
  // Nouveaux filtres
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCreatedBy, setSelectedCreatedBy] = useState("");
  const [selectedApprovedBy, setSelectedApprovedBy] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [hasClientProcedure, setHasClientProcedure] = useState<"all" | "yes" | "no">("all");
  
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const session = authClient.useSession();
  
  // Extraire les options uniques pour les filtres
  const uniqueClients = React.useMemo(() => {
    const clients = new Map<string,{id: string, name: string}>();
    transactions.forEach(transaction => {
      if (transaction.clientProcedure?.client) {
        const client = transaction.clientProcedure.client;
        const clientName = client?.firstName || `Client ${client.id}`;
        clients.set(client.id, {
          id: client.id,
          name: clientName
        });
      }
    });
    return Array.from(clients.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [transactions]);

  const uniqueCategories = React.useMemo(() => {
    const categories = new Map<string, {id: string, name: string}>();
    transactions.forEach(transaction => {
      if (transaction.category) {
        const id = transaction.category.id;
        const name = transaction.category.name;
        categories.set(id, {id,name})
      }
    });
    return Array.from(categories.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [transactions]);

  const uniqueCreators = React.useMemo(() => {
    const creatorMap = new Map<string, { id: string; name: string }>();
  
    transactions.forEach(transaction => {
      if (transaction.createdBy) {
        const id = transaction.createdBy.id;
        const name = transaction.createdBy.name || transaction.createdBy.email;
        creatorMap.set(id, { id, name }); // Remplace si le même id existe déjà (ce qu'on veut ici)
      }
    });
  
    return Array.from(creatorMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [transactions]);

  const uniqueApprovers = React.useMemo(() => {
    const approvers = new Map<string,{id: string, name: string}>();
    transactions.forEach(transaction => {
      if (transaction.approvedBy) {
        approvers.set(transaction.approvedBy.id,{
          id: transaction.approvedBy.id,
          name: transaction.approvedBy.name || transaction.approvedBy.email
        });
      }
    });
    return Array.from(approvers.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [transactions]);

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
        transaction.createdBy?.name?.toLowerCase().includes(searchLower) ||
        transaction.createdBy?.email.toLowerCase().includes(searchLower) ||
        transaction.approvedBy?.name?.toLowerCase().includes(searchLower) ||
        transaction.approvedBy?.email?.toLowerCase().includes(searchLower) ||
        transaction.clientProcedure?.client?.firstName?.toLowerCase().includes(searchLower) ||
        transaction.clientProcedure?.procedure?.name?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtre par client
    if (selectedClient) {
      filtered = filtered.filter(transaction => 
        transaction.clientProcedure?.client?.id === selectedClient
      );
    }
    
    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter(transaction => 
        transaction.category?.id === selectedCategory
      );
    }
    
    // Filtre par créateur
    if (selectedCreatedBy) {
      filtered = filtered.filter(transaction => 
        transaction.createdBy?.id === selectedCreatedBy
      );
    }
    
    // Filtre par approbateur
    if (selectedApprovedBy) {
      filtered = filtered.filter(transaction => 
        transaction.approvedBy?.id === selectedApprovedBy
      );
    }
    
    // Filtre par statut d'approbation
    if (selectedStatus !== "all") {
      if (selectedStatus === "approved") {
        filtered = filtered.filter(transaction => transaction.approvedBy !== null);
      } else if (selectedStatus === "pending") {
        filtered = filtered.filter(transaction => transaction.approvedBy === null);
      }
      // Note: "rejected" nécessiterait un champ status dans le modèle
    }
    
    // Filtre par présence de procédure client
    if (hasClientProcedure !== "all") {
      if (hasClientProcedure === "yes") {
        filtered = filtered.filter(transaction => transaction.clientProcedure !== null);
      } else if (hasClientProcedure === "no") {
        filtered = filtered.filter(transaction => transaction.clientProcedure === null);
      }
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

  useEffect(() => {
    applyFilters();
  }, [selectedTab, searchTerm, dateRange, amountRange, selectedClient, selectedCategory, selectedCreatedBy, selectedApprovedBy, selectedStatus, hasClientProcedure]);

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchTerm("");
    setDateRange({from: "", to: ""});
    setAmountRange({min: "", max: ""});
    setSelectedClient("");
    setSelectedCategory("");
    setSelectedCreatedBy("");
    setSelectedApprovedBy("");
    setSelectedStatus("all");
    setHasClientProcedure("all");
    setShowFilters(false);
  };

  // Vérifier si des filtres avancés sont actifs
  const hasActiveFilters = dateRange.from || dateRange.to || amountRange.min || amountRange.max || 
                          selectedClient || selectedCategory || selectedCreatedBy || selectedApprovedBy || 
                          selectedStatus !== "all" || hasClientProcedure !== "all";

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
            <Input 
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Filtre par client */}
              <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <User className="w-4 h-4 mr-2 text-blue-500" />
                Client
              </label>
              <Select
                options={uniqueClients.map(client => ({
                  value: client.id,
                  label: client.name
                }))}
                placeholder="Sélectionner un client"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              />
            </div>

                  {/* Filtre par catégorie */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Tag className="w-4 h-4 mr-2 text-green-500" />
                Catégorie
              </label>
              <Select
                options={uniqueCategories.map(category => ({
                  value: category.id,
                  label: category.name
                }))}
                placeholder="Sélectionner une catégorie"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
            </div>

            {/* Filtre par créateur */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <User className="w-4 h-4 mr-2 text-purple-500" />
                Créé par
              </label>
              <Select
                options={uniqueCreators.map(creator => ({
                  value: creator.id,
                  label: creator.name
                }))}
                placeholder="Sélectionner un créateur"
                value={selectedCreatedBy}
                onChange={(e) => setSelectedCreatedBy(e.target.value)}
              />
            </div>

            {/* Filtre par approbateur */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                Approuvé par
              </label>
              <Select
                options={uniqueApprovers.map(approver => ({
                  value: approver.id,
                  label: approver.name
                }))}
                placeholder="Sélectionner un approbateur"
                value={selectedApprovedBy}
                onChange={(e) => setSelectedApprovedBy(e.target.value)}
              />
            </div>

            {/* Filtre par statut */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Clock className="w-4 h-4 mr-2 text-orange-500" />
                Statut d&apos;approbation
              </label>
              <Select
                options={[
                  { value: "all", label: "Tous les statuts" },
                  { value: "approved", label: "Approuvées" },
                  { value: "pending", label: "En attente" },
                  { value: "rejected", label: "Rejetées" }
                ]}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as "all" | "approved" | "pending" | "rejected")}
              />
            </div>

            {/* Filtre par service lié */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                Service lié
              </label>
              <Select
                options={[
                  { value: "all", label: "Toutes" },
                  { value: "yes", label: "Avec service lié" },
                  { value: "no", label: "Sans service" }
                ]}
                value={hasClientProcedure}
                onChange={(e) => setHasClientProcedure(e.target.value as "all"|"yes"|"no")}
              />
            </div>

            {/* Date de début */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-2 text-cyan-500" />
                Date de début
              </label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
              />
            </div>

            {/* Date de fin */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-2 text-cyan-500" />
                Date de fin
              </label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
              />
            </div>

            {/* Montant minimum */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <DollarSign className="w-4 h-4 mr-2 text-yellow-500" />
                Montant minimum
              </label>
              <Input
                type="number"
                min="0"
                placeholder="Ex: 50"
                value={amountRange.min}
                onChange={(e) => setAmountRange({...amountRange, min: e.target.value})}
              />
            </div>

            {/* Montant maximum */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <DollarSign className="w-4 h-4 mr-2 text-yellow-500" />
                Montant maximum
              </label>
              <Input
                type="number"
                min="0"
                placeholder="Ex: 1000"
                value={amountRange.max}
                onChange={(e) => setAmountRange({...amountRange, max: e.target.value})}
              />
            </div>
          </div>

          
          {/* Actions des filtres */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 mr-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        </div>
      )}
      
      {/* Résumé des filtres appliqués */}
      {(hasActiveFilters || searchTerm) && (
        <div className="p-3 bg-blue-50 text-blue-800 text-sm border-b border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/50">
          <div className="flex flex-wrap gap-2 items-center justify-between">
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
              {selectedClient && (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs dark:bg-blue-800 dark:text-blue-200">
                  Client: {uniqueClients.find(c => c.id === selectedClient)?.name}
                  <button onClick={() => setSelectedClient("")} className="ml-1 hover:text-blue-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs dark:bg-blue-800 dark:text-blue-200">
                  Catégorie: {uniqueCategories.find(c => c.id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory("")} className="ml-1 hover:text-blue-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCreatedBy && (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs dark:bg-blue-800 dark:text-blue-200">
                  Créé par: {uniqueCreators.find(c => c.id === selectedCreatedBy)?.name}
                  <button onClick={() => setSelectedCreatedBy("")} className="ml-1 hover:text-blue-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedApprovedBy && (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs dark:bg-blue-800 dark:text-blue-200">
                  Approuvé par: {uniqueApprovers.find(c => c.id === selectedApprovedBy)?.name}
                  <button onClick={() => setSelectedApprovedBy("")} className="ml-1 hover:text-blue-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedStatus !== "all" && (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs dark:bg-blue-800 dark:text-blue-200">
                  Statut: {selectedStatus === "approved" ? "Approuvées" : "En attente"}
                  <button onClick={() => setSelectedStatus("all")} className="ml-1 hover:text-blue-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {hasClientProcedure !== "all" && (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs dark:bg-blue-800 dark:text-blue-200">
                  Procédure: {hasClientProcedure === "yes" ? "Avec" : "Sans"}
                  <button onClick={() => setHasClientProcedure("all")} className="ml-1 hover:text-blue-600">
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
                  Jusqu&apos;à: {new Date(dateRange.to).toLocaleDateString()}
                  <button onClick={() => setDateRange({...dateRange, to: ""})} className="ml-1 hover:text-blue-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {amountRange.min && (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs dark:bg-blue-800 dark:text-blue-200">
                  Min: {amountRange.min}fng
                  <button onClick={() => setAmountRange({...amountRange, min: ""})} className="ml-1 hover:text-blue-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {amountRange.max && (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs dark:bg-blue-800 dark:text-blue-200">
                  Max: {amountRange.max}fng
                  <button onClick={() => setAmountRange({...amountRange, max: ""})} className="ml-1 hover:text-blue-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
            <button
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300 whitespace-nowrap"
            >
              Tout effacer
            </button>
          </div>
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
      {
        filteredTransactions.length > 0 && (
            <TransactionsTable transactions={filteredTransactions} />
        )
      }
      
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
          Affichage de {filteredTransactions.length} transaction(s) sur {transactions.length} {(searchTerm || hasActiveFilters) && "après filtrage"}
        </div>
        {/* Contrôles de pagination ici si nécessaire */}
      </div>
    </div>
  );
}