import { getProcedureDetails } from "@/db/queries/procedures.query";
import { auth } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, Clock, CreditCard, Users } from "lucide-react";
import { headers } from "next/headers";
import { StatCard } from "@/components/ui/stat-card";

export default async function StatsService(
{procedureId}: { procedureId: string },
) {

  const procedure = await getProcedureDetails(procedureId);
  const serverSession = await auth.api.getSession({
    headers: await headers()
  })

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          color="blue"
          label="Total Clients"
          value={procedure?.totalClients ?? 0}
        />

        <StatCard
          icon={Clock}
          color="amber"
          label="En cours"
          value={procedure?.inProgressCount ?? 0}
        />

        <StatCard
          icon={CheckCircle}
          color="green"
          label="Complétées"
          value={procedure?.completedCount ?? 0}
        />

        <StatCard
          icon={CreditCard}
          color="purple"
          label="Revenu total"
          value={formatCurrency(procedure?.totalRevenue ?? 0, serverSession?.userDetails?.organization?.comptaSettings?.currency)}
        />
      </div>
    )
}