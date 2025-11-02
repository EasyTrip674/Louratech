/**
 * Custom hook for managing permission filtering and searching
 */

import { useState, useMemo } from 'react';
import { LucideIcon } from 'lucide-react';

export interface Permission {
  key: string;
  label: string;
  critical?: boolean;
}

export interface FilteredPermission extends Permission {
  category: string;
  groupLabel: string;
  groupColor: string;
  groupIcon: LucideIcon;
}

export interface PermissionGroup {
  label: string;
  icon: LucideIcon;
  color: string;
  permissions: Permission[];
}

export interface UsePermissionFiltersProps {
  permissionGroups: Record<string, PermissionGroup>;
}

export interface UsePermissionFiltersReturn {
  activeCategory: string;
  searchTerm: string;
  expandedGroups: Set<string>;
  setActiveCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  setExpandedGroups: (groups: Set<string>) => void;
  toggleGroupExpanded: (group: string) => void;
  filteredPermissions: FilteredPermission[];
}

/**
 * Hook for managing permission filters and search
 */
export function usePermissionFilters({ permissionGroups }: UsePermissionFiltersProps): UsePermissionFiltersReturn {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['all']));

  // Toggle group expansion
  const toggleGroupExpanded = (group: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  // Filter permissions based on category and search
  const filteredPermissions = useMemo((): FilteredPermission[] => {
    let permissions: FilteredPermission[] = [];

    if (activeCategory === 'all') {
      permissions = Object.entries(permissionGroups).flatMap(([category, group]) =>
        group.permissions.map(p => ({
          ...p,
          category,
          groupLabel: group.label,
          groupColor: group.color,
          groupIcon: group.icon
        }))
      );
    } else {
      const group = permissionGroups[activeCategory];
      if (group) {
        permissions = group.permissions.map(p => ({
          ...p,
          category: activeCategory,
          groupLabel: group.label,
          groupColor: group.color,
          groupIcon: group.icon
        }));
      }
    }

    if (searchTerm) {
      permissions = permissions.filter(p =>
        p.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return permissions;
  }, [activeCategory, searchTerm, permissionGroups]);

  return {
    activeCategory,
    searchTerm,
    expandedGroups,
    setActiveCategory,
    setSearchTerm,
    setExpandedGroups,
    toggleGroupExpanded,
    filteredPermissions
  };
}
