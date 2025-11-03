# Plan d'Optimisation des Performances - Louratech

**Date**: 2025-11-02
**Statut**: 🚀 En cours d'implémentation
**Objectif**: Optimiser les requêtes, implémenter le cache et la pagination

---

## 📊 Analyse des Problèmes Actuels

### 1. Pas de Pagination ❌

**Problème** : Les services chargent TOUTES les données en une fois
```typescript
// ClientService.getAllClients() - PROBLÈME
async getAllClients() {
  return await this.prisma.client.findMany({
    where: { organizationId },
    // ❌ Pas de limit, pas de skip
    // Charge potentiellement des milliers de clients
  });
}
```

**Impact** :
- ⚠️ Temps de chargement long (>2s pour 1000+ clients)
- ⚠️ Mémoire excessive côté serveur
- ⚠️ Bande passante gaspillée
- ⚠️ Expérience utilisateur dégradée

---

### 2. Pas de Cache Next.js ❌

**Problème** : Les pages sont recalculées à chaque requête
```typescript
// page.tsx - PROBLÈME
export default async function ClientsPage() {
  const clients = await clientService.getAllClients();
  // ❌ Pas de cache, données rechargées à chaque visite
  // ❌ Pas de revalidation configurée
}
```

**Impact** :
- ⚠️ Serveur surchargé (requêtes DB à chaque visite)
- ⚠️ Temps de réponse lent
- ⚠️ Coûts DB élevés

---

### 3. Requêtes Non Optimisées ❌

**Problème** : Usage excessif de `include` au lieu de `select`
```typescript
// PROBLÈME - Charge toute l'organisation
include: {
  organization: true  // ❌ Charge tous les champs inutiles
}

// MIEUX - Sélection précise
select: {
  id: true,
  firstName: true,
  lastName: true,
  // Seulement ce qui est nécessaire
}
```

