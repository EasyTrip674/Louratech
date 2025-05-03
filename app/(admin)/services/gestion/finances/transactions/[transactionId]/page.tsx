import { Suspense } from "react";
import TransactionDetailsLayout from "./DetailsTransactionLayout";
import TransactionDetailsSkeleton from "./TransactionDetailsSkeleton";

export default async function TransactionDetailsPage({
    params,
    }: {
    params: { transactionId: string };
}) {

    const transactionId = params.transactionId;

return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Transaction</h1>
      <p className="text-gray-500">
        Détails de la transaction
      </p>
     <Suspense fallback={<TransactionDetailsSkeleton />}>
      <TransactionDetailsLayout transactionId={transactionId} />
     </Suspense>
    </div>
  );
}