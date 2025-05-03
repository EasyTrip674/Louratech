"use client";

import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./PdfInvoice";
import { ClientStepPaymentInfo } from "@/db/queries/procedures.query";
import { PropsWithChildren } from "react";
import { getTransactionsDB } from "@/db/queries/finances.query";
import { PDFViewer } from "@react-pdf/renderer";

export default function DowloadPdf({
  transaction,
  canReadInvoice = false,
  children
}: PropsWithChildren<{
  transaction: ClientStepPaymentInfo["transactions"][0] | getTransactionsDB[0];
  canReadInvoice?: boolean;
}>) {
  const { isOpen, openModal, closeModal } = useModal();

  if (!transaction || !canReadInvoice) {
    return null;
  }

  const fileName = `${transaction.clientProcedure?.client.user.firstName}${transaction?.clientProcedure?.client.user.lastName}${transaction.id}.pdf`;

  return (
    <>
      <button
        onClick={openModal}
        className="text-brand-600 hover:text-brand-800 font-medium flex items-center"
      >
        {children || (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
            Aperçu de la facture
          </>
        )}
      </button>

      <Modal isOpen={isOpen} onClose={closeModal} className="w-full h-full m-0 p-0 max-w-none">
        <div className="no-scrollbar relative w-full h-screen overflow-y-auto bg-white dark:bg-gray-900 p-4 lg:p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              Aperçu de la facture
            </h4>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

        {/* prendre 90 de la high de screen */}
          <div className="w-full h-screen border border-gray-200 dark:border-gray-700 rounded-lg">
            <PDFViewer width="100%" height="100%" className="rounded-lg">
              <InvoicePDF transaction={transaction} />
            </PDFViewer>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Fermer
            </Button>
            <PDFDownloadLink
              document={<InvoicePDF transaction={transaction} />}
              fileName={fileName}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-600 bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 hover:border-brand-700"
            >
              {({ loading }) =>
                loading ? "Chargement..." : "Télécharger la facture"
              }
            </PDFDownloadLink>
          </div>
        </div>
      </Modal>
    </>
  );
}