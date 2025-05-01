import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeftFromLine } from 'lucide-react';

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
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