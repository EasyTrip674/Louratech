import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React, { Suspense } from "react";
import CreateEmployeeFormModal from "./create/CreateEmployeeFormModal";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import TableEmployeesLayout from "./TableEmployeesLayout";
import TableEmployeesSkeleton from "./TableEmployeesSkeleton";

export const metadata: Metadata = {
    title: "Employees",
    description: "Gestion des Employees de l'entreprise",
    // other metadata
};

export default async function EmployeesPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

    return (
        <div>
            <PageBreadcrumb pageTitle="Gestion des Employés" />
            <div className="space-y-6">
                <ComponentCard
                    title="Employés"
                    actions={
                        <div className="flex items-center space-x-2">
                         {
                             session?.userDetails?.authorize?.canCreateAdmin && (
                                <CreateEmployeeFormModal />
                                )
                         }
                        </div>
                    }
                >
                    <Suspense fallback={<TableEmployeesSkeleton />}>
                        <TableEmployeesLayout />
                    </Suspense>
                </ComponentCard>
            </div>
        </div>
    );
}
