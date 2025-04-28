"use client";

import React from "react";
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
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { getTransactionsDB } from "@/db/queries/finances.query";
import { PaymentMethod, TransactionType } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { getStepStatusBadge } from "@/lib/StatusBadge";



// Composant pour afficher les transactions financières
export const TransactionsTable = ({ transactions }: { transactions: getTransactionsDB }) => {

    if(!transactions || transactions.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Aucune transaction trouvée.</p>
            </div>
        );
    }

  // Obtenir l'icône de type de transaction
  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case "REVENUE":
        return <ArrowUpCircle className="w-5 h-5 text-green-500" />;
      case "EXPENSE":
        return <ArrowDownCircle className="w-5 h-5 text-red-500" />;
      case "TRANSFER":
        return <ArrowUpCircle className="w-5 h-5 text-blue-500" rotate={90} />;
      default:
        return null;
    }
  };

  // Format du montant avec le signe approprié
  const formatAmount = (amount: number, type: TransactionType) => {
    const sign = type === "EXPENSE" ? "-" : "+";
    return `${sign} ${amount.toLocaleString('fr-FR')} FNG`;
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
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Catégorie
                </div>
              </TableCell>
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
            {transactions.map((transaction) => (
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
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-center">
                    {transaction.category?.name || "Non catégorisé"}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  {getStepStatusBadge(transaction.status)}
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
                  {formatAmount(transaction.amount, transaction.type)}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center">
                    <Link 
                      href={`/services/gestion/finances/transactions/${transaction.id}`}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
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
      </div>
    </div>
  );
};

// Bouton de création de dépense
export const CreateExpenseButton = () => {
  return (
    <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-colors dark:bg-red-700 dark:hover:bg-red-800">
      <ArrowDownCircle className="w-4 h-4 mr-2" />
      Créer une dépense
    </button>
  );
};


// Bouton de création de revenu
export const CreateRevenueButton = () => {
    return (
      <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors dark:bg-green-700 dark:hover:bg-green-800">
        <ArrowUpCircle className="w-4 h-4 mr-2" />
        Créer un revenu
      </button>
    );
  };