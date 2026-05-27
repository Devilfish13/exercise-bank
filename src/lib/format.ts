/** Format a major-unit amount as a localised currency string. */
export function formatCurrency(amount: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount);
}

/** Format an ISO date as e.g. "24 May 2026". */
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

/** Mask an account/card number to its last four digits. */
export function maskAccountNumber(value: string): string {
  const last4 = value.slice(-4);
  return `•••• ${last4}`;
}
