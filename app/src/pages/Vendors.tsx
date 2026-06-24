import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableColumnHeader } from '@/components/data-table/DataTableColumnHeader'
import { RowActions } from '@/components/data-table/RowActions'
import { FormDialog, type FieldConfig, type FormValues } from '@/components/data-table/FormDialog'
import { vendors as initialVendors } from '@/data/mock'
import { vendorStatusLabel, vendorStatusVariant, vendorCategoryLabel } from '@/lib/status'
import { formatDate } from '@/lib/format'
import type { Vendor, VendorCategory, VendorStatus } from '@/types'

const statusOptions = (Object.keys(vendorStatusLabel) as VendorStatus[]).map((s) => ({
  label: vendorStatusLabel[s],
  value: s,
}))

const categoryOptions = (Object.keys(vendorCategoryLabel) as VendorCategory[]).map((c) => ({
  label: vendorCategoryLabel[c],
  value: c,
}))

const fields: FieldConfig[] = [
  { name: 'name', label: 'Nama Vendor', type: 'text', placeholder: 'cth. CV Bersih Sentosa' },
  { name: 'category', label: 'Kategori', type: 'select', options: categoryOptions },
  { name: 'contactPerson', label: 'Kontak Person', type: 'text', placeholder: 'cth. Pak Slamet' },
  { name: 'phone', label: 'No. Telepon', type: 'text', placeholder: 'cth. 021-5550101' },
  { name: 'contractStart', label: 'Mulai Kontrak', type: 'date' },
  { name: 'contractEnd', label: 'Akhir Kontrak', type: 'date' },
  { name: 'status', label: 'Status', type: 'select', options: statusOptions },
]

const emptyValues: FormValues = {
  name: '',
  category: 'general',
  contactPerson: '',
  phone: '',
  contractStart: '',
  contractEnd: '',
  status: 'active',
}

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Vendor | null>(null)

  const activeCount = vendors.filter((v) => v.status === 'active').length
  const categoriesCount = new Set(vendors.map((v) => v.category)).size

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(vendor: Vendor) {
    setEditing(vendor)
    setDialogOpen(true)
  }

  function handleDelete(id: string) {
    setVendors((prev) => prev.filter((v) => v.id !== id))
  }

  function handleBulkDelete(rows: Vendor[]) {
    const ids = new Set(rows.map((r) => r.id))
    setVendors((prev) => prev.filter((v) => !ids.has(v.id)))
  }

  function handleImport(rows: Record<string, string>[]) {
    const categoryByLabel = new Map(
      (Object.keys(vendorCategoryLabel) as VendorCategory[]).map((c) => [vendorCategoryLabel[c], c]),
    )
    const imported: Vendor[] = rows.map((row, idx) => ({
      id: `vnd-import-${Date.now()}-${idx}`,
      name: row['Nama Vendor'] ?? '',
      category: categoryByLabel.get(row['Kategori']) ?? 'general',
      contactPerson: row['Kontak Person'] ?? '',
      phone: row['Telepon'] ?? '',
      contractStart: new Date().toISOString().slice(0, 10),
      contractEnd: new Date().toISOString().slice(0, 10),
      status: 'active',
    }))
    setVendors((prev) => [...imported, ...prev])
  }

  function handleSubmit(values: FormValues) {
    const payload = {
      name: String(values.name),
      category: values.category as VendorCategory,
      contactPerson: String(values.contactPerson),
      phone: String(values.phone),
      contractStart: String(values.contractStart),
      contractEnd: String(values.contractEnd),
      status: values.status as VendorStatus,
    }
    if (editing) {
      setVendors((prev) => prev.map((v) => (v.id === editing.id ? { ...v, ...payload } : v)))
    } else {
      setVendors((prev) => [...prev, { id: `vnd-${Date.now()}`, ...payload }])
    }
  }

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Vendor" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'category',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kategori" />,
      cell: ({ row }) => vendorCategoryLabel[row.original.category],
      filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id) as string),
    },
    {
      accessorKey: 'contactPerson',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kontak Person" />,
    },
    {
      accessorKey: 'phone',
      header: 'Telepon',
    },
    {
      id: 'period',
      header: 'Periode Kontrak',
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm">
          {formatDate(row.original.contractStart)} – {formatDate(row.original.contractEnd)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={vendorStatusVariant[row.original.status]}>{vendorStatusLabel[row.original.status]}</Badge>
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
          deleteLabel={`Vendor ${row.original.name} akan dihapus dari sistem.`}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Vendor & Kontraktor</h1>
        <p className="text-sm text-muted-foreground">
          Data vendor jasa kebersihan, keamanan, HVAC, lift, dan kontraktor lainnya.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Vendor</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{vendors.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Kontrak Aktif</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{activeCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Jumlah Kategori</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{categoriesCount}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Vendor</CardTitle>
          <CardDescription>Vendor & kontraktor yang bekerja sama dengan pengelola gedung</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={vendors}
            searchColumnId="name"
            searchPlaceholder="Cari nama vendor..."
            facetedFilters={[
              { columnId: 'category', title: 'Kategori', options: categoryOptions },
              { columnId: 'status', title: 'Status', options: statusOptions },
            ]}
            addLabel="Tambah Vendor"
            onAdd={openAdd}
            exportFilename="vendors"
            onImport={handleImport}
            onBulkDelete={handleBulkDelete}
            getRowId={(row) => row.id}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? 'Edit Vendor' : 'Tambah Vendor'}
        description="Lengkapi data vendor/kontraktor"
        fields={fields}
        defaultValues={
          editing
            ? {
                name: editing.name,
                category: editing.category,
                contactPerson: editing.contactPerson,
                phone: editing.phone,
                contractStart: editing.contractStart,
                contractEnd: editing.contractEnd,
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
