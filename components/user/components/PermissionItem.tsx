/**
 * Individual permission item component
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { PermissionSwitch } from './PermissionSwitch';

export interface PermissionItemProps {
  permissionKey: string;
  label: string;
  critical?: boolean;
  checked: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md';
  onToggle: (key: string, value: boolean) => void;
}

/**
 * Single permission item with toggle
 */
export const PermissionItem: React.FC<PermissionItemProps> = ({
  permissionKey,
  label,
  critical,
  checked,
  disabled,
  size = 'md',
  onToggle
}) => {
  const containerClass = size === 'sm'
    ? 'p-3 bg-gray-50 dark:bg-gray-800'
    : 'p-4 border transition-all';

  const borderClass = critical
    ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'
    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800';

  return (
    <div className={`flex items-center justify-between rounded-lg ${containerClass} ${size === 'md' ? borderClass : ''}`}>
      <div className="flex items-center gap-3">
        {critical && (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
        <span className={`${size === 'md' ? 'font-medium' : ''} text-gray-900 dark:text-white`}>
          {label}
        </span>
        {critical && (
          <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
            Critique
          </span>
        )}
      </div>
      <PermissionSwitch
        checked={checked}
        onChange={(value) => onToggle(permissionKey, value)}
        disabled={disabled}
        size={size}
      />
    </div>
  );
};
