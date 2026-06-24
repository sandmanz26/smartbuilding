import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableColumnHeader } from '@/components/data-table/DataTableColumnHeader'
import { RowActions } from '@/components/data-table/RowActions'
import { FormDialog, type FieldConfig, type FormValues } from '@/components/data-table/FormDialog'
import { buildings, units, leases as initialLeases } from '@/data/mock'
import { leaseStatusLabel, leaseStatusVariant } from '@/lib/status'
import { formatRupiah, formatDate, daysUntil } from '@/lib/format'
import type { Lease, LeaseStatus } from '@/types'

const RENEWAL_WINDOW_DAYS = 60

/** A lease is "due for renewal attention" if active and ending within the window, regardless of its stored status. */
function isRenewalDue(lease: Lease) {
  if (lease.status === 'expired' || lease.status === 'terminated') return false
  const remaining = daysUntil(lease.endDate)
  return remaining >= 0 && remaining <= RENEWAL_WINDOW_DAYS
}

const statusOptions = (Object.keys(leaseStatusLabel) as LeaseStatus[]).map((s) => ({
  label: leaseStatusLabel[s],
  value: s,
}))

const unitOptions = units.map((u) => ({ label: `${u.unitNumber} (${buildings.find((b) => b.id === u.buildingId)?.name})`, value: u.id }))

const fields: FieldConfig[] = [
  { name: 'tenantName', label: 'Nama Penyewa', type: 'text', placeholder: 'cth. Reza Pratama' },
  { name: 'tenantPhone', label: 'No. Telepon', type: 'text', placeholder: 'cth. 0813-2222-3333' },
  { name: 'unitId', label: 'Unit', type: 'select', options: unitOptions },
  { name: 'startDate', label: 'Tanggal Mulai', type: 'date' },
  { name: 'endDate', label: 'Tanggal Berakhir', type: 'date' },
  { name: 'monthlyRent', label: 'Sewa Bulanan (Rp)', type: 'number', placeholder: 'cth. 12000000' },
  { name: 'depositAmount', label: 'Deposit (Rp)', type: 'number', placeholder: 'cth. 24000000' },
  { name: 'status', label: 'Status', type: 'select', options: statusOptions },
]

const emptyValues: FormValues = {
  tenantName: '',
  tenantPhone: '',
  unitId: unitOptions[0]?.value ?? '',
  startDate: '',
  endDate: '',
  monthlyRent: 0,
  depositAmount: 0,
  status: 'active',
}

