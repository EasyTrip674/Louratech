"use client";
import React, { useState, useEffect } from "react";
import { ProcedureCard } from "@/components/procedures/ProcedureCard";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/BackendConfig/api";

export default function ServicesCard() {
  const { data: procedureData, isLoading, isError } = useQuery({
    queryKey: ["proceduresServices"],
    queryFn: () => api.get("api/procedures/procedures/with-stats/").then(res => res.data),
    retry: false
  });


  // État pour la recherche, le filtrage et la pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const itemsPerPage = 4;

  // Options de filtre
  const filterOptions = [
    { value: "all", label: "Tous les services" },
    { value: "inProgress", label: "En cours" },
    { value: "completed", label: "Terminés" },
    { value: "failed", label: "Échoués" },
    { value: "high", label: "Clients élevés" },
    { value: "low", label: "Clients faibles" },
  ];

  // Appliquer la recherche et le filtrage
  useEffect(() => {
    if (!procedureData || procedureData.data.length === 0) {
      setFilteredData([]);
      return;
    }
    
    console.log(procedureData);
    
    
    let result = [...procedureData.data];
    
    // Appliquer la recherche
    if (searchTerm) {
      result = result.filter(procedure => 
        procedure.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

   
    // // Appliquer le filtrage
    switch (filterStatus) {
      case "inProgress":
        result = result.filter(procedure => procedure.inProgress > 0);
        break;
      case "completed":
        result = result.filter(procedure => procedure.completed > 0);
        break;
      case "failed":
        result = result.filter(procedure => procedure.failed > 0);
        break;
      case "high":
        result = result.sort((a, b) => b.totalClients - a.totalClients);
        break;
      case "low":
        result = result.sort((a, b) => a.totalClients - b.totalClients);
        break;
      default:
        // "all" - pas de filtrage supplémentaire
        break;
    }
    
    setFilteredData(result);
    setCurrentPage(1); // Réinitialiser à la première page après changement de filtre/recherche
  }, [searchTerm, filterStatus, procedureData]);

  if (!procedureData) {
    return null
  }
  
  // Gestion du chargement et des erreurs
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement des services...</p>
        </div>
      </div>
    );
  }

  if (isError || !procedureData) {
    return null;
  }

  console.log(procedureData);

  // Calculer les éléments pour la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Gérer la pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="space-y-6">
      {/* Barre de recherche et filtres */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
          <input
            type="text"
            placeholder="Rechercher un service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="text-gray-500 size-5 dark:text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-2 px-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            {filterOptions.map((option, index) => (
              <option key={index} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Affichage des résultats */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Affichage de {currentItems.length} services sur {filteredData.length} {searchTerm && "trouvés"}
      </div>
      
      {/* Grille de cartes */}
      {currentItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
          {currentItems.map((procedure, index) => (
            <ProcedureCard
              procedureId={procedure.id}
              key={procedure.id || index} // Utilisez procedure.id si disponible
              title={procedure.title}
              totalClients={procedure.totalClients}
              inProgress={procedure.inProgress}
              completed={procedure.completed}
              failed={procedure.failed}
              description={procedure.description}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
            <Search className="size-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Aucun service trouvé</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Essayez de modifier vos critères de recherche ou de filtrage.
          </p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`flex items-center px-3 py-1 text-sm rounded-md ${
              currentPage === 1 
                ? "text-gray-400 cursor-not-allowed" 
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <ChevronLeft className="size-4 mr-1" />
            Précédent
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`size-8 rounded-md flex items-center justify-center text-sm transition-colors ${
                  currentPage === i + 1
                    ? "bg-brand-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center px-3 py-1 text-sm rounded-md ${
              currentPage === totalPages 
                ? "text-gray-400 cursor-not-allowed" 
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            Suivant
            <ChevronRight className="size-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}