/**
 * Search and filter bar for permissions
 */

import React from 'react';
import { Search } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface PermissionGroup {
  label: string;
  icon: LucideIcon;
  color: string;
  permissions: Array<{ key: string; label: string; critical?: boolean }>;
}

export interface PermissionSearchBarProps {
  searchTerm: string;
  activeCategory: string;
  permissionGroups: Record<string, PermissionGroup>;
  authorizations: Record<string, boolean>;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
}

/**
 * Search bar with category filters
 */
export const PermissionSearchBar: React.FC<PermissionSearchBarProps> = ({
  searchTerm,
  activeCategory,
  permissionGroups,
  authorizations,
  onSearchChange,
  onCategoryChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une permission..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Toutes
          </button>
          {Object.entries(permissionGroups).map(([key, group]) => {
            const IconComponent = group.icon;
            const activeCount = group.permissions.filter(p =>
              authorizations[p.key]
            ).length;

            return (
              <button
                key={key}
                onClick={() => onCategoryChange(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {group.label}
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                  {activeCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
