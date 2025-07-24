import React from 'react';

const fakeSubscriptions = [
  { id: 's1', organization: 'Agence Alpha', plan: 'Pro', status: 'ACTIVE', end: '2024-12-31' },
  { id: 's2', organization: 'Beta Conseil', plan: 'Essai', status: 'TRIAL', end: '2024-08-01' },
  { id: 's3', organization: 'Gamma Services', plan: 'Pro', status: 'PAST_DUE', end: '2024-06-30' },
];

export default function SubscriptionTable() {
  return (
    <div className='p-8'>
      <h2 className='text-2xl font-bold mb-4'>Abonnements</h2>
      <div className='overflow-x-auto rounded shadow bg-white'>
        <table className='min-w-full'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='px-4 py-2 text-left'>Organisation</th>
              <th className='px-4 py-2 text-left'>Plan</th>
              <th className='px-4 py-2 text-left'>Statut</th>
              <th className='px-4 py-2 text-left'>Fin</th>
              <th className='px-4 py-2 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fakeSubscriptions.map(sub => (
              <tr key={sub.id} className='border-b'>
                <td className='px-4 py-2'>{sub.organization}</td>
                <td className='px-4 py-2'>{sub.plan}</td>
                <td className='px-4 py-2'>{sub.status}</td>
                <td className='px-4 py-2'>{sub.end}</td>
                <td className='px-4 py-2 flex gap-2'>
                  <button className='p-1 hover:bg-gray-100 rounded'>Voir</button>
                  <button className='p-1 hover:bg-gray-100 rounded'>Editer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 