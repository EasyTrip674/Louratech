"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import { Users, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

export const ProcedureCard = ({ 
  procedureId,
  title ,
  totalClients = 0,
  change = 0,
  inProgress = 0,
  completed = 0,
  failed = 0,
  timeframe = "Ce mois-ci",
  className,
}:{
  title?: string;
  totalClients?: number;
  change?: number;
  inProgress?: number;
  completed?: number;
  failed?: number;
  timeframe?: string;
  procedureId: string;
  className?: string;
}) => {
  const isPositive = change >= 0;
  
  return (
    <div className={"rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] md:p-6" + (className ? ` ${className}` : "")}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-50 rounded-xl dark:bg-purple-900/20">
            <Users className="text-purple-600 size-6 dark:text-purple-400" />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </span>
            <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
              {typeof totalClients === 'number' ? totalClients.toLocaleString() : totalClients}
            </h4>
          </div>
        </div>
        
        <Badge color={isPositive ? "success" : "error"}>
          {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
          {Math.abs(change).toFixed(2)}%
        </Badge>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
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
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {timeframe}
        </span>
        
        <Link href={`/services/gestion/procedures/${procedureId}`}  className="flex items-center text-xs font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
          Voir les details
          <ChevronRight className="size-3 ml-1" />
        </Link>
      </div>
    </div>
  );
};