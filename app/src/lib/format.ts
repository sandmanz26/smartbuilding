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
