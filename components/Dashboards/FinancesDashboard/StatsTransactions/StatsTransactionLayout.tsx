import { StatCard } from "@/components/ui/stat-card";
import { getTransactionsDB } from "@/db/queries/finances.query";
import { auth } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownCircle, ArrowUpCircle, CheckCircle } from "lucide-react";
import { headers } from "next/headers";

export default async function StatsTransactionLayout() {

const transactions = await getTransactionsDB();

const totalRevenues = transactions
.filter(t => t.type === "REVENUE" && t.status === "APPROVED")
.reduce((sum, t) => sum + t.amount, 0);

const totalExpenses = transactions
.filter(t => t.type === "EXPENSE" && t.status === "APPROVED")
.reduce((sum, t) => sum + t.amount, 0);

const balance = totalRevenues - totalExpenses;

const session = await auth.api.getSession({
  headers: await headers()
})


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        icon={ArrowUpCircle}
        color="green"
        label="Entrées"
        value={formatCurrency(totalRevenues, session?.userDetails?.organization?.comptaSettings?.currency)}
        subtitle="Total des revenus approuvés"
      />

      <StatCard
        icon={ArrowDownCircle}
        color="red"
        label="Sorties"
        value={formatCurrency(totalExpenses, session?.userDetails?.organization?.comptaSettings?.currency)}
        subtitle="Total des dépenses approuvées"
      />

      <StatCard
        icon={CheckCircle}
        color={balance >= 0 ? "green" : "red"}
        label="Balance"
        value={formatCurrency(balance, session?.userDetails?.organization?.comptaSettings?.currency)}
        subtitle="Différence entrées/sorties"
      />
    </div>
  );
}