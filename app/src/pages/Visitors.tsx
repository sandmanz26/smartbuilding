import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableColumnHeader } from '@/components/data-table/DataTableColumnHeader'
import { RowActions } from '@/components/data-table/RowActions'
import { FormDialog, type FieldConfig, type FormValues } from '@/components/data-table/FormDialog'
import { buildings, units, visitors as initialVisitors } from '@/data/mock'
import { visitorStatusLabel, visitorStatusVariant } from '@/lib/status'
import { formatDateTime } from '@/lib/format'
import type { Visitor, VisitorStatus } from '@/types'

const statusOptions = (Object.keys(visitorStatusLabel) as VisitorStatus[]).map((s) => ({
  label: visitorStatusLabel[s],
  value: s,
}))

const unitOptions = units.map((u) => ({ label: `${u.unitNumber} (${buildings.find((b) => b.id === u.buildingId)?.name})`, value: u.id }))

const fields: FieldConfig[] = [
  { name: 'visitorName', label: 'Nama Tamu', type: 'text', placeholder: 'cth. Budi Santoso' },
  { name: 'purpose', label: 'Keperluan', type: 'text', placeholder: 'cth. Kunjungan Keluarga' },
  { name: 'unitId', label: 'Unit Tujuan', type: 'select', options: unitOptions },
  { name: 'vehiclePlate', label: 'No. Kendaraan', type: 'text', placeholder: 'cth. B 1234 ABC' },
  { name: 'checkInAt', label: 'Check-in', type: 'datetime' },
  { name: 'checkOutAt', label: 'Check-out', type: 'datetime' },
  { name: 'status', label: 'Status', type: 'select', options: statusOptions },
]

const emptyValues: FormValues = {
  visitorName: '',
  purpose: '',
  unitId: unitOptions[0]?.value ?? '',
  vehiclePlate: '',
  checkInAt: '',
  checkOutAt: '',
  status: 'expected',
}

export default function Visitors() {
  const [visitors, setVisitors] = useState<Visitor[]>(initialVisitors)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Visitor | null>(null)

  const checkedInCount = visitors.filter((v) => v.status === 'checked_in').length
  const expectedCount = visitors.filter((v) => v.status === 'expected').length

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(visitor: Visitor) {
    setEditing(visitor)
    setDialogOpen(true)
  }

  function handleDelete(id: string) {
    setVisitors((prev) => prev.filter((v) => v.id !== id))
  }

  function handleSubmit(values: FormValues) {
    const unit = units.find((u) => u.id === String(values.unitId))
    const checkOutAt = String(values.checkOutAt ?? '')
    const payload = {
      visitorName: String(values.visitorName),
      purpose: String(values.purpose),
      unitId: String(values.unitId),
      buildingId: unit?.buildingId ?? '',
      vehiclePlate: String(values.vehiclePlate ?? '') || undefined,
      checkInAt: String(values.checkInAt),
      checkOutAt: checkOutAt || undefined,
      status: values.status as VisitorStatus,
    }
    if (editing) {
      setVisitors((prev) => prev.map((v) => (v.id === editing.id ? { ...v, ...payload } : v)))
    } else {
      setVisitors((prev) => [...prev, { id: `vis-${Date.now()}`, ...payload }])
    }
  }

  const columns: ColumnDef<Visitor>[] = [
    {
      id: 'building',
      header: 'Tower',
      accessorFn: (row) => buildings.find((b) => b.id === row.buildingId)?.name ?? '-',
    },
    {
      id: 'unit',
      header: 'Unit Tujuan',
      accessorFn: (row) => units.find((u) => u.id === row.unitId)?.unitNumber ?? '-',
    },
    {
      accessorKey: 'visitorName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Tamu" />,
      cell: ({ row }) => <span className="font-medium">{row.original.visitorName}</span>,
    },
    {
      accessorKey: 'purpose',
      header: 'Keperluan',
    },
    {
      id: 'vehiclePlate',
      header: 'No. Kendaraan',
      accessorFn: (row) => row.vehiclePlate ?? '-',
    },
    {
      id: 'checkInAt',
      header: 'Check-in',
      cell: ({ row }) => <span className="whitespace-nowrap text-xs">{formatDateTime(row.original.checkInAt)}</span>,
    },
    {
      id: 'checkOutAt',
      header: 'Check-out',
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-xs">
          {row.original.checkOutAt ? formatDateTime(row.original.checkOutAt) : '-'}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={visitorStatusVariant[row.original.status]}>{visitorStatusLabel[row.original.status]}</Badge>
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
          deleteLabel={`Data tamu ${row.original.visitorName} akan dihapus dari sistem.`}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Visitor Management</h1>
        <p className="text-sm text-muted-foreground">
          Log tamu masuk/keluar per tower untuk keamanan kompleks apartemen.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Sedang di Lokasi</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{checkedInCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Hari Ini</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{visitors.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Dijadwalkan</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{expectedCount}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log Tamu</CardTitle>
          <CardDescription>Riwayat dan status kunjungan tamu per unit</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={visitors}
            searchColumnId="visitorName"
            searchPlaceholder="Cari nama tamu..."
            facetedFilters={[{ columnId: 'status', title: 'Status', options: statusOptions }]}
            addLabel="Tambah Tamu"
            onAdd={openAdd}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? 'Edit Tamu' : 'Tambah Tamu'}
        description="Lengkapi data kunjungan tamu"
        fields={fields}
        defaultValues={
          editing
            ? {
                visitorName: editing.visitorName,
                purpose: editing.purpose,
                unitId: editing.unitId,
                vehiclePlate: editing.vehiclePlate ?? '',
                checkInAt: editing.checkInAt,
                checkOutAt: editing.checkOutAt ?? '',
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
