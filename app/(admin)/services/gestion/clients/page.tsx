import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React, { Suspense } from "react";
import CreateClientFormModal from "./create/CreateClientFormModal";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import TableClientsLayout from "./TableClientLayout";
import TableClientsSkeleton from "./TableClientsSkeleton";

export const metadata: Metadata = {
    title: "Clients",
    description: "Gestion des clients de l'entreprise",
    // other metadata
};

export default async function  ClientsPage() {

    const user = await  auth.api.getSession({
        headers: await headers()
    })
    
    return (
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
    );
}
