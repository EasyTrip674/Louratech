"use client";
import React from "react";
import { clientProfileDB } from "@/db/queries/clients.query";
import EditClientFormModal from "../edit/EditClientFormModal";

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

export default function ClientInfoCard({ client }: { client: clientProfileDB }) {

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
              value={client?.user.firstName} 
            />

            <UserElementInfo 
              label="Last Name" 
              value={client?.user.lastName} 
            />

            <UserElementInfo 
              label="Email address" 
              value={client?.user.email} 
            />

            <UserElementInfo 
              label="Phone" 
              value={client?.phone} 
            />

            <UserElementInfo 
              label="Birth Date" 
              value={client?.birthDate?.toLocaleDateString()} 
            />

            <UserElementInfo 
              label="Passport" 
              value={client?.passport} 
            />

            <UserElementInfo 
              label="Father's Name" 
              value={`${client?.fatherFirstName} ${client?.fatherLastName}`} 
            />

            <UserElementInfo 
              label="Mother's Name" 
              value={`${client?.motherFirstName} ${client?.motherLastName}`} 
            />

            <UserElementInfo 
              label="Address" 
              value={client?.address} 
            />
          </div>
        </div>

        <EditClientFormModal client={client} inPageProfile={true} />
      
      </div>

    </div>
  );
}