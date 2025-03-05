import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons";
import { Metadata } from "next";
import React from "react";
import TableEmployees from "./TableEmployees";
// import CreateEmployeeFormModal from "./create/CreateEmployeeFormModal";
import Button from "@/components/ui/button/Button";
import CreateEmployeeFormModal from "./create/CreateEmployeeFormModal";

export const metadata: Metadata = {
    title: "Employees",
    description: "Gestion des Employees de l'entreprise",
    // other metadata
};

export default function EmployeesPage() {
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
                    <TableEmployees />
                </ComponentCard>
            </div>
        </div>
    );
}
