import React, { ReactNode } from "react";

/**
 * Props pour le composant DashboardCard
 */
export interface DashboardCardProps {
  /** Titre de la carte (optionnel) */
  title?: string;
  /** Description sous le titre (optionnel) */
  description?: string;
  /** Contenu de la carte */
  children: ReactNode;
  /** Actions à afficher dans l'en-tête (boutons, menus, etc.) */
  headerActions?: ReactNode;
  /** Afficher l'état de chargement avec skeleton */
  isLoading?: boolean;
  /** Classe CSS personnalisée */
  className?: string;
  /** Classe CSS pour le conteneur de contenu */
  contentClassName?: string;
  /** Masquer le padding du contenu */
  noPadding?: boolean;
  /** Hauteur complète */
  fullHeight?: boolean;
  /** Masquer l'en-tête */
  hideHeader?: boolean;
}

/**
 * Composant DashboardCard - Carte standardisée pour les dashboards
 *
 * Fournit un conteneur avec un style cohérent pour les cartes de dashboard,
 * incluant un en-tête optionnel, un état de chargement et un support pour le dark mode.
 *
 * @example
 * ```tsx
 * // Carte simple avec titre
 * <DashboardCard title="Statistiques">
 *   <p>Contenu de la carte</p>
 * </DashboardCard>
 *
 * // Carte avec en-tête et actions
 * <DashboardCard
 *   title="Clients récents"
 *   description="Liste des 10 derniers clients"
 *   headerActions={<button>Voir tout</button>}
 * >
 *   <ClientList />
 * </DashboardCard>
 *
 * // Carte en chargement
 * <DashboardCard title="Données" isLoading>
 *   <p>Ce contenu sera caché pendant le chargement</p>
 * </DashboardCard>
 *
 * // Carte sans padding (pour tableaux)
 * <DashboardCard title="Transactions" noPadding>
 *   <table>...</table>
 * </DashboardCard>
 * ```
 */
export default function DashboardCard({
  title,
  description,
  children,
  headerActions,
  isLoading = false,
  className = "",
  contentClassName = "",
  noPadding = false,
  fullHeight = false,
  hideHeader = false,
}: DashboardCardProps) {
  const hasHeader = !hideHeader && (title || description || headerActions);

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] ${
        fullHeight ? "h-full" : ""
      } ${className}`}
    >
      {/* En-tête de la carte */}
      {hasHeader && (
        <div className={`flex items-start justify-between gap-4 ${noPadding ? "p-5 lg:p-6" : ""}`}>
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {headerActions}
            </div>
          )}
        </div>
      )}

      {/* Contenu de la carte */}
      <div
        className={`${noPadding ? "" : "p-5 lg:p-6"} ${
          hasHeader && !noPadding ? "pt-0" : ""
        } ${contentClassName}`}
      >
        {isLoading ? <DashboardCardSkeleton /> : children}
      </div>
    </div>
  );
}

/**
 * Skeleton de chargement pour DashboardCard
 */
export function DashboardCardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Ligne 1 */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      {/* Ligne 2 */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      {/* Ligne 3 */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      {/* Blocs */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}

/**
 * Variante de carte avec un grid responsive pour les statistiques
 */
export interface DashboardCardGridProps {
  /** Liste des cartes à afficher */
  children: ReactNode;
  /** Nombre de colonnes sur mobile (défaut: 1) */
  mobileColumns?: 1 | 2;
  /** Nombre de colonnes sur tablette (défaut: 2) */
  tabletColumns?: 2 | 3 | 4;
  /** Nombre de colonnes sur desktop (défaut: 4) */
  desktopColumns?: 2 | 3 | 4 | 5 | 6;
  /** Espacement entre les cartes (défaut: 6) */
  gap?: 4 | 5 | 6 | 8;
  /** Classe CSS personnalisée */
  className?: string;
}

/**
 * Composant DashboardCardGrid - Grid responsive pour les cartes
 *
 * @example
 * ```tsx
 * <DashboardCardGrid mobileColumns={1} tabletColumns={2} desktopColumns={4}>
 *   <StatCard {...} />
 *   <StatCard {...} />
 *   <StatCard {...} />
 *   <StatCard {...} />
 * </DashboardCardGrid>
 * ```
 */
export function DashboardCardGrid({
  children,
  mobileColumns = 1,
  tabletColumns = 2,
  desktopColumns = 4,
  gap = 6,
  className = "",
}: DashboardCardGridProps) {
  const mobileClass = `grid-cols-${mobileColumns}`;
  const tabletClass = `sm:grid-cols-${tabletColumns}`;
  const desktopClass = `lg:grid-cols-${desktopColumns}`;
  const gapClass = `gap-${gap}`;

  return (
    <div className={`grid ${mobileClass} ${tabletClass} ${desktopClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
}
