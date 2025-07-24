import React from 'react';

const fakeFeedbacks = [
  { id: 'f1', user: 'Alice', type: 'BUG', message: 'Problème de connexion', status: 'PENDING' },
  { id: 'f2', user: 'Bob', type: 'SUGGESTION', message: 'Ajouter un mode sombre', status: 'RESOLVED' },
  { id: 'f3', user: 'Carla', type: 'QUESTION', message: 'Comment changer mon mot de passe ?', status: 'IN_PROGRESS' },
];

export default function FeedbackTable() {
  return (
    <div className='p-8'>
      <h2 className='text-2xl font-bold mb-4'>Feedbacks</h2>
      <div className='overflow-x-auto rounded shadow bg-white'>
        <table className='min-w-full'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='px-4 py-2 text-left'>Utilisateur</th>
              <th className='px-4 py-2 text-left'>Type</th>
              <th className='px-4 py-2 text-left'>Message</th>
              <th className='px-4 py-2 text-left'>Statut</th>
              <th className='px-4 py-2 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fakeFeedbacks.map(fb => (
              <tr key={fb.id} className='border-b'>
                <td className='px-4 py-2'>{fb.user}</td>
                <td className='px-4 py-2'>{fb.type}</td>
                <td className='px-4 py-2'>{fb.message}</td>
                <td className='px-4 py-2'>{fb.status}</td>
                <td className='px-4 py-2 flex gap-2'>
                  <button className='p-1 hover:bg-gray-100 rounded'>Voir</button>
                  <button className='p-1 hover:bg-gray-100 rounded'>Assigner</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 