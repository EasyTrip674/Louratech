/**
 * Component for displaying and applying predefined roles
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface PredefinedRole {
  name: string;
  description: string;
  icon: LucideIcon;
  permissions: string[];
}

export interface PredefinedRolesProps {
  roles: Record<string, PredefinedRole>;
  onApplyRole: (roleKey: string) => void;
}

/**
 * Card grid displaying predefined roles
 */
export const PredefinedRoles: React.FC<PredefinedRolesProps> = ({ roles, onApplyRole }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Rôles prédéfinis
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(roles).map(([key, role]) => {
          const IconComponent = role.icon;
          return (
            <button
              key={key}
              onClick={() => onApplyRole(key)}
              className="p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <IconComponent className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {role.name}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {role.description}
              </p>
              <span className="text-xs text-blue-600 dark:text-blue-400">
                {role.permissions.length} permissions
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
