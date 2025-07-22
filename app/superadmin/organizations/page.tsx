'use client';
import { useQuery, useMutation, useQueryClient, InvalidateQueryFilters } from '@tanstack/react-query';
import OrganizationTable from '../OrganizationTable';
import OrganizationFormModal from './OrganizationFormModal';
import { useState } from 'react';

export type User = {
  id: string;
  name?: string;
  email?: string;
};

export type Organization = {
  id?: string;
  name: string;
  active: boolean;
  createdAt?: string;
  admins?: { name: string; email: string }[];
  subscription?: { status: string; plan: string; end: string };
  usersCount?: number;
  users?: User[];
};

async function fetchOrganizations(): Promise<Organization[]> {
  const res = await fetch('/superadmin/organizations');
  if (!res.ok) throw new Error('Erreur lors du chargement');
  return res.json();
}

async function createOrganization(data: Organization): Promise<Organization> {
  const res = await fetch('/superadmin/organizations', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Erreur création');
  return res.json();
}

async function updateOrganization(data: Organization): Promise<Organization> {
  const res = await fetch('/superadmin/organizations', {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Erreur modification');
  return res.json();
}

async function deleteOrganization(id: string): Promise<{ success: boolean }> {
  const res = await fetch('/superadmin/organizations', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Erreur suppression');
  return res.json();
}

export default function Page() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<Organization[]>({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editOrg, setEditOrg] = useState<Organization | null>(null);

  const createMutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      setModalOpen(false);
      queryClient.invalidateQueries(['organizations'] as InvalidateQueryFilters);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateOrganization,
    onSuccess: () => {
      setModalOpen(false);
      setEditOrg(null);
      queryClient.invalidateQueries(['organizations'] as InvalidateQueryFilters);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => queryClient.invalidateQueries(['organizations'] as InvalidateQueryFilters),
  });

  function handleCreate() {
    setEditOrg(null);
    setModalOpen(true);
  }

  function handleEdit(org: Organization) {
    setEditOrg(org);
    setModalOpen(true);
  }

  function handleSubmit(data: Organization) {
    if (editOrg && editOrg.id) {
      updateMutation.mutate({ ...editOrg, ...data });
    } else {
      createMutation.mutate(data);
    }
  }

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {(error as Error).message}</div>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          className="bg-brand-600 text-white px-4 py-2 rounded"
          onClick={handleCreate}
        >
          + Nouvelle organisation
        </button>
      </div>
      <OrganizationTable
        organizations={data ?? []}
        onDelete={(id: string) => deleteMutation.mutate(id)}
        onEdit={handleEdit}
      />
      <OrganizationFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditOrg(null); }}
        onSubmit={handleSubmit}
        initialData={editOrg}
      />
    </div>
  );
} 