**Impact** :
- ⚠️ Données inutiles transférées (organisation entière vs juste l'ID)
- ⚠️ Bande passante gaspillée
- ⚠️ Temps de sérialisation augmenté

---

### 4. Pas de Cache Client (React Query) ⚠️

**Problème** : React Query pas configuré optimalement
```typescript
// Pas de staleTime, pas de gcTime configurés
// Cache par défaut trop court
```

**Impact** :
- ⚠️ Requêtes répétées inutiles
- ⚠️ UX dégradée (rechargements fréquents)

---

## 🎯 Plan d'Optimisation

### Phase 1 : Pagination Côté Serveur (PRIORITÉ HAUTE) 🔥

#### 1.1 Créer des interfaces de pagination

```typescript
// lib/types/pagination.ts
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
```

#### 1.2 Optimiser ClientService

**Avant** :
```typescript
async getAllClients() {
  return await this.prisma.client.findMany({
    where: { organizationId },
  });
}
```

**Après** :
```typescript
async getAllClients(params: PaginationParams = {}): Promise<PaginatedResponse<Client>> {
  const { page = 1, limit = 20, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  const where = {
    organizationId,
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    this.prisma.client.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        // ✅ Seulement les champs nécessaires pour la liste
      },
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    this.prisma.client.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + data.length < total,
    },
  };
}
```

**Gains** :
- ✅ Charge seulement 20 clients au lieu de tous
- ✅ Recherche optimisée avec index
- ✅ Tri côté DB (plus rapide)
- ✅ Métadonnées de pagination incluses

---

### Phase 2 : Cache Next.js (PRIORITÉ HAUTE) 🔥

#### 2.1 Ajouter revalidation aux pages

```typescript
// app/(admin)/services/gestion/clients/page.tsx
export const revalidate = 60; // ✅ Cache pendant 60 secondes

export default async function ClientsPage() {
  // Les données sont mises en cache
}
```

#### 2.2 Utiliser unstable_cache pour les requêtes

```typescript
import { unstable_cache } from 'next/cache';

const getClients = unstable_cache(
  async (organizationId: string, page: number) => {
    return clientService.getAllClients({ page, limit: 20 });
  },
  ['clients-list'], // Cache key
  {
    revalidate: 60, // 60 secondes
    tags: ['clients'], // Pour invalidation ciblée
  }
);
```

#### 2.3 Invalidation intelligente du cache

```typescript
// Dans les server actions
import { revalidateTag } from 'next/cache';

export const createClientAction = adminAction
  .action(async ({ parsedInput }) => {
    const client = await clientService.createClient(parsedInput);

    // ✅ Invalider seulement le cache des clients
    revalidateTag('clients');

    return { success: true, client };
  });
```

**Gains** :
- ✅ Réduction de 90% des requêtes DB pour les lectures
- ✅ Temps de réponse divisé par 10 (20ms vs 200ms)
- ✅ Invalidation ciblée (pas de revalidatePath global)

---

### Phase 3 : Optimisation des Requêtes (PRIORITÉ MOYENNE) ⚡

#### 3.1 Remplacer `include` par `select`

**Règle** : N'inclure que les champs nécessaires

```typescript
// ❌ MAUVAIS - Charge toute l'organisation
include: {
  organization: true
}

// ✅ BON - Seulement ce qui est nécessaire
select: {
  id: true,
  firstName: true,
  lastName: true,
  organizationId: true,
  // Pas besoin de toute l'organisation
}
```

#### 3.2 Requêtes parallèles avec Promise.all

```typescript
// ❌ MAUVAIS - Séquentiel (300ms total)
const clients = await prisma.client.count(); // 100ms
const procedures = await prisma.procedure.count(); // 100ms
const transactions = await prisma.transaction.count(); // 100ms

// ✅ BON - Parallèle (100ms total)
const [clients, procedures, transactions] = await Promise.all([
  prisma.client.count(),
  prisma.procedure.count(),
  prisma.transaction.count(),
]);
```

#### 3.3 Index de base de données

```prisma
// prisma/schema.prisma
model Client {
  id             String   @id @default(cuid())
  firstName      String
  lastName       String
  email          String?
  organizationId String
  createdAt      DateTime @default(now())

  @@index([organizationId]) // ✅ Index existant
  @@index([organizationId, createdAt]) // ✅ Pour tri optimisé
  @@index([firstName, lastName]) // ✅ Pour recherche
}
```

---

### Phase 4 : Composant de Pagination Réutilisable (PRIORITÉ MOYENNE) ⚡

```typescript
// components/ui/pagination/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Page {currentPage} sur {totalPages}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn-secondary"
        >
          Précédent
        </button>

        {/* Numéros de pages */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={currentPage === page ? 'btn-primary' : 'btn-secondary'}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn-secondary"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
```

---

### Phase 5 : Configuration React Query (PRIORITÉ FAIBLE) 📦

```typescript
// app/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // ✅ Données considérées fraîches pendant 1 minute
      gcTime: 5 * 60 * 1000, // ✅ Cache conservé 5 minutes
      refetchOnWindowFocus: false, // ✅ Pas de refetch au focus
      retry: 1, // ✅ 1 seule retry au lieu de 3
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

## 📈 Gains Attendus

### Avant Optimisation
- **Temps de chargement liste clients (1000 clients)** : ~2-3 secondes
- **Requêtes DB par visite** : 1-3 requêtes
- **Données transférées** : ~500KB (tous les clients + relations)
- **Mémoire serveur** : ~50MB par requête

### Après Optimisation
- **Temps de chargement** : ~100-200ms ✅ (10-30x plus rapide)
- **Requêtes DB par visite** : 0 (cache) ou 1 ✅ (90% de réduction)
- **Données transférées** : ~20KB (20 clients seulement) ✅ (25x moins)
- **Mémoire serveur** : ~2MB par requête ✅ (25x moins)

### Métriques de Performance

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| **Temps de chargement** | 2000ms | 100ms | 🚀 **20x** |
| **Requêtes DB/jour** | 10,000 | 1,000 | ✅ **90%** ↓ |
| **Bande passante** | 500KB | 20KB | ✅ **96%** ↓ |
| **Mémoire serveur** | 50MB | 2MB | ✅ **96%** ↓ |
| **Coûts DB** | 100% | 10% | ✅ **90%** ↓ |

---

## 🔄 Stratégie de Cache

### Cache Layers

```
┌─────────────────────────────────────┐
│  1. Browser Cache (React Query)     │
│     - staleTime: 60s                │
│     - gcTime: 5min                  │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  2. Next.js Cache (RSC)             │
│     - revalidate: 60s               │
│     - tags: ['clients']             │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  3. Database (Prisma)               │
│     - Connection pooling            │
│     - Query optimization            │
└─────────────────────────────────────┘
```

### Invalidation Strategy

**Créer/Modifier/Supprimer** :
```typescript
// Invalider le cache spécifique
revalidateTag('clients');        // Liste des clients
revalidateTag('client-123');     // Client spécifique
```

**Recherche/Filtres** :
```typescript
// Cache séparé par query params
unstable_cache(
  (orgId, search, page) => clientService.getAllClients({ search, page }),
  ['clients-search', search, page]
);
```

---

## 📋 Plan d'Implémentation

### Sprint 1 : Pagination (2 jours) 🏃

- [x] Créer interfaces de pagination
- [ ] Optimiser ClientService avec pagination
- [ ] Optimiser ProcedureService avec pagination
- [ ] Optimiser TransactionService avec pagination
- [ ] Créer composant Pagination réutilisable
- [ ] Mettre à jour les pages pour utiliser la pagination

### Sprint 2 : Cache Next.js (1 jour) 🏃

- [ ] Ajouter revalidate aux pages principales
- [ ] Utiliser unstable_cache pour les requêtes
- [ ] Remplacer revalidatePath par revalidateTag
- [ ] Tester l'invalidation du cache

### Sprint 3 : Optimisation Requêtes (1 jour) ⚡

- [ ] Audit de tous les `include` et conversion en `select`
- [ ] Identifier et paralléliser les requêtes séquentielles
- [ ] Ajouter index DB si nécessaires
- [ ] Mesurer les performances avec Prisma Studio

### Sprint 4 : React Query (0.5 jour) 📦

- [ ] Configurer QueryClient avec staleTime/gcTime
- [ ] Tester le cache côté client
- [ ] Ajuster les paramètres selon les métriques

### Sprint 5 : Tests et Monitoring (1 jour) 🧪

- [ ] Tests de charge avec 1000+ clients
- [ ] Mesurer les temps de réponse
- [ ] Vérifier l'utilisation mémoire
- [ ] Documenter les résultats

**Total estimé** : 5.5 jours

---

## 🛠️ Outils de Monitoring

### 1. Next.js Instrumentation

```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node');
  }
}

