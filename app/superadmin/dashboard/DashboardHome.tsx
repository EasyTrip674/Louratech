import React from 'react';

export default function DashboardHome() {
  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-6'>Bienvenue SuperAdmin</h1>
      <div className='mb-4'>
        <p className='text-lg'>Ce dashboard vous permet de gérer toutes les organisations, utilisateurs, abonnements, feedbacks, logs, paramètres et coupons de la plateforme SaaS.</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded shadow p-6'>
          <div className='text-xl font-semibold mb-2'>Organisations</div>
          <div className='text-3xl font-bold'>3</div>
        </div>
        <div className='bg-white rounded shadow p-6'>
          <div className='text-xl font-semibold mb-2'>Utilisateurs</div>
          <div className='text-3xl font-bold'>25</div>
        </div>
        <div className='bg-white rounded shadow p-6'>
          <div className='text-xl font-semibold mb-2'>Feedbacks</div>
          <div className='text-3xl font-bold'>7</div>
        </div>
      </div>
    </div>
  );
} 