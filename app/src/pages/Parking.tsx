import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableColumnHeader } from '@/components/data-table/DataTableColumnHeader'
import { RowActions } from '@/components/data-table/RowActions'
import { FormDialog, type FieldConfig, type FormValues } from '@/components/data-table/FormDialog'
import { buildings, units, parkingSlots as initialParkingSlots } from '@/data/mock'
import { parkingStatusLabel, parkingStatusVariant } from '@/lib/status'
import type { ParkingSlot, ParkingSlotStatus, ParkingVehicleType } from '@/types'

const statusOptions = (Object.keys(parkingStatusLabel) as ParkingSlotStatus[]).map((s) => ({
  label: parkingStatusLabel[s],
  value: s,
}))

const vehicleTypeLabel: Record<ParkingVehicleType, string> = {
  car: 'Mobil',
  motorcycle: 'Motor',
}

const vehicleTypeOptions = (Object.keys(vehicleTypeLabel) as ParkingVehicleType[]).map((v) => ({
  label: vehicleTypeLabel[v],
  value: v,
}))

const buildingOptions = buildings.map((b) => ({ label: b.name, value: b.id }))

const NO_UNIT = '__none__'
const unitOptions = [
  { label: 'Tidak ada', value: NO_UNIT },
  ...units.map((u) => ({ label: `${u.unitNumber} (${buildings.find((b) => b.id === u.buildingId)?.name})`, value: u.id })),
]

const fields: FieldConfig[] = [
  { name: 'buildingId', label: 'Tower', type: 'select', options: buildingOptions },
  { name: 'slotCode', label: 'Kode Slot', type: 'text', placeholder: 'cth. P1-A01' },
  { name: 'level', label: 'Level', type: 'text', placeholder: 'cth. B1' },
  { name: 'vehicleType', label: 'Jenis Kendaraan', type: 'select', options: vehicleTypeOptions },
  { name: 'unitId', label: 'Unit', type: 'select', options: unitOptions },
  { name: 'vehiclePlate', label: 'No. Kendaraan', type: 'text', placeholder: 'cth. B 1234 ABC' },
  { name: 'status', label: 'Status', type: 'select', options: statusOptions },
]

const emptyValues: FormValues = {
  buildingId: buildingOptions[0]?.value ?? '',
  slotCode: '',
  level: '',
  vehicleType: 'car',
  unitId: NO_UNIT,
  vehiclePlate: '',
  status: 'available',
}

export default function Parking() {
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>(initialParkingSlots)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ParkingSlot | null>(null)

  const available = parkingSlots.filter((p) => p.status === 'available').length
  const occupied = parkingSlots.filter((p) => p.status === 'occupied').length

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(slot: ParkingSlot) {
    setEditing(slot)
    setDialogOpen(true)
  }

  function handleDelete(id: string) {
    setParkingSlots((prev) => prev.filter((p) => p.id !== id))
  }

  function handleSubmit(values: FormValues) {
    const unitId = String(values.unitId)
    const payload = {
      buildingId: String(values.buildingId),
      slotCode: String(values.slotCode),
      level: String(values.level),
      vehicleType: values.vehicleType as ParkingVehicleType,
      unitId: unitId === NO_UNIT ? undefined : unitId,
      vehiclePlate: String(values.vehiclePlate ?? '') || undefined,
      status: values.status as ParkingSlotStatus,
    }
    if (editing) {
      setParkingSlots((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...payload } : p)))
    } else {
      setParkingSlots((prev) => [...prev, { id: `prk-${Date.now()}`, ...payload }])
    }
  }

  const columns: ColumnDef<ParkingSlot>[] = [
    {
      id: 'building',
      header: 'Tower',
      accessorFn: (row) => buildings.find((b) => b.id === row.buildingId)?.name ?? '-',
    },
    {
      accessorKey: 'slotCode',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Slot" />,
      cell: ({ row }) => <span className="font-medium">{row.original.slotCode}</span>,
    },
    {
      accessorKey: 'level',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Level" />,
    },
    {
      accessorKey: 'vehicleType',
      header: 'Jenis',
      cell: ({ row }) => vehicleTypeLabel[row.original.vehicleType],
      filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id) as string),
    },
    {
      id: 'unit',
      header: 'Unit',
      accessorFn: (row) => units.find((u) => u.id === row.unitId)?.unitNumber ?? '-',
    },
    {
      id: 'vehiclePlate',
      header: 'No. Kendaraan',
      accessorFn: (row) => row.vehiclePlate ?? '-',
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={parkingStatusVariant[row.original.status]}>{parkingStatusLabel[row.original.status]}</Badge>
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
          deleteLabel={`Slot parkir ${row.original.slotCode} akan dihapus dari sistem.`}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Parking Management</h1>
        <p className="text-sm text-muted-foreground">
          Status slot parkir dan kendaraan terdaftar per tower.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Slot</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{parkingSlots.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Terisi</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{occupied}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Tersedia</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{available}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Slot Parkir</CardTitle>
          <CardDescription>Status & kendaraan terdaftar per slot</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={parkingSlots}
            facetedFilters={[
              { columnId: 'status', title: 'Status', options: statusOptions },
              { columnId: 'vehicleType', title: 'Jenis', options: vehicleTypeOptions },
            ]}
            addLabel="Tambah Slot"
            onAdd={openAdd}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? 'Edit Slot Parkir' : 'Tambah Slot Parkir'}
        description="Lengkapi data slot parkir"
        fields={fields}
        defaultValues={
          editing
            ? {
                buildingId: editing.buildingId,
                slotCode: editing.slotCode,
                level: editing.level,
                vehicleType: editing.vehicleType,
                unitId: editing.unitId ?? NO_UNIT,
                vehiclePlate: editing.vehiclePlate ?? '',
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
