import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons";
import { Metadata } from "next";
import React from "react";
import TableClients from "./TableClients";
import CreateClientFormModal from "./create/CreateClientFormModal";
import Button from "@/components/ui/button/Button";

export const metadata: Metadata = {
    title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Basic Table page for TailAdmin Tailwind CSS Admin Dashboard Template",
    // other metadata
};

export default function ClientsPage() {
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
                    <TableClients />
                </ComponentCard>
            </div>
        </div>
    );
}
