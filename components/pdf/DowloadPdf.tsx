"use client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./PdfInvoice";
import { ClientStepPaymentInfo } from "@/db/queries/procedures.query";
import { Download } from "lucide-react";

export default function DownloadPdf(
  {transaction}:{  transaction: ClientStepPaymentInfo["transactions"][0] }
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
    {({ loading }) =>
    loading ? (
      <div className="flex items-center dark:text-white text-gray-500 hover:text-brand-600" >
        <Download className="animate-spin mr-2" />
        Generer PDF...
      </div>
    ) : (
      <div className="flex items-center dark:text-white text-gray-500 hover:text-brand-600" >
        <Download className="mr-2" />
        facture
      </div>
    )
    }
  </PDFDownloadLink>
  );
}