"use client";

import { useState, useMemo } from 'react';
import { Search, Users, Shield, CheckCircle, AlertCircle, Eye, Plus, Edit, Trash2, Settings } from 'lucide-react';

// Simulation des types (à adapter selon votre projet)
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
  onSave: (data: Authorization) => Promise<void>;
  isLoading?: boolean;
}

// Composant Switch amélioré
const Switch = ({ checked, onChange, disabled, label, size = 'md' }: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'md';
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

export default function ImprovedAuthorization({ 
  initialAuthorizations, 
  onSave, 
  isLoading = false 
}: AuthorizationProps) {
  const [authorizations, setAuthorizations] = useState<Authorization>(initialAuthorizations);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['all']));

  // Rôles prédéfinis pour faciliter la gestion
  const predefinedRoles = {
    admin: {
      name: 'Administrateur complet',
      description: 'Accès total à toutes les fonctionnalités',
      icon: Shield,
      permissions: Object.keys(initialAuthorizations).filter(key => key !== 'id' && key !== 'userId')
    },
    manager: {
      name: 'Gestionnaire',
      description: 'Lecture et modification, sans suppression critique',
      icon: Users,
      permissions: Object.keys(initialAuthorizations).filter(key => 
        key.includes('Read') || key.includes('Edit') || key.includes('Create')
      ).filter(key => !key.includes('Delete') && key !== 'canDeleteClient' && key !== 'canChangeUserAuthorization')
    },
    viewer: {
      name: 'Consultant',
      description: 'Lecture seule des données',
      icon: Eye,
      permissions: Object.keys(initialAuthorizations).filter(key => key.includes('Read'))
    }
  };

  // Configuration des groupes de permissions avec icônes
  const permissionGroups = {
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

  // Filtrage et recherche
  const filteredPermissions = useMemo(() => {
    let permissions = [];
    
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
      const group = permissionGroups[activeCategory as keyof typeof permissionGroups];
      permissions = group.permissions.map(p => ({
        ...p,
        category: activeCategory,
        groupLabel: group.label,
        groupColor: group.color,
        groupIcon: group.icon
      }));
    }

    if (searchTerm) {
      permissions = permissions.filter(p =>
        p.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return permissions;
  }, [activeCategory, searchTerm]);

  const handleToggle = (key: keyof Authorization, value: boolean) => {
    setAuthorizations(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const applyRole = (roleKey: string) => {
    const role = predefinedRoles[roleKey as keyof typeof predefinedRoles];
    const newAuthorizations = { ...initialAuthorizations };
    
    // Désactiver toutes les permissions
    Object.keys(newAuthorizations).forEach(key => {
      if (key !== 'id' && key !== 'userId') {
        (newAuthorizations as any)[key] = false;
      }
    });
    
    // Activer les permissions du rôle
    role.permissions.forEach(permission => {
      if (permission in newAuthorizations) {
        (newAuthorizations as any)[permission] = true;
      }
    });
    
    setAuthorizations(newAuthorizations);
    setHasChanges(true);
  };

  const toggleCategoryPermissions = (category: string) => {
    const group = permissionGroups[category as keyof typeof permissionGroups];
    const allEnabled = group.permissions.every(p => 
      authorizations[p.key as keyof Authorization] === true
    );
    
    const newAuthorizations = { ...authorizations };
    group.permissions.forEach(p => {
      (newAuthorizations as any)[p.key] = !allEnabled;
    });
    
    setAuthorizations(newAuthorizations);
    setHasChanges(true);
  };

  const saveAuthorizations = async () => {
    try {
      await onSave({
        userId: initialAuthorizations.userId,
        authorizationId: initialAuthorizations.id,
        authorization: { ...authorizations }
      });
      
      setHasChanges(false);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error saving authorizations:', error);
    }
  };

  const getStats = () => {
    const total = Object.keys(initialAuthorizations).filter(k => k !== 'id' && k !== 'userId').length;
    const active = Object.entries(authorizations).filter(([key, value]) => 
      key !== 'id' && key !== 'userId' && value === true
    ).length;
    const critical = Object.entries(permissionGroups)
      .flatMap(([_, group]) => group.permissions)
      .filter(p => p?.critical && authorizations[p.key as keyof Authorization])
      .length;
    
    return { total, active, critical };
  };

  const stats = getStats();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* En-tête avec statistiques */}
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

      {/* Messages de statut */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800 dark:text-green-200">
              Autorisations mises à jour avec succès
            </span>
          </div>
        </div>
      )}

      {/* Rôles prédéfinis */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Rôles prédéfinis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(predefinedRoles).map(([key, role]) => {
            const IconComponent = role.icon;
            return (
              <button
                key={key}
                onClick={() => applyRole(key)}
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

      {/* Recherche et filtres */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une permission..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Toutes
            </button>
            {Object.entries(permissionGroups).map(([key, group]) => {
              const IconComponent = group.icon;
              const activeCount = group.permissions.filter(p => 
                authorizations[p.key as keyof Authorization]
              ).length;
              
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {group.label}
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                    {activeCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Liste des permissions */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm">
        {activeCategory !== 'all' ? (
          // Vue par catégorie
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {(() => {
                  const group = permissionGroups[activeCategory as keyof typeof permissionGroups];
                  const IconComponent = group.icon;
                  return (
                    <>
                      <div className={`w-3 h-3 rounded-full ${group.color}`} />
                      <IconComponent className="w-5 h-5 text-gray-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {group.label}
                      </h3>
                    </>
                  );
                })()}
              </div>
              <button
                onClick={() => toggleCategoryPermissions(activeCategory)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {(() => {
                  const group = permissionGroups[activeCategory as keyof typeof permissionGroups];
                  const allEnabled = group.permissions.every(p => 
                    authorizations[p.key as keyof Authorization] === true
                  );
                  return allEnabled ? 'Tout désactiver' : 'Tout activer';
                })()}
              </button>
            </div>
            
            <div className="space-y-3">
              {filteredPermissions.map((permission) => (
                <div
                  key={permission.key}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    permission.critical
                      ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {permission.critical && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {permission.label}
                    </span>
                    {permission.critical && (
                      <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                        Critique
                      </span>
                    )}
                  </div>
                  <Switch
                    checked={authorizations[permission.key as keyof Authorization] === true}
                    onChange={(checked) => handleToggle(permission.key as keyof Authorization, checked)}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Vue globale par groupes
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Object.entries(permissionGroups).map(([key, group]) => {
              const IconComponent = group.icon;
              const isExpanded = expandedGroups.has(key);
              const activeCount = group.permissions.filter(p => 
                authorizations[p.key as keyof Authorization]
              ).length;
              const criticalCount = group.permissions.filter(p => 
                p.critical && authorizations[p.key as keyof Authorization]
              ).length;
              
              return (
                <div key={key}>
                  <button
                    onClick={() => {
                      const newExpanded = new Set(expandedGroups);
                      if (isExpanded) {
                        newExpanded.delete(key);
                      } else {
                        newExpanded.add(key);
                      }
                      setExpandedGroups(newExpanded);
                    }}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${group.color}`} />
                      <IconComponent className="w-5 h-5 text-gray-500" />
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {group.label}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {activeCount}/{group.permissions.length} actives
                          </span>
                          {criticalCount > 0 && (
                            <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                              {criticalCount} critiques
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${group.color} transition-all`}
                          style={{ width: `${(activeCount / group.permissions.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-400 transform transition-transform">
                        {isExpanded ? '−' : '+'}
                      </span>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-3">
                      {group.permissions.map((permission) => (
                        <div
                          key={permission.key}
                          className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                            permission.critical
                              ? 'border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'
                              : 'bg-gray-50 dark:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {permission.critical && (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-gray-900 dark:text-white">
                              {permission.label}
                            </span>
                            {permission.critical && (
                              <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                                Critique
                              </span>
                            )}
                          </div>
                          <Switch
                            checked={authorizations[permission.key as keyof Authorization] === true}
                            onChange={(checked) => handleToggle(permission.key as keyof Authorization, checked)}
                            disabled={isLoading}
                            size="sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      {hasChanges && (
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
                onClick={() => {
                  setAuthorizations(initialAuthorizations);
                  setHasChanges(false);
                }}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveAuthorizations}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}