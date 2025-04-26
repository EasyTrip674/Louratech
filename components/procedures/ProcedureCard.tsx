"use client";

import React from "react";
import {  CheckCircle, XCircle, Clock, Eye, Hammer } from "lucide-react";
import Link from "next/link";

export const ProcedureCard = ({
  procedureId,
  title,
  totalClients = 0,
  inProgress = 0,
  completed = 0,
  failed = 0,
  className,
}: {
  title?: string;
  totalClients?: number;
  change?: number;
  inProgress?: number;
  completed?: number;
  failed?: number;
  procedureId: string;
  className?: string;
}) => {
  
  // Calculate completion rate
  const total = inProgress + completed + failed;


  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-black dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-black/40 md:p-6 relative${className ? ` ${className}` : ""}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blackrounded-xl dark:bg-black/20">
          <Hammer className="text-black size-6 dark:text-white" />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </span>
            <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
              {typeof totalClients === 'number' ? totalClients.toLocaleString() : totalClients} <span className="text-sm">clients</span>
            </h4>
          </div>
        </div>
        {/* {change !== 0 && (
          <Badge color={isPositive ? "success" : "error"}>
            {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(change).toFixed(1)}%
          </Badge>
        )} */}
      </div>
      
   
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg dark:bg-amber-900/20">
          <Clock className="text-amber-500 size-5 mb-1 dark:text-amber-400" />
          <div className="text-xl font-bold text-gray-800 dark:text-white/90">{inProgress}</div>
          <div className="text-xs text-amber-600 font-medium dark:text-amber-400">En cours</div>
        </div>
        <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
          <CheckCircle className="text-green-500 size-5 mb-1 dark:text-green-400" />
          <div className="text-xl font-bold text-gray-800 dark:text-white/90">{completed}</div>
          <div className="text-xs text-green-600 font-medium dark:text-green-400">Terminée</div>
        </div>
        <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg dark:bg-red-900/20">
          <XCircle className="text-red-500 size-5 mb-1 dark:text-red-400" />
          <div className="text-xl font-bold text-gray-800 dark:text-white/90">{failed}</div>
          <div className="text-xs text-red-600 font-medium dark:text-red-400">Échouée</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-gray-400">
            {total} dossiers au total
          </span>
        </div>
        
        {/* Prominent "Voir les détails" button */}
        <Link 
          href={`/services/gestion/procedures/${procedureId}`} 
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-black focus:ring-4 focus:ring-black transition-colors dark:bg-black dark:hover:bg-black dark:focus:ring-black"
        >
          Voir les détails
          <Eye className="size-4 ml-2" />
        </Link>
      </div>
      
      {/* Floating action indicator */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-black rounded-full animate-pulse hidden md:block"></div>
    </div>
  );
};