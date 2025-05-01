import { Metadata } from "next";
import React from "react";
import TableClients from "./TableClients";
import { clientsTableOrganizationDB } from "@/db/queries/clients.query";

export const metadata: Metadata = {
    title: "Clients",
    description: "Gestion des clients de l'entreprise",
};

export default async function TableClientsLayout() {
   
    const tableClients = await clientsTableOrganizationDB();
    if (!tableClients) return null;
    return (
        <TableClients clients={tableClients} />
    );
}
