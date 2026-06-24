export function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID')
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString('id-ID')
}

/** Number of whole days from today until `value` (negative if in the past). */
export function daysUntil(value: string) {
  const target = new Date(value)
  target.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

/** Late fee for an overdue invoice: 2% of amount per 30-day block overdue, capped at 20%. */
export function calculateLateFee(amount: number, dueDate: string): number {
  const overdueDays = -daysUntil(dueDate)
  if (overdueDays <= 0) return 0
  const blocks = Math.ceil(overdueDays / 30)
  const rate = Math.min(blocks * 0.02, 0.2)
  return Math.round(amount * rate)
}

/** Outstanding IPL/invoice balance for a unit: sum of amounts for invoices not yet paid. */
export function calculateOutstandingBalance(
  unitId: string,
  invoices: { unitId: string; amount: number; status: string }[],
): number {
  return invoices
    .filter((invoice) => invoice.unitId === unitId && invoice.status !== 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0)
}
