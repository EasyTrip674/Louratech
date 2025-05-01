"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { clientsTableOrganizationDB } from "@/db/queries/clients.query";
import EditClientFormModal from "./edit/EditClientFormModal";
import { Eye, ChevronLeft, ChevronRight, Search, Filter, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import DeleteClientFormModal from "./[clientId]/delete/DeleteClientFormModal";

type TableClientsProps = {
  clients?: Awaited<ReturnType<typeof clientsTableOrganizationDB>>;
}

export default function TableClients({ clients }: TableClientsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [filteredClients, setFilteredClients] = useState(clients || []);
  const itemsPerPage = 5;
  const session = authClient.useSession();

  // Appliquer les filtres chaque fois que searchTerm, statusFilter ou clients change
  useEffect(() => {
    if (!clients) return;

    let filtered = [...clients];
    
    // Appliquer le filtre de recherche
    if (searchTerm.trim() !== "") {
      const searchTermLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(client => 
        `${client.user.lastName} ${client.user.firstName}`.toLowerCase().includes(searchTermLower) ||
        client.user.email.toLowerCase().includes(searchTermLower) ||
        (client.address && client.address.toLowerCase().includes(searchTermLower))
      );
    }
    
    // Appliquer le filtre de statut
    if (statusFilter !== "all") {
      filtered = filtered.filter(client => 
        (statusFilter === "active" ? client.user.active : !client.user.active)
      );
    }
    
    setFilteredClients(filtered);
    // Retourner à la première page après application des filtres
    setCurrentPage(1);
  }, [searchTerm, statusFilter, clients]);

  if (!clients || clients.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        Aucun client trouvé.
      </div>
    );
  }

  // Calculer les indices pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  // Fonction pour changer de page
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Fonction pour réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-4">
      {/* Filtres et recherche */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, email ou adresse..."
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 pl-10 pr-4 py-2 focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>
          
          {/* Filtre par statut */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Statut:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
              className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Tous</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
          
          {/* Bouton de réinitialisation */}
          {(searchTerm || statusFilter !== "all") && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* Résumé des résultats */}
      <div className="text-sm text-gray-500 dark:text-gray-400 px-1">
        {filteredClients.length} client(s) trouvé(s) {(searchTerm || statusFilter !== "all") && "après filtrage"}
      </div>

      {/* Tableau des clients */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Address
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
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
                {currentClients.length > 0 ? (
                  currentClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {client.user.lastName} {client.user.firstName}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {client.user.email}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {client.address}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={
                            client.user.active
                              ? "success"
                              : "error"
                          }
                        >
                          {client.user.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          {
                            session.data?.userDetails?.authorize?.canReadClient && (
                              <Button href={`/services/gestion/clients/${client.id}`} variant="outline" size="sm">
                                <Eye className="w-4 h-4 dark:text-white" />
                              </Button>
                            )
                          }
                          {
                            session.data?.userDetails?.authorize?.canEditClient && (
                              <EditClientFormModal client={client} />
                            )
                          }

                          {
                            session.data?.userDetails?.authorize?.canDeleteClient && (
                              <DeleteClientFormModal client={client} inPageProfile={false} />
                            )
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 ">
                      Aucun client ne correspond aux critères de recherche.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-white/[0.05]">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredClients.length)} sur {filteredClients.length} clients
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Afficher les pages autour de la page actuelle
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => paginate(pageNumber)}
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            currentPage === pageNumber
                              ? "bg-brand-600 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}