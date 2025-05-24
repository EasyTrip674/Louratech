"use employee";
import React from "react";
import { employeeProfileDB } from "@/db/queries/employees.query";
import EditEmployeeFormModal from "../edit/EditEmployeeFormModal";
import { Mail, User, User2 } from "lucide-react";

const UserElementInfo = ({ 
  label, 
  value, 
  icon 
}: { 
  label: string; 
  value?: string | null; 
  icon?: React.ReactNode;
}) => {
  if (!value) return null;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-100 bg-gray-50/50 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-white hover:shadow-sm dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-gray-700 dark:hover:bg-gray-800">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 flex-shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-400">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="break-words text-sm font-medium text-gray-900 dark:text-gray-100">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};


export default function EmployeetInfoCard({ employee, canEditAdmin = false }: { employee: employeeProfileDB ,canEditAdmin: boolean }) {

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <UserElementInfo 
              label="Prenom" 
              icon={<User />}
              value={employee?.user.firstName} 
            />

            <UserElementInfo 
              label="Nom" 
              icon={<User2 />}
              value={employee?.user.lastName} 
            />

            <UserElementInfo 
              icon={<Mail />}
              label="Email" 
              value={employee?.user.email} 
            />

            <UserElementInfo 
              label="Telephone" 
              value={employee?.phone} 
            />


            <UserElementInfo 
              label="Adresse" 
              value={employee?.address} 
            />
          </div>
        </div>

      {
        canEditAdmin && (
          <EditEmployeeFormModal admin={employee} inPageProfile={true} />
        ) 
      }
      </div>

    </div>
  );
}