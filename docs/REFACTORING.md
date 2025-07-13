# Refactoring de l'Architecture - LouraTech

## Vue d'ensemble

Ce document décrit l'architecture refactorisée du projet LouraTech pour améliorer la scalabilité et appliquer les bonnes pratiques.

## Architecture Précédente

### Problèmes identifiés :
- Duplication de code dans les actions serveur
- Logique métier mélangée avec les actions
- Gestion d'erreurs non standardisée
- Validation et autorisations dispersées
- Difficulté à maintenir et faire évoluer le code

## Nouvelle Architecture

### 1. Couche de Services (`lib/services/`)

#### BaseService (`base.service.ts`)
Service de base avec des méthodes communes :
- `getOrganizationId()` : Récupère l'ID de l'organisation
- `getCurrentUser()` : Récupère l'utilisateur connecté
- `checkPermission()` : Vérifie les autorisations
- `validateOrganizationAccess()` : Valide l'accès à l'organisation
- `handleDatabaseError()` : Gestion centralisée des erreurs

#### Services Spécialisés

**ClientService** (`client.service.ts`)
- `createClient()` : Création d'un client
- `updateClient()` : Mise à jour d'un client
- `deleteClient()` : Suppression d'un client
- `getAllClients()` : Récupération de tous les clients
- `getClientById()` : Récupération d'un client par ID

**EmployeeService** (`employee.service.ts`)
- `createEmployee()` : Création d'un employé
- `updateEmployee()` : Mise à jour d'un employé
- `deleteEmployee()` : Suppression d'un employé
- `getAllEmployees()` : Récupération de tous les employés
- `getEmployeeById()` : Récupération d'un employé par ID

**TransactionService** (`transaction.service.ts`)
- `createTransaction()` : Création d'une transaction
- `updateTransaction()` : Mise à jour d'une transaction
- `deleteTransaction()` : Suppression d'une transaction
- `approveTransaction()` : Approbation d'une transaction
- `getFinancialStats()` : Statistiques financières

**ProcedureService** (`procedure.service.ts`)
- `createProcedure()` : Création d'une procédure
- `updateProcedure()` : Mise à jour d'une procédure
- `deleteProcedure()` : Suppression d'une procédure
- `createStep()` : Création d'une étape
- `updateStep()` : Mise à jour d'une étape
- `deleteStep()` : Suppression d'une étape

**AuthorizationService** (`authorization.service.ts`)
- `updateUserAuthorization()` : Mise à jour des autorisations
- `getUserAuthorization()` : Récupération des autorisations
- `createDefaultAuthorization()` : Création d'autorisations par défaut
- `checkUserPermission()` : Vérification d'une autorisation

### 2. Actions Serveur Refactorisées (`lib/actions/`)

Les actions serveur utilisent maintenant les services :

```typescript
export const createClientAction = adminAction
  .metadata({ actionName: "create client" })
  .schema(createClientSchema)
  .action(async ({ clientInput }) => {
    try {
      const client = await clientService.createClient(clientInput);
      revalidatePath("/app/(admin)/services/gestion/clients");
      return { success: true, client };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" };
    }
  });
```

## Avantages de la Nouvelle Architecture

### 1. Séparation des Responsabilités
- **Services** : Logique métier et accès aux données
- **Actions** : Validation, autorisation et gestion des réponses
- **Composants** : Interface utilisateur uniquement

### 2. Réutilisabilité
- Les services peuvent être utilisés dans différents contextes
- Logique métier centralisée et testable
- Facilite l'ajout de nouvelles fonctionnalités

### 3. Maintenabilité
- Code plus lisible et organisé
- Gestion d'erreurs centralisée
- Validation et autorisations cohérentes

### 4. Scalabilité
- Architecture modulaire facile à étendre
- Services indépendants et testables
- Facilite l'ajout de nouveaux modules

## Migration Guide

### 1. Remplacer les anciennes actions

**Avant :**
```typescript
export const doCreateClient = adminAction
  .metadata({ actionName: "create client" })
  .schema(createClientSchema)
  .action(async ({ clientInput, ctx }) => {
    // Logique métier mélangée avec l'action
    const organizationId = await getOrganizationId();
    // ... beaucoup de code dupliqué
  });
```

**Après :**
```typescript
export const createClientAction = adminAction
  .metadata({ actionName: "create client" })
  .schema(createClientSchema)
  .action(async ({ clientInput }) => {
    const client = await clientService.createClient(clientInput);
    return { success: true, client };
  });
```

### 2. Utiliser les services dans les composants

```typescript
// Dans un composant serveur
import { clientService } from "@/lib/services";

const clients = await clientService.getAllClients();
```

### 3. Gestion des erreurs

Les services gèrent automatiquement les erreurs et les autorisations :
- Vérification des permissions
- Validation de l'accès à l'organisation
- Gestion des erreurs de base de données

## Bonnes Pratiques Appliquées

### 1. Single Responsibility Principle
- Chaque service a une responsabilité unique
- Actions séparées de la logique métier

### 2. Dependency Injection
- Services injectables et testables
- Couplage faible entre les composants

### 3. Error Handling
- Gestion centralisée des erreurs
- Messages d'erreur cohérents
- Logging approprié

### 4. Type Safety
- Interfaces TypeScript pour tous les services
- Validation avec Zod
- Types stricts pour les données

### 5. Security
- Vérification des autorisations dans chaque service
- Validation de l'accès aux ressources
- Protection contre les injections

## Tests

### Structure des tests recommandée :

```
tests/
├── services/
│   ├── client.service.test.ts
│   ├── employee.service.test.ts
│   └── transaction.service.test.ts
├── actions/
│   ├── client.actions.test.ts
│   └── employee.actions.test.ts
└── integration/
    └── api.test.ts
```

## Prochaines Étapes

1. **Migration progressive** : Remplacer les anciennes actions une par une
2. **Tests unitaires** : Ajouter des tests pour chaque service
3. **Documentation API** : Documenter les interfaces des services
4. **Monitoring** : Ajouter des métriques de performance
5. **Cache** : Implémenter un système de cache pour les requêtes fréquentes

## Conclusion

Cette nouvelle architecture améliore significativement la maintenabilité, la testabilité et la scalabilité du projet. Elle facilite l'ajout de nouvelles fonctionnalités et réduit la duplication de code. 