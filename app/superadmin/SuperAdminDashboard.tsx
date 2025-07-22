import { organization } from '@prisma/client';
import OrganizationStatsCards from './OrganizationStatsCards';
import OrganizationTable from './OrganizationTable';
import { getOrganizationsSupAdmin } from './superAdmin.query';



export default async function SuperAdminDashboard() {
    const data = await  getOrganizationsSupAdmin()

  const stats = {
    total: data.length,
    active: data.filter((o: organization) => o.active).length,
    inactive: data.filter((o: organization) => !o.active).length,
    trial:0,
    pastDue:0,
    // trial: data.filter((o: organization) => o.subscription?.status === 'TRIAL').length,
    // pastDue: data.filter((o: organization) => o.subscription?.status === 'PAST_DUE').length,
  };



  return (
    <div className='p-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold'>Dashboard SuperAdmin</h1>
        <button className='bg-brand-600 text-white px-4 py-2 rounded hover:bg-brand-700 transition'>+ Nouvelle organisation</button>
      </div>
      <OrganizationStatsCards stats={stats} /> 
     <OrganizationTable organizations={data} />
    </div>
  );
} 