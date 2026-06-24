import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableColumnHeader } from '@/components/data-table/DataTableColumnHeader'
import { RowActions } from '@/components/data-table/RowActions'
import { FormDialog, type FieldConfig, type FormValues } from '@/components/data-table/FormDialog'
import { buildings, units, parkingSlots as initialParkingSlots } from '@/data/mock'
import { parkingStatusLabel, parkingStatusVariant, parkingUserTypeLabel, parkingUserTypeVariant } from '@/lib/status'
import type { ParkingSlot, ParkingSlotStatus, ParkingVehicleType, ParkingUserType } from '@/types'

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

const userTypeOptions = (Object.keys(parkingUserTypeLabel) as ParkingUserType[]).map((v) => ({
  label: parkingUserTypeLabel[v],
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
  { name: 'userType', label: 'Jenis Pengguna', type: 'select', options: userTypeOptions },
  { name: 'unitId', label: 'Unit', type: 'select', options: unitOptions },
  { name: 'vehiclePlate', label: 'No. Kendaraan', type: 'text', placeholder: 'cth. B 1234 ABC' },
  { name: 'status', label: 'Status', type: 'select', options: statusOptions },
]

const emptyValues: FormValues = {
  buildingId: buildingOptions[0]?.value ?? '',
  slotCode: '',
  level: '',
  vehicleType: 'car',
  userType: 'resident',
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

  const quotaUsage = units.map((unit) => {
    const assigned = parkingSlots.filter((p) => p.unitId === unit.id).length
    return {
      unit,
      assigned,
      quota: unit.parkingQuota,
      overQuota: assigned > unit.parkingQuota,
      noSlot: assigned === 0 && unit.parkingQuota > 0,
    }
  })
  const overQuotaUnits = quotaUsage.filter((q) => q.overQuota)
  const noSlotUnits = quotaUsage.filter((q) => q.noSlot)

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
      userType: values.userType as ParkingUserType,
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
      accessorKey: 'userType',
      header: 'Jenis Pengguna',
      cell: ({ row }) => (
        <Badge variant={parkingUserTypeVariant[row.original.userType]}>
          {parkingUserTypeLabel[row.original.userType]}
        </Badge>
      ),
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
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Unit Lebih Kuota</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{overQuotaUnits.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Unit Belum Ada Slot</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{noSlotUnits.length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kuota Parkir per Unit</CardTitle>
          <CardDescription>Jumlah slot terpakai dibandingkan kuota parkir unit</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit</TableHead>
                <TableHead>Tower</TableHead>
                <TableHead>Kuota</TableHead>
                <TableHead>Terpakai</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotaUsage.map(({ unit, assigned, quota, overQuota, noSlot }) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                  <TableCell>{buildings.find((b) => b.id === unit.buildingId)?.name ?? '-'}</TableCell>
                  <TableCell>{quota}</TableCell>
                  <TableCell>{assigned}</TableCell>
                  <TableCell>
                    {overQuota ? (
                      <Badge variant="destructive">Lebih Kuota</Badge>
                    ) : noSlot ? (
                      <Badge variant="outline">Belum Ada Slot</Badge>
                    ) : (
                      <Badge variant="secondary">Sesuai Kuota</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
              { columnId: 'userType', title: 'Jenis Pengguna', options: userTypeOptions },
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
                userType: editing.userType,
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
