// create formatCurrency

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'FNG' }).format(value);
}
