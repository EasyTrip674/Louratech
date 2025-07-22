'use client';
import React, { useState, useEffect } from 'react';

type Organization = {
  id?: string;
  name: string;
  active: boolean;
};

type OrganizationFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Organization) => void;
  initialData?: Organization | null;
};

export default function OrganizationFormModal({ isOpen, onClose, onSubmit, initialData }: OrganizationFormModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [active, setActive] = useState(initialData?.active ?? true);

  useEffect(() => {
    setName(initialData?.name || '');
    setActive(initialData?.active ?? true);
  }, [initialData, isOpen]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ ...initialData, name, active } as Organization);
  }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Modifier' : 'Créer'} une organisation</h2>
        <div className="mb-4">
          <label className="block mb-1">Nom</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label>
            <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} />
            <span className="ml-2">Active</span>
          </label>
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Annuler</button>
          <button type="submit" className="px-4 py-2 rounded bg-brand-600 text-white">{initialData ? 'Enregistrer' : 'Créer'}</button>
        </div>
      </form>
    </div>
  );
} 