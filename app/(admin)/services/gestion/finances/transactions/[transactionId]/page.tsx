import { getTransactionById } from "@/db/queries/finances.query";
import TransactionDetails from "../DetailsTransaction";

export default async function TransactionDetailsPage({
    params,
    }: {
    params: { transactionId: string };
}) {

    const transactionId = params.transactionId;
    const transaction = await getTransactionById(transactionId);
    if (!transaction) {
        return <div>Transaction non trouvée</div>;
    }
return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Transaction</h1>
      <p className="text-gray-500">
        Détails de la transaction
      </p>
      <TransactionDetails baseTransaction={transaction} />
    </div>
  );
}