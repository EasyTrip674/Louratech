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
    <div className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-400 relative overflow-hidden${className ? ` ${className}` : ""}`}>
      {/* Top decoration bar */}
      
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-brand-100 rounded-lg dark:bg-brand-900/30">
            <Hammer className="text-brand-600 size-6 dark:text-brand-400" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-xl dark:text-white">
              {title}
            </h4>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                {typeof totalClients === 'number' ? totalClients.toLocaleString() : totalClients}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">clients</span>
            </div>
          </div>
        </div>
        
        {/* Completion badge */}
              <div className="flex flex-col items-end">
                  <div className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm font-medium dark:bg-brand-900/30 dark:text-brand-300">
                    {completionRate}% complété
                  </div>
                </div>
              {/* edit button */}
               <div>
               <EditProcedureFormModal procedure={
                { procedureId: procedureId, name:title ?? "", description: description ?? "" }
               } />
               </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6 dark:bg-gray-800">
        <div className="h-full bg-gradient-to-r from-brand-500 to-indigo-600" style={{ width: `${completionRate}%` }}></div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center p-4 bg-amber-50 rounded-xl border border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/30">
          <Clock className="text-amber-500 size-5 mb-2 dark:text-amber-400" />
          <div className="text-xl font-bold text-amber-700 dark:text-amber-300">{inProgress}</div>
          <div className="text-xs text-amber-600 font-medium dark:text-amber-400">En cours</div>
        </div>
        <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl border border-green-100 dark:bg-green-900/20 dark:border-green-800/30">
          <CheckCircle className="text-green-500 size-5 mb-2 dark:text-green-400" />
          <div className="text-xl font-bold text-green-700 dark:text-green-300">{completed}</div>
          <div className="text-xs text-green-600 font-medium dark:text-green-400">Terminée</div>
        </div>
        <div className="flex flex-col items-center p-4 bg-red-50 rounded-xl border border-red-100 dark:bg-red-900/20 dark:border-red-800/30">
          <XCircle className="text-red-500 size-5 mb-2 dark:text-red-400" />
          <div className="text-xl font-bold text-red-700 dark:text-red-300">{failed}</div>
          <div className="text-xs text-red-600 font-medium dark:text-red-400">Échouée</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-gray-300">
            {total} dossiers au total
          </span>
        </div>
        
        <Link 
          href={`/services/gestion/procedures/${procedureId}`} 
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 focus:ring-4 focus:ring-brand-300 transition-colors dark:bg-brand-700 dark:hover:bg-brand-600 dark:focus:ring-brand-800"
        >
          Voir les détails
          <Eye className="size-4 ml-2" />
        </Link>
      </div>
      
      {/* Activity indicator */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full shadow-lg shadow-brand-500/50 animate-pulse"></div>
    </div>
  );
};