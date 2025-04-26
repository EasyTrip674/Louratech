// create formatCurrency

import { ClientProcedureWithSteps } from "@/db/queries/procedures.query";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'FNG' }).format(value);
}



export function formatDate(date?: Date | string): string {
  if (!date) return '';
  if (typeof date === 'string') {
    date = new Date(date);
  }
  if (isNaN(date.getTime())) return '';
  // Format the date to 'dd/MM/yyyy'
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export const calculateProgress = (steps: ClientProcedureWithSteps['steps']) => {
  if (!steps.length) return 0;
  const completed = steps.filter(step => step.status === "COMPLETED").length;
  return Math.round((completed / steps.length) * 100);
};
