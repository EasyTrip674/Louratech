"use client";
import NotAuthorized from "@/app/not-authorized";
import useAuth from "@/lib/BackendConfig/useAuth";

// Composant pour vérifier les autorisations des procédures
 function ProceduresAuthGuard({ children }: { children: React.ReactNode }) {
  try {
    const {user} = useAuth()

    if (!user?.email) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
            <p className="text-gray-600">Vous devez être connecté pour accéder à cette page</p>
          </div>
        </div>
      );
    }

    // Vérifier les autorisations directement depuis la session
    if (!user?.authorization.can_read_procedure) {
      return <NotAuthorized />;
    }

    return <>{children}</>;
  } catch (error) {
    console.error("Erreur lors de la vérification des autorisations procédures:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-gray-600">Une erreur est survenue lors de la vérification des autorisations</p>
        </div>
      </div>
    );
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProceduresAuthGuard>
      {children}
    </ProceduresAuthGuard>
  );
}
