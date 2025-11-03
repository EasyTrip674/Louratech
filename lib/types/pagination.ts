/**
 * Types pour la pagination côté serveur
 */

export interface PaginationParams {
  /** Numéro de page (commence à 1) */
  page?: number;
  /** Nombre d'éléments par page (défaut: 20) */
  limit?: number;
  /** Terme de recherche */
  search?: string;
  /** Champ de tri */
  sortBy?: string;
  /** Ordre de tri */
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  /** Numéro de page actuelle */
  page: number;
  /** Nombre d'éléments par page */
  limit: number;
  /** Nombre total d'éléments */
  total: number;
  /** Nombre total de pages */
  totalPages: number;
  /** Indique s'il y a plus de pages */
  hasMore: boolean;
  /** Indique s'il y a une page précédente */
  hasPrevious: boolean;
}

export interface PaginatedResponse<T> {
  /** Données paginées */
  data: T[];
  /** Métadonnées de pagination */
  pagination: PaginationMeta;
}

/**
 * Crée les métadonnées de pagination
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
    hasPrevious: page > 1,
  };
}

/**
 * Calcule skip et take pour Prisma
 */
export function calculatePaginationSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Valide et normalise les paramètres de pagination
 */
export function normalizePaginationParams(
  params: PaginationParams = {}
): Required<PaginationParams> {
  return {
    page: Math.max(1, params.page || 1),
    limit: Math.min(100, Math.max(1, params.limit || 20)), // Max 100 éléments par page
    search: (params.search || '').trim(),
    sortBy: params.sortBy || 'createdAt',
    sortOrder: params.sortOrder || 'desc',
  };
}
