"use client"

"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { 
  Eye, 
  Clock, 
  CheckCircle, 
  User, 
  Calendar, 
  AlertCircle, 
  Search,
  ChevronRight,
  Filter,
  X,
  ChevronLeft,
} from "lucide-react";
import { procedureDetailsDb } from "@/db/queries/procedures.query";
import Link from "next/link";
import { calculateProgress, formatDate } from "@/lib/utils";
import { getStatusIcon, getStepStatusBadge } from "@/lib/StatusBadge";

type TableClientsProcedureProps = {
  procedureDetails: procedureDetailsDb;
  showProgress?: boolean;
  showDates?: boolean;
  showInvoice?: boolean;
  canEditClientProcedure?: boolean;
}

type FilterType = {
  status: string;
  progress: string;
  search: string;
}

const ITEMS_PER_PAGE = 3;

export default function TableClientsProcedure({ 
  procedureDetails,
  showDates = true,
  showProgress = true,
  canEditClientProcedure = false,
}: TableClientsProcedureProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    status: '',
    progress: '',
    search: ''
  });

  // Move this check to a variable
  const hasData = procedureDetails && procedureDetails.clientProcedures;
  const clientProcedures = hasData ? procedureDetails.clientProcedures : [];

  // Hooks always called
  const filteredData = useMemo(() => {
    return clientProcedures.filter(clientProc => {
      const progress = clientProc.steps ? calculateProgress(clientProc.steps) : 0;
      const fullName = `${clientProc.client.lastName} ${clientProc.client.firstName}`.toLowerCase();
      const email = clientProc.client.email?.toLowerCase() || '';
      
      // Filtre de recherche
      const searchMatch = !filters.search || 
        fullName.includes(filters.search.toLowerCase()) ||
        email.includes(filters.search.toLowerCase());

      // Filtre de statut
      const statusMatch = !filters.status || (() => {
        const completedSteps = clientProc.steps?.filter(step => step.status === "COMPLETED").length || 0;
        const totalSteps = clientProc.steps?.length || 0;
        
        if (filters.status === 'completed') return completedSteps === totalSteps && totalSteps > 0;
        if (filters.status === 'in-progress') return completedSteps > 0 && completedSteps < totalSteps;
        if (filters.status === 'not-started') return completedSteps === 0;
        return true;
      })();

      // Filtre de progression
      const progressMatch = !filters.progress || (() => {
        if (filters.progress === '0-25') return progress >= 0 && progress <= 25;
        if (filters.progress === '26-50') return progress >= 26 && progress <= 50;
        if (filters.progress === '51-75') return progress >= 51 && progress <= 75;
        if (filters.progress === '76-100') return progress >= 76 && progress <= 100;
        return true;
      })();

      return searchMatch && statusMatch && progressMatch;
    });
  }, [clientProcedures, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Now do the early return
  if (!hasData) return null;

  const clearFilters = () => {
    setFilters({ status: '', progress: '', search: '' });
  };


  const hasActiveFilters = filters.status || filters.progress || filters.search;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header avec recherche et filtres */}
      <div className="p-4 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h3 className="font-medium text-gray-800 dark:text-white/90">
            {filteredData.length} client{filteredData.length !== 1 ? 's' : ''} 
            {filteredData.length !== clientProcedures.length && (
              <span className="text-gray-500"> sur {clientProcedures.length}</span>
            )}
          </h3>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Rechercher un client..." 
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
              {hasActiveFilters && (
                <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800 dark:text-white/90">Filtres</h4>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Effacer tout
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filtre par statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Statut
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="">Tous les statuts</option>
                  <option value="completed">Terminé</option>
                  <option value="in-progress">En cours</option>
                  <option value="not-started">Non commencé</option>
                </select>
              </div>

              {/* Filtre par progression */}
              {showProgress && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Progression
                  </label>
                  <select
                    value={filters.progress}
                    onChange={(e) => setFilters(prev => ({ ...prev, progress: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="">Toutes les progressions</option>
                    <option value="0-25">0% - 25%</option>
                    <option value="26-50">26% - 50%</option>
                    <option value="51-75">51% - 75%</option>
                    <option value="76-100">76% - 100%</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tableau */}
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-800/50">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Client
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Modules
                  </div>
                </TableCell>
              
                {showProgress && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Progression
                    </div>
                  </TableCell>
                )}
              
                {showDates && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Dates
                    </div>
                  </TableCell>
                )}
              
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {currentData.map((clientProc) => {
                const progress = clientProc.steps ? calculateProgress(clientProc.steps) : 0;
                
                return (
                  <TableRow 
                    key={clientProc.id}
                    className="hover:bg-gray-50 transition-colors dark:hover:bg-white/[0.02]"
                  >
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <span className="font-medium text-purple-600 dark:text-purple-400">
                            {clientProc.client.firstName?.charAt(0)}{clientProc.client.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {clientProc.client.lastName} {clientProc.client.firstName}
                          </span>
                          <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                            {clientProc.client.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-col space-y-2 max-h-40 overflow-y-auto pr-2">
                        {clientProc.steps.map((stepClient) => (
                          <div key={stepClient.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                            {getStatusIcon(stepClient.status)}
                            <span className="font-medium">{stepClient.step.name}</span>
                            <div className="ml-auto">
                              {getStepStatusBadge(stepClient.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                
                    {showProgress && (
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="w-full">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{progress}% complété</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                            <div 
                              className={`h-2 rounded-full ${
                                progress === 100 ? 'bg-green-500' : 
                                progress > 50 ? 'bg-blue-500' : 
                                progress > 25 ? 'bg-amber-500' : 'bg-purple-500'
                              }`} 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                    )}
                
                    {showDates && (
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex flex-col space-y-2 max-h-40 overflow-y-auto pr-2">
                          {clientProc.steps.map((stepClient) => (
                            <div key={`${stepClient.id}-dates`} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg dark:bg-gray-800/50 text-xs">
                              <span className="font-medium">{stepClient.step.name.substring(0, 15)}{stepClient.step.name.length > 15 ? '...' : ''}</span>
                              <div className="flex items-center gap-1">
                                <span>{formatDate(String(stepClient?.startDate))}</span>
                                {stepClient.status === "COMPLETED" && (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    )}
                    
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {canEditClientProcedure && (
                        <div className="flex items-center">
                          <Link 
                            href={`/services/gestion/procedures/${clientProc.procedureId}/clients/${clientProc.id}`}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition-colors dark:bg-purple-700 dark:hover:bg-purple-800"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Détails
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              Affichage {startIndex + 1} à {Math.min(endIndex, filteredData.length)} sur {filteredData.length} résultats
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Message vide */}
      {filteredData.length === 0 && clientProcedures.length > 0 && (
        <div className="p-8 text-center">
          <div className="mb-4 flex justify-center">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">
            Aucun résultat trouvé
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
            Aucun client ne correspond à vos critères de recherche.
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
          >
            <X className="w-4 h-4 mr-2" />
            Effacer les filtres
          </button>
        </div>
      )}

      {clientProcedures.length === 0 && (
        <div className="p-8 text-center">
          <div className="mb-4 flex justify-center">
            <AlertCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">
            Aucun client enregistré
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Cette procédure n&apos;a pas encore de clients associés. Veuillez ajouter des clients pour commencer.
          </p>
        </div>
      )}
    </div>
  );
}