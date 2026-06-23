import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableColumnHeader } from '@/components/data-table/DataTableColumnHeader'
import { RowActions } from '@/components/data-table/RowActions'
import { FormDialog, type FieldConfig, type FormValues } from '@/components/data-table/FormDialog'
import { buildings, assets, workOrders as initialWorkOrders } from '@/data/mock'
import { priorityBadgeVariant, workOrderStatusLabel } from '@/lib/status'
import { formatDateTime } from '@/lib/format'
import type { WorkOrder, WorkOrderPriority, WorkOrderStatus } from '@/types'

const NO_ASSET = 'none'

const priorityOptions: { label: string; value: string }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
]

const statusOptions = (Object.keys(workOrderStatusLabel) as WorkOrderStatus[]).map((s) => ({
  label: workOrderStatusLabel[s],
  value: s,
}))

const buildingOptions = buildings.map((b) => ({ label: b.name, value: b.id }))

const assetOptions = [
  { label: '— Tidak ada —', value: NO_ASSET },
  ...assets.map((a) => ({ label: a.name, value: a.id })),
]

const fields: FieldConfig[] = [
  { name: 'buildingId', label: 'Gedung', type: 'select', options: buildingOptions },
  { name: 'assetId', label: 'Aset', type: 'select', options: assetOptions },
  { name: 'title', label: 'Judul', type: 'text', placeholder: 'cth. Servis AHU Lantai 5' },
  { name: 'priority', label: 'Prioritas', type: 'select', options: priorityOptions },
  { name: 'status', label: 'Status', type: 'select', options: statusOptions },
  { name: 'assignee', label: 'PIC', type: 'text', placeholder: 'cth. Budi Santoso' },
  { name: 'dueAt', label: 'Tenggat', type: 'datetime' },
]

const emptyValues: FormValues = {
  buildingId: buildingOptions[0]?.value ?? '',
  assetId: NO_ASSET,
  title: '',
  priority: 'medium',
  status: 'open',
  assignee: '',
  dueAt: '',
}

export default function Maintenance() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<WorkOrder | null>(null)

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(workOrder: WorkOrder) {
    setEditing(workOrder)
    setDialogOpen(true)
  }

  function handleDelete(id: string) {
    setWorkOrders((prev) => prev.filter((w) => w.id !== id))
  }

  function handleSubmit(values: FormValues) {
    const assetId = String(values.assetId)
    const payload = {
      buildingId: String(values.buildingId),
      assetId: assetId === NO_ASSET ? undefined : assetId,
      title: String(values.title),
      priority: values.priority as WorkOrderPriority,
      status: values.status as WorkOrderStatus,
      assignee: String(values.assignee),
      dueAt: String(values.dueAt),
    }
    if (editing) {
      setWorkOrders((prev) => prev.map((w) => (w.id === editing.id ? { ...w, ...payload } : w)))
    } else {
      setWorkOrders((prev) => [
        ...prev,
        { id: `wo-${Date.now()}`, createdAt: new Date().toISOString(), ...payload },
      ])
    }
  }

  const columns: ColumnDef<WorkOrder>[] = [
    {
      id: 'building',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Gedung" />,
      accessorFn: (row) => buildings.find((b) => b.id === row.buildingId)?.name ?? '-',
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Judul" />,
      cell: ({ row }) => <span className="max-w-[260px] truncate font-medium">{row.original.title}</span>,
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Prioritas" />,
      cell: ({ row }) => (
        <Badge variant={priorityBadgeVariant[row.original.priority]} className="capitalize">
          {row.original.priority}
        </Badge>
      ),
      filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id) as string),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => workOrderStatusLabel[row.original.status],
      filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id) as string),
    },
    {
      accessorKey: 'assignee',
      header: ({ column }) => <DataTableColumnHeader column={column} title="PIC" />,
    },
    {
      accessorKey: 'dueAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tenggat" />,
      cell: ({ row }) => <span className="whitespace-nowrap text-xs">{formatDateTime(row.original.dueAt)}</span>,
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => (
        <RowActions
          onEdit={() => openEdit(row.original)}
          onDelete={() => handleDelete(row.original.id)}
          deleteLabel={`Work order "${row.original.title}" akan dihapus dari sistem.`}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Aset & Maintenance</h1>
        <p className="text-sm text-muted-foreground">
          Kesehatan aset kritikal dan tracking work order.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kesehatan Aset</CardTitle>
          <CardDescription>Skor kesehatan berdasarkan kondisi & riwayat maintenance</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets.map((a) => {
            const building = buildings.find((b) => b.id === a.buildingId)
            return (
              <div key={a.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{a.name}</h3>
                  <span className="text-xs text-muted-foreground">{a.category}</span>
                </div>
                <p className="text-xs text-muted-foreground">{building?.name} — {a.location}</p>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Health Score</span>
                    <span>{a.healthScore}%</span>
                  </div>
                  <Progress value={a.healthScore} className="h-2" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Maintenance berikutnya: {new Date(a.nextMaintenanceDate).toLocaleDateString('id-ID')}
                </p>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work Order</CardTitle>
          <CardDescription>Pekerjaan maintenance yang sedang berjalan</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={workOrders}
            searchColumnId="title"
            searchPlaceholder="Cari judul work order..."
            facetedFilters={[
              { columnId: 'status', title: 'Status', options: statusOptions },
              { columnId: 'priority', title: 'Prioritas', options: priorityOptions },
            ]}
            addLabel="Tambah Work Order"
            onAdd={openAdd}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? 'Edit Work Order' : 'Tambah Work Order'}
        description="Lengkapi data work order maintenance"
        fields={fields}
        defaultValues={
          editing
            ? {
                buildingId: editing.buildingId,
                assetId: editing.assetId ?? NO_ASSET,
                title: editing.title,
                priority: editing.priority,
                status: editing.status,
                assignee: editing.assignee,
                dueAt: editing.dueAt,
              }
            : emptyValues
        }
        onSubmit={handleSubmit}
        submitLabel={editing ? 'Simpan Perubahan' : 'Tambah'}
      />
    </div>
  )
}
