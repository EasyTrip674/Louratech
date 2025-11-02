/**
 * Header component for authorization page with statistics
 */

import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export interface AuthorizationHeaderProps {
  stats: {
    total: number;
    active: number;
    critical: number;
  };
}

/**
 * Header displaying authorization statistics
 */
export const AuthorizationHeader: React.FC<AuthorizationHeaderProps> = ({ stats }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des autorisations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configurez les permissions pour cet utilisateur
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {stats.active}/{stats.total} autorisations
            </span>
          </div>
          {stats.critical > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                {stats.critical} permissions critiques
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
