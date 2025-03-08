import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Eye, Clock, CheckCircle, AlertCircle } from "lucide-react";

type ClientProcedure = {
  id: string;
  status: string;
  startDate: string;
  completionDate: string | null;
  dueDate: string | null;
  reference: string;
  client: {
    id: string;
    user: {
      firstName: string | null;
      lastName: string;
      email: string;
      active: boolean;
    }
  };
  steps: {
    id: string;
    status: string;
    startDate: string | null;
    completionDate: string | null;
  }[];
  invoice: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    status: string;
  } | null;
  stepProgress: number;
};

type ProcedureDetails = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  estimatedDuration: number | null;
  category: string | null;
  isActive: boolean;
  steps: any[];
  clientProcedures: ClientProcedure[];
  totalClients: number;
  inProgressCount: number;
  completedCount: number;
  cancelledCount: number;
  totalRevenue: number;
  pendingRevenue: number;
};

type TableClientsProcedureProps = {
  procedureDetails: ProcedureDetails;
  showProgress?: boolean;
  showDates?: boolean;
  showInvoice?: boolean;
}

// Helper function to format dates
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};


// Fonction pour calculer le statut d'un paiement
function getPaymentStatus(status: string) {
  switch(status) {
    case 'PAID':
      return { text: 'Payée', color: 'success' };
    case 'PARTIALLY_PAID':
      return { text: 'Partiellement payée', color: 'warning' };
    case 'OVERDUE':
      return { text: 'En retard', color: 'error' };
    case 'SENT':
      return { text: 'Envoyée', color: 'info' };
    case 'DRAFT':
      return { text: 'Brouillon', color: 'default' };
    case 'CANCELLED':
      return { text: 'Annulée', color: 'error' };
    default:
      return { text: 'Inconnue', color: 'default' };
  }
}

// Fonction pour calculer le statut de la procédure
function getProcedureStatus(status: string)  {
  switch(status) {
    case 'NOT_STARTED':
      return { text: 'Non démarrée', color: 'primary' };
    case 'IN_PROGRESS':
      return { text: 'En cours', color: 'info' };
    case 'ON_HOLD':
      return { text: 'En attente', color: 'info' };
    case 'COMPLETED':
      return { text: 'Terminée', color: 'success' };
    case 'CANCELLED':
      return { text: 'Annulée', color: 'warning' };
    case 'REJECTED':
      return { text: 'Rejetée', color: 'error' };
    default:
      return { text: 'Inconnue', color: 'info' };
  }
}


// Helper function to get invoice status color
const getInvoiceStatusColor = (status: string) => {
  switch (status) {
    case "PAID": return "success";
    case "PARTIALLY_PAID": return "warning";
    case "OVERDUE": return "error";
    case "SENT": return "primary";
    case "DRAFT": return "secondary";
    default: return "secondary";
  }
};

export default function TableClientsProcedure({ 
  procedureDetails,
  showProgress = true,
  showDates = true,
  showInvoice = true 
}: TableClientsProcedureProps) {
  if (!procedureDetails || !procedureDetails.clientProcedures) return null;
  
  const clientProcedures = procedureDetails.clientProcedures;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Client
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Référence
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Statut
                </TableCell>
                {showProgress && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Progression
                  </TableCell>
                )}
                {showDates && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Dates
                  </TableCell>
                )}
                {showInvoice && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Facture
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
              {clientProcedures.map((clientProc) => (
                <TableRow key={clientProc.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {clientProc.client.user.lastName} {clientProc.client.user.firstName}
                    </span>
                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {clientProc.client.user.email}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {clientProc.reference}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={getProcedureStatus(clientProc.status).color}
                    >
                      {getProcedureStatus(clientProc.status).text}
                    </Badge>
                  </TableCell>
                  {showProgress && (
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                          <div 
                            className="h-2 rounded-full bg-blue-500" 
                            style={{ width: `${clientProc.stepProgress}%` }}
                          ></div>
                        </div>
                        <span>{clientProc.stepProgress}%</span>
                      </div>
                    </TableCell>
                  )}
                  {showDates && (
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Début: {formatDate(clientProc.startDate)}</span>
                        </div>
                        {clientProc.dueDate && (
                          <div className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>Échéance: {formatDate(clientProc.dueDate)}</span>
                          </div>
                        )}
                        {clientProc.completionDate && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Terminé: {formatDate(clientProc.completionDate)}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {showInvoice && (
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {clientProc.invoice ? (
                        <div className="flex flex-col">
                          <span>{clientProc.invoice.invoiceNumber}</span>
                          <span className="font-medium">{clientProc.invoice.totalAmount.toLocaleString()} FNG</span>
                          <Badge
                            size="sm"
                            color={getInvoiceStatusColor(clientProc.invoice.status)}
                          >
                            {clientProc.invoice.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      ) : (
                        <span>Non facturé</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Button 
                        href={`/procedures/clients/${clientProc.id}`} 
                        variant="outline" 
                        size="sm"
                      >
                        <Eye className="w-4 h-4 dark:text-white" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}