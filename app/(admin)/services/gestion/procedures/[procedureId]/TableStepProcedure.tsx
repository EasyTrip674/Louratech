"use client";
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
import { Eye, Clock, CheckCircle, AlertCircle, Edit, Trash } from "lucide-react";
import { ProcedureWithStepsDb } from "@/db/queries/procedures.query";
import EditStepFormModal from "./steps/step/edit/EditStepFormModal";



type TableProcedureStepsProps = {
  procedureDetails: ProcedureWithStepsDb;
  readOnly?: boolean;
};

export default function TableProcedureSteps({
  procedureDetails,
  readOnly = false
}: TableProcedureStepsProps) {
  if (!procedureDetails || !procedureDetails.steps) return null;

  // Sort steps by order
  const sortedSteps = [...procedureDetails?.steps].sort((a, b) => Number(a.createdAt) - Number(b.createdAt));

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ordre
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nom
                </TableCell>
              
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Coût du module
                </TableCell>
              
                {!readOnly && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {sortedSteps.map((step) => (
                <TableRow key={step.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {step.order}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {step.name}
                    </span>
                  </TableCell>
                 
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {step.price !== null ? `${step.price.toLocaleString()} FNG` : '-'}
                  </TableCell>
                 
                  {!readOnly && (
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-2">
                       <EditStepFormModal 
                          procedureId={step.procedureId} 
                          stepId={step.id} 
                          name={step.name} 
                          description={step.description} 
                          estimatedDuration={step.estimatedDuration}
                          price={step.price}
                          order={step.order} 
                          />
                          <Button
                          variant="outline"
                          size="sm"
                          href={`/services/gestion/procedures/${step.procedureId}/steps/step/${step.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
