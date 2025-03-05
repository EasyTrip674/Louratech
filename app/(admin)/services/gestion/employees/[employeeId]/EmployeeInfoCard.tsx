"use employee";
import React from "react";
import { employeeProfileDB } from "@/db/queries/employees.query";
import EditEmployeeFormModal from "../edit/EditEmployeeFormModal";

const UserElementInfo = ({ label, value }: { label: string, value?: string | null }) => {
  return (
    value ?   
      <div>
        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
          {value}
        </p>
      </div>
    : null
  );
};

export default function EmployeetInfoCard({ employee }: { employee: employeeProfileDB }) {

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <UserElementInfo 
              label="First Name" 
              value={employee?.user.firstName} 
            />

            <UserElementInfo 
              label="Last Name" 
              value={employee?.user.lastName} 
            />

            <UserElementInfo 
              label="Email address" 
              value={employee?.user.email} 
            />

            <UserElementInfo 
              label="Phone" 
              value={employee?.phone} 
            />


            <UserElementInfo 
              label="Address" 
              value={employee?.address} 
            />
          </div>
        </div>

        <EditEmployeeFormModal admin={employee} inPageProfile={true} />
      
      </div>

    </div>
  );
}