import { getTransactionsDB } from "@/db/queries/finances.query";
import FilteredTransactions from "./FilterTransactions";

export default async function FinancesPage() {
  const transactions = await getTransactionsDB();
  return (
    <FilteredTransactions transactions={transactions} />
  );
}