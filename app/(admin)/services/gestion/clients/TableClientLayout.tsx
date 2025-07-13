import { Metadata } from "next";
import React from "react";
import TableClients from "./TableClients";
import { clientService } from "@/lib/services";

export const metadata: Metadata = {
    title: "Clients",
    description: "Gestion des clients de l'entreprise",
};

// Composant pour récupérer les données des clients avec gestion d'erreur améliorée
async function ClientsDataProvider({ children }: { children: React.ReactNode }) {
  try {
    const clients = await clientService.getAllClients();
    
    if (!clients || clients.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              Aucun client trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Commencez par ajouter votre premier client.
            </p>
          </div>
        </div>
      );
    }

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
            Impossible de charger la liste des clients.
          </p>
        </div>
      </div>
    );
  }
}

export default async function TableClientsLayout() {
  return (
    <ClientsDataProvider>
      <TableClients />
    </ClientsDataProvider>
  );
}
