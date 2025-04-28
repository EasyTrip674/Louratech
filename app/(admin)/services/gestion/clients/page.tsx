import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import TableClients from "./TableClients";
import CreateClientFormModal from "./create/CreateClientFormModal";
import { clientsTableOrganizationDB } from "@/db/queries/clients.query";

export const metadata: Metadata = {
    title: "Clients",
    description: "Gestion des clients de l'entreprise",
    // other metadata
};

export default async function  ClientsPage() {
    const tableClients = await clientsTableOrganizationDB();
    if (!tableClients) return null;
    return (
        <div>
            <PageBreadcrumb pageTitle="Gestion des clients" />
            <div className="space-y-6">
                <ComponentCard
                    title="Clients"
                    actions={
                        <div className="flex items-center space-x-2">
                            <CreateClientFormModal />
                        </div>
                    }
                >
                    <TableClients clients={tableClients} />
                </ComponentCard>
            </div>
        </div>
    );
}
