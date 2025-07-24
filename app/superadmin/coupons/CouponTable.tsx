import React from 'react';

const fakeCoupons = [
  { id: 'c1', code: 'WELCOME10', discount: 10, expiration: '2024-12-31', owner: 'Alice' },
  { id: 'c2', code: 'SUMMER20', discount: 20, expiration: '2024-08-31', owner: 'Bob' },
  { id: 'c3', code: 'BETA5', discount: 5, expiration: '2024-09-15', owner: 'Carla' },
];

export default function CouponTable() {
  return (
    <div className='p-8'>
      <h2 className='text-2xl font-bold mb-4'>Coupons</h2>
      <div className='overflow-x-auto rounded shadow bg-white'>
        <table className='min-w-full'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='px-4 py-2 text-left'>Code</th>
              <th className='px-4 py-2 text-left'>Réduction (%)</th>
              <th className='px-4 py-2 text-left'>Expiration</th>
              <th className='px-4 py-2 text-left'>Propriétaire</th>
              <th className='px-4 py-2 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fakeCoupons.map(coupon => (
              <tr key={coupon.id} className='border-b'>
                <td className='px-4 py-2'>{coupon.code}</td>
                <td className='px-4 py-2'>{coupon.discount}</td>
                <td className='px-4 py-2'>{coupon.expiration}</td>
                <td className='px-4 py-2'>{coupon.owner}</td>
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