import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React, { Suspense } from "react";
import CreateClientFormModal from "./create/CreateClientFormModal";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import TableClientsLayout from "./TableClientLayout";
import TableClientsSkeleton from "./TableClientsSkeleton";
import { clientService } from "@/lib/services";

export const metadata: Metadata = {
    title: "Clients",
    description: "Gestion des clients de l'entreprise",
};

// Composant pour récupérer les données des clients avec gestion d'erreur améliorée
async function ClientsDataProvider({ children }: { children: React.ReactNode }) {
  try {
    // Récupérer tous les clients via le service
    const clients = await clientService.getAllClients();
    
    return (
      <div className="clients-data" data-clients={JSON.stringify(clients)}>
        {children}
      </div>
    );
  } catch (error) {
    console.error("Erreur lors du chargement des clients:", error);
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-red-600 dark:text-red-300">
            Impossible de charger la liste des clients. Veuillez réessayer.
          </p>
        </div>
      </div>
    );
  }
}

export default async function ClientsPage() {
    const user = await auth.api.getSession({
        headers: await headers()
    });
    
    return (
        <ClientsDataProvider>
            <div>
                <PageBreadcrumb pageTitle="Gestion des clients" />
                <div className="space-y-6">
                    <ComponentCard
                        title="Clients"
                        actions={
                            <div className="flex items-center space-x-2">
                                {
                                    user?.userDetails?.authorize?.canCreateClient && (
                                        <CreateClientFormModal />
                                    )
                                }
                            </div>
                        }
                    >
                        <Suspense fallback={<TableClientsSkeleton />}>
                            <TableClientsLayout />
                        </Suspense>
                    </ComponentCard>
                </div>
            </div>
        </ClientsDataProvider>
    );
}