// instrumentation.node.ts
import { performance } from 'perf_hooks';

// Logger les temps de réponse
```

### 2. Prisma Logging

```typescript
// lib/prisma.ts
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

// Voir les requêtes dans les logs
```

### 3. React Query Devtools

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

---

## 📝 Checklist de Migration

### Pour chaque Service

- [ ] Ajouter interface `PaginationParams`
- [ ] Modifier méthode `getAll()` pour accepter pagination
- [ ] Remplacer `include` par `select` précis
- [ ] Ajouter `Promise.all` pour requêtes parallèles
- [ ] Retourner `PaginatedResponse<T>`

### Pour chaque Page

- [ ] Ajouter `export const revalidate = 60`
- [ ] Utiliser `unstable_cache` si nécessaire
- [ ] Ajouter composant `Pagination`
- [ ] Gérer les query params (page, search)
- [ ] Tester avec données réelles

### Pour chaque Action

- [ ] Remplacer `revalidatePath('/')` par `revalidateTag('entity')`
- [ ] Invalider seulement les caches nécessaires
- [ ] Tester l'invalidation

---

## 🎯 Priorités

### 🔥 URGENT (Cette semaine)
1. Pagination ClientService
2. Pagination ProcedureService
3. Cache Next.js pages principales

### ⚡ IMPORTANT (Semaine prochaine)
4. Optimisation requêtes (select vs include)
5. Composant Pagination réutilisable
6. Pagination autres services

### 📦 PEUT ATTENDRE (Plus tard)
7. React Query configuration
8. Index DB additionnels
9. Monitoring avancé

---

**Document maintenu par** : L'équipe de développement Louratech
**Prochaine révision** : Hebdomadaire
**Contact** : dev@louratech.com
