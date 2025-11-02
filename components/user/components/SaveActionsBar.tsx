/**
 * Sticky save/cancel actions bar
 */

import React from 'react';

export interface SaveActionsBarProps {
  hasChanges: boolean;
  isSubmitting: boolean;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Sticky bar for save/cancel actions
 */
export const SaveActionsBar: React.FC<SaveActionsBarProps> = ({
  hasChanges,
  isSubmitting,
  onSave,
  onCancel
}) => {
  if (!hasChanges) return null;

  return (
    <div className="sticky bottom-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="font-medium text-gray-900 dark:text-white">
            Modifications non sauvegardées
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
};
