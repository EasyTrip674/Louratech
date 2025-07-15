"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  FileText,
  User,
  Building,
  Clock,
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Download,
  CheckCircle,
  XCircle,
  CreditCard,
  Tag,
  Receipt,
  Link as LinkIcon,
  Paperclip,
  FileCheck,
} from "lucide-react";
import { formatAmount, formatDate } from "@/lib/utils";
import {
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import { getTransactionById } from "@/db/queries/finances.query";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import DownloadPdf from "@/components/pdf/DowloadPdf";
import { authClient } from "@/lib/auth-client";
import BackButton from "@/layout/BackButton";

// Composant pour afficher les détails d'une transaction
export default function TransactionDetails(
  { baseTransaction }: { baseTransaction: getTransactionById }
) {
  const router = useRouter();
  const [transaction] = React.useState<getTransactionById>(baseTransaction);
  const [error] = React.useState<string | null>(null);
  const session = authClient.useSession();

  if (error || !transaction) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {error || "Transaction introuvable"}
        </h1>
        <Button  onClick={() => router.push("/finances/transactions")}>
          Retour aux transactions
        </Button>
      </div>
    );
  }

  // Obtenir l'icône de type de transaction
  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case "REVENUE":
        return <ArrowUpCircle className="w-6 h-6 text-green-500" />;
      case "EXPENSE":
        return <ArrowDownCircle className="w-6 h-6 text-red-500" />;
      case "TRANSFER":
        return <ArrowUpCircle className="w-6 h-6 text-brand-500" rotate={90} />;
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
      case "CASH":
        return "Espèces";
      case "BANK_TRANSFER":
        return "Virement";
      case "CHECK":
        return "Chèque";
      case "MOBILE_PAYMENT":
        return "Paiement mobile";
      default:
        return method;
    }
  };

  // Obtenir le badge de statut
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 inline-flex items-center px-3 py-1">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 inline-flex items-center px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approuvée
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 inline-flex items-center px-3 py-1">
            <XCircle className="w-3 h-3 mr-1" />
            Rejetée
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 inline-flex items-center px-3 py-1">
            <XCircle className="w-3 h-3 mr-1" />
            Annulée
          </Badge>
        );
      default:
        return null;
    }
  };

  // Obtenir le libellé du type de transaction en français
  const getTransactionTypeLabel = (type: TransactionType) => {
    switch (type) {
      case "EXPENSE":
        return "Dépense";
      case "REVENUE":
        return "Revenu";
      case "TRANSFER":
        return "Transfert";
      default:
        return type;
    }
  };

  // const session = authClient.useSession();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-12">
      {/* Header avec statut et actions */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          {/* <Link
            href="/services/gestion/finances"
            className="inline-flex items-center text-brand-600 hover:text-brand-800 mb-4 text-xl font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour aux transactions
          </Link> */}

          <div className="py-4">
          <BackButton />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div className="flex items-center">
              <div className="mr-4">
                {getTypeIcon(transaction.type)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getTransactionTypeLabel(transaction.type)}{" "}
                  {transaction.reference ? `#${transaction.reference}` : ""}
                </h1>
                <div className="flex items-center mt-2 space-x-4">
                  {getStatusBadge(transaction.status)}
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(transaction.date)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              {transaction.status === "APPROVED" && (
                <>
                <DownloadPdf transaction={transaction} canReadInvoice={session?.data?.userDetails?.authorize?.canReadInvoice ?? false}>
                    <Button variant="outline" className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger la facture
                    </Button>
                </DownloadPdf>
                </>
              )}
            
            </div>
          </div>
        </div>
      </div>
      
      {/* Montant bien visible */}
      <div className="bg-white dark:bg-gray-800 shadow-sm mb-6">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 block">
                Montant total
              </span>
              <div className={`text-3xl font-bold ${getAmountClass(transaction.type)}`}>
              {formatAmount(transaction.amount, transaction.type, session.data?.userDetails?.organization?.comptaSettings?.currency)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 block">
                Méthode de paiement
              </span>
              <div className="flex items-center text-gray-800 dark:text-gray-200 font-medium">
                <CreditCard className="w-4 h-4 mr-2" />
                {getPaymentMethodName(transaction.paymentMethod)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations principales */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidiven">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-brand-500" />
                  Informations de la transaction
                </h2>
              </div>
              <div className="p-6">
                {transaction?.clientProcedure && 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-6">
                   <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      Client
                    </dt>
                    <div className="mt-1 text-gray-900 dark:text-white">
                        {transaction.clientProcedure.client.firstName} {transaction.clientProcedure.client.lastName}
                    </div>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      Email
                    </dt>
                    <div className="mt-1 text-gray-900 dark:text-white">
                        {transaction.clientProcedure.client.email}
                    </div>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      Service
                    </dt>
                    <div className="mt-1 text-gray-900 dark:text-white">
                        {transaction.clientProcedure.procedure.name} <br />
                    </div>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      Module
                    </dt>
                    <div className="mt-1 text-gray-900 dark:text-white">
                    {transaction.clientStep?.step.name}
                    </div>
                  </div>
                </div>
                }
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      Date
                    </dt>
                    <div className="mt-1 text-gray-900 dark:text-white">
                      {formatDate(transaction.date)}
                    </div>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-400" />
                      Description
                    </dt>
                    <div className="mt-1 text-gray-900 dark:text-white">
                      {transaction.description || "—"}
                    </div>
                  </div>

                  {transaction.category && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-gray-400" />
                        Catégorie
                      </dt>
                      <div className="mt-1">
                        <span className="px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-800 dark:text-brand-200 text-sm font-medium">
                          {transaction.category.name}
                        </span>
                      </div>
                    </div>
                  )}

                  {transaction.reference && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <Receipt className="w-4 h-4 mr-2 text-gray-400" />
                        Référence
                      </dt>
                      <div className="mt-1 text-gray-900 dark:text-white">
                        {transaction.reference}
                      </div>
                    </div>
                  )}

                  {transaction.type === "EXPENSE" && transaction.expense?.vendor && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        Fournisseur
                      </dt>
                      <div className="mt-1 text-gray-900 dark:text-white">
                        {transaction.expense.vendor}
                      </div>
                    </div>
                  )}

                  {transaction.type === "REVENUE" && transaction.revenue?.source && (
                    <div>
                      {/* description */}
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        Titre
                      </div>
                      <div className="mt-1 text-gray-900 dark:text-white">
                        {transaction.revenue.source}
                      </div>
                    </div>
                  )}

                  {transaction.type === "EXPENSE" && transaction.expense && (
                    <div>
                      {/* description */}
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        Titre
                      </div>
                      <div className="mt-1 text-gray-900 dark:text-white">
                        {transaction.expense.title}
                      </div>
                    </div>
                  )}
                </dl>
              </div>
            </div>
            
            {/* Information adivitionnelles basées sur le type */}
            {transaction.type === "EXPENSE" && transaction.expense && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidiven">
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <ArrowDownCircle className="w-5 h-5 mr-2 text-red-500" />
                    Détails de la dépense
                  </h2>
                </div>
                <div className="p-6">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {transaction.expense.invoiceNumber && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <Receipt className="w-4 h-4 mr-2 text-gray-400" />
                          Numéro de facture
                        </dt>
                        <div className="mt-1 text-gray-900 dark:text-white">
                          {transaction.expense.invoiceNumber}
                        </div>
                      </div>
                    )}
                    {transaction.expense.invoiceDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          Date de facture
                        </dt>
                        <div className="mt-1 text-gray-900 dark:text-white">
                          {formatDate(transaction.expense.invoiceDate)}
                        </div>
                      </div>
                    )}
                    {transaction.expense.dueDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          Date d&apos;échéance
                        </dt>
                        <div className="mt-1 text-gray-900 dark:text-white">
                          {formatDate(transaction.expense.dueDate)}
                        </div>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            )}

            {transaction.type === "REVENUE" && transaction.revenue && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidiven">
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <ArrowUpCircle className="w-5 h-5 mr-2 text-green-500" />
                    Détails du revenu
                  </h2>
                </div>
                <div className="p-6">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {transaction.revenue.referenceNumber && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <Receipt className="w-4 h-4 mr-2 text-gray-400" />
                          Numéro de référence
                        </dt>
                        <div className="mt-1 text-gray-900 dark:text-white">
                          {transaction.revenue.referenceNumber}
                        </div>
                      </div>
                    )}
                    {transaction.revenue.invoice && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-gray-400" />
                          Facture associée
                        </dt>
                        <div className="mt-1">
                          <Link
                            href={"#"}
                            // href={`/finances/invoices/${transaction.revenue.invoice.id}`}
                            className="text-brand-600 hover:text-brand-800 flex items-center"
                          >
                            <FileCheck className="w-4 h-4 mr-1" />
                            {transaction.revenue.invoice.invoiceNumber}
                          </Link>
                        </div>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            )}

            {/* Pièces jointes */}
            {transaction.attachments && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidiven">
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Paperclip className="w-5 h-5 mr-2 text-brand-500" />
                    Pièces jointes
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {transaction.attachments.split(",").map((url: string, index: number) => (
                      <a
                        key={index}
                        href={url.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mr-3">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            Pièce jointe {index + 1}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {url.split("/").pop()}
                          </p>
                        </div>
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-brand-500 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Entités liées */}
            {((transaction.clientProcedure || transaction.clientStep) && (session.data?.userDetails?.authorize?.canReadClientProcedure)) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidiven">
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <LinkIcon className="w-5 h-5 mr-2 text-brand-500" />
                    Entités liées
                  </h2>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {transaction.clientProcedure && (
                      <li>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                          Service
                        </span>
                        <Link
                          href={`/services/gestion/procedures/${transaction.clientProcedure.procedureId}/clients/${transaction.clientProcedure.id}`}
                          className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-brand-600 hover:text-brand-800"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">
                            {transaction.clientProcedure.procedure.name}
                          </span>
                        </Link>
                      </li>
                    )}
                    {transaction.clientStep && session.data.userDetails.authorize.canReadStep && (
                      <li>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                         Module
                        </span>
                        <Link
                          href={`/services/gestion/procedures/${transaction.clientProcedure?.procedureId}/steps/step/${transaction.clientStep.stepId}`}
                          className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-brand-600 hover:text-brand-800"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">
                            {transaction.clientStep.step?.name || "Étape"}
                          </span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Métadonnées */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidiven">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-brand-500" />
                  Informations de suivi
                </h2>
              </div>
              <div className="p-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Créée par
                    </dt>
                    <div className="mt-1 text-gray-900 dark:text-white flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mr-2">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-sm font-medium">
                          {transaction.createdBy?.name || "Utilisateur inconnu"}
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {transaction.approvedBy && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Approuvée par
                      </dt>
                      <div className="mt-1 text-gray-900 dark:text-white flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-2">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-sm font-medium">
                            {transaction.approvedBy?.name || "Utilisateur inconnu"}
                          </span>
                          <span className="block text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(String(transaction.approvedAt))}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}