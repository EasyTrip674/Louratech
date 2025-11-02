/**
 * Reusable Switch component for permission toggles
 */

import React from 'react';

export interface PermissionSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'md';
}

/**
 * Switch component with dark mode support
 */
export const PermissionSwitch: React.FC<PermissionSwitchProps> = ({
  checked,
  onChange,
  disabled,
  label,
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'w-8 h-4' : 'w-11 h-6';
  const thumbClasses = size === 'sm' ? 'w-3 h-3' : 'w-5 h-5';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`${sizeClasses} ${
        checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
      } relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
      }`}
      aria-label={label}
    >
      <span
        className={`${thumbClasses} bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
          checked ? (size === 'sm' ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0.5'
        }`}
      />
    </button>
  );
};
