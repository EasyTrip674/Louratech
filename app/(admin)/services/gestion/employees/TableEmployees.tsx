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
import { employeesTableOrganizationDB } from "@/db/queries/employees.query";
import { Eye, ChevronLeft, ChevronRight, Search } from "lucide-react";
import EditEmployeeFormModal from "./edit/EditEmployeeFormModal";
import { authClient } from "@/lib/auth-client";
import DeleteemployeeFormModal from "./[employeeId]/delete/DeleteEmployeeFormModal";

type TableEmployeesProps = {
  employees?: Awaited<ReturnType<typeof employeesTableOrganizationDB>>;
}

export default function TableEmployees({ employees }: TableEmployeesProps) {
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [filteredEmployees, setFilteredEmployees] = useState(employees || []);
  const itemsPerPage = 5;
  const session = authClient.useSession();

  // Ajout des nouveaux états pour les filtres avancés
  const [emailFilter, setEmailFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");


  // Appliquer les filtres chaque fois que searchTerm, statusFilter ou employees change
  useEffect(() => {
    if (!employees) return;

    let filtered = [...employees];
    
    // Appliquer le filtre de recherche
    if (searchTerm.trim() !== "") {
      const searchTermLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(employee => 
        `${employee.user.lastName} ${employee.user.firstName}`.toLowerCase().includes(searchTermLower) ||
        employee.user.email.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Appliquer le filtre de statut
    if (statusFilter !== "all") {
      filtered = filtered.filter(employee => 
        (statusFilter === "active" ? employee.user.active : !employee.user.active)
      );
    }

    // Appliquer les filtres avancés
    if (emailFilter.trim() !== "") {
      filtered = filtered.filter(employee =>
        employee.user.email && employee.user.email.toLowerCase().includes(emailFilter.toLowerCase())
      );
    }
    if (addressFilter.trim() !== "") {
      filtered = filtered.filter(employee =>
        employee.address && employee.address.toLowerCase().includes(addressFilter.toLowerCase())
      );
    }
    if (phoneFilter.trim() !== "") {
      filtered = filtered.filter(employee =>
        employee.phone && employee.phone.includes(phoneFilter.trim())
      );
    }
    
   

    setFilteredEmployees(filtered);
    // Retourner à la première page après application des filtres
    setCurrentPage(1);
  }, [searchTerm, statusFilter, emailFilter, addressFilter, phoneFilter, employees]);

  if (!employees || employees.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        Aucun employé trouvé.
      </div>
    );
  }

  // Calculer les indices pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // Fonction pour changer de page
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };


  return (
    <div className="space-y-4">
      {/* Filtres et recherche */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un employé..."
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
            <input type="text" placeholder="Email..." value={emailFilter} onChange={e => setEmailFilter(e.target.value)} className="input-filter" />
            <input type="text" placeholder="Téléphone..." value={phoneFilter} onChange={e => setPhoneFilter(e.target.value)} className="input-filter" />
            <input type="text" placeholder="Adresse..." value={addressFilter} onChange={e => setAddressFilter(e.target.value)} className="input-filter" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredEmployees.length} employé{filteredEmployees.length > 1 ? 's' : ''}
            </span>
            {/* Ajoute ici le bouton d'ajout si besoin */}
          </div>
        </div>
      </div>

      {/* Résumé des résultats */}
      <div className="text-sm text-gray-500 dark:text-gray-400 px-1">
        {filteredEmployees.length} employé(s) trouvé(s) {(searchTerm || statusFilter !== "all" || emailFilter || addressFilter || phoneFilter) && "après filtrage"}
      </div>

      {/* Tableau des employés */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      Name
                  
                    </div>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      Email
                    
                    </div>
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
                {currentEmployees.length > 0 ? (
                  currentEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {(employee.user.firstName?.charAt(0) || '') + (employee.user.lastName?.charAt(0) || '')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {employee.user.firstName} {employee.user.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {employee.address || "Aucune adresse"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {employee.user.email}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {employee.address}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={
                              employee.user.active
                                ? "success"
                                : "error"
                            }
                          >
                            {employee.user.active ? "Active" : "Inactive"}
                          </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          {
                            session.data?.userDetails?.authorize?.canReadAdmin && (
                                <Button variant="outline" size="sm" onClick={() => window.location.href = `/services/gestion/employees/${employee.id}` }>
                                <Eye className="w-4 h-4 dark:text-white" />
                              </Button>
                            )
                          }
                          {
                            session.data?.userDetails?.authorize?.canEditAdmin && (
                                <EditEmployeeFormModal admin={employee} />
                            )
                          }
                          {
                            session.data?.userDetails?.authorize?.canDeleteAdmin && (
                                <DeleteemployeeFormModal
                                  employee={employee}
                                  inPageProfile={false} 
                                />
                            )
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      Aucun employé ne correspond aux critères de recherche.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-white/[0.05]">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredEmployees.length)} sur {filteredEmployees.length} employés
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