import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import TableEmployees from "./TableEmployees";
// import CreateEmployeeFormModal from "./create/CreateEmployeeFormModal";
import CreateEmployeeFormModal from "./create/CreateEmployeeFormModal";
import { employeesTableOrganizationDB } from "@/db/queries/employees.query";

export const metadata: Metadata = {
    title: "Employees",
    description: "Gestion des Employees de l'entreprise",
    // other metadata
};

export default async function EmployeesPage() {
  const employees = await employeesTableOrganizationDB();

    return (
        <div>
            <PageBreadcrumb pageTitle="Gestion des Employees" />
            <div className="space-y-6">
                <ComponentCard
                    title="Employees"
                    actions={
                        <div className="flex items-center space-x-2">
                            <CreateEmployeeFormModal />
                        </div>
                    }
                >
                    <TableEmployees employees={employees} />
                </ComponentCard>
            </div>
        </div>
    );
}
