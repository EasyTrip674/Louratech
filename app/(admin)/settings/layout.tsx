import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeftFromLine } from 'lucide-react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

interface SettingsLayoutProps {
  children: ReactNode;
}

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
    const  session = await auth.api.getSession({
        headers: await headers()
    }) 
    if (!session?.userDetails?.authorize?.canEditOrganization) {
        return (
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Accès refusé</h1>
          </div>
        );
    }
  return (
    <div className="">
      <header className="">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/services">
              <span className="text-sm text-brand-600 hover:text-brand-800 flex">
                <ArrowLeftFromLine className='' /> Retour au tableau de bord
              </span>
            </Link>
          </div>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}