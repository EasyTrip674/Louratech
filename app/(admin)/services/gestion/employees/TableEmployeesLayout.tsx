import { Metadata } from "next";
import React from "react";
import TableEmployees from "./TableEmployees";
import { employeeService } from "@/lib/services";

export const metadata: Metadata = {
    title: "Employees",
    description: "Gestion des Employees de l'entreprise",
};

export default async function TableEmployeesLayout() {
  const employees = await employeeService.getAllEmployees();
  return <TableEmployees employees={employees} />;
}