export default function Leases() {
  const [leases, setLeases] = useState<Lease[]>(initialLeases)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Lease | null>(null)

  const activeCount = leases.filter((l) => l.status === 'active').length
  const endingSoonCount = leases.filter((l) => l.status === 'ending_soon').length
  const totalRent = leases.filter((l) => l.status === 'active' || l.status === 'ending_soon').reduce((sum, l) => sum + l.monthlyRent, 0)
  const renewalDueCount = leases.filter(isRenewalDue).length

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(lease: Lease) {
    setEditing(lease)
    setDialogOpen(true)
  }

  function handleDelete(id: string) {
    setLeases((prev) => prev.filter((l) => l.id !== id))
  }

  function handleBulkDelete(rows: Lease[]) {
    const ids = new Set(rows.map((r) => r.id))
    setLeases((prev) => prev.filter((l) => !ids.has(l.id)))
  }

  function handleImport(rows: Record<string, string>[]) {
    const unitByNumber = new Map(units.map((u) => [u.unitNumber, u]))
    const imported: Lease[] = rows.map((row, idx) => {
      const unit = unitByNumber.get(row['Unit'])
      return {
        id: `lse-import-${Date.now()}-${idx}`,
        tenantName: row['Penyewa'] ?? '',
        tenantPhone: row['__phone__'] ?? '',
        unitId: unit?.id ?? units[0]?.id ?? '',
        buildingId: unit?.buildingId ?? buildings[0]?.id ?? '',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        monthlyRent: Number(row['Sewa Bulanan']?.replace(/[^\d]/g, '')) || 0,
        depositAmount: Number(row['Deposit']?.replace(/[^\d]/g, '')) || 0,
        status: 'active',
      }
    })
    setLeases((prev) => [...imported, ...prev])
  }

  function handleSubmit(values: FormValues) {
    const unit = units.find((u) => u.id === String(values.unitId))
    const payload = {
      tenantName: String(values.tenantName),
      tenantPhone: String(values.tenantPhone),
      unitId: String(values.unitId),
      buildingId: unit?.buildingId ?? '',
      startDate: String(values.startDate),
      endDate: String(values.endDate),
      monthlyRent: Number(values.monthlyRent),
      depositAmount: Number(values.depositAmount),
      status: values.status as LeaseStatus,
    }
    if (editing) {
      setLeases((prev) => prev.map((l) => (l.id === editing.id ? { ...l, ...payload } : l)))
    } else {
      setLeases((prev) => [...prev, { id: `lse-${Date.now()}`, ...payload }])
    }
  }

  const columns: ColumnDef<Lease>[] = [
    {
      accessorKey: 'tenantName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Penyewa" />,
      cell: ({ row }) => <span className="font-medium">{row.original.tenantName}</span>,
    },
    {
      id: 'unit',
      header: 'Unit',
      accessorFn: (row) => units.find((u) => u.id === row.unitId)?.unitNumber ?? '-',
    },
    {
      id: 'building',
      header: 'Tower',
      accessorFn: (row) => buildings.find((b) => b.id === row.buildingId)?.name ?? '-',
    },
    {
      id: 'period',
      header: 'Periode',
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm">
          {formatDate(row.original.startDate)} – {formatDate(row.original.endDate)}
        </span>
      ),
    },
    {
      accessorKey: 'monthlyRent',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Sewa Bulanan" />,
      cell: ({ row }) => formatRupiah(row.original.monthlyRent),
    },
    {
      accessorKey: 'depositAmount',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Deposit" />,
      cell: ({ row }) => formatRupiah(row.original.depositAmount),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={leaseStatusVariant[row.original.status]}>{leaseStatusLabel[row.original.status]}</Badge>
      ),
      filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id) as string),
    },
    {
      id: 'renewal',
      header: 'Pengingat Perpanjangan',
      cell: ({ row }) => {
        if (!isRenewalDue(row.original)) return '-'
        const remaining = daysUntil(row.original.endDate)
        return (
          <Badge variant="destructive">
            Berakhir {remaining} hari lagi
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => (
        <RowActions
          onEdit={() => openEdit(row.original)}
          onDelete={() => handleDelete(row.original.id)}
          deleteLabel={`Sewa ${row.original.tenantName} akan dihapus dari sistem.`}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Manajemen Sewa</h1>
        <p className="text-sm text-muted-foreground">
          Kontrak sewa unit, jangka waktu, nilai sewa, dan deposit penyewa.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Sewa Aktif</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{activeCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Akan Berakhir</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{endingSoonCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pendapatan Sewa Bulanan</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatRupiah(totalRent)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Perlu Pengingat Perpanjangan ({RENEWAL_WINDOW_DAYS} hari)</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{renewalDueCount}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Sewa</CardTitle>
          <CardDescription>Kontrak sewa unit penghuni lintas tower</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={leases}
            searchColumnId="tenantName"
            searchPlaceholder="Cari nama penyewa..."
            facetedFilters={[{ columnId: 'status', title: 'Status', options: statusOptions }]}
            addLabel="Tambah Sewa"
            onAdd={openAdd}
            exportFilename="leases"
            onImport={handleImport}
            onBulkDelete={handleBulkDelete}
            getRowId={(row) => row.id}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? 'Edit Sewa' : 'Tambah Sewa'}
        description="Lengkapi data kontrak sewa unit"
        fields={fields}
        defaultValues={
          editing
            ? {
                tenantName: editing.tenantName,
                tenantPhone: editing.tenantPhone,
                unitId: editing.unitId,
                startDate: editing.startDate,
                endDate: editing.endDate,
                monthlyRent: editing.monthlyRent,
                depositAmount: editing.depositAmount,
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
