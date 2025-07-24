import React from 'react';

const fakeUsers = [
  { id: 'u1', name: 'Alice', email: 'alice@alpha.com', organization: 'Agence Alpha', role: 'Admin', active: true },
  { id: 'u2', name: 'Bob', email: 'bob@alpha.com', organization: 'Agence Alpha', role: 'User', active: true },
  { id: 'u3', name: 'Carla', email: 'carla@beta.com', organization: 'Beta Conseil', role: 'Admin', active: false },
  { id: 'u4', name: 'David', email: 'david@gamma.com', organization: 'Gamma Services', role: 'User', active: true },
];

export default function UserTable() {
  return (
    <div className='p-8'>
      <h2 className='text-2xl font-bold mb-4'>Utilisateurs</h2>
      <div className='overflow-x-auto rounded shadow bg-white'>
        <table className='min-w-full'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='px-4 py-2 text-left'>Nom</th>
              <th className='px-4 py-2 text-left'>Email</th>
              <th className='px-4 py-2 text-left'>Organisation</th>
              <th className='px-4 py-2 text-left'>Rôle</th>
              <th className='px-4 py-2 text-left'>Statut</th>
              <th className='px-4 py-2 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fakeUsers.map(user => (
              <tr key={user.id} className='border-b'>
                <td className='px-4 py-2'>{user.name}</td>
                <td className='px-4 py-2'>{user.email}</td>
                <td className='px-4 py-2'>{user.organization}</td>
                <td className='px-4 py-2'>{user.role}</td>
                <td className='px-4 py-2'>
                  <span className={user.active ? 'text-green-600' : 'text-red-600'}>
                    {user.active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className='px-4 py-2 flex gap-2'>
                  <button className='p-1 hover:bg-gray-100 rounded'>Voir</button>
                  <button className='p-1 hover:bg-gray-100 rounded'>Editer</button>
                  <button className='p-1 hover:bg-gray-100 rounded text-red-600'>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 