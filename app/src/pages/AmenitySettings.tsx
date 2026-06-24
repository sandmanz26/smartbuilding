import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableColumnHeader } from '@/components/data-table/DataTableColumnHeader'
import { RowActions } from '@/components/data-table/RowActions'
import { FormDialog, type FieldConfig, type FormValues } from '@/components/data-table/FormDialog'
import { buildings, amenities as initialAmenities } from '@/data/mock'
import {
  amenityFacilityStatusLabel,
  amenityFacilityStatusVariant,
  amenityCategoryLabel,
} from '@/lib/status'
import { generateTimeSlots } from '@/lib/format'
import type { Amenity, AmenityAudience, AmenityCategory, AmenityStatus } from '@/types'

const statusOptions = (Object.keys(amenityFacilityStatusLabel) as AmenityStatus[]).map((s) => ({
  label: amenityFacilityStatusLabel[s],
  value: s,
}))

const categoryOptions = (Object.keys(amenityCategoryLabel) as AmenityCategory[]).map((c) => ({
  label: amenityCategoryLabel[c],
  value: c,
}))

const audienceOptions: { label: string; value: string }[] = [
  { label: 'Semua Tower', value: 'all' },
  ...buildings.map((b) => ({ label: b.name, value: b.id })),
]

const fields: FieldConfig[] = [
  { name: 'name', label: 'Nama Fasilitas', type: 'text', placeholder: 'cth. Perpustakaan' },
  { name: 'category', label: 'Kategori', type: 'select', options: categoryOptions },
  { name: 'audienceScope', label: 'Tower / Cakupan', type: 'select', options: audienceOptions },
  { name: 'operatingHoursStart', label: 'Jam Buka', type: 'text', placeholder: 'cth. 06:00' },
  { name: 'operatingHoursEnd', label: 'Jam Tutup', type: 'text', placeholder: 'cth. 22:00' },
  { name: 'slotDurationMinutes', label: 'Durasi Slot (menit)', type: 'number', min: 15 },
  { name: 'capacityPerSlot', label: 'Kuota per Slot', type: 'number', min: 1 },
  { name: 'status', label: 'Status', type: 'select', options: statusOptions },
]

const emptyValues: FormValues = {
  name: '',
  category: 'rekreasi',
  audienceScope: 'all',
  operatingHoursStart: '08:00',
  operatingHoursEnd: '20:00',
  slotDurationMinutes: 60,
  capacityPerSlot: 4,
  status: 'active',
}

function audienceLabel(amenity: Amenity) {
  if (amenity.audience === 'all') return 'Semua Tower'
  return buildings.find((b) => b.id === amenity.buildingId)?.name ?? '-'
}

export default function AmenitySettings() {
  const [amenities, setAmenities] = useState<Amenity[]>(initialAmenities)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Amenity | null>(null)

  const activeCount = amenities.filter((a) => a.status === 'active').length
  const totalCapacity = amenities.reduce((sum, a) => sum + a.capacityPerSlot, 0)

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(amenity: Amenity) {
    setEditing(amenity)
    setDialogOpen(true)
  }

  function handleDelete(id: string) {
    setAmenities((prev) => prev.filter((a) => a.id !== id))
  }

  function handleSubmit(values: FormValues) {
    const audienceScope = String(values.audienceScope)
    const audience: AmenityAudience = audienceScope === 'all' ? 'all' : 'single_building'
    const payload = {
      name: String(values.name),
      category: values.category as AmenityCategory,
      audience,
      buildingId: audience === 'single_building' ? audienceScope : undefined,
      operatingHoursStart: String(values.operatingHoursStart),
      operatingHoursEnd: String(values.operatingHoursEnd),
      slotDurationMinutes: Number(values.slotDurationMinutes),
      capacityPerSlot: Number(values.capacityPerSlot),
      status: values.status as AmenityStatus,
    }
    if (editing) {
      setAmenities((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...payload } : a)))
    } else {
      setAmenities((prev) => [...prev, { id: `fac-${Date.now()}`, ...payload }])
    }
  }

  const columns: ColumnDef<Amenity>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Fasilitas" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'category',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kategori" />,
      cell: ({ row }) => amenityCategoryLabel[row.original.category],
      filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id) as string),
    },
    {
      id: 'audience',
      header: 'Cakupan',
      accessorFn: (row) => audienceLabel(row),
    },
    {
      id: 'hours',
      header: 'Jam Operasional',
      cell: ({ row }) => `${row.original.operatingHoursStart} - ${row.original.operatingHoursEnd}`,
    },
    {
      accessorKey: 'slotDurationMinutes',
      header: 'Durasi Slot',
      cell: ({ row }) => `${row.original.slotDurationMinutes} menit`,
    },
    {
      accessorKey: 'capacityPerSlot',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kuota / Slot" />,
    },
    {
      id: 'slotCount',
      header: 'Jumlah Slot/Hari',
      cell: ({ row }) =>
        generateTimeSlots(
          row.original.operatingHoursStart,
          row.original.operatingHoursEnd,
          row.original.slotDurationMinutes,
        ).length,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={amenityFacilityStatusVariant[row.original.status]}>
          {amenityFacilityStatusLabel[row.original.status]}
        </Badge>
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
          deleteLabel={`Fasilitas ${row.original.name} akan dihapus dari sistem.`}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Pengaturan Fasilitas</h1>
        <p className="text-sm text-muted-foreground">
          Master data fasilitas bersama: jam operasional, durasi slot, dan kuota per slot untuk reservasi.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Fasilitas</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{amenities.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Aktif</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{activeCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Kuota per Slot</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalCapacity}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Fasilitas</CardTitle>
          <CardDescription>Kelola fasilitas yang dapat direservasi oleh penghuni</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={amenities}
            searchColumnId="name"
            searchPlaceholder="Cari nama fasilitas..."
            facetedFilters={[
              { columnId: 'category', title: 'Kategori', options: categoryOptions },
              { columnId: 'status', title: 'Status', options: statusOptions },
            ]}
            addLabel="Tambah Fasilitas"
            onAdd={openAdd}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? 'Edit Fasilitas' : 'Tambah Fasilitas'}
        description="Lengkapi data fasilitas, jam operasional, durasi slot, dan kuota"
        fields={fields}
        defaultValues={
          editing
            ? {
                name: editing.name,
                category: editing.category,
                audienceScope: editing.audience === 'all' ? 'all' : (editing.buildingId ?? 'all'),
                operatingHoursStart: editing.operatingHoursStart,
                operatingHoursEnd: editing.operatingHoursEnd,
                slotDurationMinutes: editing.slotDurationMinutes,
                capacityPerSlot: editing.capacityPerSlot,
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
