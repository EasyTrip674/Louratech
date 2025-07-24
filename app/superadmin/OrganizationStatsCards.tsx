import React from 'react';

type Stats = {
  total: number;
  active: number;
  inactive: number;
  trial: number;
  pastDue: number;
};

const OrganizationStatsCards = ({ stats }: { stats: Stats }) => (
  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
    <div className='bg-white rounded shadow p-4'>
      <div className='text-2xl font-bold'>{stats.total}</div>
      <div className='text-gray-500'>Organisations</div>
    </div>
    <div className='bg-green-50 rounded shadow p-4'>
      <div className='text-2xl font-bold'>{stats.active}</div>
      <div className='text-green-700'>Actives</div>
    </div>
    <div className='bg-red-50 rounded shadow p-4'>
      <div className='text-2xl font-bold'>{stats.inactive}</div>
      <div className='text-red-700'>Inactives</div>
    </div>
    <div className='bg-yellow-50 rounded shadow p-4'>
      <div className='text-2xl font-bold'>{stats.trial}</div>
      <div className='text-yellow-700'>En essai</div>
    </div>
    <div className='bg-orange-50 rounded shadow p-4'>
      <div className='text-2xl font-bold'>{stats.pastDue}</div>
      <div className='text-orange-700'>En retard paiement</div>
    </div>
  </div>
);

export default OrganizationStatsCards; 