"use client"
import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { organization } from '@prisma/client';
import { getOrganizationsSupAdmin } from './superAdmin.query';

type OrganizationTableProps = {
  organizations: getOrganizationsSupAdmin,
  onEdit?: (org: organization) => void;
  onDelete?: (id: string) => void;
};

const OrganizationTable = ({ organizations, onEdit, onDelete }: OrganizationTableProps) => (
  <div className='overflow-x-auto rounded shadow bg-white'>
    <table className='min-w-full'>
      <thead>
        <tr className='bg-gray-50'>
          <th className='px-4 py-2 text-left'>Nom</th>
          <th className='px-4 py-2 text-left'>Statut</th>
          <th className='px-4 py-2 text-left'>Admins</th>
          <th className='px-4 py-2 text-left'>Abonnement</th>
          <th className='px-4 py-2 text-left'>Utilisateurs</th>
          <th className='px-4 py-2 text-left'>Actions</th>
        </tr>
      </thead>
      <tbody>
        {organizations.map(org => (
          <tr key={org.id} className='border-b'>
            <td className='px-4 py-2'>{org.name}</td>
            <td className='px-4 py-2'>
              <span className={org.active ? 'text-green-600' : 'text-red-600'}>
                {org.active ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className='px-4 py-2'>{org._count.admins}</td>
            <td className='px-4 py-2'>
              {/* <span className='font-semibold'>{org.subscription?.plan || '-'}</span> */}
              {/* <span className='ml-2 text-xs px-2 py-1 rounded bg-gray-100'>
                {org.subscription?.status || '-'}
              </span> */}
              2
            </td>
            <td className='px-4 py-2'>{org._count.users}</td>
            <td className='px-4 py-2 flex gap-2'>
              <button className='p-1 hover:bg-gray-100 rounded'><Eye size={16} /></button>
              <button className='p-1 hover:bg-gray-100 rounded' onClick={() => onEdit && onEdit(org)}><Pencil size={16} /></button>
              <button className='p-1 hover:bg-gray-100 rounded text-red-600' onClick={() => onDelete && org.id && onDelete(org.id)}><Trash2 size={16} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OrganizationTable; 