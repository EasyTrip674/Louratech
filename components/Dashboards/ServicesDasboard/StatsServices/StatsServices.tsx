import prisma from "@/db/prisma";
import { getOrgnaizationId } from "@/db/queries/utils.query";
import { Backpack, FileCheck, Users } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";

export default async function StatsServices() {
  const organizationId = await getOrgnaizationId();

  const totalClients = await prisma.client.count({
    where: {
      organizationId,
    },
  });

  const pendingServices = await prisma.clientProcedure.count({
    where: {
      status: {
        in: ["IN_PROGRESS"],
      },
      procedure: {
        organizationId,
      },
    },
  });

  const finishServices = await prisma.clientProcedure.count({
    where: {
      status: {
        in: ["COMPLETED"],
      },
      procedure: {
        organizationId,
      },
    },
  });

  // taux de réussite
  const successRate = (finishServices / (pendingServices + finishServices) || 0) * 100;
  const formattedSuccessRate = successRate.toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={Users}
        color="blue"
        label="Total Clients"
        value={totalClients}
        badge="Total"
      />

      <StatCard
        icon={Backpack}
        color="green"
        label="Services actifs"
        value={pendingServices}
        badge="En cours"
      />

      <StatCard
        icon={FileCheck}
        color="amber"
        label="Terminées ce mois"
        value={finishServices}
        badge="Terminé"
      />

      <StatCard
        icon={FileCheck}
        color="purple"
        label="Taux de réussite"
        value={`${formattedSuccessRate}%`}
        badge="Taux"
        progressBar={Number(formattedSuccessRate)}
      />
    </div>
  );
}
