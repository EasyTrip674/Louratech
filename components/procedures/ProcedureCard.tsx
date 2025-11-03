"use client";

import React from "react";
import { CheckCircle, XCircle, Clock, Eye, Hammer, type LucideIcon } from "lucide-react";
import Link from "next/link";
import EditProcedureFormModal from "@/app/(admin)/services/gestion/procedures/[procedureId]/edit/CreateEditModalForm";

type StatusStatConfig = {
  icon: LucideIcon;
  value: number;
  label: string;
  colorClasses: {
    bg: string;
    iconColor: string;
    textColor: string;
    labelColor: string;
  };
};

type ProcedureCardProps = {
  procedureId: string;
  title?: string;
  totalClients?: number;
  inProgress?: number;
  completed?: number;
  failed?: number;
  className?: string;
  description?: string;
};

// Sub-components for better organization
const StatusStat = ({ icon: Icon, value, label, colorClasses }: StatusStatConfig) => (
  <div className={`text-center p-2 ${colorClasses.bg} rounded-md`}>
    <Icon className={`${colorClasses.iconColor} size-3 mx-auto mb-1`} />
    <div className={`text-sm font-medium ${colorClasses.textColor}`}>{value}</div>
    <div className={`text-xs ${colorClasses.labelColor}`}>{label}</div>
  </div>
);

const ProcedureHeader = ({
  title,
  totalClients,
  completionRate,
  procedureId,
  description
}: {
  title?: string;
  totalClients: number;
  completionRate: number;
  procedureId: string;
  description?: string;
}) => (
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
      <EditProcedureFormModal
        procedure={{
          procedureId,
          name: title ?? "",
          description: description ?? ""
        }}
      />
    </div>
  </div>
);

const ProgressBar = ({ completionRate }: { completionRate: number }) => (
  <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 dark:bg-gray-700">
    <div
      className="h-full bg-brand-500 rounded-full transition-all duration-300"
      style={{ width: `${completionRate}%` }}
    />
  </div>
);

const ProcedureFooter = ({
  total,
  procedureId
}: {
  total: number;
  procedureId: string;
}) => (
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
);

export const ProcedureCard = ({
  procedureId,
  title,
  totalClients = 0,
  inProgress = 0,
  completed = 0,
  failed = 0,
  className,
  description
}: ProcedureCardProps) => {
  // Calculate completion rate
  const total = inProgress + completed + failed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Status statistics configuration
  const statusStats: StatusStatConfig[] = [
    {
      icon: Clock,
      value: inProgress,
      label: "En cours",
      colorClasses: {
        bg: "bg-amber-50 dark:bg-amber-900/20",
        iconColor: "text-amber-500 dark:text-amber-400",
        textColor: "text-amber-700 dark:text-amber-300",
        labelColor: "text-amber-600 dark:text-amber-400",
      },
    },
    {
      icon: CheckCircle,
      value: completed,
      label: "Terminés",
      colorClasses: {
        bg: "bg-green-50 dark:bg-green-900/20",
        iconColor: "text-green-500 dark:text-green-400",
        textColor: "text-green-700 dark:text-green-300",
        labelColor: "text-green-600 dark:text-green-400",
      },
    },
    {
      icon: XCircle,
      value: failed,
      label: "Échoués",
      colorClasses: {
        bg: "bg-red-50 dark:bg-red-900/20",
        iconColor: "text-red-500 dark:text-red-400",
        textColor: "text-red-700 dark:text-red-300",
        labelColor: "text-red-600 dark:text-red-400",
      },
    },
  ];
  
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800${className ? ` ${className}` : ""}`}>
      <ProcedureHeader
        title={title}
        totalClients={totalClients}
        completionRate={completionRate}
        procedureId={procedureId}
        description={description}
      />

      <ProgressBar completionRate={completionRate} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {statusStats.map((stat) => (
          <StatusStat key={stat.label} {...stat} />
        ))}
      </div>

      <ProcedureFooter total={total} procedureId={procedureId} />
    </div>
  );
};