import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableColumnHeader } from '@/components/data-table/DataTableColumnHeader'
import { RowActions } from '@/components/data-table/RowActions'
import { FormDialog, type FieldConfig, type FormValues } from '@/components/data-table/FormDialog'
import { buildings, units, amenityBookings as initialAmenityBookings } from '@/data/mock'
import { amenityStatusLabel, amenityStatusVariant } from '@/lib/status'
import { formatDate } from '@/lib/format'
import type { AmenityBooking, AmenityBookingStatus } from '@/types'

const statusOptions = (Object.keys(amenityStatusLabel) as AmenityBookingStatus[]).map((s) => ({
  label: amenityStatusLabel[s],
  value: s,
}))

const amenityNameOptions = [
  { label: 'Kolam Renang', value: 'Kolam Renang' },
  { label: 'Gym', value: 'Gym' },
  { label: 'Function Hall', value: 'Function Hall' },
  { label: 'BBQ Area', value: 'BBQ Area' },
  { label: 'Sky Lounge', value: 'Sky Lounge' },
  { label: 'Co-working Space', value: 'Co-working Space' },
]

const unitOptions = units.map((u) => ({ label: `${u.unitNumber} (${buildings.find((b) => b.id === u.buildingId)?.name})`, value: u.id }))

const fields: FieldConfig[] = [
  { name: 'amenityName', label: 'Fasilitas', type: 'select', options: amenityNameOptions },
  { name: 'unitId', label: 'Unit', type: 'select', options: unitOptions },
  { name: 'bookedBy', label: 'Dipesan Oleh', type: 'text', placeholder: 'cth. Andi Wijaya' },
  { name: 'date', label: 'Tanggal', type: 'date' },
  { name: 'timeSlot', label: 'Slot Waktu', type: 'text', placeholder: 'cth. 07:00 - 08:00' },
  { name: 'status', label: 'Status', type: 'select', options: statusOptions },
]

const emptyValues: FormValues = {
  amenityName: amenityNameOptions[0]?.value ?? '',
  unitId: unitOptions[0]?.value ?? '',
  bookedBy: '',
  date: '',
  timeSlot: '',
  status: 'pending',
}

export default function Amenities() {
  const [amenityBookings, setAmenityBookings] = useState<AmenityBooking[]>(initialAmenityBookings)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AmenityBooking | null>(null)

  const confirmedCount = amenityBookings.filter((a) => a.status === 'confirmed').length
  const pendingCount = amenityBookings.filter((a) => a.status === 'pending').length

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(booking: AmenityBooking) {
    setEditing(booking)
    setDialogOpen(true)
  }

  function handleDelete(id: string) {
    setAmenityBookings((prev) => prev.filter((a) => a.id !== id))
  }

  function handleSubmit(values: FormValues) {
    const unit = units.find((u) => u.id === String(values.unitId))
    const payload = {
      amenityName: String(values.amenityName),
      unitId: String(values.unitId),
      buildingId: unit?.buildingId ?? '',
      bookedBy: String(values.bookedBy),
      date: String(values.date),
      timeSlot: String(values.timeSlot),
      status: values.status as AmenityBookingStatus,
    }
    if (editing) {
      setAmenityBookings((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...payload } : a)))
    } else {
      setAmenityBookings((prev) => [...prev, { id: `amn-${Date.now()}`, ...payload }])
    }
  }

  const columns: ColumnDef<AmenityBooking>[] = [
    {
      id: 'building',
      header: 'Tower',
      accessorFn: (row) => buildings.find((b) => b.id === row.buildingId)?.name ?? '-',
    },
    {
      accessorKey: 'amenityName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fasilitas" />,
      cell: ({ row }) => <span className="font-medium">{row.original.amenityName}</span>,
    },
    {
      id: 'unit',
      header: 'Unit',
      accessorFn: (row) => units.find((u) => u.id === row.unitId)?.unitNumber ?? '-',
    },
    {
      accessorKey: 'bookedBy',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Dipesan Oleh" />,
    },
    {
      accessorKey: 'date',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal" />,
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      accessorKey: 'timeSlot',
      header: 'Slot Waktu',
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={amenityStatusVariant[row.original.status]}>{amenityStatusLabel[row.original.status]}</Badge>
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
          deleteLabel={`Reservasi ${row.original.amenityName} oleh ${row.original.bookedBy} akan dihapus dari sistem.`}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Amenity Booking</h1>
        <p className="text-sm text-muted-foreground">
          Reservasi fasilitas bersama: kolam renang, gym, function hall, BBQ area.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Reservasi</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{amenityBookings.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Terkonfirmasi</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{confirmedCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Menunggu Konfirmasi</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{pendingCount}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Reservasi</CardTitle>
          <CardDescription>Jadwal penggunaan fasilitas bersama per tower</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={amenityBookings}
            searchColumnId="bookedBy"
            searchPlaceholder="Cari nama pemesan..."
            facetedFilters={[{ columnId: 'status', title: 'Status', options: statusOptions }]}
            addLabel="Tambah Reservasi"
            onAdd={openAdd}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? 'Edit Reservasi' : 'Tambah Reservasi'}
        description="Lengkapi data reservasi fasilitas"
        fields={fields}
        defaultValues={
          editing
            ? {
                amenityName: editing.amenityName,
                unitId: editing.unitId,
                bookedBy: editing.bookedBy,
                date: editing.date,
                timeSlot: editing.timeSlot,
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
