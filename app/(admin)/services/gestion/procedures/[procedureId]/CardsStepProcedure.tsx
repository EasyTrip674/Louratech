"use client";
import React from "react";
import Button from "@/components/ui/button/Button";
import { Eye, Trash, Clock, ChevronRight } from "lucide-react";
import { ProcedureWithStepsDb } from "@/db/queries/procedures.query";
import EditStepFormModal from "./steps/step/edit/EditStepFormModal";

type CardsProcedureStepsProps = {
  procedureDetails: ProcedureWithStepsDb;
  readOnly?: boolean;
};

export default function CardsProcedureSteps({
  procedureDetails,
  readOnly = false
}: CardsProcedureStepsProps) {
  if (!procedureDetails || !procedureDetails.steps) return null;

  // Sort steps by order
  const sortedSteps = [...procedureDetails?.steps].sort((a, b) => Number(a.createdAt) - Number(b.createdAt));

  return (
    <div className="space-y-6">

      {/* Grille de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSteps.map((step) => (
          <div 
            key={step.id} 
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* Entête avec numéro d'ordre */}
            <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mr-2">
                  <span className="font-bold text-blue-600 dark:text-blue-300">{step.order}</span>
                </div>
                <h3 className="font-medium text-blue-700 dark:text-blue-300">Module</h3>
              </div>
              
              {/* Prix du module */}
              {step.price !== null && (
                <div className="bg-green-100 dark:bg-green-900/30 py-1 px-3 rounded-full">
                  <span className="text-green-700 dark:text-green-300 text-sm font-medium">{step.price.toLocaleString()} FNG</span>
                </div>
              )}
            </div>
            
            {/* Corps de la carte */}
            <div className="p-5">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.name}</h4>
              
              {step.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {step.description}
                </p>
              )}
              
              {/* Informations supplémentaires */}
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                {step.estimatedDuration && (
                  <div className="flex items-center mr-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{step.estimatedDuration} jours</span>
                  </div>
                )}
                
                {/* {step?.documents?.length > 0 && (
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    <span>{step.documents.length} document{step.documents.length > 1 ? 's' : ''}</span>
                  </div>
                )} */}
              </div>
              
              {/* Actions */}
              {!readOnly && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
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
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    href={`/services/gestion/procedures/${step.procedureId}/steps/step/${step.id}`}
                    className="flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Détails
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}