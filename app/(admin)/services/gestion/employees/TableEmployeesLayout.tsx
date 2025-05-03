import { Metadata } from "next";
import React from "react";
import TableEmployees from "./TableEmployees";
import { employeesTableOrganizationDB } from "@/db/queries/employees.query";

export const metadata: Metadata = {
    title: "Employees",
    description: "Gestion des Employees de l'entreprise",
    // other metadata
};

export default async function TableEmployeesLayout() {
  const employees = await employeesTableOrganizationDB();
    return (
      <TableEmployees employees={employees} />
    );
}
