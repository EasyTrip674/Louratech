import React, { Suspense } from "react";
import { StatClientProcedureLayout } from "@/components/Dashboards/ServiceClientDashboard/StatClientProcedure/StatClientProcudureLayout";
import StepsClientProcedureLayout from "@/components/Dashboards/ServiceClientDashboard/StepsClientProcedure/StepsClientProcedureLayout";
import { StatClientProcedureLayoutSkeleton } from "@/components/Dashboards/ServiceClientDashboard/StatClientProcedure/StatClientProcedureSkeleton";
import StepsClientProcedureSkeleton from "@/components/Dashboards/ServiceClientDashboard/StepsClientProcedure/StepsClientProcedureSkeleton";


export default async function ClientProcedurePage(props: {
  params: Promise<{ procedureId: string; clientProcedureId: string }>;
}) {
  const params = await props.params;
  const procedureId = params.procedureId;
  const clientProcedureId = params.clientProcedureId;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête de la page */}
        
      <Suspense fallback={<StatClientProcedureLayoutSkeleton />}>
        <StatClientProcedureLayout procedureId={procedureId} clientProcedureId={clientProcedureId} />
      </Suspense>
      {/* Liste des étapes en timeline */}
            
      <Suspense fallback={<StepsClientProcedureSkeleton />}>
        <StepsClientProcedureLayout procedureId={procedureId} clientProcedureId={clientProcedureId} />
      </Suspense>
  </div>
);
}