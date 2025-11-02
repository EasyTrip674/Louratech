/**
 * Configuration for permission groups
 * Centralized permission definitions
 */

import { Settings, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface Permission {
  key: string;
  label: string;
  critical?: boolean;
}

export interface PermissionGroup {
  label: string;
  icon: LucideIcon;
  color: string;
  permissions: Permission[];
}

/**
 * Permission groups configuration
 */
export const permissionGroups: Record<string, PermissionGroup> = {
  general: {
    label: 'Gestion système',
    icon: Settings,
    color: 'bg-violet-600',
    permissions: [
      { key: 'canChangeUserAuthorization', label: 'Modifier les autorisations utilisateur', critical: true },
      { key: 'canChangeUserPassword', label: 'Réinitialiser les mots de passe', critical: true },
    ]
  },
  create: {
    label: 'Création',
    icon: Plus,
    color: 'bg-blue-600',
    permissions: [
      { key: 'canCreateClient', label: 'Créer des clients' },
      { key: 'canCreateProcedure', label: 'Créer des services' },
      { key: 'canCreateTransaction', label: 'Créer des transactions' },
      { key: 'canCreateInvoice', label: 'Créer des factures' },
      { key: 'canCreateExpense', label: 'Créer des dépenses' },
      { key: 'canCreateRevenue', label: 'Créer des revenus' },
      { key: 'canCreateComptaSettings', label: 'Créer des paramètres comptables' },
      { key: 'canCreateStep', label: 'Créer des modules' },
      { key: 'canCreateClientProcedure', label: 'Attribuer des services aux clients' },
      { key: 'canCreateClientStep', label: 'Créer des étapes client' },
      { key: 'canCreateClientDocument', label: 'Ajouter des documents client' },
    ]
  },
  read: {
    label: 'Consultation',
    icon: Eye,
    color: 'bg-green-600',
    permissions: [
      { key: 'canReadClient', label: 'Voir les dossiers clients' },
      { key: 'canReadStep', label: 'Voir les modules' },
      { key: 'canReadAdmin', label: 'Voir les administrateurs' },
      { key: 'canReadProcedure', label: 'Voir les services' },
      { key: 'canReadTransaction', label: 'Voir les transactions' },
      { key: 'canReadInvoice', label: 'Voir les factures' },
      { key: 'canReadExpense', label: 'Voir les dépenses' },
      { key: 'canReadRevenue', label: 'Voir les revenus' },
      { key: 'canReadComptaSettings', label: 'Voir les paramètres comptables' },
      { key: 'canReadClientProcedure', label: 'Voir les services clients' },
      { key: 'canReadClientStep', label: 'Voir les étapes clients' },
      { key: 'canReadClientDocument', label: 'Voir les documents clients' },
    ]
  },
  update: {
    label: 'Modification',
    icon: Edit,
    color: 'bg-amber-600',
    permissions: [
      { key: 'canEditOrganization', label: 'Modifier les organisations' },
      { key: 'canEditClient', label: 'Modifier les clients' },
      { key: 'canEditStep', label: 'Modifier les modules' },
      { key: 'canEditAdmin', label: 'Modifier les administrateurs', critical: true },
      { key: 'canEditProcedure', label: 'Modifier les services' },
      { key: 'canEditTransaction', label: 'Modifier les transactions' },
      { key: 'canEditInvoice', label: 'Modifier les factures' },
      { key: 'canEditExpense', label: 'Modifier les dépenses' },
      { key: 'canEditRevenue', label: 'Modifier les revenus' },
      { key: 'canEditComptaSettings', label: 'Modifier les paramètres comptables' },
      { key: 'canEditClientProcedure', label: 'Modifier les services clients' },
      { key: 'canEditClientStep', label: 'Modifier les étapes clients' },
      { key: 'canEditClientDocument', label: 'Modifier les documents clients' },
    ]
  },
  delete: {
    label: 'Suppression',
    icon: Trash2,
    color: 'bg-red-600',
    permissions: [
      { key: 'canDeleteClient', label: 'Supprimer les clients', critical: true },
      { key: 'canDeleteStep', label: 'Supprimer les modules' },
      { key: 'canDeleteAdmin', label: 'Supprimer les administrateurs', critical: true },
      { key: 'canDeleteProcedure', label: 'Supprimer les services' },
      { key: 'canDeleteTransaction', label: 'Supprimer les transactions', critical: true },
      { key: 'canDeleteInvoice', label: 'Supprimer les factures' },
      { key: 'canDeleteExpense', label: 'Supprimer les dépenses' },
      { key: 'canDeleteRevenue', label: 'Supprimer les revenus' },
      { key: 'canDeleteComptaSettings', label: 'Supprimer les paramètres comptables' },
      { key: 'canDeleteClientProcedure', label: 'Désassocier les services clients' },
      { key: 'canDeleteClientStep', label: 'Supprimer les étapes clients' },
      { key: 'canDeleteClientDocument', label: 'Supprimer les documents clients' },
    ]
  }
};
