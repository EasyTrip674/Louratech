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
import { procedureDetailsDb } from "@/db/queries/procedures.query";

type TableClientsProcedureProps = {
  procedureDetails: procedureDetailsDb;
  showProgress?: boolean;
  showDates?: boolean;
  showInvoice?: boolean;
}

// Helper function to format dates
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

// Helper function to get step status badge
const getStepStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return <Badge color="success">Terminée</Badge>;
    case "IN_PROGRESS":
    case "PENDING":
      return <Badge color="info">En cours</Badge>;
    case "NOT_STARTED":
      return <Badge color="primary">Non démarrée</Badge>;
    case "ON_HOLD":
      return <Badge color="warning">En attente</Badge>;
    default:
      return <Badge color="info">Inconnue</Badge>;
  }
};

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
                  modules
                </TableCell>
              
              
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
                    <div className="flex flex-col space-y-2">
                      {clientProc.steps.map((stepClient) => (
                        <div key={stepClient.id} className="flex items-center justify-between">
                          <span className="font-medium">{stepClient.step.name}</span>
                          {getStepStatusBadge(stepClient.status)}
                        </div>
                      ))}
                    </div>
                  </TableCell>
              
                  {showDates && (
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-col space-y-1">
                        {clientProc.steps.map((stepClient) => (
                          <div key={`${stepClient.id}-dates`} className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">Début: {formatDate(stepClient?.startDate)}</span>
                            </div>
                            {stepClient.completionDate && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span className="text-xs">Terminé: {formatDate(stepClient?.completionDate)}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  )}
                  {showInvoice && (
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {clientProc.invoice ? (
                        <div className="flex flex-col">
                          <span className="font-medium">#{clientProc.invoice.invoiceNumber}</span>
                          <div className="flex items-center gap-2">
                            <span>{clientProc.invoice.totalAmount.toLocaleString()} €</span>
                            <Badge color={getInvoiceStatusColor(clientProc.invoice.status) as any}>
                              {clientProc.invoice.status}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Aucune facture</span>
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