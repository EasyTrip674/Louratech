import { getTransactionById } from "@/db/queries/finances.query";
import TransactionDetails from "./DetailsTransaction";

export default async function TransactionDetailsLayout({
    transactionId,
    }: {
    transactionId: string 
    }) {

    const transaction = await getTransactionById(transactionId);
    if (!transaction) {
        return <div>Transaction non trouvée</div>;
    }
    return (
      <TransactionDetails baseTransaction={transaction} />
    );
}