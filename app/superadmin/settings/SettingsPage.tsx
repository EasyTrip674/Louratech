import React from 'react';

export default function SettingsPage() {
  return (
    <div className='p-8 max-w-xl'>
      <h2 className='text-2xl font-bold mb-4'>Paramètres globaux</h2>
      <form className='bg-white rounded shadow p-6 space-y-4'>
        <div>
          <label className='block mb-1 font-semibold'>Nom de la plateforme</label>
          <input className='w-full border rounded px-3 py-2' defaultValue='LouraTech SaaS' />
        </div>
        <div>
          <label className='block mb-1 font-semibold'>Email support</label>
          <input className='w-full border rounded px-3 py-2' defaultValue='support@louratech.com' />
        </div>
        <div>
          <label className='block mb-1 font-semibold'>Logo</label>
          <input type='file' className='w-full' />
        </div>
        <button type='submit' className='bg-brand-600 text-white px-4 py-2 rounded hover:bg-brand-700'>Enregistrer</button>
      </form>
    </div>
  );
} 