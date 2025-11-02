/**
 * Refactored Authorization Component
 * Manages user permissions with improved modularity and maintainability
 */

"use client";

import { CheckCircle } from 'lucide-react';
import { AuthorizationHeader } from './components/AuthorizationHeader';
import { PredefinedRoles } from './components/PredefinedRoles';
import { PermissionSearchBar } from './components/PermissionSearchBar';
import { PermissionsList } from './components/PermissionsList';
import { SaveActionsBar } from './components/SaveActionsBar';
import { usePermissions } from './hooks/usePermissions';
import { usePermissionFilters } from './hooks/usePermissionFilters';
import { permissionGroups } from './config/permissionGroups';
import { createPredefinedRoles, getAllPermissionKeys } from './config/predefinedRoles';

// Interface Authorization
interface Authorization {
  id: string;
  userId: string;
  canChangeUserAuthorization: boolean;
  canChangeUserPassword: boolean;
  canCreateClient: boolean;
  canCreateProcedure: boolean;
  canCreateTransaction: boolean;
  canCreateInvoice: boolean;
  canCreateExpense: boolean;
  canCreateRevenue: boolean;
  canCreateComptaSettings: boolean;
  canCreateStep: boolean;
  canCreateClientProcedure: boolean;
  canCreateClientStep: boolean;
  canCreateClientDocument: boolean;
  canReadClient: boolean;
  canReadStep: boolean;
  canReadAdmin: boolean;
  canReadProcedure: boolean;
  canReadTransaction: boolean;
  canReadInvoice: boolean;
  canReadExpense: boolean;
  canReadRevenue: boolean;
  canReadComptaSettings: boolean;
  canReadClientProcedure: boolean;
  canReadClientStep: boolean;
  canReadClientDocument: boolean;
  canEditOrganization: boolean;
  canEditClient: boolean;
  canEditStep: boolean;
  canEditAdmin: boolean;
  canEditProcedure: boolean;
  canEditTransaction: boolean;
  canEditInvoice: boolean;
  canEditExpense: boolean;
  canEditRevenue: boolean;
  canEditComptaSettings: boolean;
  canEditClientProcedure: boolean;
  canEditClientStep: boolean;
  canEditClientDocument: boolean;
  canDeleteClient: boolean;
  canDeleteStep: boolean;
  canDeleteAdmin: boolean;
  canDeleteProcedure: boolean;
  canDeleteTransaction: boolean;
  canDeleteInvoice: boolean;
  canDeleteExpense: boolean;
  canDeleteRevenue: boolean;
  canDeleteComptaSettings: boolean;
  canDeleteClientProcedure: boolean;
  canDeleteClientStep: boolean;
  canDeleteClientDocument: boolean;
}

interface AuthorizationProps {
  initialAuthorizations: Authorization;
}

/**
 * Main Authorization Component
 * Refactored for improved modularity and reduced complexity
 */
export default function ImprovedAuthorization({
  initialAuthorizations,
}: AuthorizationProps) {
  // Custom hooks for state management
  const {
    authorizations,
    hasChanges,
    isSubmitting,
    isSuccess,
    handleToggle,
    saveAuthorizations,
    resetAuthorizations,
    applyBulkPermissions,
    getAllPermissionKeys: getPermissionKeys,
    getStats
  } = usePermissions({ initialAuthorizations });

  const {
    activeCategory,
    searchTerm,
    expandedGroups,
    setActiveCategory,
    setSearchTerm,
    toggleGroupExpanded,
    filteredPermissions
  } = usePermissionFilters({ permissionGroups });

  // Generate predefined roles
  const allPermissionKeys = getAllPermissionKeys(initialAuthorizations);
  const predefinedRoles = createPredefinedRoles(allPermissionKeys);

  // Handler for applying predefined roles
  const handleApplyRole = (roleKey: string) => {
    const role = predefinedRoles[roleKey];
    if (!role) return;

    const newPermissions: Record<string, boolean> = {};

    // Disable all permissions first
    allPermissionKeys.forEach(key => {
      newPermissions[key] = false;
    });

    // Enable permissions for selected role
    role.permissions.forEach(permission => {
      newPermissions[permission] = true;
    });

    applyBulkPermissions(newPermissions);
  };

  // Handler for toggling all permissions in a category
  const handleToggleCategory = (category: string) => {
    const group = permissionGroups[category];
    if (!group) return;

    const allEnabled = group.permissions.every(p =>
      authorizations[p.key] === true
    );

    const updates: Record<string, boolean> = {};
    group.permissions.forEach(p => {
      updates[p.key] = !allEnabled;
    });

    applyBulkPermissions(updates);
  };

  const stats = getStats();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with statistics */}
      <AuthorizationHeader stats={stats} />

      {/* Success message */}
      {isSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800 dark:text-green-200">
              Autorisations mises à jour avec succès
            </span>
          </div>
        </div>
      )}

      {/* Predefined roles */}
      <PredefinedRoles
        roles={predefinedRoles}
        onApplyRole={handleApplyRole}
      />

      {/* Search and filters */}
      <PermissionSearchBar
        searchTerm={searchTerm}
        activeCategory={activeCategory}
        permissionGroups={permissionGroups}
        authorizations={authorizations}
        onSearchChange={setSearchTerm}
        onCategoryChange={setActiveCategory}
      />

      {/* Permissions list */}
      <PermissionsList
        activeCategory={activeCategory}
        filteredPermissions={filteredPermissions}
        permissionGroups={permissionGroups}
        authorizations={authorizations}
        expandedGroups={expandedGroups}
        disabled={isSubmitting}
        onToggle={handleToggle}
        onToggleCategory={handleToggleCategory}
        onToggleGroupExpanded={toggleGroupExpanded}
      />

      {/* Save/Cancel actions bar */}
      <SaveActionsBar
        hasChanges={hasChanges}
        isSubmitting={isSubmitting}
        onSave={saveAuthorizations}
        onCancel={resetAuthorizations}
      />
    </div>
  );
}