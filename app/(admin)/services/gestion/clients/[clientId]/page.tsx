import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { clientProfileDB } from "@/db/queries/clients.query";
import ClientInfoCard from "./ClientInfoCard";
import UserCredentialsManage from "@/components/user/ChangePasswordFormModal";
import UserProfileCard from "../../../../../../components/user/UserProfileCard";
import { Role } from "@prisma/client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
    title: "Client",
    description: "Client page",
    // other metadata
};

export default async function Profile(
    {params:{clientId}}: {params: {clientId: string}}

) {

   const client = await clientProfileDB(clientId);

    if (!client) {
        return notFound();
    }

  return (
    <div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Client
        </h3>
        <div className="space-y-6">

          <UserProfileCard 
            role={Role.CLIENT}
            email={client.user.email}
            firstName={client.user.firstName || ""}
            lastName={client.user.lastName || ""}
            phone={client.phone || ""}
            address={client.address || ""}
            imageSrc={""}
           />
          <ClientInfoCard client={client} />
          <UserCredentialsManage
           role={Role.CLIENT}
           userId={client.user.id} email={client.user.email} active={client.user.active} />
        </div>
      </div>
    </div>
  );
}
