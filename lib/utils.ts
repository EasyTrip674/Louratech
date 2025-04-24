// create formatCurrency

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