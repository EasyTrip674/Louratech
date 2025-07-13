"use client";
import React from "react";
import { clientProfileDB } from "@/lib/services/client.service";
import EditClientFormModal from "../edit/EditClientFormModal";
import { UserElementInfo } from "@/components/user/UserElementInfo";

export default function ClientInfoCard({ client, canEditCLient = false }: { client: clientProfileDB, canEditCLient?: boolean }) {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informations personnelles
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <UserElementInfo 
              label="Prénom" 
              value={client?.user.firstName} 
            />

            <UserElementInfo 
              label="Nom" 
              value={client?.user.lastName} 
            />

            <UserElementInfo 
              label="Adresse e-mail" 
              value={client?.user.email} 
            />

            <UserElementInfo 
              label="Téléphone" 
              value={client?.phone} 
            />

            <UserElementInfo 
              label="Date de naissance" 
              value={client?.birthDate?.toLocaleDateString()} 
            />

            <UserElementInfo 
              label="Passeport" 
              value={client?.passport} 
            />

            <UserElementInfo 
              label="Nom du père" 
              value={`${client?.fatherFirstName} ${client?.fatherLastName}`} 
            />

            <UserElementInfo 
              label="Nom de la mère" 
              value={`${client?.motherFirstName} ${client?.motherLastName}`} 
            />

            <UserElementInfo 
              label="Adresse" 
              value={client?.address} 
            />
          </div>
        </div>

        {
          canEditCLient && (
            <EditClientFormModal client={client} inPageProfile={true} />
          )
        }
      </div>
    </div>
  );
}
