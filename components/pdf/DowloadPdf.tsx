"use client";

import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./PdfInvoice";
import { ClientStepPaymentInfo } from "@/db/queries/procedures.query";
import { PropsWithChildren, useState } from "react";
import { getTransactionsDB } from "@/db/queries/finances.query";
import { PDFViewer } from "@react-pdf/renderer";

export default function DownloadPdf({
  transaction,
  canReadInvoice = false,
  children
}: PropsWithChildren<{
  transaction: ClientStepPaymentInfo["transactions"][0] | getTransactionsDB[0];
  canReadInvoice?: boolean;
}>) {
  const { isOpen, openModal, closeModal } = useModal();
  const [scale, setScale] = useState(1);

  if (!transaction || !canReadInvoice) {
    return null;
  }

  const fileName = `${transaction.clientProcedure?.client.firstName}${transaction?.clientProcedure?.client.lastName}${transaction.id}.pdf`;

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.25, 0.5));
  };

  const handleReset = () => {
    setScale(1);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="text-brand-600 hover:text-brand-800 font-medium flex items-center transition-all duration-300 hover:scale-105"
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
        <div className="no-scrollbar relative w-full h-screen overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 lg:p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center">
              <svg 
                className="w-6 h-6 mr-2 text-brand-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Aperçu de la facture
            </h4>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
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

          <div className="flex justify-center mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleZoomOut} 
                className="p-2 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                </svg>
              </button>
              <div className="bg-white dark:bg-gray-700 px-3 py-1 rounded-md shadow-sm">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(scale * 100)}%</span>
              </div>
              <button 
                onClick={handleZoomIn}
                className="p-2 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
              <button 
                onClick={handleReset}
                className="p-2 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="w-full h-3/4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300"
               style={{ transformOrigin: 'center', transform: `scale(${scale})` }}>
            <PDFViewer 
              width="100%" 
              height="100%" 
              className="rounded-lg"
            >
              <InvoicePDF transaction={transaction} />
            </PDFViewer>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <div className="flex items-center mr-4 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Facture #{transaction.reference}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={closeModal}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Fermer
              </Button>
              <PDFDownloadLink
                document={<InvoicePDF transaction={transaction} />}
                fileName={fileName}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-600 bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 hover:border-brand-700 transition-all duration-300"
              >
                {({ loading }) =>
                  loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Préparation...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                      <span>Télécharger la facture</span>
                    </>
                  )
                }
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}