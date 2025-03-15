"use client";
import React from "react";
import { useParams } from "next/navigation";
import { getClientProcedureWithSteps } from "@/db/queries/procedures.query";
import { Clock, CheckCircle } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";


export default async function ClientProcedurePage() {
  const params = useParams();
  const procedureId = params.procedureId as string;
  const clientId = params.clientId as string;

  const clientProcedure = await getClientProcedureWithSteps(clientId,procedureId);

  if (!clientProcedure) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Procédure client non trouvée</h1>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Non défini';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-2xl font-semibold">{clientProcedure.procedure.name}</h1>
          <span className="text-gray-500">•</span>
          <div className="flex flex-col">
            <h2 className="text-xl">{clientProcedure.client.user.firstName} {clientProcedure.client.user.lastName}</h2>
            <span className="text-sm text-gray-500">{clientProcedure.client.user.email}</span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{clientProcedure.procedure.description}</p>
      </div>

      <div className="space-y-6">
        {clientProcedure.steps.map((step) => (
          <div key={step.id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium">{step.step.name}</span>
                  <Badge className={getStatusColor(step.status)}>
                    {step.status}
                  </Badge>
                </div>
                <div className="flex gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Début: {formatDate(step.startDate)}</span>
                  </div>
                  {step.completionDate && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Fin: {formatDate(step.completionDate)}</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{step.step.description}</p>
            </div>

            <div className="p-4">
              {/* {step.step.documents.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Documents requis</h3>
                  <ul className="space-y-2">
                    {step.step.documents.map(doc => (
                      <li key={doc.id} className="flex items-center gap-2">
                        <span>{doc.name}</span>
                        {doc.required && (
                          <Badge className="text-xs">Obligatoire</Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}

              {/* {step.step.tasks.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Tâches à accomplir</h3>
                  <ul className="space-y-2">
                    {step.step.tasks.map(task => (
                      <li key={task.id} className="flex items-center gap-2">
                        <span>{task.name}</span>
                        {task.required && (
                          <Badge  className="text-xs">Obligatoire</Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
