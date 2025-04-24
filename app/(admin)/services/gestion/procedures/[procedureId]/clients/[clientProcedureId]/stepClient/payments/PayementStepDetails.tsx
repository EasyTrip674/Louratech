import {  Info, FileText, CreditCard, Calendar, Clock, Receipt, Plus, CircleCheckIcon, ChevronRight, AlertCircle, DockIcon, Download } from "lucide-react";
import { InvoiceStatus, PaymentMethod, StepStatus, TransactionStatus } from "@prisma/client";
import { formatDate } from "@fullcalendar/core/index.js";
import { getClientStepPaymentInfo } from "@/db/queries/procedures.query";
import { Suspense } from "react";
import CreateTransactionModalStep from "./transactions/CreateTransactionModalStep";
import ApprovedTransactionModal from "./transactions/ApprovedTransactionModal";
import DownloadPdf from "@/components/pdf/DowloadPdf";

// Types pour les données de facturation liées à un ClientStep
interface PaymentInfoModalProps {
  clientStepId: string;
  stepName: string;
  clientName: string;
  procedureName: string;
}

export default async function PaymentStepDetails({
  clientStepId,
  stepName,
  clientName,
  procedureName,
}: PaymentInfoModalProps) {

  // Récupération des données de paiement
  const data = await getClientStepPaymentInfo(clientStepId);
  
  // Formatage pour affichage de la monnaie
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', { style: 'currency', currency: 'GNF' }).format(amount);
  };

  // Calcul du montant total payé et du montant restant à payer
  const allTransactions = data.transactions;
  const totalPaid = allTransactions.reduce((acc, transaction) => 
    transaction.status === "APPROVED" ? acc + transaction.amount : acc, 0);
  const remainingAmount = (data?.clientStep?.price ?? 0) - totalPaid;
  type Status = InvoiceStatus | TransactionStatus | StepStatus

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusColor = (status:Status) => {
    const statusColors = {
      // Statuts de facture
      DRAFT: "bg-gray-100 text-gray-800 border border-gray-200",
      SENT: "bg-blue-50 text-blue-700 border border-blue-100",
      PARTIALLY_PAID: "bg-amber-50 text-amber-700 border border-amber-100",
      PAID: "bg-emerald-50 text-emerald-700 border border-emerald-100",
      OVERDUE: "bg-rose-50 text-rose-700 border border-rose-100",
      CANCELLED: "bg-slate-50 text-slate-700 border border-slate-100",
      
      // Statuts de transaction
      PENDING: "bg-amber-50 text-amber-700 border border-amber-100",
      APPROVED: "bg-emerald-50 text-emerald-700 border border-emerald-100",
      REJECTED: "bg-rose-50 text-rose-700 border border-rose-100",
    };
    
    return statusColors[status] || "bg-gray-50 text-gray-700 border border-gray-200";
  };

  // Traduction des statuts pour l'affichage
  const translateStatus = (status: string) => {
    const translations = {
      // Statuts de facture
      DRAFT: "Brouillon",
      SENT: "Envoyée",
      PARTIALLY_PAID: "Partiellement payée",
      PAID: "Payée",
      OVERDUE: "En retard",
      CANCELLED: "Annulée",
      
      // Statuts de transaction
      PENDING: "En attente",
      APPROVED: "Approuvée",
      REJECTED: "Rejetée",
      
      // Statuts des étapes client
      COMPLETED: "Complétée",
      IN_PROGRESS: "En cours",
      WAITING: "En attente",
      SKIPPED: "Ignorée",
      FAILED: "Échouée"
    };
    
    return translations[status] || status;
  };

  // Traduction des méthodes de paiement
  const translatePaymentMethod = (method: PaymentMethod) => {
    const translations = {
      CASH: "Espèces",
      BANK_TRANSFER: "Virement bancaire",
      CREDIT_CARD: "Carte bancaire",
      CHECK: "Chèque",
      MOBILE_PAYMENT: "Paiement mobile",
    };
    
    return translations[method] || method;
  };

  // Icon pour les méthodes de paiement
  const getPaymentMethodIcon = (method: PaymentMethod) => {
    const methodIcons = {
      CASH: <Receipt className="h-4 w-4" />,
      BANK_TRANSFER: <CreditCard className="h-4 w-4" />,
      CREDIT_CARD: <CreditCard className="h-4 w-4" />,
      CHECK: <FileText className="h-4 w-4" />,
      MOBILE_PAYMENT: <Calendar className="h-4 w-4" />,
    };
    
    return methodIcons[method] || <Receipt className="h-4 w-4" />;
  };

  // Formatage des dates
  const formatReadableDate = (date: Date | string | undefined) => {
    if (!date) return "-";
    return formatDate(String(date), { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Chargement des données...</span>
      </div>
    }>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        {/* Header avec infos principales */}
        <div className="bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/5 p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            Informations de paiement
            <span className="ml-2 text-xs font-normal px-2 py-1 rounded-full bg-primary/10 text-primary">
              Étape {stepName}
            </span>
          </h3>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <Info className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
              Client: <span className="ml-1 font-semibold">{clientName}</span>
            </div>
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <FileText className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
              Procédure: <span className="ml-1 font-semibold">{procedureName}</span>
            </div>
          </div>
        </div>
        
        {data && (
          <div className="p-6 space-y-6">
            {/* Informations principales - statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                  <Receipt className="h-4 w-4 mr-1.5 text-primary/70" />
                  Prix de l&apos;étape
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(data.clientStep.price || 0)}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                  <CircleCheckIcon className="h-4 w-4 mr-1.5 text-emerald-500" />
                  Déjà payé
                </p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPaid)}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1.5 text-amber-500" />
                  Reste à payer
                </p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(Math.max(remainingAmount,0))}</p>
                {remainingAmount <= 0 && (
                  <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                    <CircleCheckIcon className="h-3 w-3 mr-1" />
                    Entièrement payé
                  </span>
                )}
              </div>
            </div>
            
            {/* Transactions */}
            {data.transactions && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                  <h4 className="text-base font-semibold flex items-center text-gray-700 dark:text-gray-200">
                    <CreditCard className="h-4 w-4 mr-2 text-primary" />
                    Transactions associées
                    <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {data.transactions.length}
                    </span>
                  </h4>
                  <CreateTransactionModalStep clientStepId={clientStepId} haveToPay={remainingAmount > 0 ? remainingAmount : 0} />
                </div>
                
                {data.transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700/60">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Date</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Montant</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Méthode</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Statut</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Référence</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Approuvée par</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Date d&apos;approbation</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Facture</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {data.transactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatReadableDate(transaction.date)}</td>
                            <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{formatCurrency(transaction.amount)}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                              <div className="flex items-center">
                                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-700 mr-2">
                                  {getPaymentMethodIcon(transaction.paymentMethod)}
                                </span>
                                {translatePaymentMethod(transaction.paymentMethod)}
                              </div>
                            </td>
                            <td className="px-4 py-3 flex items-center text-gray-700 dark:text-gray-300 flex-col">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                {translateStatus(transaction.status)}
                              </span>
                            <ApprovedTransactionModal transactionId={transaction.id}
                               status={transaction.status}
                              amount={transaction.amount}
                              paymentMethod={transaction.paymentMethod}
                              date={formatReadableDate(transaction.date)}
                            />
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono text-xs">{transaction.reference || "-"}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                              {transaction.approvedBy ? (
                                <div className="flex items-center">
                                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary mr-2">
                                    {transaction?.approvedBy?.firstName?.charAt(0)}{transaction?.approvedBy?.lastName?.charAt(0)}
                                  </div>
                                  <span>{transaction.approvedBy.firstName} {transaction.approvedBy.lastName}</span>
                                </div>
                              ) : "-"}
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatDate(String(transaction.approvedAt)) ?? "-"} </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300 cursor-pointer">
                            <DownloadPdf transaction={transaction} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                      <CreditCard className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Aucune transaction</h3>
                    <p className="text-gray-400 dark:text-gray-500 text-xs max-w-sm mx-auto mb-4">
                      Aucune transaction n&apos;a encore été enregistrée pour cette étape de procédure.
                    </p>
                  </div>
                )}
              </div>
            )}

         
          </div>
        )}
      </div>
    </Suspense>
  );
}