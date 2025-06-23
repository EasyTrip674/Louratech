"use client";

import React from "react";
import { CheckCircle, XCircle, Clock, Eye, Hammer } from "lucide-react";
import Link from "next/link";
import EditProcedureFormModal from "@/app/(admin)/services/gestion/procedures/[procedureId]/edit/CreateEditModalForm";

export const ProcedureCard = ({
  procedureId,
  title,
  totalClients = 0,
  inProgress = 0,
  completed = 0,
  failed = 0,
  className,
  description
}: {
  title?: string;
  totalClients?: number;
  change?: number;
  inProgress?: number;
  completed?: number;
  failed?: number;
  procedureId: string;
  className?: string;
  description?: string;
}) => {
  // Calculate completion rate
  const total = inProgress + completed + failed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800${className ? ` ${className}` : ""}`}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-brand-100 rounded-md dark:bg-brand-900/30">
            <Hammer className="text-brand-600 size-4 dark:text-brand-400" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 text-sm dark:text-white">
              {title}
            </h4>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-lg font-semibold text-brand-600 dark:text-brand-400">
                {typeof totalClients === 'number' ? totalClients.toLocaleString() : totalClients}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">clients</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
            {completionRate}%
          </span>
          <EditProcedureFormModal procedure={
            { procedureId: procedureId, name: title ?? "", description: description ?? "" }
          } />
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 dark:bg-gray-700">
        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${completionRate}%` }}></div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-amber-50 rounded-md dark:bg-amber-900/20">
          <Clock className="text-amber-500 size-3 mx-auto mb-1 dark:text-amber-400" />
          <div className="text-sm font-medium text-amber-700 dark:text-amber-300">{inProgress}</div>
          <div className="text-xs text-amber-600 dark:text-amber-400">En cours</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-md dark:bg-green-900/20">
          <CheckCircle className="text-green-500 size-3 mx-auto mb-1 dark:text-green-400" />
          <div className="text-sm font-medium text-green-700 dark:text-green-300">{completed}</div>
          <div className="text-xs text-green-600 dark:text-green-400">Terminés</div>
        </div>
        <div className="text-center p-2 bg-red-50 rounded-md dark:bg-red-900/20">
          <XCircle className="text-red-500 size-3 mx-auto mb-1 dark:text-red-400" />
          <div className="text-sm font-medium text-red-700 dark:text-red-300">{failed}</div>
          <div className="text-xs text-red-600 dark:text-red-400">Échoués</div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {total} dossiers
        </span>
        
        <Link 
          href={`/services/gestion/procedures/${procedureId}`} 
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-colors dark:bg-brand-700 dark:hover:bg-brand-600"
        >
          Détails
          <Eye className="size-3 ml-1" />
        </Link>
      </div>
    </div>
  );
};