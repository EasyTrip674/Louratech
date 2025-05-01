"use client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./PdfInvoice";
import { ClientStepPaymentInfo } from "@/db/queries/procedures.query";
import { PropsWithChildren } from "react";
import { getTransactionsDB } from "@/db/queries/finances.query";

export default function DownloadPdf(
  {transaction,canReadInvoice=false, children}:PropsWithChildren<{  transaction: ClientStepPaymentInfo["transactions"][0] | getTransactionsDB[0] , canReadInvoice?: boolean }>
) {
 
  if (!transaction || !canReadInvoice) {
    return null;
  }

  return (
    <PDFDownloadLink
    document={
      <InvoicePDF
       transaction={transaction}
      />
    }
    fileName={`${transaction.clientProcedure?.client.user.firstName}${transaction?.clientProcedure?.client.user.lastName}${transaction.id}.pdf`}
    className="text-white font-medium py-2 px-4 rounded"
  >
   {children}
    
    
  </PDFDownloadLink>
  );
}