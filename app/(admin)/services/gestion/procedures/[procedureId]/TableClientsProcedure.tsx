import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import Badge from "@/components/ui/badge/Badge";
import { 
  Eye, 
  Clock, 
  CheckCircle, 
  FileText, 
  User, 
  Calendar, 
  AlertCircle, 
  Search,
  ChevronRight
} from "lucide-react";
import { procedureDetailsDb } from "@/db/queries/procedures.query";
import Link from "next/link";
import { calculateProgress } from "@/lib/utils";

type TableClientsProcedureProps = {
  procedureDetails: procedureDetailsDb;
  showProgress?: boolean;
  showDates?: boolean;
  showInvoice?: boolean;
}

// Helper function to format dates
const formatDate = (dateString: string | null | Date) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

// Helper function to get step status badge
const getStepStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return <Badge color="success">Terminée</Badge>;
    case "IN_PROGRESS":
      return <Badge color="info">En cours</Badge>;
    case "FAILED":
      return <Badge color="error">Échouée</Badge>;
    case "PENDING":
      return <Badge color="info">En attente</Badge>;
    case "NOT_STARTED":
      return <Badge color="primary">Non démarrée</Badge>;
    case "ON_HOLD":
      return <Badge color="warning">En pause</Badge>;
    default:
      return <Badge>Inconnue</Badge>;
  }
};

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "IN_PROGRESS":
    case "PENDING":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "NOT_STARTED":
      return <Calendar className="w-4 h-4 text-purple-500" />;
    case "ON_HOLD":
      return <AlertCircle className="w-4 h-4 text-amber-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

// Helper function to get invoice status color and label
const getInvoiceStatus = (status: string) => {
  switch (status) {
    case "PAID": 
      return { color: "success", label: "Payée" };
    case "PARTIALLY_PAID": 
      return { color: "warning", label: "Partiellement" };
    case "OVERDUE": 
      return { color: "error", label: "En retard" };
    case "SENT": 
      return { color: "primary", label: "Envoyée" };
    case "DRAFT": 
      return { color: "secondary", label: "Brouillon" };
    default: 
      return { color: "secondary", label: status };
  }
};

// Calculate procedure progress

export default function TableClientsProcedure({ 
  procedureDetails,
  showDates = true,
  showInvoice = true,
  showProgress = true
}: TableClientsProcedureProps) {
  if (!procedureDetails || !procedureDetails.clientProcedures) return null;
  
  const clientProcedures = procedureDetails.clientProcedures;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Search and filter section */}
      <div className="p-4 border-b border-gray-100 dark:border-white/[0.05] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="font-medium text-gray-800 dark:text-white/90">
          {clientProcedures.length} client{clientProcedures.length !== 1 ? 's' : ''} dans cette procédure
        </h3>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un client..." 
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
            />
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-800/50">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Client
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Modules
                  </div>
                </TableCell>
              
                {showProgress && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Progression
                    </div>
                  </TableCell>
                )}
              
                {showDates && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Dates
                    </div>
                  </TableCell>
                )}
                {showInvoice && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Facture
                    </div>
                  </TableCell>
                )}
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {clientProcedures.map((clientProc) => {
                const progress = calculateProgress(clientProc.steps);
                
                return (
                  <TableRow 
                    key={clientProc.id}
                    className="hover:bg-gray-50 transition-colors dark:hover:bg-white/[0.02]"
                  >
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <span className="font-medium text-purple-600 dark:text-purple-400">
                            {clientProc.client.user.firstName?.charAt(0)}{clientProc.client.user.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {clientProc.client.user.lastName} {clientProc.client.user.firstName}
                          </span>
                          <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                            {clientProc.client.user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-col space-y-2 max-h-40 overflow-y-auto pr-2">
                        {clientProc.steps.map((stepClient) => (
                          <div key={stepClient.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                            {getStatusIcon(stepClient.status)}
                            <span className="font-medium">{stepClient.step.name}</span>
                            <div className="ml-auto">
                              {getStepStatusBadge(stepClient.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                
                    {showProgress && (
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="w-full">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{progress}% complété</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                            <div 
                              className={`h-2 rounded-full ${
                                progress === 100 ? 'bg-green-500' : 
                                progress > 50 ? 'bg-blue-500' : 
                                progress > 25 ? 'bg-amber-500' : 'bg-purple-500'
                              }`} 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                    )}
                
                    {showDates && (
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex flex-col space-y-2 max-h-40 overflow-y-auto pr-2">
                          {clientProc.steps.map((stepClient) => (
                            <div key={`${stepClient.id}-dates`} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg dark:bg-gray-800/50 text-xs">
                              <span className="font-medium">{stepClient.step.name.substring(0, 15)}{stepClient.step.name.length > 15 ? '...' : ''}</span>
                              <div className="flex items-center gap-1">
                                <span>{formatDate(stepClient?.startDate)}</span>
                                {stepClient.status === "COMPLETED" && (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    )}
                    
                    {showInvoice && (
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {clientProc.invoice ? (
                          <div className="flex flex-col p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">#{clientProc.invoice.invoiceNumber}</span>
                              <Badge color={getInvoiceStatus(clientProc.invoice.status).color}>
                                {getInvoiceStatus(clientProc.invoice.status).label}
                              </Badge>
                            </div>
                            <div className="text-lg font-bold text-gray-800 dark:text-white">
                              {clientProc.invoice.totalAmount.toLocaleString()} €
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                            <span className="text-gray-400">Aucune facture</span>
                          </div>
                        )}
                      </TableCell>
                    )}
                    
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center">
                        <Link 
                          href={`/services/gestion/procedures/${clientProc.procedureId}/clients/${clientProc.id}`}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition-colors dark:bg-purple-700 dark:hover:bg-purple-800"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Détails
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {clientProcedures.length === 0 && (
        <div className="p-8 text-center">
          <div className="mb-4 flex justify-center">
            <AlertCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">
            Aucun client enregistré
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Cette procédure n&apos;a pas encore de clients associés. Veuillez ajouter des clients pour commencer.
          </p>
        </div>
      )}
    </div>
  );
}