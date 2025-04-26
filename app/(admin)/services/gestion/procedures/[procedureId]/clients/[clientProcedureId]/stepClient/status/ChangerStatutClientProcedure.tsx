"use client";

import { ClientStep } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  ChevronDown,
  AlertTriangle,
  Clock3,
  CircleDot,
  Loader2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import Button from "@/components/ui/button/Button";
import { ChangeStatusSchema, Status } from "./change.status.clientStep.sheme";
import { doChangeStepStatus } from "./change.status.client.step.action";

type ChangeStatusInput = z.infer<typeof ChangeStatusSchema>;

type StatusConfig = {
  [K in Status]: {
    icon: typeof CircleDot;
    text: string;
    color: string;
  }
};

export default function ChangerStatutClientProcedure({ 
  clientStepId, 
  currentStatus = "NOT_STARTED" 
}: { 
  clientStepId: string,
  currentStatus?: Status 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Map status to icons and text
  const statusConfig: StatusConfig = {
    'NOT_STARTED': { icon: CircleDot, text: 'Non commencée', color: 'text-gray-500' },
    'IN_PROGRESS': { icon: Clock3, text: 'En cours', color: 'text-blue-500' },
    'COMPLETED': { icon: CheckCircle, text: 'Terminée', color: 'text-green-500' },
    'FAILED': { icon: AlertTriangle, text: 'Échouée', color: 'text-red-500' },
    'SKIPPED': { icon: CircleDot, text: 'Passée', color: 'text-gray-500' },
    'PENDING': { icon: Clock3, text: 'En attente', color: 'text-yellow-500' },
    'WAITING': { icon: Clock3, text: 'En attente', color: 'text-yellow-500' }
  };

  const currentStatusColor = statusConfig[currentStatus].color;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Define the mutation
  const changeStatusMutation = useMutation({
    mutationFn: async (data: ChangeStatusInput) => {
      const response = await doChangeStepStatus(data);
      
      if (!response?.data?.success) {
        const errorData = await response?.serverError;
        throw new Error(errorData || 'Une erreur est survenue');
      }
      
      return response.data.step as ClientStep;
    },
    onSuccess: () => {
      // Show success toast
    //   toast.success(`Statut changé en "${statusConfig[data.status].text}"`);
      
      // Invalidate and refetch relevant queries instead of page reload
      queryClient.invalidateQueries({ queryKey: ['clientSteps'] });
      
      // Close dropdown
      setIsOpen(false);
    },
    onError: (error: Error) => {
    //   toast.error(error.message || 'Erreur lors du changement de statut');
      console.error('Erreur lors du changement de statut:', error);
    }
  });

  const handleStatusChange = (newStatus: Status) => {
    try {
      // Don't do anything if status is the same
      if (newStatus === currentStatus) {
        setIsOpen(false);
        return;
      }
      
      // Validate input with Zod
      const validatedData = ChangeStatusSchema.parse({
        clientStepId,
        status: newStatus
      });
      
      // Execute the mutation with validated data
      changeStatusMutation.mutate(validatedData);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        // toast.error(validationError.errors[0].message);
      } else {
        // toast.error('Erreur de validation');
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        className={`flex items-center ${currentStatusColor}`}
        disabled={changeStatusMutation.isPending}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {changeStatusMutation.isPending ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : (null
        //   <CurrentStatusIcon className="w-4 h-4 mr-1" />
        )}
        {changeStatusMutation.isPending ? 'Chargement...' : "Changer le statut"}
        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      {isOpen && (
        <div className="absolute left-0 mt-1 z-10 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 animate-fadeIn">
          <div className="py-1">
            <button
              onClick={() => handleStatusChange('IN_PROGRESS')}
              className={`flex items-center w-full px-4 py-2 text-sm text-left ${currentStatus === 'IN_PROGRESS' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} text-gray-700 dark:text-gray-200`}
              disabled={currentStatus === 'IN_PROGRESS'}
            >
              <Clock3 className="w-4 h-4 mr-2 text-blue-500" />
              En cours
              {currentStatus === 'IN_PROGRESS' && <span className="ml-auto text-xs text-gray-500">Actuel</span>}
            </button>
            <button
              onClick={() => handleStatusChange('COMPLETED')}
              className={`flex items-center w-full px-4 py-2 text-sm text-left ${currentStatus === 'COMPLETED' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} text-gray-700 dark:text-gray-200`}
              disabled={currentStatus === 'COMPLETED'}
            >
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Terminée
              {currentStatus === 'COMPLETED' && <span className="ml-auto text-xs text-gray-500">Actuel</span>}
            </button>
            <button
              onClick={() => handleStatusChange('SKIPPED')}
              className={`flex items-center w-full px-4 py-2 text-sm text-left ${currentStatus === 'SKIPPED' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} text-gray-700 dark:text-gray-200`}
              disabled={currentStatus === 'SKIPPED'}
            >
              <CircleDot className="w-4 h-4 mr-2 text-gray-500" />
              Passée
              {currentStatus === 'SKIPPED' && <span className="ml-auto text-xs text-gray-500">Actuel</span>}
            </button>
            <button
              onClick={() => handleStatusChange('FAILED')}
              className={`flex items-center w-full px-4 py-2 text-sm text-left ${currentStatus === 'FAILED' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} text-gray-700 dark:text-gray-200`}
              disabled={currentStatus === 'FAILED'}
            >
              <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
              Échouée
              {currentStatus === 'FAILED' && <span className="ml-auto text-xs text-gray-500">Actuel</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}