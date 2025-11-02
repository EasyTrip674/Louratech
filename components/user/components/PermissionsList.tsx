/**
 * Component for displaying permissions list (both category and global views)
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { PermissionItem } from './PermissionItem';
import { FilteredPermission } from '../hooks/usePermissionFilters';

export interface PermissionGroup {
  label: string;
  icon: LucideIcon;
  color: string;
  permissions: Array<{ key: string; label: string; critical?: boolean }>;
}

export interface PermissionsListProps {
  activeCategory: string;
  filteredPermissions: FilteredPermission[];
  permissionGroups: Record<string, PermissionGroup>;
  authorizations: Record<string, boolean>;
  expandedGroups: Set<string>;
  disabled?: boolean;
  onToggle: (key: string, value: boolean) => void;
  onToggleCategory: (category: string) => void;
  onToggleGroupExpanded: (group: string) => void;
}

/**
 * Renders permissions in either category view or global grouped view
 */
export const PermissionsList: React.FC<PermissionsListProps> = ({
  activeCategory,
  filteredPermissions,
  permissionGroups,
  authorizations,
  expandedGroups,
  disabled,
  onToggle,
  onToggleCategory,
  onToggleGroupExpanded
}) => {
  // Category view (single category)
  if (activeCategory !== 'all') {
    const group = permissionGroups[activeCategory];
    if (!group) return null;

    const IconComponent = group.icon;
    const allEnabled = group.permissions.every(p => authorizations[p.key] === true);

    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${group.color}`} />
            <IconComponent className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {group.label}
            </h3>
          </div>
          <button
            onClick={() => onToggleCategory(activeCategory)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {allEnabled ? 'Tout désactiver' : 'Tout activer'}
          </button>
        </div>

        <div className="space-y-3">
          {filteredPermissions.map((permission) => (
            <PermissionItem
              key={permission.key}
              permissionKey={permission.key}
              label={permission.label}
              critical={permission.critical}
              checked={authorizations[permission.key] === true}
              disabled={disabled}
              onToggle={onToggle}
            />
          ))}
        </div>
      </div>
    );
  }

  // Global view (all categories with collapsible groups)
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
      {Object.entries(permissionGroups).map(([key, group]) => {
        const IconComponent = group.icon;
        const isExpanded = expandedGroups.has(key);
        const activeCount = group.permissions.filter(p => authorizations[p.key]).length;
        const criticalCount = group.permissions.filter(p =>
          p.critical && authorizations[p.key]
        ).length;

        return (
          <div key={key}>
            <button
              onClick={() => onToggleGroupExpanded(key)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${group.color}`} />
                <IconComponent className="w-5 h-5 text-gray-500" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {group.label}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {activeCount}/{group.permissions.length} actives
                    </span>
                    {criticalCount > 0 && (
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                        {criticalCount} critiques
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${group.color} transition-all`}
                    style={{ width: `${(activeCount / group.permissions.length) * 100}%` }}
                  />
                </div>
                <span className="text-gray-400 transform transition-transform">
                  {isExpanded ? '−' : '+'}
                </span>
              </div>
            </button>

            {isExpanded && (
              <div className="px-6 pb-6 space-y-3">
                {group.permissions.map((permission) => (
                  <PermissionItem
                    key={permission.key}
                    permissionKey={permission.key}
                    label={permission.label}
                    critical={permission.critical}
                    checked={authorizations[permission.key] === true}
                    disabled={disabled}
                    size="sm"
                    onToggle={onToggle}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
