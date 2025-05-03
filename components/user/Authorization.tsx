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
      authorizationId: initialAuthorizations.id,
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
/**
 * Configuration des groupes de permissions avec labels explicites pour les utilisateurs
 */
const permissionGroups = {
  general: [
    { key: 'canChangeUserAuthorization', label: 'Modifier les autorisations des autres utilisateurs du système' },
    { key: 'canChangeUserPassword', label: 'Réinitialiser ou changer les mots de passe des autres utilisateurs' },
  ],
  
  create: [
    { key: 'canCreateClient', label: 'Enregistrer un nouveau client dans la base de données' },
    { key: 'canCreateProcedure', label: 'Créer un nouveau service dans le catalogue de l\'entreprise' },
    { key: 'canCreateTransaction', label: 'Enregistrer une nouvelle transaction financière' },
    { key: 'canCreateInvoice', label: 'Générer une nouvelle facture pour un client' },
    { key: 'canCreateExpense', label: 'Enregistrer une nouvelle dépense dans la comptabilité' },
    { key: 'canCreateRevenue', label: 'Enregistrer un nouveau revenu dans la comptabilité' },
    { key: 'canCreateComptaSettings', label: 'Configurer de nouveaux paramètres comptables' },
    { key: 'canCreateStep', label: 'Ajouter un nouveau module aux procédures' },
    { key: 'canCreateClientProcedure', label: 'Attribuer un service à un client spécifique' },
    { key: 'canCreateClientStep', label: 'Définir une étape dans le dossier d\'un client' },
    { key: 'canCreateClientDocument', label: 'Télécharger ou ajouter un document au dossier d\'un client' },
  ],
  
  read: [
    { key: 'canReadClient', label: 'Voir les dossiers et données des clients' },
    { key: 'canReadStep', label: 'Visualiser les modules et leurs détails' },
    { key: 'canReadAdmin', label: 'Voir la liste et les profils des administrateurs' },
    { key: 'canReadProcedure', label: 'Consulter le catalogue de services de l\'entreprise' },
    { key: 'canReadTransaction', label: 'Accéder à l\'historique des transactions financières' },
    { key: 'canReadInvoice', label: 'Consulter les factures émises aux clients' },
    { key: 'canReadExpense', label: 'Voir les dépenses enregistrées dans la comptabilité' },
    { key: 'canReadRevenue', label: 'Voir les revenus enregistrés dans la comptabilité' },
    { key: 'canReadComptaSettings', label: 'Afficher les paramètres de configuration comptable' },
    { key: 'canReadClientProcedure', label: 'Voir les services associés à chaque client' },
    { key: 'canReadClientStep', label: 'Consulter les étapes dans les dossiers clients' },
    { key: 'canReadClientDocument', label: 'Visualiser et télécharger les documents des clients' },
  ],
  
  update: [
    { key: 'canEditOrganization', label: 'Mettre à jour les informations des organisations' },
    { key: 'canEditClient', label: 'Modifier les données des fiches clients' },
    { key: 'canEditStep', label: 'Mettre à jour les modules et leurs détails' },
    { key: 'canEditAdmin', label: 'Modifier les profils et droits des administrateurs' },
    { key: 'canEditProcedure', label: 'Modifier les services du catalogue' },
    { key: 'canEditTransaction', label: 'Modifier les transactions financières existantes' },
    { key: 'canEditInvoice', label: 'Ajuster ou corriger les factures créées' },
    { key: 'canEditExpense', label: 'Modifier les dépenses existantes' },
    { key: 'canEditRevenue', label: 'Modifier les revenus existants' },
    { key: 'canEditComptaSettings', label: 'Ajuster les paramètres de comptabilité' },
    { key: 'canEditClientProcedure', label: 'Modifier les services attribués aux clients' },
    { key: 'canEditClientStep', label: 'Modifier les étapes dans les dossiers clients' },
    { key: 'canEditClientDocument', label: 'Mettre à jour les documents associés aux clients' },
  ],
  
  delete: [
    { key: 'canDeleteClient', label: 'Supprimer des clients et leurs données associées' },
    { key: 'canDeleteStep', label: 'Supprimer des modules d\'un service' },
    { key: 'canDeleteAdmin', label: 'Retirer des comptes administrateurs' },
    { key: 'canDeleteProcedure', label: 'Retirer des services du catalogue' },
    { key: 'canDeleteTransaction', label: 'Effacer des transactions financières du système' },
    { key: 'canDeleteInvoice', label: 'Supprimer des factures émises' },
    { key: 'canDeleteExpense', label: 'Effacer des dépenses de la comptabilité' },
    { key: 'canDeleteRevenue', label: 'Effacer des revenus de la comptabilité' },
    { key: 'canDeleteComptaSettings', label: 'Supprimer des paramètres de comptabilité' },
    { key: 'canDeleteClientProcedure', label: 'Désassocier des services attribués aux clients' },
    { key: 'canDeleteClientStep', label: 'Supprimer des étapes dans les dossiers clients' },
    { key: 'canDeleteClientDocument', label: 'Supprimer des documents des dossiers clients' },
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