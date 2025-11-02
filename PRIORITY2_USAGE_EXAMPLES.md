# Priority 2: Reusable Hooks and Components - Usage Examples

This document demonstrates how to use the new reusable hooks and components created in Priority 2 of the refactoring plan.

## Table of Contents

1. [useDeleteConfirmation Hook](#usedeleteconfirmation-hook)
2. [FilterPanel Component](#filterpanel-component)
3. [DashboardCard Component](#dashboardcard-component)
4. [Migration Guide](#migration-guide)

---

## useDeleteConfirmation Hook

**Location:** `/hooks/useDeleteConfirmation.ts`
**Lines:** 152

### Purpose

Simplifies delete modal usage by encapsulating common logic including:
- Modal state management (isOpen, openModal, closeModal)
- Success/Error modal states
- Server error state
- Mutation handling with TanStack Query
- Automatic router refresh on success

### Basic Usage

```tsx
"use client";

import { useDeleteConfirmation } from "@/hooks";
import DeleteConfirmationModal from "@/components/ui/modal/DeleteConfirmationModal";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import DeleteButton from "@/components/ui/button/DeleteButton";
import { doDeleteClient } from "./client.delete.action";

export default function DeleteClientModal({ client }) {
  const {
    isOpen,
    openModal,
    closeModal,
    handleConfirm,
    isDeleting,
    successModal,
    errorModal,
    serverError,
  } = useDeleteConfirmation({
    mutationFn: async () => {
      const result = await doDeleteClient({
        id: client.id,
        lastName: client.lastName,
      });

      if (!result?.data?.success) {
        throw new Error(result?.serverError || "Erreur lors de la suppression");
      }

      return result;
    },
    successMessage: "Client supprimé avec succès",
    successTitle: "Suppression réussie",
  });

  return (
    <>
      <SuccessModal
        successModal={successModal}
        message={successModal.message}
        title={successModal.title}
      />

      <ErrorModal
        errorModal={errorModal}
        onRetry={errorModal.onRetry}
        message={serverError || "Erreur lors de la suppression"}
      />

      <DeleteButton onClick={openModal} />

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={() => handleConfirm()}
        entityType="ce client"
        itemName={client.lastName}
        isLoading={isDeleting}
      />
    </>
  );
}
```

### Advanced Usage with Variables

```tsx
"use client";

import { useDeleteConfirmation } from "@/hooks";

interface DeleteParams {
  id: string;
  confirmationName: string;
}

export default function DeleteEmployeeModal({ employee }) {
  const {
    isOpen,
    openModal,
    closeModal,
    handleConfirm,
    isDeleting,
    successModal,
    errorModal,
    serverError,
  } = useDeleteConfirmation<any, DeleteParams>({
    mutationFn: async ({ id, confirmationName }) => {
      const result = await doDeleteEmployee({ id, confirmationName });

      if (!result?.data?.success) {
        throw new Error(result?.serverError || "Erreur");
      }

      return result;
    },
    successMessage: "Employé supprimé avec succès",
    onSuccess: (data) => {
      console.log("Deletion successful:", data);
    },
    onError: (error) => {
      console.error("Deletion failed:", error);
    },
  });

  return (
    <>
      {/* Modals... */}

      <button onClick={openModal}>Delete</button>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={() => handleConfirm({
          id: employee.id,
          confirmationName: employee.lastName
        })}
        entityType="cet employé"
        itemName={employee.lastName}
        isLoading={isDeleting}
      />
    </>
  );
}
```

### Key Features

- **Type-safe**: Fully typed with TypeScript generics
- **Automatic refresh**: Calls `router.refresh()` on success
- **Unified modal management**: Handles delete, success, and error modals
- **Error handling**: Centralized error state management
- **Flexible**: Supports callbacks for custom logic

### Props

| Prop | Type | Description |
|------|------|-------------|
| `mutationFn` | `(variables) => Promise<T>` | The delete mutation function |
| `successMessage` | `string` | Success modal message (default: "Suppression réussie") |
| `successTitle` | `string` | Success modal title |
| `defaultErrorMessage` | `string` | Default error message |
| `onSuccess` | `(data, variables) => void` | Callback on success |
| `onError` | `(error, variables) => void` | Callback on error |
| `mutationOptions` | `UseMutationOptions` | Additional TanStack Query options |

### Return Values

| Value | Type | Description |
|-------|------|-------------|
| `isOpen` | `boolean` | Delete modal open state |
| `openModal` | `() => void` | Open delete modal |
| `closeModal` | `() => void` | Close delete modal |
| `handleConfirm` | `(variables) => void` | Trigger deletion |
| `isDeleting` | `boolean` | Mutation pending state |
| `isSuccess` | `boolean` | Mutation success state |
| `isError` | `boolean` | Mutation error state |
| `successModal` | `object` | Success modal state and props |
| `errorModal` | `object` | Error modal state and props |
| `serverError` | `string \| null` | Current error message |
| `clearError` | `() => void` | Clear error state |

---

## FilterPanel Component

**Location:** `/components/ui/filter-panel/FilterPanel.tsx`
**Lines:** 202

### Purpose

Standardizes filter UI across tables with:
- Search input with icon and clear button
- Filter toggle button with active count badge
- Collapsible filter section
- Active filter tags with individual removal
- Reset button with active filter indication
- Responsive design
- Dark mode support

### Basic Usage

```tsx
"use client";

import { useState } from "react";
import { FilterPanel } from "@/components/ui/filter-panel";
import Select from "@/components/form/Select";

export default function ClientsTable({ clients }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCategoryFilter("");
    setShowFilters(false);
  };

  const hasActiveFilters = statusFilter || categoryFilter;
  const activeFilterCount = [statusFilter, categoryFilter].filter(Boolean).length;

  const activeFilters = [
    statusFilter && {
      key: "status",
      label: `Statut: ${statusFilter}`,
      onRemove: () => setStatusFilter(""),
    },
    categoryFilter && {
      key: "category",
      label: `Catégorie: ${categoryFilter}`,
      onRemove: () => setCategoryFilter(""),
    },
  ].filter(Boolean);

  return (
    <FilterPanel
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Rechercher un client..."
      showFilters={showFilters}
      onToggleFilters={() => setShowFilters(!showFilters)}
      onResetFilters={resetFilters}
      hasActiveFilters={hasActiveFilters}
      activeFilterCount={activeFilterCount}
      activeFilters={activeFilters}
      filterContent={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            options={[
              { value: "", label: "Tous les statuts" },
              { value: "active", label: "Actif" },
              { value: "inactive", label: "Inactif" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            options={[
              { value: "", label: "Toutes les catégories" },
              { value: "vip", label: "VIP" },
              { value: "standard", label: "Standard" },
            ]}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
      }
    />
  );
}
```

### Advanced Usage with Date Filters

```tsx
"use client";

import { FilterPanel } from "@/components/ui/filter-panel";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import { Calendar, User, DollarSign } from "lucide-react";

export default function TransactionsFilter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [selectedClient, setSelectedClient] = useState("");

  const hasActiveFilters =
    dateRange.from || dateRange.to ||
    amountRange.min || amountRange.max ||
    selectedClient;

  const activeFilters = [
    selectedClient && {
      key: "client",
      label: `Client: ${selectedClient}`,
      onRemove: () => setSelectedClient(""),
    },
    dateRange.from && {
      key: "dateFrom",
      label: `Depuis: ${new Date(dateRange.from).toLocaleDateString()}`,
      onRemove: () => setDateRange({ ...dateRange, from: "" }),
    },
    dateRange.to && {
      key: "dateTo",
      label: `Jusqu'à: ${new Date(dateRange.to).toLocaleDateString()}`,
      onRemove: () => setDateRange({ ...dateRange, to: "" }),
    },
    amountRange.min && {
      key: "minAmount",
      label: `Min: ${amountRange.min} FNG`,
      onRemove: () => setAmountRange({ ...amountRange, min: "" }),
    },
    amountRange.max && {
      key: "maxAmount",
      label: `Max: ${amountRange.max} FNG`,
      onRemove: () => setAmountRange({ ...amountRange, max: "" }),
    },
  ].filter(Boolean);

  return (
    <FilterPanel
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Rechercher une transaction..."
      showFilters={showFilters}
      onToggleFilters={() => setShowFilters(!showFilters)}
      onResetFilters={() => {
        setSearchTerm("");
        setDateRange({ from: "", to: "" });
        setAmountRange({ min: "", max: "" });
        setSelectedClient("");
        setShowFilters(false);
      }}
      hasActiveFilters={hasActiveFilters}
      activeFilterCount={activeFilters.length}
      activeFilters={activeFilters}
      filterContent={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <User className="w-4 h-4 mr-2 text-blue-500" />
              Client
            </label>
            <Select
              options={clients.map(c => ({ value: c.id, label: c.name }))}
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4 mr-2 text-cyan-500" />
              Date de début
            </label>
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4 mr-2 text-cyan-500" />
              Date de fin
            </label>
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 mr-2 text-yellow-500" />
              Montant
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={amountRange.min}
                onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Max"
                value={amountRange.max}
                onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
              />
            </div>
          </div>
        </div>
      }
      actions={
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Exporter
        </button>
      }
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `searchValue` | `string` | Yes | Current search value |
| `onSearchChange` | `(value: string) => void` | Yes | Search change handler |
| `searchPlaceholder` | `string` | No | Search input placeholder |
| `showFilters` | `boolean` | Yes | Filter panel visibility |
| `onToggleFilters` | `() => void` | Yes | Toggle filters handler |
| `onResetFilters` | `() => void` | Yes | Reset all filters handler |
| `hasActiveFilters` | `boolean` | No | Indicates active filters |
| `activeFilterCount` | `number` | No | Number of active filters (badge) |
| `filterContent` | `ReactNode` | No | Filter form content |
| `actions` | `ReactNode` | No | Header action buttons |
| `activeFilters` | `Array<{key, label, onRemove}>` | No | Active filter tags |
| `hideSearch` | `boolean` | No | Hide search input |
| `hideFilterButton` | `boolean` | No | Hide filter button |
| `className` | `string` | No | Custom CSS class |

### Key Features

- **Fully responsive**: Adapts to mobile, tablet, and desktop
- **Dark mode**: Complete dark mode support
- **Accessible**: ARIA labels and keyboard navigation
- **Flexible**: Highly customizable with slots for custom content
- **Tag management**: Individual filter removal or bulk reset
- **Visual feedback**: Active state indication with badges and colors

---

## DashboardCard Component

**Location:** `/components/ui/card/DashboardCard.tsx`
**Lines:** 187

### Purpose

Standardizes dashboard card layouts with:
- Consistent border, shadow, and background styling
- Optional title/header section with actions
- Content area with flexible padding
- Loading skeleton variant
- Dark mode support
- Full height option

### Basic Usage

```tsx
import { DashboardCard } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <DashboardCard title="Statistiques récentes">
      <p>Contenu de la carte</p>
    </DashboardCard>
  );
}
```

### Card with Header Actions

```tsx
import { DashboardCard } from "@/components/ui/card";
import { Plus, MoreVertical } from "lucide-react";

export default function ClientsDashboard() {
  return (
    <DashboardCard
      title="Clients récents"
      description="Liste des 10 derniers clients ajoutés"
      headerActions={
        <>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="w-4 h-4" />
          </button>
        </>
      }
    >
      <div className="space-y-3">
        {clients.map((client) => (
          <div key={client.id} className="p-3 border rounded-lg">
            {client.name}
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
```

### Loading State

```tsx
import { DashboardCard } from "@/components/ui/card";

export default function DataCard({ isLoading, data }) {
  return (
    <DashboardCard title="Données" isLoading={isLoading}>
      <div>{data}</div>
    </DashboardCard>
  );
}
```

### No Padding (for Tables)

```tsx
import { DashboardCard } from "@/components/ui/card";

export default function TransactionsCard() {
  return (
    <DashboardCard title="Transactions récentes" noPadding>
      <table className="w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>1000 FNG</td>
          </tr>
        </tbody>
      </table>
    </DashboardCard>
  );
}
```

### DashboardCardGrid

```tsx
import { DashboardCard, DashboardCardGrid } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Users, DollarSign, FileText } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <DashboardCardGrid
        mobileColumns={1}
        tabletColumns={2}
        desktopColumns={4}
        gap={6}
      >
        <StatCard icon={Users} color="blue" label="Clients" value={150} />
        <StatCard icon={DollarSign} color="green" label="Revenus" value="50K" />
        <StatCard icon={FileText} color="amber" label="Services" value={42} />
      </DashboardCardGrid>

      {/* Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Graphique">
          <div>Chart content</div>
        </DashboardCard>

        <DashboardCard title="Activité récente">
          <div>Activity list</div>
        </DashboardCard>
      </div>
    </div>
  );
}
```

### Props

#### DashboardCard Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Card title |
| `description` | `string` | Card description |
| `children` | `ReactNode` | Card content |
| `headerActions` | `ReactNode` | Header action buttons |
| `isLoading` | `boolean` | Show loading skeleton |
| `className` | `string` | Custom CSS class |
| `contentClassName` | `string` | Content area CSS class |
| `noPadding` | `boolean` | Remove content padding |
| `fullHeight` | `boolean` | Full height card |
| `hideHeader` | `boolean` | Hide header section |

#### DashboardCardGrid Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Grid items |
| `mobileColumns` | `1 \| 2` | Columns on mobile (default: 1) |
| `tabletColumns` | `2 \| 3 \| 4` | Columns on tablet (default: 2) |
| `desktopColumns` | `2 \| 3 \| 4 \| 5 \| 6` | Columns on desktop (default: 4) |
| `gap` | `4 \| 5 \| 6 \| 8` | Gap between cards (default: 6) |
| `className` | `string` | Custom CSS class |

### Key Features

- **Consistent styling**: Matches existing dashboard patterns
- **Flexible layout**: Supports various content types
- **Dark mode**: Complete dark mode support
- **Loading states**: Built-in skeleton loader
- **Responsive**: Adapts to all screen sizes
- **Composable**: Works with other UI components

---

## Migration Guide

### Before (Old Pattern)

```tsx
"use client";

import React, { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import { useRouter } from "next/navigation";

export default function DeleteClientModal({ client }) {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const successModal = useModal();
  const errorModal = useModal();
  const [serverError, setServerError] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const result = await doDeleteClient({ id: client.id });

      if (result?.data?.success) {
        closeModal();
        successModal.openModal();
        router.refresh();
        return result;
      } else {
        setServerError(result?.serverError || "Erreur");
        errorModal.openModal();
        throw new Error("Failed to delete");
      }
    },
    onError: () => {
      setServerError("Une erreur est survenue");
      errorModal.openModal();
    }
  });

  const handleConfirm = async () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <SuccessModal
        successModal={successModal}
        message="Client supprimé avec succès"
        title="Suppression réussie"
      />

      <ErrorModal
        errorModal={errorModal}
        onRetry={openModal}
        message={serverError || "Erreur"}
      />

      <button onClick={openModal}>Delete</button>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        entityType="ce client"
        itemName={client.lastName}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
```

### After (With useDeleteConfirmation)

```tsx
"use client";

import { useDeleteConfirmation } from "@/hooks";
import DeleteConfirmationModal from "@/components/ui/modal/DeleteConfirmationModal";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";

export default function DeleteClientModal({ client }) {
  const {
    isOpen,
    openModal,
    closeModal,
    handleConfirm,
    isDeleting,
    successModal,
    errorModal,
    serverError,
  } = useDeleteConfirmation({
    mutationFn: async () => {
      const result = await doDeleteClient({ id: client.id });

      if (!result?.data?.success) {
        throw new Error(result?.serverError || "Erreur");
      }

      return result;
    },
    successMessage: "Client supprimé avec succès",
    successTitle: "Suppression réussie",
  });

  return (
    <>
      <SuccessModal
        successModal={successModal}
        message={successModal.message}
        title={successModal.title}
      />

      <ErrorModal
        errorModal={errorModal}
        onRetry={errorModal.onRetry}
        message={serverError || "Erreur"}
      />

      <button onClick={openModal}>Delete</button>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        entityType="ce client"
        itemName={client.lastName}
        isLoading={isDeleting}
      />
    </>
  );
}
```

**Benefits:**
- 30+ lines of boilerplate removed
- Centralized mutation logic
- Consistent error handling
- Automatic router refresh
- Type-safe with generics

---

## Summary

These three new reusable components significantly improve code quality:

1. **useDeleteConfirmation**: Reduces delete modal boilerplate by ~30-40 lines per component
2. **FilterPanel**: Provides consistent filtering UI with 200+ lines of reusable logic
3. **DashboardCard**: Standardizes card layouts across dashboards with flexible options

### Import Paths

```tsx
// Hooks
import { useDeleteConfirmation, useModal } from "@/hooks";

// Components
import { FilterPanel } from "@/components/ui/filter-panel";
import { DashboardCard, DashboardCardGrid, DashboardCardSkeleton } from "@/components/ui/card";
```

### Next Steps

1. Migrate existing delete modals to use `useDeleteConfirmation`
2. Replace custom filter implementations with `FilterPanel`
3. Standardize dashboard layouts with `DashboardCard`
4. Update COMPONENT_REFACTORING_GUIDE.md to include these new components
