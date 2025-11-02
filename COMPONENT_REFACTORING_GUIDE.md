# Guide de Refactoring des Composants

## 🎉 Composants Créés

### 1. StatCard - Cartes de Statistiques Réutilisables

**Emplacement**: `components/ui/stat-card/`

**Fichiers**:
- `StatCard.tsx` - Composant principal
- `StatCardSkeleton.tsx` - Version skeleton pour le chargement
- `index.ts` - Exports

**Utilisation**:

```tsx
import { StatCard } from "@/components/ui/stat-card";
import { Users, CheckCircle, Clock, CreditCard } from "lucide-react";

// Exemple basique
<StatCard
  icon={Users}
  color="blue"
  label="Total Clients"
  value={150}
  badge="Total"
/>

// Avec barre de progression
<StatCard
  icon={CheckCircle}
  color="purple"
  label="Taux de réussite"
  value="85.5%"
  progressBar={85.5}
  badge="Taux"
/>

// Version skeleton
import { StatCardSkeleton } from "@/components/ui/stat-card";

<StatCardSkeleton showProgressBar showBadge />
```

**Props**:
- `icon`: Icône Lucide à afficher
- `color`: Couleur du thème (blue, green, amber, purple, red, indigo, pink)
- `label`: Label de la statistique
- `value`: Valeur à afficher
- `badge`: Badge optionnel
- `progressBar`: Valeur de 0-100 pour afficher une barre
- `size`: Taille (sm, md, lg)
- `subtitle`: Texte additionnel
- `children`: Contenu personnalisé

**Remplace**: 8+ implémentations de cartes de stats dans `components/Dashboards/`

---

### 2. DeleteConfirmationModal - Modal de Confirmation de Suppression

**Emplacement**: `components/ui/modal/DeleteConfirmationModal.tsx`

**Utilisation**:

```tsx
import DeleteConfirmationModal from "@/components/ui/modal/DeleteConfirmationModal";
import { useModal } from "@/hooks/useModal";

function MyComponent() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAction();
      closeModal();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button onClick={openModal}>Supprimer</button>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        entityType="ce client"
        itemName="Dupont"
        isLoading={isDeleting}
        warningMessage={
          <>
            <strong>Attention :</strong> Suppression définitive du client
            et de toutes ses données associées.
          </>
        }
        warningSubMessage="Cette action est irréversible."
      />
    </>
  );
}
```

**Props**:
- `isOpen`: État du modal
- `onClose`: Fonction de fermeture
- `onConfirm`: Fonction appelée lors de la confirmation
- `entityType`: Type d'entité (ex: "ce client")
- `itemName`: Nom de l'item pour la confirmation
- `isLoading`: État de chargement
- `warningMessage`: Message principal (ReactNode)
- `warningSubMessage`: Message secondaire (ReactNode)
- `title`: Titre personnalisé
- `confirmButtonText`: Texte du bouton
- `requireNameConfirmation`: Activer/désactiver la saisie du nom (défaut: true)

**Remplace**: 15+ modals de suppression dans `app/**/delete/`

---

### 3. DeleteButton - Bouton de Suppression Standardisé

**Emplacement**: `components/ui/button/DeleteButton.tsx`

**Utilisation**:

```tsx
import DeleteButton from "@/components/ui/button/DeleteButton";

// Version icône seulement
<DeleteButton onClick={handleDelete} />

// Version complète avec label
<DeleteButton
  onClick={handleDelete}
  variant="full"
  label="Supprimer ce client"
/>
```

**Props**:
- `onClick`: Fonction appelée au clic
- `variant`: "icon" ou "full"
- `label`: Texte du bouton (pour variant="full")
- `disabled`: Désactiver le bouton

---

### 4. EmptyState - État Vide Réutilisable

**Emplacement**: `components/ui/empty-state/EmptyState.tsx`

**Utilisation**:

```tsx
import EmptyState from "@/components/ui/empty-state/EmptyState";
import { Search, AlertCircle, Users } from "lucide-react";

// Exemple basique
<EmptyState
  icon={Search}
  title="Aucun résultat trouvé"
  description="Essayez de modifier vos critères de recherche."
/>

// Avec action
<EmptyState
  icon={Users}
  title="Aucun client"
  description="Commencez par ajouter votre premier client."
  action={
    <button onClick={handleAdd} className="btn-primary">
      Ajouter un client
    </button>
  }
  iconSize="lg"
/>

// Sans fond d'icône
<EmptyState
  icon={AlertCircle}
  title="Aucune donnée disponible"
  withIconBackground={false}
/>
```

**Props**:
- `icon`: Icône Lucide
- `title`: Titre principal
- `description`: Description optionnelle
- `action`: Bouton/action optionnel (ReactNode)
- `iconSize`: Taille (sm, md, lg)
- `withIconBackground`: Afficher fond sur icône (défaut: true)

**Remplace**: 3+ implémentations d'états vides dans tables et listes

---

## 📊 Impact du Refactoring

### Code Supprimé
- ✅ **23 composants non utilisés supprimés** (~2,500 lignes)
- ✅ **5 répertoires vides nettoyés**

### Code Consolidé
- ✅ **StatCard**: Remplace 8+ implémentations (économie: ~320 lignes)
- ✅ **DeleteConfirmationModal**: Remplace 15+ modals (économie potentielle: ~1,050 lignes)
- ✅ **EmptyState**: Remplace 3+ implémentations (économie: ~90 lignes)

