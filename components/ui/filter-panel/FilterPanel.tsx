"use client";

import React, { ReactNode } from "react";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import Input from "@/components/form/input/InputField";

/**
 * Props pour le composant FilterPanel
 */
export interface FilterPanelProps {
  /** Valeur de recherche actuelle */
  searchValue: string;
  /** Callback appelé quand la recherche change */
  onSearchChange: (value: string) => void;
  /** Placeholder pour l'input de recherche */
  searchPlaceholder?: string;
  /** Indique si les filtres avancés sont visibles */
  showFilters: boolean;
  /** Callback pour afficher/masquer les filtres */
  onToggleFilters: () => void;
  /** Callback pour réinitialiser tous les filtres */
  onResetFilters: () => void;
  /** Indique si des filtres avancés sont actifs */
  hasActiveFilters?: boolean;
  /** Nombre de filtres actifs (affiché dans le badge) */
  activeFilterCount?: number;
  /** Contenu des filtres avancés (grille de selects, dates, etc.) */
  filterContent?: ReactNode;
  /** Contenu additionnel à droite de la barre de recherche (ex: boutons d'action) */
  actions?: ReactNode;
  /** Liste des filtres actifs à afficher sous forme de tags */
  activeFilters?: Array<{
    /** Clé unique du filtre */
    key: string;
    /** Label à afficher */
    label: string;
    /** Callback pour retirer ce filtre */
    onRemove: () => void;
  }>;
  /** Masquer la barre de recherche */
  hideSearch?: boolean;
  /** Masquer le bouton de filtres */
  hideFilterButton?: boolean;
  /** Classe CSS personnalisée pour le conteneur */
  className?: string;
}

/**
 * Composant FilterPanel - Panneau de filtres standardisé pour les tableaux
 *
 * Fournit une interface cohérente pour la recherche et le filtrage de données
 * avec gestion des filtres actifs, tags de filtres et reset.
 *
 * @example
 * ```tsx
 * <FilterPanel
 *   searchValue={searchTerm}
 *   onSearchChange={setSearchTerm}
 *   searchPlaceholder="Rechercher un client..."
 *   showFilters={showFilters}
 *   onToggleFilters={() => setShowFilters(!showFilters)}
 *   onResetFilters={resetFilters}
 *   hasActiveFilters={hasActiveFilters}
 *   activeFilterCount={5}
 *   filterContent={
 *     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 *       <Select options={...} />
 *       <Input type="date" />
 *     </div>
 *   }
 *   activeFilters={[
 *     { key: "status", label: "Statut: Actif", onRemove: () => setStatus("") }
 *   ]}
 * />
 * ```
 */
export default function FilterPanel({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  showFilters,
  onToggleFilters,
  onResetFilters,
  hasActiveFilters = false,
  activeFilterCount = 0,
  filterContent,
  actions,
  activeFilters = [],
  hideSearch = false,
  hideFilterButton = false,
  className = "",
}: FilterPanelProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Barre supérieure avec recherche et filtres */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Section de recherche et filtres */}
        <div className="flex items-center gap-3 w-full md:flex-1">
          {/* Input de recherche */}
          {!hideSearch && (
            <div className="relative flex-grow md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              {searchValue && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label="Effacer la recherche"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              )}
            </div>
          )}

          {/* Bouton de filtres */}
          {!hideFilterButton && (
            <button
              onClick={onToggleFilters}
              className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition-colors whitespace-nowrap ${
                hasActiveFilters || showFilters
                  ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/30 dark:text-blue-400"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
              aria-expanded={showFilters}
              aria-label="Afficher/Masquer les filtres"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtres</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>

        {/* Actions additionnelles (boutons, etc.) */}
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      {/* Section des filtres avancés (collapsible) */}
      {showFilters && filterContent && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          {filterContent}

          {/* Bouton de réinitialisation */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={onResetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        </div>
      )}

      {/* Tags des filtres actifs */}
      {activeFilters.length > 0 && (
        <div className="p-3 bg-blue-50 text-blue-800 text-sm border-b border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/50">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-medium">Filtres appliqués:</span>
              {activeFilters.map((filter) => (
                <span
                  key={filter.key}
                  className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs dark:bg-blue-800 dark:text-blue-200"
                >
                  {filter.label}
                  <button
                    onClick={filter.onRemove}
                    className="ml-1 hover:text-blue-600 dark:hover:text-blue-400"
                    aria-label={`Retirer le filtre ${filter.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={onResetFilters}
              className="text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300 whitespace-nowrap"
            >
              Tout effacer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
