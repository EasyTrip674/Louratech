"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Search } from 'lucide-react';
import { clientsTableOrganizationDB } from '@/lib/services/client.service';
import Button from '@/components/ui/button/Button';
import CreateClientFormModal from './create/CreateClientFormModal';
import EditClientFormModal from './edit/EditClientFormModal';
import DeleteClientFormModal from './[clientId]/delete/DeleteClientFormModal';
import { authClient } from '@/lib/auth-client';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { useRouter } from 'next/navigation';

export default function TableClients() {
  const [clients, setClients] = useState<clientsTableOrganizationDB>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"name" | "email" | "createdAt">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const session = authClient.useSession();
  const router =useRouter();
  const [phoneFilter, setPhoneFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");


  // Récupérer les données des clients depuis le DOM
  useEffect(() => {
    const clientsDataElement = document.querySelector('.clients-data');
    if (clientsDataElement) {
      const clientsData = clientsDataElement.getAttribute('data-clients');
      if (clientsData) {
        try {
          const parsedClients = JSON.parse(clientsData);
          setClients(parsedClients);
        } catch (error) {
          console.error('Erreur lors du parsing des données clients:', error);
        }
      }
    }
    setIsLoading(false);
  }, []);

  // Mise à jour du useMemo pour appliquer tous les filtres
  const filteredAndSortedClients = useMemo(() => {
    if (!clients || clients.length === 0) return [];
    let filtered = [...clients];
    
    // Appliquer le filtre de recherche
    if (searchTerm.trim() !== "") {
      const searchTermLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(client => 
        `${client.lastName} ${client.firstName}`.toLowerCase().includes(searchTermLower) ||
        client?.email?.toLowerCase().includes(searchTermLower)
      );
    }
    
 

    // Appliquer le filtre de téléphone
    if (phoneFilter.trim() !== "") {
      filtered = filtered.filter(client =>
        client.phone && client.phone.includes(phoneFilter.trim())
      );
    }

    // Appliquer le filtre d'adresse
    if (addressFilter.trim() !== "") {
      filtered = filtered.filter(client =>
        client.address && client.address.toLowerCase().includes(addressFilter.toLowerCase())
      );
    }

    // Appliquer le tri
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortBy) {
        case "name":
          aValue = `${a.lastName} ${a.firstName}`.toLowerCase();
          bValue = `${b.lastName} ${b.firstName}`.toLowerCase();
          break;
        case "email":
          aValue = a?.email?.toLowerCase() ?? "";
          bValue = b?.email?.toLowerCase() ?? "";
          break;
        case "createdAt":
          aValue = new Date(0); // Fallback since createdAt is not available
          bValue = new Date(0);
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [clients, searchTerm, statusFilter, phoneFilter, addressFilter, sortBy, sortOrder]);

  // Calculer les indices pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredAndSortedClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedClients.length / itemsPerPage);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, phoneFilter, addressFilter, sortBy, sortOrder]);

  const handleSort = (column: "name" | "email" | "createdAt") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        <div className="mb-4">
          <Search className="h-12 w-12 text-gray-300" />
        </div>
        <p className="text-lg font-medium mb-2">Aucun client trouvé</p>
        <p className="text-sm text-gray-400">Commencez par ajouter votre premier client</p>
        <div className="mt-4">
          <CreateClientFormModal />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
          <input type="text" placeholder="Téléphone..." value={phoneFilter} onChange={e => setPhoneFilter(e.target.value)} className="input-filter" />
          <input type="text" placeholder="Adresse..." value={addressFilter} onChange={e => setAddressFilter(e.target.value)} className="input-filter" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredAndSortedClients.length} client{filteredAndSortedClients.length > 1 ? 's' : ''}
          </span>
          <CreateClientFormModal />
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-700">
                <TableRow>
                  <TableCell 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Client
                      {sortBy === "name" && (
                        <span className="text-blue-500">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      {sortBy === "email" && (
                        <span className="text-blue-500">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Téléphone
                  </TableCell>
                  <TableCell 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      Date d&apos;inscription
                      {sortBy === "createdAt" && (
                        <span className="text-blue-500">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {client.firstName?.charAt(0)}{client.lastName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {client.firstName} {client.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {client.address || "Aucune adresse"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{client.email}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {client.phone || "Non renseigné"}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        N/A
                      </div>
                    </TableCell>
                 
                    <TableCell className="px-6 py-4  text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/services/gestion/clients/${client.id}`)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {session.data?.userDetails?.authorize?.canEditClient && (
                          <EditClientFormModal client={client} />
                        )}
                        {session.data?.userDetails?.authorize?.canDeleteClient && (
                          <DeleteClientFormModal client={client} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredAndSortedClients.length)} sur {filteredAndSortedClients.length} clients
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}