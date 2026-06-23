import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableColumnHeader } from '@/components/data-table/DataTableColumnHeader'
import { RowActions } from '@/components/data-table/RowActions'
import { FormDialog, type FieldConfig, type FormValues } from '@/components/data-table/FormDialog'
import { buildings, units, invoices as initialInvoices } from '@/data/mock'
import { invoiceStatusLabel, invoiceStatusVariant } from '@/lib/status'
import { formatRupiah, formatDate } from '@/lib/format'
import type { Invoice, InvoiceStatus } from '@/types'

const statusOptions = (Object.keys(invoiceStatusLabel) as InvoiceStatus[]).map((s) => ({
  label: invoiceStatusLabel[s],
  value: s,
}))

const unitOptions = units.map((u) => ({
  label: `${u.unitNumber} (${buildings.find((b) => b.id === u.buildingId)?.name})`,
  value: u.id,
}))

const fields: FieldConfig[] = [
  { name: 'unitId', label: 'Unit', type: 'select', options: unitOptions },
  { name: 'period', label: 'Periode', type: 'text', placeholder: 'cth. Juni 2026' },
  { name: 'description', label: 'Keterangan', type: 'text', placeholder: 'cth. IPL + Air' },
  { name: 'amount', label: 'Jumlah (Rp)', type: 'number', placeholder: 'cth. 1850000' },
  { name: 'dueDate', label: 'Jatuh Tempo', type: 'date' },
  { name: 'status', label: 'Status', type: 'select', options: statusOptions },
]

const emptyValues: FormValues = {
  unitId: unitOptions[0]?.value ?? '',
  period: '',
  description: '',
  amount: 0,
  dueDate: '',
  status: 'due',
}

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Invoice | null>(null)

  const totalBilled = invoices.reduce((sum, i) => sum + i.amount, 0)
  const totalOverdue = invoices.filter((i) => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0)
  const overdueCount = invoices.filter((i) => i.status === 'overdue').length

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(invoice: Invoice) {
    setEditing(invoice)
    setDialogOpen(true)
  }

  function handleDelete(id: string) {
    setInvoices((prev) => prev.filter((i) => i.id !== id))
  }

  function handleSubmit(values: FormValues) {
    const unit = units.find((u) => u.id === String(values.unitId))
    const payload = {
      unitId: String(values.unitId),
      buildingId: unit?.buildingId ?? '',
      period: String(values.period),
      description: String(values.description),
      amount: Number(values.amount),
      dueDate: String(values.dueDate),
      status: values.status as InvoiceStatus,
    }
    if (editing) {
      setInvoices((prev) => prev.map((i) => (i.id === editing.id ? { ...i, ...payload } : i)))
    } else {
      setInvoices((prev) => [...prev, { id: `inv-${Date.now()}`, ...payload }])
    }
  }

  const columns: ColumnDef<Invoice>[] = [
    {
      id: 'building',
      header: 'Tower',
      accessorFn: (row) => buildings.find((b) => b.id === row.buildingId)?.name ?? '-',
    },
    {
      id: 'unit',
      header: 'Unit',
      accessorFn: (row) => units.find((u) => u.id === row.unitId)?.unitNumber ?? '-',
    },
    {
      accessorKey: 'period',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Periode" />,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Keterangan" />,
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Jumlah" />,
      cell: ({ row }) => formatRupiah(row.original.amount),
    },
    {
      accessorKey: 'dueDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Jatuh Tempo" />,
      cell: ({ row }) => formatDate(row.original.dueDate),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={invoiceStatusVariant[row.original.status]}>{invoiceStatusLabel[row.original.status]}</Badge>
      ),
      filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id) as string),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => (
        <RowActions
          onEdit={() => openEdit(row.original)}
          onDelete={() => handleDelete(row.original.id)}
          deleteLabel={`Invoice periode ${row.original.period} akan dihapus dari sistem.`}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Billing & Iuran</h1>
        <p className="text-sm text-muted-foreground">
          Tagihan IPL (Iuran Pemeliharaan Lingkungan) dan utilitas per unit.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Tagihan Bulan Ini</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatRupiah(totalBilled)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Tertunggak</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatRupiah(totalOverdue)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Jumlah Unit Tertunggak</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{overdueCount}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Invoice</CardTitle>
          <CardDescription>Status pembayaran iuran per unit</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={invoices}
            searchColumnId="description"
            searchPlaceholder="Cari keterangan..."
            facetedFilters={[{ columnId: 'status', title: 'Status', options: statusOptions }]}
            addLabel="Tambah Invoice"
            onAdd={openAdd}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? 'Edit Invoice' : 'Tambah Invoice'}
        description="Lengkapi data tagihan unit"
        fields={fields}
        defaultValues={
          editing
            ? {
                unitId: editing.unitId,
                period: editing.period,
                description: editing.description,
                amount: editing.amount,
                dueDate: editing.dueDate,
                status: editing.status,
              }
            : emptyValues
        }
        onSubmit={handleSubmit}
        submitLabel={editing ? 'Simpan Perubahan' : 'Tambah'}
      />
    </div>
  )
}
