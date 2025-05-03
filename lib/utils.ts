// create formatCurrency

import { BadgeColor } from "@/components/ui/badge/Badge";
import { ClientProcedureWithSteps } from "@/db/queries/procedures.query";
import { TransactionType } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Formate un nombre en format monétaire avec gestion des millions et milliards
 * @param value - La valeur numérique à formater
 * @param devise - Le code de la devise (par défaut "FNG")
 * @param options - Options de formatage supplémentaires
 * @returns Une chaîne formatée représentant la valeur monétaire
 */
export function formatCurrency(
  value: number, 
  devise: string = "FNG", 
  options: { 
    useSymbol?: boolean,
    maxDecimals?: number,
    abbreviateMillions?: boolean,
    abbreviateBillions?: boolean
  } = {}
): string {
  // Valeurs par défaut des options
  const {
    useSymbol = false,
    maxDecimals = 0,
    abbreviateMillions = true,
    abbreviateBillions = true
  } = options;

  // Gestion des valeurs négatives
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  
  // Formatage pour les milliards
  if (abbreviateBillions && absValue >= 1_000_000_000) {
    const billions = absValue / 1_000_000_000;
    return `${isNegative ? '-' : ''}${billions.toFixed(2)} Mrd ${devise}`;
  }
  
  // Formatage pour les millions
  if (abbreviateMillions && absValue >= 1_000_000) {
    const millions = absValue / 1_000_000;
    return `${isNegative ? '-' : ''}${millions.toFixed(2)} M ${devise}`;
  }
  
  // Formatage standard pour les autres valeurs
  const formatter = new Intl.NumberFormat('fr-FR', { 
    style: useSymbol ? 'currency' : 'decimal', 
    currency: devise,
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: maxDecimals
  });
  
  const formattedValue = formatter.format(value);
  
  // Si on n'utilise pas le symbole, ajouter la devise à la fin
  return useSymbol ? formattedValue : `${formattedValue} ${devise}`;
}


export function formatDate(date?: Date | string): string {
  if (!date) return '';
  if (typeof date === 'string') {
    date = new Date(date);
  }
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export const calculateProgress = (steps: NonNullable<ClientProcedureWithSteps>["steps"]) => {
  if (!steps.length) return 0;
  const completed = steps.filter(step => step.status === "COMPLETED").length;
  return Math.round((completed / steps.length) * 100);
};


export const getInvoiceStatus = (status: string) : {color:BadgeColor, label:string} => {
  switch (status) {
    case "PAID": 
      return { color: "success", label: "Payée" };
    case "PARTIALLY_PAID": 
      return { color: "warning", label: "Partiellement" };
    case "OVERDUE": 
      return { color: "error", label: "En retard" };
    case "SENT": 
      return { color: "primary", label: "Envoyée" };
    case "DRAFT": 
      return { color: "info", label: "Brouillon" };
    default: 
      return { color: "info", label: status };
  }
};



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export  const getStatusBadgeClasses = (status:string) => {
  switch(status) {
    case 'COMPLETED': 
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800';
    case 'IN_PROGRESS': 
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
    case 'WAITING': 
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800';
    default: 
      return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
  }
};

    // Format du montant avec le signe approprié
    export const formatAmount = (amount: number, type: TransactionType, devise:string = 'FNG') => {
      const sign = type === "EXPENSE" ? "-" : "+";
      return `${sign} ${formatCurrency(amount, devise)}`;
    };
