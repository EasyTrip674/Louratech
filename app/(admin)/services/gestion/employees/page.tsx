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
};

// Composant pour récupérer les données de session
async function EmployeesPageProvider({ children }: { children: React.ReactNode }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500">Session non trouvée</p>
        </div>
      );
    }

    return (
      <div className="employees-page-data" data-session={JSON.stringify(session)}>
        {children}
      </div>
    );
  } catch (error) {
    console.error("Erreur lors du chargement de la session:", error);
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erreur lors du chargement de la session</p>
      </div>
    );
  }
}

export default async function EmployeesPage() {
  return (
    <EmployeesPageProvider>
      <div>
        <PageBreadcrumb pageTitle="Gestion des Employés" />
        <div className="space-y-6">
          <ComponentCard
            title="Employés"
            actions={
              <div className="flex items-center space-x-2">
                <CreateEmployeeFormModal />
              </div>
            }
          >
            <Suspense fallback={<TableEmployeesSkeleton />}>
              <TableEmployeesLayout />
            </Suspense>
          </ComponentCard>
        </div>
      </div>
    </EmployeesPageProvider>
  );
}
