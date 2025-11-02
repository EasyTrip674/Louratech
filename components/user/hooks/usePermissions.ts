/**
 * Custom hook for managing authorization permissions
 * Handles permission state, validation, and API mutations
 */

import { useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { doChangeAuthozation } from '../authozisation.action';

// Types
export type PermissionKey = string;

export interface Authorization {
  id: string;
  userId: string;
  [key: string]: boolean | string;
}

export interface UsePermissionsProps {
  initialAuthorizations: Authorization;
}

export interface UsePermissionsReturn {
  authorizations: Authorization;
  hasChanges: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  handleToggle: (key: PermissionKey, value: boolean) => void;
  saveAuthorizations: () => Promise<void>;
  resetAuthorizations: () => void;
  applyBulkPermissions: (permissions: Record<string, boolean>) => void;
  getAllPermissionKeys: () => PermissionKey[];
  getStats: () => { total: number; active: number; critical: number };
}

/**
 * Hook for managing permissions state and operations
 */
export function usePermissions({ initialAuthorizations }: UsePermissionsProps): UsePermissionsReturn {
  const [authorizations, setAuthorizations] = useState<Authorization>(initialAuthorizations);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Helper function to get all permission keys
  const getAllPermissionKeys = (): PermissionKey[] => {
    return Object.keys(initialAuthorizations).filter(
      key => key !== 'id' && key !== 'userId'
    ) as PermissionKey[];
  };

  // Mutation for saving authorizations
  const authorizationMutation = useMutation({
    mutationFn: async (data: Authorization) => {
      await doChangeAuthozation({
        userId: initialAuthorizations.userId,
        authorizationId: initialAuthorizations.id,
        authorization: { ...data }
      });
    }
  });

  // Toggle a single permission
  const handleToggle = (key: PermissionKey, value: boolean) => {
    setAuthorizations(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  // Apply bulk permissions (for roles)
  const applyBulkPermissions = (permissions: Record<string, boolean>) => {
    setAuthorizations(prev => ({
      ...prev,
      ...permissions
    }));
    setHasChanges(true);
  };

  // Save authorizations
  const saveAuthorizations = async () => {
    try {
      authorizationMutation.mutate(authorizations);
      setHasChanges(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving authorizations:', error);
    }
  };

  // Reset to initial state
  const resetAuthorizations = () => {
    setAuthorizations(initialAuthorizations);
    setHasChanges(false);
  };

  // Calculate statistics
  const getStats = () => {
    const total = getAllPermissionKeys().length;
    const active = getAllPermissionKeys().filter(key =>
      authorizations[key] === true
    ).length;

    // Count critical permissions (would need to be passed in or defined)
    const critical = 0; // Placeholder - would be calculated from permission groups

    return { total, active, critical };
  };

  return {
    authorizations,
    hasChanges,
    isSubmitting: authorizationMutation.isPending,
    isSuccess,
    handleToggle,
    saveAuthorizations,
    resetAuthorizations,
    applyBulkPermissions,
    getAllPermissionKeys,
    getStats
  };
}
