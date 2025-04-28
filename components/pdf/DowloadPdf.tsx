"use client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./PdfInvoice";
import { ClientStepPaymentInfo } from "@/db/queries/procedures.query";
import { PropsWithChildren } from "react";

export default function DownloadPdf(
  {transaction,children}:PropsWithChildren<{  transaction: ClientStepPaymentInfo["transactions"][0] }>
) {
 
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