import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableColumnHeader } from '@/components/data-table/DataTableColumnHeader'
import { RowActions } from '@/components/data-table/RowActions'
import { FormDialog, type FieldConfig, type FormValues } from '@/components/data-table/FormDialog'
import { buildings, units, amenities, amenityBookings as initialAmenityBookings } from '@/data/mock'
import { amenityStatusLabel, amenityStatusVariant } from '@/lib/status'
import { formatDate, generateTimeSlots } from '@/lib/format'
import type { AmenityBooking, AmenityBookingStatus } from '@/types'

const statusOptions = (Object.keys(amenityStatusLabel) as AmenityBookingStatus[]).map((s) => ({
  label: amenityStatusLabel[s],
  value: s,
}))

const activeAmenities = amenities.filter((a) => a.status === 'active')

const amenityOptions = activeAmenities.map((a) => ({
  label: a.audience === 'all' ? a.name : `${a.name} (${buildings.find((b) => b.id === a.buildingId)?.name ?? '-'})`,
  value: a.id,
}))

const unitOptions = units.map((u) => ({ label: `${u.unitNumber} (${buildings.find((b) => b.id === u.buildingId)?.name})`, value: u.id }))

const emptyValues: FormValues = {
  amenityId: amenityOptions[0]?.value ?? '',
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
  // Tracks the amenity currently selected inside the open form dialog, so timeSlot
  // options can be regenerated reactively from that amenity's operating hours/slot duration.
  const [formAmenityId, setFormAmenityId] = useState<string>(amenityOptions[0]?.value ?? '')

  const confirmedCount = amenityBookings.filter((a) => a.status === 'confirmed').length
  const pendingCount = amenityBookings.filter((a) => a.status === 'pending').length

  function amenityName(id: string) {
    return amenities.find((a) => a.id === id)?.name ?? '-'
  }

  /** How many active (non-cancelled) bookings already occupy this amenity+date+slot. */
  function bookedCount(amenityId: string, date: string, timeSlot: string, excludeId?: string) {
    return amenityBookings.filter(
      (b) =>
        b.amenityId === amenityId &&
        b.date === date &&
        b.timeSlot === timeSlot &&
        b.status !== 'cancelled' &&
        b.id !== excludeId,
    ).length
  }

  function quotaFor(amenityId: string) {
    return amenities.find((a) => a.id === amenityId)?.capacityPerSlot ?? 0
  }

  const timeSlotOptions = useMemo(() => {
    const amenity = amenities.find((a) => a.id === formAmenityId)
    if (!amenity) return []
    return generateTimeSlots(amenity.operatingHoursStart, amenity.operatingHoursEnd, amenity.slotDurationMinutes).map(
      (slot) => ({ label: slot, value: slot }),
    )
  }, [formAmenityId])

  const fields: FieldConfig[] = [
    {
      name: 'amenityId',
      label: 'Fasilitas',
      type: 'select',
      options: amenityOptions,
    },
    { name: 'unitId', label: 'Unit', type: 'select', options: unitOptions },
    { name: 'bookedBy', label: 'Dipesan Oleh', type: 'text', placeholder: 'cth. Andi Wijaya' },
    { name: 'date', label: 'Tanggal', type: 'date' },
    {
      name: 'timeSlot',
      label: 'Slot Waktu',
      type: 'select',
      options: timeSlotOptions.length > 0 ? timeSlotOptions : [{ label: 'Pilih fasilitas dahulu', value: '' }],
    },
    { name: 'status', label: 'Status', type: 'select', options: statusOptions },
  ]

  function openAdd() {
    setEditing(null)
    setFormAmenityId(amenityOptions[0]?.value ?? '')
    setDialogOpen(true)
  }

  function openEdit(booking: AmenityBooking) {
    setEditing(booking)
    setFormAmenityId(booking.amenityId)
    setDialogOpen(true)
  }

  function handleDelete(id: string) {
    setAmenityBookings((prev) => prev.filter((a) => a.id !== id))
  }

  function handleSubmit(values: FormValues) {
    const unit = units.find((u) => u.id === String(values.unitId))
    const amenityId = String(values.amenityId)
    const date = String(values.date)
    const timeSlot = String(values.timeSlot)
    const status = values.status as AmenityBookingStatus

    if (status !== 'cancelled') {
      const already = bookedCount(amenityId, date, timeSlot, editing?.id)
      const quota = quotaFor(amenityId)
      if (already >= quota) {
        window.alert(
          `Kuota penuh untuk ${amenityName(amenityId)} pada ${formatDate(date)} slot ${timeSlot}. ` +
            `(${already}/${quota} sudah terisi). Reservasi tidak disimpan.`,
        )
        return
      }
    }

    const payload = {
      amenityId,
      unitId: String(values.unitId),
      buildingId: unit?.buildingId ?? '',
      bookedBy: String(values.bookedBy),
      date,
      timeSlot,
      status,
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
      id: 'amenityName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fasilitas" />,
      accessorFn: (row) => amenityName(row.amenityId),
      cell: ({ row }) => <span className="font-medium">{amenityName(row.original.amenityId)}</span>,
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
      id: 'quota',
      header: 'Kuota Slot',
      cell: ({ row }) => {
        const quota = quotaFor(row.original.amenityId)
        const used = bookedCount(row.original.amenityId, row.original.date, row.original.timeSlot)
        return (
          <span className={used >= quota ? 'text-destructive font-medium' : 'text-muted-foreground'}>
            {used} dari {quota} slot terisi
          </span>
        )
      },
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
          deleteLabel={`Reservasi ${amenityName(row.original.amenityId)} oleh ${row.original.bookedBy} akan dihapus dari sistem.`}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Amenity Booking</h1>
        <p className="text-sm text-muted-foreground">
          Reservasi fasilitas bersama sesuai jadwal, jam operasional, dan kuota yang diatur di Pengaturan Fasilitas.
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
          <CardDescription>Jadwal penggunaan fasilitas bersama per tower, lengkap dengan sisa kuota per slot</CardDescription>
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
        key={editing?.id ?? 'new'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? 'Edit Reservasi' : 'Tambah Reservasi'}
        description="Lengkapi data reservasi fasilitas. Slot waktu mengikuti jam operasional & durasi slot fasilitas terpilih."
        fields={fields}
        defaultValues={
          editing
            ? {
                amenityId: editing.amenityId,
                unitId: editing.unitId,
                bookedBy: editing.bookedBy,
                date: editing.date,
                timeSlot: editing.timeSlot,
                status: editing.status,
              }
            : { ...emptyValues, amenityId: formAmenityId }
        }
        onSubmit={handleSubmit}
        submitLabel={editing ? 'Simpan Perubahan' : 'Tambah'}
        onFieldChange={(name, value) => {
          if (name === 'amenityId') setFormAmenityId(String(value))
        }}
      />
    </div>
  )
}
