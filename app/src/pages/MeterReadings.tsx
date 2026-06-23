import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableColumnHeader } from '@/components/data-table/DataTableColumnHeader'
import { RowActions } from '@/components/data-table/RowActions'
import { FormDialog, type FieldConfig, type FormValues } from '@/components/data-table/FormDialog'
import { buildings, units, meterReadings as initialReadings } from '@/data/mock'
import { meterTypeLabel } from '@/lib/status'
import { formatRupiah } from '@/lib/format'
import type { MeterReading, MeterType } from '@/types'

const meterTypeOptions = (Object.keys(meterTypeLabel) as MeterType[]).map((t) => ({
  label: meterTypeLabel[t],
  value: t,
}))

const unitOptions = units.map((u) => ({ label: `${u.unitNumber} (${buildings.find((b) => b.id === u.buildingId)?.name})`, value: u.id }))

const fields: FieldConfig[] = [
  { name: 'unitId', label: 'Unit', type: 'select', options: unitOptions },
  { name: 'meterType', label: 'Jenis Meter', type: 'select', options: meterTypeOptions },
  { name: 'period', label: 'Periode', type: 'text', placeholder: 'cth. Juni 2026' },
  { name: 'previousReading', label: 'Pembacaan Sebelumnya', type: 'number', placeholder: 'cth. 120' },
  { name: 'currentReading', label: 'Pembacaan Saat Ini', type: 'number', placeholder: 'cth. 138' },
  { name: 'ratePerUnit', label: 'Tarif per Unit (Rp)', type: 'number', placeholder: 'cth. 12000' },
]

const emptyValues: FormValues = {
  unitId: unitOptions[0]?.value ?? '',
  meterType: 'water',
  period: '',
  previousReading: 0,
  currentReading: 0,
  ratePerUnit: 0,
}

export default function MeterReadings() {
  const [readings, setReadings] = useState<MeterReading[]>(initialReadings)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<MeterReading | null>(null)

  const totalUsageCost = readings.reduce((sum, r) => sum + (r.currentReading - r.previousReading) * r.ratePerUnit, 0)
  const waterCount = readings.filter((r) => r.meterType === 'water').length
  const electricityCount = readings.filter((r) => r.meterType === 'electricity').length

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(reading: MeterReading) {
    setEditing(reading)
    setDialogOpen(true)
  }

  function handleDelete(id: string) {
    setReadings((prev) => prev.filter((r) => r.id !== id))
  }

  function handleSubmit(values: FormValues) {
    const unit = units.find((u) => u.id === String(values.unitId))
    const payload = {
      unitId: String(values.unitId),
      buildingId: unit?.buildingId ?? '',
      meterType: values.meterType as MeterType,
      period: String(values.period),
      previousReading: Number(values.previousReading),
      currentReading: Number(values.currentReading),
      ratePerUnit: Number(values.ratePerUnit),
    }
    if (editing) {
      setReadings((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...payload } : r)))
    } else {
      setReadings((prev) => [...prev, { id: `mtr-${Date.now()}`, ...payload }])
    }
  }

  const columns: ColumnDef<MeterReading>[] = [
    {
      id: 'unit',
      header: 'Unit',
      accessorFn: (row) => units.find((u) => u.id === row.unitId)?.unitNumber ?? '-',
      cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
    },
    {
      id: 'building',
      header: 'Tower',
      accessorFn: (row) => buildings.find((b) => b.id === row.buildingId)?.name ?? '-',
    },
    {
      accessorKey: 'meterType',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Jenis Meter" />,
      cell: ({ row }) => <Badge variant="outline">{meterTypeLabel[row.original.meterType]}</Badge>,
      filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id) as string),
    },
    {
      accessorKey: 'period',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Periode" />,
    },
    {
      accessorKey: 'previousReading',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Sebelumnya" />,
    },
    {
      accessorKey: 'currentReading',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Saat Ini" />,
    },
    {
      id: 'usage',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Pemakaian" />,
      accessorFn: (row) => row.currentReading - row.previousReading,
      cell: ({ getValue }) => `${getValue<number>()}`,
    },
    {
      id: 'cost',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Biaya" />,
      accessorFn: (row) => (row.currentReading - row.previousReading) * row.ratePerUnit,
      cell: ({ getValue }) => formatRupiah(getValue<number>()),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => (
        <RowActions
          onEdit={() => openEdit(row.original)}
          onDelete={() => handleDelete(row.original.id)}
          deleteLabel="Data pembacaan meter ini akan dihapus."
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Submetering Air & Listrik</h1>
        <p className="text-sm text-muted-foreground">
          Pencatatan meter individual per unit untuk perhitungan tagihan utilitas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Meter Air</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{waterCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Meter Listrik</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{electricityCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Biaya Pemakaian</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatRupiah(totalUsageCost)}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pembacaan Meter</CardTitle>
          <CardDescription>Pembacaan meter air & listrik per unit per periode</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={readings}
            facetedFilters={[{ columnId: 'meterType', title: 'Jenis Meter', options: meterTypeOptions }]}
            addLabel="Tambah Pembacaan"
            onAdd={openAdd}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? 'Edit Pembacaan Meter' : 'Tambah Pembacaan Meter'}
        description="Lengkapi data pembacaan meter unit"
        fields={fields}
        defaultValues={
          editing
            ? {
                unitId: editing.unitId,
                meterType: editing.meterType,
                period: editing.period,
                previousReading: editing.previousReading,
                currentReading: editing.currentReading,
                ratePerUnit: editing.ratePerUnit,
              }
            : emptyValues
        }
        onSubmit={handleSubmit}
        submitLabel={editing ? 'Simpan Perubahan' : 'Tambah'}
      />
    </div>
  )
}
