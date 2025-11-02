/**
 * Configuration for predefined roles
 */

import { Shield, Users, Eye } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface PredefinedRole {
  name: string;
  description: string;
  icon: LucideIcon;
  permissions: string[];
}

/**
 * Get all permission keys from an authorization object
 */
export const getAllPermissionKeys = (auth: Record<string, any>): string[] => {
  return Object.keys(auth).filter(
    key => key !== 'id' && key !== 'userId'
  );
};

/**
 * Predefined roles factory
 */
export const createPredefinedRoles = (allPermissions: string[]): Record<string, PredefinedRole> => ({
  admin: {
    name: 'Administrateur complet',
    description: 'Accès total à toutes les fonctionnalités',
    icon: Shield,
    permissions: allPermissions
  },
  manager: {
    name: 'Gestionnaire',
    description: 'Lecture et modification, sans suppression critique',
    icon: Users,
    permissions: allPermissions.filter(key =>
      key.includes('Read') || key.includes('Edit') || key.includes('Create')
    ).filter(key => !key.includes('Delete') && key !== 'canDeleteClient' && key !== 'canChangeUserAuthorization')
  },
  viewer: {
    name: 'Consultant',
    description: 'Lecture seule des données',
    icon: Eye,
    permissions: allPermissions.filter(key => key.includes('Read'))
  }
});
