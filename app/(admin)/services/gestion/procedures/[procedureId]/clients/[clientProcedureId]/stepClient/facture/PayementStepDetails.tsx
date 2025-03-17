
import {  Info, FileText, CreditCard, Calendar,  Clock, Receipt, Plus } from "lucide-react";
import { InvoiceStatus, PaymentMethod, TransactionStatus } from "@prisma/client";
import { formatDate } from "@fullcalendar/core/index.js";
import { getClientStepPaymentInfo } from "@/db/queries/procedures.query";
import { Suspense } from "react";
import Button from "@/components/ui/button/Button";

// Types pour les données de facturation liées à un ClientStep
interface PaymentInfoModalProps {
  clientStepId: string;
  stepName: string;
  clientName: string;
  procedureName: string;
}

// Interfaces pour les types de données à afficher


export default async function  PaymentStepDetails({
  clientStepId,
  stepName,
  clientName,
  procedureName
}: PaymentInfoModalProps) {

  // Récupération des données de paiement
  // Formatage pour affichage de la monnaie

  const data  = await getClientStepPaymentInfo(clientStepId);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', { style: 'currency', currency: 'GNF' }).format(amount);
  };

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusColor = (status: InvoiceStatus | TransactionStatus) => {
    const statusColors = {
      // Statuts de facture
      DRAFT: "bg-gray-200 text-gray-800",
      SENT: "bg-blue-100 text-blue-800",
      PARTIALLY_PAID: "bg-amber-100 text-amber-800",
      PAID: "bg-emerald-100 text-emerald-800",
      OVERDUE: "bg-rose-100 text-rose-800",
      CANCELLED: "bg-slate-100 text-slate-800",
      
      // Statuts de transaction
      PENDING: "bg-amber-100 text-amber-800",
      APPROVED: "bg-emerald-100 text-emerald-800",
      REJECTED: "bg-rose-100 text-rose-800",
    };
    
    return statusColors[status] || "bg-gray-100 text-gray-800";
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
    
        <div className="mb-6 border-b pb-4 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-1">
            Informations de paiement
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 flex flex-wrap gap-2">
            <span className="inline-flex items-center">
              <span className="font-medium mr-1">Client:</span> {clientName}
            </span>
            <span className="inline-flex items-center">
              <span className="font-medium mr-1">Procédure:</span> {procedureName}
            </span>
            <span className="inline-flex items-center">
              <span className="font-medium mr-1">Étape:</span> {stepName}
            </span>
          </p>
        </div>
        
        {data && (
          <div className="space-y-6">
            {/* Informations principales */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg shadow-sm">
              <h4 className="text-sm font-semibold mb-4 flex items-center text-gray-700 dark:text-gray-200">
                <Info className="h-4 w-4 mr-2 text-primary" />
                Informations principales
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Prix de l&apos;étape</p>
                  <p className="text-lg font-semibold text-primary">{formatCurrency(data.clientStep.price || 0)}</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Statut de paiement</p>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(data.clientStep.status)}`}>
                      {translateStatus(data.clientStep.status)}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date de complétion</p>
                  <p className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                    {formatReadableDate(data.clientStep.completionDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Factures */}
            {data.invoices && data.invoices.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg shadow-sm">
                <h4 className="text-sm font-semibold mb-4 flex items-center text-gray-700 dark:text-gray-200">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  Factures associées
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-700/60">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">N° Facture</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Montant</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Statut</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Date d&apos;émission</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Date d&apos;échéance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                      {data.invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                            <span className="flex items-center gap-1.5">
                              <Receipt className="h-4 w-4 text-gray-500" />
                              {invoice.invoiceNumber}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{formatCurrency(invoice.totalAmount)}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                              {translateStatus(invoice.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatReadableDate(invoice.issuedDate)}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gray-500" />
                              {formatReadableDate(invoice.dueDate)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )} 
            
            {/* Transactions */}
            {data.transactions && (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-semibold flex items-center text-gray-700 dark:text-gray-200">
                    <CreditCard className="h-4 w-4 mr-2 text-primary" />
                    Transactions associées
                  </h4>
                  <Button 
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Nouvelle transaction
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-700/60">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Date</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Montant</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Méthode de paiement</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Statut</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Référence</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Approuvée par</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Date d&apos;approbation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                      {data.transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatReadableDate(transaction.date)}</td>
                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{formatCurrency(transaction.amount)}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-white">{translatePaymentMethod(transaction.paymentMethod)}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {translateStatus(transaction.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{transaction.reference || "-"}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                            {transaction.approvedBy?.firstName} {transaction.approvedBy?.lastName}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatReadableDate(transaction.approvedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        </Suspense>
  );
}