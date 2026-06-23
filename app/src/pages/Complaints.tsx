import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableColumnHeader } from '@/components/data-table/DataTableColumnHeader'
import { RowActions } from '@/components/data-table/RowActions'
import { FormDialog, type FieldConfig, type FormValues } from '@/components/data-table/FormDialog'
import { buildings, units, complaints as initialComplaints } from '@/data/mock'
import { complaintStatusLabel, complaintPriorityVariant } from '@/lib/status'
import type { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus } from '@/types'

const categoryLabel: Record<ComplaintCategory, string> = {
  hvac: 'HVAC',
  plumbing: 'Plumbing',
  electrical: 'Elektrikal',
  security: 'Keamanan',
  cleanliness: 'Kebersihan',
  noise: 'Kebisingan',
  other: 'Lainnya',
}

const statusOptions = (Object.keys(complaintStatusLabel) as ComplaintStatus[]).map((s) => ({
  label: complaintStatusLabel[s],
  value: s,
}))

const priorityOptions: { label: string; value: ComplaintPriority }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
]

const categoryOptions = (Object.keys(categoryLabel) as ComplaintCategory[]).map((c) => ({
  label: categoryLabel[c],
  value: c,
}))

const unitOptions = units.map((u) => ({ label: `${u.unitNumber} (${buildings.find((b) => b.id === u.buildingId)?.name})`, value: u.id }))

const fields: FieldConfig[] = [
  { name: 'unitId', label: 'Unit', type: 'select', options: unitOptions },
  { name: 'reportedBy', label: 'Pelapor', type: 'text', placeholder: 'cth. Reza Pratama' },
  { name: 'category', label: 'Kategori', type: 'select', options: categoryOptions },
  { name: 'description', label: 'Deskripsi', type: 'textarea', placeholder: 'Jelaskan keluhan secara singkat' },
  { name: 'priority', label: 'Prioritas', type: 'select', options: priorityOptions },
  { name: 'status', label: 'Status', type: 'select', options: statusOptions },
  { name: 'assignee', label: 'Petugas/Tim', type: 'text', placeholder: 'cth. Tim Teknik' },
]

const emptyValues: FormValues = {
  unitId: unitOptions[0]?.value ?? '',
  reportedBy: '',
  category: 'other',
  description: '',
  priority: 'medium',
  status: 'open',
  assignee: '',
}

export default function Complaints() {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Complaint | null>(null)

  function resolve(id: string) {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'resolved', assignee: c.assignee ?? 'Tim Teknik' } : c)),
    )
  }

  const openCount = complaints.filter((c) => c.status === 'open').length
  const urgentCount = complaints.filter((c) => c.priority === 'urgent' && c.status !== 'resolved').length

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(complaint: Complaint) {
    setEditing(complaint)
    setDialogOpen(true)
  }

  function handleDelete(id: string) {
    setComplaints((prev) => prev.filter((c) => c.id !== id))
  }

  function handleSubmit(values: FormValues) {
    const unit = units.find((u) => u.id === String(values.unitId))
    const payload = {
      unitId: String(values.unitId),
      buildingId: unit?.buildingId ?? '',
      reportedBy: String(values.reportedBy),
      category: values.category as ComplaintCategory,
      description: String(values.description),
      priority: values.priority as ComplaintPriority,
      status: values.status as ComplaintStatus,
      assignee: values.assignee ? String(values.assignee) : undefined,
    }
    if (editing) {
      setComplaints((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...payload } : c)))
    } else {
      setComplaints((prev) => [...prev, { id: `cmp-${Date.now()}`, createdAt: new Date().toISOString(), ...payload }])
    }
  }

  const columns: ColumnDef<Complaint>[] = [
    {
      id: 'building',
      header: 'Tower',
      accessorFn: (row) => buildings.find((b) => b.id === row.buildingId)?.name ?? '-',
    },
    {
      id: 'unit',
      header: 'Unit',
      accessorFn: (row) => units.find((u) => u.id === row.unitId)?.unitNumber ?? '-',
      cell: ({ row }) => <span className="font-medium">{units.find((u) => u.id === row.original.unitId)?.unitNumber ?? '-'}</span>,
    },
    {
      accessorKey: 'reportedBy',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Pelapor" />,
    },
    {
      accessorKey: 'category',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kategori" />,
      cell: ({ row }) => categoryLabel[row.original.category],
    },
    {
      accessorKey: 'description',
      header: 'Deskripsi',
      cell: ({ row }) => <span className="max-w-[260px] text-sm">{row.original.description}</span>,
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Prioritas" />,
      cell: ({ row }) => (
        <Badge variant={complaintPriorityVariant[row.original.priority]} className="capitalize">
          {row.original.priority}
        </Badge>
      ),
      filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id) as string),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => complaintStatusLabel[row.original.status],
      filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id) as string),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          {row.original.status !== 'resolved' && row.original.status !== 'closed' && (
            <Button size="sm" variant="outline" onClick={() => resolve(row.original.id)}>
              Tandai Selesai
            </Button>
          )}
          <RowActions
            onEdit={() => openEdit(row.original)}
            onDelete={() => handleDelete(row.original.id)}
            deleteLabel={`Keluhan dari ${row.original.reportedBy} akan dihapus dari sistem.`}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Keluhan & Tiket Layanan</h1>
        <p className="text-sm text-muted-foreground">
          Tiket keluhan penghuni — pelacakan dari pelaporan hingga penyelesaian.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Tiket Baru</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{openCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Urgent Belum Selesai</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{urgentCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Tiket</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{complaints.length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Keluhan</CardTitle>
          <CardDescription>Keluhan penghuni dari seluruh tower</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={complaints}
            searchColumnId="reportedBy"
            searchPlaceholder="Cari nama pelapor..."
            facetedFilters={[
              { columnId: 'status', title: 'Status', options: statusOptions },
              { columnId: 'priority', title: 'Prioritas', options: priorityOptions },
            ]}
            addLabel="Tambah Keluhan"
            onAdd={openAdd}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? 'Edit Keluhan' : 'Tambah Keluhan'}
        description="Lengkapi data tiket keluhan penghuni"
        fields={fields}
        defaultValues={
          editing
            ? {
                unitId: editing.unitId,
                reportedBy: editing.reportedBy,
                category: editing.category,
                description: editing.description,
                priority: editing.priority,
                status: editing.status,
                assignee: editing.assignee ?? '',
              }
            : emptyValues
        }
        onSubmit={handleSubmit}
        submitLabel={editing ? 'Simpan Perubahan' : 'Tambah'}
      />
    </div>
  )
}
