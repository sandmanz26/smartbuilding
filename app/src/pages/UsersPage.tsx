import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableColumnHeader } from '@/components/data-table/DataTableColumnHeader'
import { RowActions } from '@/components/data-table/RowActions'
import { FormDialog, type FieldConfig, type FormValues } from '@/components/data-table/FormDialog'
import { users as initialUsers, buildings } from '@/data/mock'
import { formatDateTime } from '@/lib/format'
import type { SystemUser, UserRole } from '@/types'

const roleLabel: Record<string, string> = {
  admin: 'Admin',
  facility_manager: 'Facility Manager',
  technician: 'Teknisi',
  viewer: 'Viewer',
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

const roleOptions = (Object.keys(roleLabel) as UserRole[]).map((r) => ({
  label: roleLabel[r],
  value: r,
}))

const statusOptions = [
  { label: 'Aktif', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
]

const fields: FieldConfig[] = [
  { name: 'name', label: 'Nama', type: 'text', placeholder: 'cth. Dewi Lestari' },
  { name: 'email', label: 'Email', type: 'text', placeholder: 'cth. dewi@gedung.id' },
  { name: 'role', label: 'Role', type: 'select', options: roleOptions },
  {
    name: 'buildingsAccess',
    label: 'Akses Gedung (ID gedung, pisahkan koma)',
    type: 'text',
    placeholder: 'bld-01,bld-02,bld-03',
  },
  { name: 'lastActive', label: 'Aktif Terakhir', type: 'datetime' },
  { name: 'status', label: 'Status', type: 'select', options: statusOptions },
]

const emptyValues: FormValues = {
  name: '',
  email: '',
  role: 'viewer',
  buildingsAccess: '',
  lastActive: '',
  status: 'active',
}

export default function UsersPage() {
  const [users, setUsers] = useState<SystemUser[]>(initialUsers)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<SystemUser | null>(null)

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(user: SystemUser) {
    setEditing(user)
    setDialogOpen(true)
  }

  function handleDelete(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  function handleSubmit(values: FormValues) {
    const payload = {
      name: String(values.name),
      email: String(values.email),
      role: values.role as UserRole,
      buildingsAccess: String(values.buildingsAccess)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      lastActive: String(values.lastActive),
      status: values.status as 'active' | 'suspended',
    }
    if (editing) {
      setUsers((prev) => prev.map((u) => (u.id === editing.id ? { ...u, ...payload } : u)))
    } else {
      setUsers((prev) => [...prev, { id: `usr-${Date.now()}`, ...payload }])
    }
  }

  const columns: ColumnDef<SystemUser>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nama" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials(row.original.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.email}</span>,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => roleLabel[row.original.role],
      filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id) as string),
    },
    {
      id: 'buildingsAccess',
      header: 'Akses Gedung',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.buildingsAccess
            .map((id) => buildings.find((b) => b.id === id)?.name)
            .filter(Boolean)
            .join(', ')}
        </span>
      ),
    },
    {
      accessorKey: 'lastActive',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Aktif Terakhir" />,
      cell: ({ row }) => <span className="whitespace-nowrap text-xs">{formatDateTime(row.original.lastActive)}</span>,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'secondary' : 'destructive'}>
          {row.original.status === 'active' ? 'Aktif' : 'Suspended'}
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
          deleteLabel={`Pengguna ${row.original.name} akan dihapus dari sistem.`}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Pengguna & Role</h1>
        <p className="text-sm text-muted-foreground">
          Kelola akses pengguna lintas gedung berdasarkan role.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>{users.length} pengguna terdaftar di sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            searchColumnId="name"
            searchPlaceholder="Cari nama pengguna..."
            facetedFilters={[
              { columnId: 'role', title: 'Role', options: roleOptions },
              { columnId: 'status', title: 'Status', options: statusOptions },
            ]}
            addLabel="Tambah Pengguna"
            onAdd={openAdd}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? 'Edit Pengguna' : 'Tambah Pengguna'}
        description="Lengkapi data pengguna sistem"
        fields={fields}
        defaultValues={
          editing
            ? {
                name: editing.name,
                email: editing.email,
                role: editing.role,
                buildingsAccess: editing.buildingsAccess.join(','),
                lastActive: editing.lastActive,
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
