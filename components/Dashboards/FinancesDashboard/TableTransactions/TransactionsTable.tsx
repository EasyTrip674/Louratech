"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { 
  Eye, 
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  SlidersHorizontal,
  Clock,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download
} from "lucide-react";
import Link from "next/link";
import { getTransactionsDB } from "@/db/queries/finances.query";
import { PaymentMethod, TransactionType } from "@prisma/client";
import { getStepStatusBadge } from "@/lib/StatusBadge";
import ApprovedTransactionModal from "../../../../app/(admin)/services/gestion/procedures/[procedureId]/clients/[clientProcedureId]/stepClient/payments/transactions/ApprovedTransactionModal";
import DownloadPdf from "@/components/pdf/DowloadPdf";
import { authClient } from "@/lib/auth-client";
import { formatAmount, formatDate } from "@/lib/utils";

// Composant pour afficher les transactions financières avec pagination
export const TransactionsTable = ({ transactions }: { transactions: getTransactionsDB }) => {
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  
  if(!transactions || transactions.length === 0) {
      return (
          <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Aucune transaction trouvée.</p>
          </div>
      );
  }

  // Calculer les indices pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  // Fonction pour changer de page
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Obtenir l'icône de type de transaction
  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case "REVENUE":
        return <ArrowUpCircle className="w-5 h-5 text-green-500" />;
      case "EXPENSE":
        return <ArrowDownCircle className="w-5 h-5 text-red-500" />;
      case "TRANSFER":
        return <ArrowUpCircle className="w-5 h-5 text-brand-500" rotate={90} />;
      default:
        return null;
    }
  };



  // Obtenir la classe de couleur pour le montant
  const getAmountClass = (type: TransactionType) => {
    return type === "EXPENSE" 
      ? "text-red-600 dark:text-red-400 font-medium" 
      : "text-green-600 dark:text-green-400 font-medium";
  };

  // Obtenir le nom de la méthode de paiement en français
  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method) {
      case "CASH": return "Espèces";
      case "BANK_TRANSFER": return "Virement";
      case "CREDIT_CARD": return "Carte bancaire";
      case "CHECK": return "Chèque";
      case "MOBILE_PAYMENT": return "Paiement mobile";
      default: return method;
    }
  };

  // const
  const session = authClient.useSession();


  return (
    <div className="max-w-full overflow-x-auto">
      <div className="min-w-[1102px]">
        <Table>
          {/* En-tête du tableau */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-800/50">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </div>
              </TableCell>
           {
                session?.data?.userDetails?.authorize?.canReadInvoice && (
                  <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Facture
                  </div>
                </TableCell>
                )
           }
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Statut
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Paiement
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                <div className="flex items-center gap-2">
                  Montant
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Corps du tableau */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentTransactions.map((transaction) => (
              <TableRow 
                key={transaction.id}
                className="hover:bg-gray-50 transition-colors dark:hover:bg-white/[0.02]"
              >
                <TableCell className="px-5 py-4 text-start">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {getTypeIcon(transaction.type)}
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {formatDate(transaction.date)}
                      </span>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {transaction.type === "EXPENSE" ? "Dépense" : "Revenu"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300">
                  <div>
                    <span className="font-medium">{transaction.description}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {transaction.type === "EXPENSE" 
                        ? transaction.expense?.vendor 
                        : transaction.revenue?.source}
                    </span>
                  </div>
                </TableCell>
               {
                session?.data?.userDetails?.authorize?.canReadInvoice && (
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:text-brand-500">
                    {/* {transaction.category?.name || "Non catégorisé"} */}
                    <DownloadPdf transaction={transaction} canReadInvoice={session?.data?.userDetails?.authorize?.canReadInvoice }>
                      <span className="flex items-center text-gray-500 dark:text-gray-400">
                      <Download className="w-4 h-4 mr-1" />
                      Télécharger
                      </span>
                    </DownloadPdf>
                  </div>
                </TableCell>
                )
               }
                <TableCell className="px-4 py-3 text-start">
                  {getStepStatusBadge(transaction.status)}
                  {
                    transaction.status === "PENDING" && (
                    <ApprovedTransactionModal transactionId={transaction.id}
                        status={transaction.status}
                       amount={transaction.amount}
                       paymentMethod={transaction.paymentMethod}
                       date={formatDate(transaction.date)}
                     />
                    )
                  }
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <span>{getPaymentMethodName(transaction.paymentMethod)}</span>
                  {transaction.reference && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Réf: {transaction.reference}
                    </div>
                  )}
                </TableCell>
                <TableCell className={`px-4 py-3 text-start text-lg ${getAmountClass(transaction.type)}`}>
                  {formatAmount(transaction.amount, transaction.type, session.data?.userDetails?.organization?.comptaSettings?.currency)}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center">
                    <Link 
                      href={`/services/gestion/finances/transactions/${transaction.id}`}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 focus:ring-4 focus:ring-brand-300 transition-colors dark:bg-brand-700 dark:hover:bg-brand-800"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Détails
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, transactions.length)} sur {transactions.length} transactions
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Afficher les pages autour de la page actuelle
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => paginate(pageNumber)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${
                        currentPage === pageNumber
                          ? "bg-brand-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};