### Total
- **Code supprimé**: ~2,500 lignes
- **Code consolidable**: ~1,460 lignes
- **Nouveaux composants**: ~600 lignes
- **Économie nette**: ~3,360 lignes (avec consolidation complète)

---

## 🔄 Migration des Composants Existants

### Étape 1: StatCard

**Avant** (`components/Dashboards/ServicesDasboard/StatsServices/StatsServices.tsx`):
```tsx
<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border...">
  <div className="flex justify-between items-start mb-4">
    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
      <Users className="h-6 w-6 text-blue-600..." />
    </div>
    <div className="bg-blue-50...">Total</div>
  </div>
  <p className="text-gray-600...">Total Clients</p>
  <p className="text-3xl font-bold...">{totalClients}</p>
</div>
```

**Après**:
```tsx
import { StatCard } from "@/components/ui/stat-card";

<StatCard
  icon={Users}
  color="blue"
  label="Total Clients"
  value={totalClients}
  badge="Total"
/>
```

**Réduction**: 15 lignes → 6 lignes (60% de réduction)

---

### Étape 2: DeleteConfirmationModal

**Avant** (`app/(admin)/services/gestion/clients/[clientId]/delete/DeleteClientFormModal.tsx`): 207 lignes

**Après**:
```tsx
import DeleteConfirmationModal from "@/components/ui/modal/DeleteConfirmationModal";
import DeleteButton from "@/components/ui/button/DeleteButton";

export default function DeleteClientFormModal({ client }) {
  const { isOpen, openModal, closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await doDeleteClient({ id: client.id, lastName: client.lastName });
      if (result?.data?.success) {
        closeModal();
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DeleteButton onClick={openModal} variant="full" label="Supprimer ce client" />
      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        entityType="ce client"
        itemName={client.lastName}
        isLoading={isDeleting}
        warningMessage={<>...</>}
      />
    </>
  );
}
```

**Réduction**: 207 lignes → ~35 lignes (83% de réduction)

---

### Étape 3: EmptyState

**Avant** (`components/Dashboards/ServicesDasboard/ServicesCards/ServicesCard.tsx`):
```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
    <Search className="size-8 text-gray-400" />
  </div>
  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
    Aucun service trouvé
  </h3>
  <p className="mt-1 text-gray-500 dark:text-gray-400">
    Essayez de modifier vos critères...
  </p>
</div>
```

**Après**:
```tsx
import EmptyState from "@/components/ui/empty-state/EmptyState";

<EmptyState
  icon={Search}
  title="Aucun service trouvé"
  description="Essayez de modifier vos critères de recherche ou de filtrage."
/>
```

**Réduction**: 13 lignes → 5 lignes (62% de réduction)

---

## 📝 TODO: Prochaines Étapes

### Priorité 1 (À faire maintenant)
- [ ] Migrer les 8+ StatCards existants vers le nouveau composant
- [ ] Créer des exemples de migration dans cette documentation
- [ ] Tester les nouveaux composants dans différents contextes

### Priorité 2 (Court terme)
- [ ] Migrer les 15+ DeleteConfirmationModal vers le nouveau composant
- [ ] Créer un hook useDeleteConfirmation pour simplifier davantage
- [ ] Créer un composant FilterPanel pour les filtres de tables

### Priorité 3 (Moyen terme)
- [ ] Refactoriser les gros composants (>350 lignes):
  - Authorization.tsx (718 lignes)
  - ChatFeedBack.tsx (655 lignes)
  - FilterTransactions.tsx (638 lignes)
- [ ] Créer des hooks personnalisés (useTableFilters, useFormState)
- [ ] Créer un composant DashboardCard pour standardiser les layouts

---

## 🧪 Tests Recommandés

Après chaque migration:
1. Vérifier le rendu visuel (identique à l'original)
2. Tester le mode sombre
3. Tester la responsivité mobile
4. Vérifier les interactions (hover, click)
5. Tester avec des données vides/null
6. Vérifier l'accessibilité (aria-labels, keyboard navigation)

---

## 💡 Bonnes Pratiques

### Imports
```tsx
// ✅ Bon - Import nommé
import { StatCard, StatCardSkeleton } from "@/components/ui/stat-card";

// ❌ Éviter - Import de fichier individuel
import StatCard from "@/components/ui/stat-card/StatCard";
```

### Composition
```tsx
// ✅ Bon - Utiliser les props pour la personnalisation
<StatCard icon={Users} color="blue" size="lg" />

// ❌ Éviter - Créer des wrappers inutiles
const MyStatCard = () => <StatCard icon={Users} color="blue" />;
```

### Types
```tsx
// ✅ Bon - Importer les types
import type { StatCardProps } from "@/components/ui/stat-card";

const customProps: StatCardProps = {
  icon: Users,
  label: "Total",
  value: 100,
};
```

---

## 📚 Ressources

- [COMPONENT_ANALYSIS_REPORT.md](./COMPONENT_ANALYSIS_REPORT.md) - Rapport d'analyse complet
- [COMPONENT_QUICK_REFERENCE.md](./COMPONENT_QUICK_REFERENCE.md) - Référence rapide
- [CLAUDE.md](./CLAUDE.md) - Documentation du projet

---

**Dernière mise à jour**: 2025-01-01
