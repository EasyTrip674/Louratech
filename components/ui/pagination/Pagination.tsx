/**
 * Composant de pagination réutilisable
 */

'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { PaginationMeta } from '@/lib/types/pagination';

export interface PaginationProps {
  /** Métadonnées de pagination */
  pagination: PaginationMeta;
  /** Callback appelé lors du changement de page */
  onPageChange: (page: number) => void;
  /** Afficher les infos de comptage */
  showCount?: boolean;
  /** Nombre maximal de pages à afficher */
  maxPages?: number;
}

/**
 * Génère les numéros de pages à afficher
 */
function generatePageNumbers(current: number, total: number, maxPages: number = 7): (number | 'ellipsis')[] {
  if (total <= maxPages) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const half = Math.floor(maxPages / 2);

  // Toujours afficher la première page
  pages.push(1);

  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, current + half);

  // Ajuster si on est près du début
  if (current <= half + 1) {
    end = maxPages - 1;
  }

  // Ajuster si on est près de la fin
  if (current >= total - half) {
    start = total - maxPages + 2;
  }

  // Ajouter ellipse au début si nécessaire
  if (start > 2) {
    pages.push('ellipsis');
  }

  // Ajouter les pages intermédiaires
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Ajouter ellipse à la fin si nécessaire
  if (end < total - 1) {
    pages.push('ellipsis');
  }

  // Toujours afficher la dernière page
  if (total > 1) {
    pages.push(total);
  }

  return pages;
}

export function Pagination({
  pagination,
  onPageChange,
  showCount = true,
  maxPages = 7,
}: PaginationProps) {
  const { page, totalPages, total, limit, hasPrevious, hasMore } = pagination;

  const pageNumbers = generatePageNumbers(page, totalPages, maxPages);

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Comptage */}
      {showCount && (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Affichage de <span className="font-medium">{start}</span> à{' '}
          <span className="font-medium">{end}</span> sur{' '}
          <span className="font-medium">{total}</span> résultats
        </div>
      )}

      {/* Boutons de navigation */}
      <div className="flex items-center gap-2">
        {/* Première page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrevious}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Première page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Page précédente */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevious}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Page précédente"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numéros de pages */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((pageNum, index) =>
            pageNum === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-500 dark:text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`
                  min-w-[40px] px-3 py-2 rounded-lg border transition-colors
                  ${
                    page === pageNum
                      ? 'bg-blue-500 border-blue-500 text-white font-medium'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }
                `}
                aria-label={`Page ${pageNum}`}
                aria-current={page === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </button>
            )
          )}
        </div>

        {/* Page actuelle (mobile) */}
        <div className="sm:hidden px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {page} / {totalPages}
        </div>

        {/* Page suivante */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasMore}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Page suivante"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dernière page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasMore}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Dernière page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
