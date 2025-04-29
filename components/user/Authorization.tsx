"use client";

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authorization } from '@prisma/client';
import Switch from '../form/switch/Switch';
import { authorizationSchema } from './authorization.shema';
import { doChangeAuthozation } from './authozisation.action';

// Interface pour représenter les autorisations utilisateur
interface AuthorizationProps {
  initialAuthorizations: authorization;
}

export default function Authorization({ initialAuthorizations }: AuthorizationProps) {
  
  const [authorizations, setAuthorizations] = useState<authorization>(initialAuthorizations);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  // successMessage 
  const [successMessage , setSuccessMessage] = useState(false);
  

  // Configuration de la mutation avec TanStack Query
  const updateMutation = useMutation({
    mutationFn: async (authorizations:authorizationSchema) => {
      
      console.info('update authorizations', authorizations);
      return await doChangeAuthozation(authorizations);
    },
    onSuccess: () => {
      // Mise à jour du cache et réinitialisation de l'état local
      setHasChanges(false);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
      }
      , 3000);
    }
  , onError: (error) => {
      console.error('Error updating authorizations:', error);
    }
  , onSettled: () => {
      // Réinitialisation de l'état local après la mutation
      setAuthorizations(initialAuthorizations);
    }
  });

  if (!initialAuthorizations) {
    return null;
}

  const saveAuthorizations = async () => {
    const data:authorizationSchema ={
      userId: initialAuthorizations.userId,
      authozationId: initialAuthorizations.id,
      authorization:{
        ...authorizations,
      }
    }
    updateMutation.mutate(data);
  };

  const handleToggle = (key: keyof authorization, value: boolean) => {
    setAuthorizations(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  // Définition des catégories d'autorisations
  const categories = {
    all: { label: 'Toutes les permissions', color: 'bg-gray-600' },
    general: { label: 'Général', color: 'bg-violet-600' },
    create: { label: 'Création', color: 'bg-blue-600' },
    read: { label: 'Lecture', color: 'bg-green-600' },
    update: { label: 'Modification', color: 'bg-amber-600' },
    delete: { label: 'Suppression', color: 'bg-red-600' }
  };

  // Regroupement des autorisations par catégorie
  const permissionGroups = {
    general: [
      { key: 'canChangeUserAuthorization', label: 'Modifier les autorisations utilisateur' },
      { key: 'canChangeUserPassword', label: 'Modifier les mots de passe' },
    ],
    create: [
      // { key: 'canCreateOrganization', label: 'Créer une organisation' },
      { key: 'canCreateClient', label: 'Créer un client' },
      { key: 'canCreateProcedure', label: 'Créer une procédure' },
      { key: 'canCreateTransaction', label: 'Créer une transaction' },
      { key: 'canCreateInvoice', label: 'Créer une facture' },
      { key: 'canCreateExpense', label: 'Créer une dépense' },
      { key: 'canCreateRevenue', label: 'Créer un revenu' },
      { key: 'canCreateComptaSettings', label: 'Créer des paramètres comptables' },
      { key: 'canCreateTeam', label: 'Créer une équipe' },
      { key: 'canCreateMember', label: 'Créer un membre' },
      { key: 'canCreateInvitation', label: 'Créer une invitation' },
      { key: 'canCreateClientProcedure', label: 'Créer une procédure client' },
      { key: 'canCreateClientStep', label: 'Créer une étape client' },
      { key: 'canCreateClientDocument', label: 'Créer un document client' },
    ],
    read: [
      { key: 'canReadOrganization', label: 'Lire les organisations' },
      { key: 'canReadClient', label: 'Lire les clients' },
      { key: 'canReadProcedure', label: 'Lire les procédures' },
      { key: 'canReadTransaction', label: 'Lire les transactions' },
      { key: 'canReadInvoice', label: 'Lire les factures' },
      { key: 'canReadExpense', label: 'Lire les dépenses' },
      { key: 'canReadRevenue', label: 'Lire les revenus' },
      { key: 'canReadComptaSettings', label: 'Lire les paramètres comptables' },
      { key: 'canReadTeam', label: 'Lire les équipes' },
      { key: 'canReadMember', label: 'Lire les membres' },
      { key: 'canReadInvitation', label: 'Lire les invitations' },
      { key: 'canReadClientProcedure', label: 'Lire les procédures client' },
      { key: 'canReadClientStep', label: 'Lire les étapes client' },
      { key: 'canReadClientDocument', label: 'Lire les documents client' },
    ],
    update: [
      { key: 'canEditOrganization', label: 'Modifier les organisations' },
      { key: 'canEditClient', label: 'Modifier les clients' },
      { key: 'canEditProcedure', label: 'Modifier les procédures' },
      { key: 'canEditTransaction', label: 'Modifier les transactions' },
      { key: 'canEditInvoice', label: 'Modifier les factures' },
      { key: 'canEditExpense', label: 'Modifier les dépenses' },
      { key: 'canEditRevenue', label: 'Modifier les revenus' },
      { key: 'canEditComptaSettings', label: 'Modifier les paramètres comptables' },
      { key: 'canEditTeam', label: 'Modifier les équipes' },
      { key: 'canEditMember', label: 'Modifier les membres' },
      { key: 'canEditInvitation', label: 'Modifier les invitations' },
      { key: 'canEditClientProcedure', label: 'Modifier les procédures client' },
      { key: 'canEditClientStep', label: 'Modifier les étapes client' },
      { key: 'canEditClientDocument', label: 'Modifier les documents client' },
    ],
    delete: [
      { key: 'canDeleteOrganization', label: 'Supprimer les organisations' },
      { key: 'canDeleteClient', label: 'Supprimer les clients' },
      { key: 'canDeleteProcedure', label: 'Supprimer les procédures' },
      { key: 'canDeleteTransaction', label: 'Supprimer les transactions' },
      { key: 'canDeleteInvoice', label: 'Supprimer les factures' },
      { key: 'canDeleteExpense', label: 'Supprimer les dépenses' },
      { key: 'canDeleteRevenue', label: 'Supprimer les revenus' },
      { key: 'canDeleteComptaSettings', label: 'Supprimer les paramètres comptables' },
      { key: 'canDeleteTeam', label: 'Supprimer les équipes' },
      { key: 'canDeleteMember', label: 'Supprimer les membres' },
      { key: 'canDeleteInvitation', label: 'Supprimer les invitations' },
      { key: 'canDeleteClientProcedure', label: 'Supprimer les procédures client' },
      { key: 'canDeleteClientStep', label: 'Supprimer les étapes client' },
      { key: 'canDeleteClientDocument', label: 'Supprimer les documents client' },
    ],
  };

  // Fonction pour obtenir la liste des autorisations à afficher selon la catégorie active
  const getPermissionsToDisplay = () => {
    if (activeCategory === 'all') {
      return Object.entries(permissionGroups).flatMap(([category, permissions]) => 
        permissions.map(permission => ({
          ...permission,
          category
        }))
      );
    }
    
    return permissionGroups[activeCategory as keyof typeof permissionGroups].map(permission => ({
      ...permission,
      category: activeCategory
    }));
  };

  // Obtenir le nombre d'autorisations actives par catégorie
  const getActivePermissionCount = (category: string) => {
    if (category === 'all') {
      return Object.values(permissionGroups)
        .flat()
        .filter(p => authorizations[p.key as keyof authorization] === true)
        .length;
    }
    
    return permissionGroups[category as keyof typeof permissionGroups]
      .filter(p => authorizations[p.key as keyof authorization] === true)
      .length;
  };

  // Calculer le pourcentage d'autorisations actives par catégorie
  const getActivePermissionPercentage = (category: string) => {
    if (category === 'all') {
      const totalPermissions = Object.values(permissionGroups).flat().length;
      return Math.round((getActivePermissionCount('all') / totalPermissions) * 100);
    }
    
    const categoryPermissions = permissionGroups[category as keyof typeof permissionGroups].length;
    return Math.round((getActivePermissionCount(category) / categoryPermissions) * 100);
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 my-8">
      <div className="w-full bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm pt-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Autorisations utilisateur</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Configurez ce que cet utilisateur peut faire dans le système
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-50 rounded-md">
            Les autorisations ont été mises à jour avec succès.
          </div>
        )}

        {hasChanges && (
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center z-10">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Vous avez des modifications non enregistrées
            </span>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setAuthorizations(initialAuthorizations);
                  setHasChanges(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                           bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                           rounded-md transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={saveAuthorizations} 
                disabled={updateMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white 
                           bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800
                           rounded-md transition-colors"
              >
                {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        )}
      </div>
        
      <div className="flex flex-nowrap overflow-x-auto gap-3 py-8 px-4">
        {Object.entries(categories).map(([key, { label, color }]) => {
          const isActive = activeCategory === key;
          const activeCount = getActivePermissionCount(key);
          const percentage = getActivePermissionPercentage(key);
          
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex-none p-4 rounded-lg transition-all ${
                isActive 
                  ? 'ring-2 ring-blue-500 dark:ring-blue-400' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
                <span className="font-medium">{label}</span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold">{activeCount}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm mb-0.5">
                  {key === 'all' 
                    ? `/${Object.values(permissionGroups).flat().length}` 
                    : `/${permissionGroups[key as keyof typeof permissionGroups].length}`
                  }
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                <div 
                  className={`h-1.5 rounded-full ${color}`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {getPermissionsToDisplay().map((permission) => {
          const categoryInfo = categories[permission.category as keyof typeof categories];
          return (
            <div 
              key={permission.key} 
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 
                        rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-5 rounded-sm ${categoryInfo.color}`}></div>
                <span>{permission.label}</span>
              </div>
              <Switch
                label={''}
                disabled={updateMutation.isPending}
                defaultChecked={authorizations[permission.key as keyof authorization] === true}
                onChange={(checked) => handleToggle(permission.key as keyof authorization, checked)}
                className={`data-[state=checked]:${categoryInfo.color.replace('bg-', 'bg-')}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}