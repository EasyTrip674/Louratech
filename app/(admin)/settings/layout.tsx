import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeftFromLine } from 'lucide-react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
// import { authorizationService } from '@/lib/services';

interface SettingsLayoutProps {
  children: ReactNode;
}

// Composant pour vérifier les autorisations
async function SettingsAuthGuard({ children }: { children: ReactNode }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
            <p className="text-gray-600">Vous devez être connecté pour accéder à cette page</p>
          </div>
        </div>
      );
    }

    // Vérifier les autorisations via le service
    // const canEdit = await authorizationService.checkUserPermission(session.userDetails.id, "canReadSettings");
    // if (!canEdit) {
    //   return (
    //     <div className="flex items-center justify-center h-screen">
    //       <div className="text-center">
    //         <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
    //         <p className="text-gray-600">Vous n&apos;avez pas les autorisations nécessaires</p>
    //       </div>
    //     </div>
    //   );
    // }

    return <>{children}</>;
  } catch (error) {
    console.error("Erreur lors de la vérification des autorisations:", error);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-gray-600">Une erreur est survenue lors de la vérification des autorisations</p>
        </div>
      </div>
    );
  }
}

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <SettingsAuthGuard>
      <div className="">
        <header className="">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <Link href="/services">
                <span className="text-sm text-brand-600 hover:text-brand-800 flex items-center gap-2">
                  <ArrowLeftFromLine className="w-4 h-4" /> 
                  Retour au tableau de bord
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
    </SettingsAuthGuard>
  );
}