import React from 'react';

const fakeLogs = [
  { id: 'l1', date: '2024-07-15 10:00', user: 'Alice', action: 'Création', target: 'Organisation', status: 'Succès' },
  { id: 'l2', date: '2024-07-15 10:05', user: 'Bob', action: 'Suppression', target: 'Utilisateur', status: 'Échec' },
  { id: 'l3', date: '2024-07-15 10:10', user: 'Carla', action: 'Modification', target: 'Abonnement', status: 'Succès' },
];

export default function LogsTable() {
  return (
    <div className='p-8'>
      <h2 className='text-2xl font-bold mb-4'>Logs</h2>
      <div className='overflow-x-auto rounded shadow bg-white'>
        <table className='min-w-full'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='px-4 py-2 text-left'>Date</th>
              <th className='px-4 py-2 text-left'>Utilisateur</th>
              <th className='px-4 py-2 text-left'>Action</th>
              <th className='px-4 py-2 text-left'>Cible</th>
              <th className='px-4 py-2 text-left'>Statut</th>
            </tr>
          </thead>
          <tbody>
            {fakeLogs.map(log => (
              <tr key={log.id} className='border-b'>
                <td className='px-4 py-2'>{log.date}</td>
                <td className='px-4 py-2'>{log.user}</td>
                <td className='px-4 py-2'>{log.action}</td>
                <td className='px-4 py-2'>{log.target}</td>
                <td className='px-4 py-2'>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 