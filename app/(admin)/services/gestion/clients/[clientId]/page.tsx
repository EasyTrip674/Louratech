import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import ClientInfoCard from "./ClientInfoCard";
import UserProfileCard from "../../../../../../components/user/UserProfileCard";
import { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ClientPageServices from "./ClientPageServices";
import BackButton from "@/layout/BackButton";
import { clientService } from "@/lib/services";

export const metadata: Metadata = {
    title: "Client",
    description: "Client page",
};

// We need to use the generated Next.js types for this file
// Rather than creating our own PageProps type
type PageProps = {
  params:  Promise<{ clientId: string }>
};

// Composant pour récupérer les données du client
async function ClientDataProvider({ 
  children 
}: { 
  clientId: string;
  children: React.ReactNode;
}) {
  try {
    // const client = await clientService.getClientById(clientId);
    
    // if (!client) {
    //   return notFound();
    // }

    return (
      <div className="client-data">
        {children}
      </div>
    );
  } catch (error) {
    console.error("Erreur lors du chargement du client:", error);
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-red-600 dark:text-red-300">
            Impossible de charger les informations du client.
          </p>
        </div>
      </div>
    );
  }
}

export default async function Profile(props: PageProps) {
  const params = await props.params;
  const clientId = params.clientId;
  
  const session = await auth.api.getSession({
    headers: await headers()  
  });

  return (
    <ClientDataProvider clientId={clientId}>
      <div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Client
          </h3>
          <BackButton />
          <div className="space-y-6">
            <Suspense fallback={
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }>
              <ClientDetailContent 
                clientId={clientId}
                canEditClient={session?.userDetails?.authorize?.canEditClient}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </ClientDataProvider>
  );
}

// Composant pour afficher le contenu du client
async function ClientDetailContent({ 
  clientId, 
  canEditClient 
}: { 
  clientId: string;
  canEditClient?: boolean;
}) {
  const client = await clientService.getClientById(clientId);
  
  if (!client) {
    return notFound();
  }

  return (
    <>
      <UserProfileCard 
        role={Role.CLIENT}
        email={client.user.email}
        firstName={client.user.firstName || ""}
        lastName={client.user.lastName || ""}
        phone={client.phone || ""}
        address={client.address || ""}
        imageSrc={""}
      />
      <ClientInfoCard client={client} canEditCLient={canEditClient} />
      <ClientPageServices clientId={client.id} />
    </>
  );
}