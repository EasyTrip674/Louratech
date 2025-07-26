// import DataReadCopilot from "@/ai/DataReadCopilot";
import AdminLayout from "@/context/AdminLayout";
// import { getAISnapshot } from "@/db/queries/ai.query";
// import { getOrgnaizationId } from "@/db/queries/utils.query";
import React from "react";

export default async function AdminLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
    // const organisationId = await getOrgnaizationId()
    // const dataAi = await getAISnapshot(organisationId)
  return (
   <AdminLayout>
      {/* <DataReadCopilot data={dataAi}/> */}
    {children}
   </AdminLayout>
  );
}
