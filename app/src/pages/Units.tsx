import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/DataTable';
import { DataTableColumnHeader } from '@/components/data-table/DataTableColumnHeader';
import { RowActions } from '@/components/data-table/RowActions';
import { FormDialog, type FieldConfig, type FormValues } from '@/components/data-table/FormDialog';
import { units as initialUnits, buildings } from '@/data/mock';
import type { Unit, UnitOccupancyStatus } from '@/types';
import { unitStatusLabel, unitStatusVariant } from '@/lib/status';
import type { ColumnDef } from '@tanstack/react-table';

const buildingOptions = buildings.map((building) => ({
  label: building.name,
  value: building.id,
}));

const statusOptions: { label: string; value: UnitOccupancyStatus }[] = [
  { label: unitStatusLabel.occupied_owner, value: 'occupied_owner' },
  { label: unitStatusLabel.occupied_tenant, value: 'occupied_tenant' },
  { label: unitStatusLabel.vacant, value: 'vacant' },
  { label: unitStatusLabel.for_sale, value: 'for_sale' },
];

function getBuildingName(buildingId: string) {
  return buildings.find((building) => building.id === buildingId)?.name ?? '-';
}

const fields: FieldConfig[] = [
  { name: 'buildingId', label: 'Tower', type: 'select', options: buildingOptions },
  { name: 'unitNumber', label: 'No. Unit', type: 'text', placeholder: 'Contoh: A-1201' },
  { name: 'floor', label: 'Lantai', type: 'number' },
  { name: 'type', label: 'Tipe', type: 'text', placeholder: 'Contoh: Studio, 2BR' },
  { name: 'areaSqm', label: 'Luas (m2)', type: 'number' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: statusOptions,
  },
  { name: 'ownerName', label: 'Pemilik', type: 'text' },
  { name: 'tenantName', label: 'Penyewa', type: 'text' },
  { name: 'phone', label: 'Telepon', type: 'text' },
];

export default function Units() {
  const [data, setData] = useState<Unit[]>(initialUnits);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Unit | null>(null);

  const totalUnits = data.length;
  const occupiedUnits = data.filter(
    (unit) => unit.status === 'occupied_owner' || unit.status === 'occupied_tenant',
  ).length;
  const vacantUnits = data.filter(
    (unit) => unit.status === 'vacant' || unit.status === 'for_sale',
  ).length;

  function openAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(unit: Unit) {
    setEditing(unit);
    setDialogOpen(true);
  }

  function handleDelete(unit: Unit) {
    setData((prev) => prev.filter((item) => item.id !== unit.id));
  }

  function handleSubmit(values: FormValues) {
    if (editing) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editing.id
            ? {
                ...item,
                buildingId: String(values.buildingId),
                unitNumber: String(values.unitNumber),
                floor: Number(values.floor),
                type: String(values.type),
                areaSqm: Number(values.areaSqm),
                status: values.status as UnitOccupancyStatus,
                ownerName: String(values.ownerName),
                tenantName: values.tenantName ? String(values.tenantName) : undefined,
                phone: String(values.phone),
              }
            : item,
        ),
      );
    } else {
      const newUnit: Unit = {
        id: `unt-${Date.now()}`,
        buildingId: String(values.buildingId),
        unitNumber: String(values.unitNumber),
        floor: Number(values.floor),
        type: String(values.type),
        areaSqm: Number(values.areaSqm),
        status: values.status as UnitOccupancyStatus,
        ownerName: String(values.ownerName),
        tenantName: values.tenantName ? String(values.tenantName) : undefined,
        phone: String(values.phone),
      };
      setData((prev) => [newUnit, ...prev]);
    }
    setDialogOpen(false);
  }

  const columns: ColumnDef<Unit>[] = [
    {
      accessorKey: 'buildingId',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tower" />,
      cell: ({ row }) => getBuildingName(row.original.buildingId),
    },
    {
      accessorKey: 'unitNumber',
      header: ({ column }) => <DataTableColumnHeader column={column} title="No. Unit" />,
    },
    {
      accessorKey: 'floor',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Lantai" />,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tipe" />,
    },
    {
      accessorKey: 'areaSqm',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Luas" />,
      cell: ({ row }) => `${row.original.areaSqm} m2`,
    },
    {
      accessorKey: 'ownerName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Pemilik" />,
    },
    {
      accessorKey: 'tenantName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Penyewa" />,
      cell: ({ row }) => row.original.tenantName ?? '-',
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Telepon" />,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={unitStatusVariant[row.original.status]}>
          {unitStatusLabel[row.original.status]}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <RowActions
          onEdit={() => openEdit(row.original)}
          onDelete={() => handleDelete(row.original)}
          deleteLabel={`Hapus unit ${row.original.unitNumber}?`}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Unit</h1>
        <p className="text-muted-foreground">Kelola data unit pada seluruh tower.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Unit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalUnits}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dihuni</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{occupiedUnits}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Kosong / Dijual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{vacantUnits}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={data}
            searchColumnId="unitNumber"
            searchPlaceholder="Cari nomor unit..."
            facetedFilters={[
              {
                columnId: 'status',
                title: 'Status',
                options: statusOptions,
              },
            ]}
            addLabel="Tambah Unit"
            onAdd={openAdd}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? 'Ubah Unit' : 'Tambah Unit'}
        description={editing ? 'Perbarui detail unit.' : 'Masukkan detail unit baru.'}
        fields={fields}
        defaultValues={
          editing
            ? {
                buildingId: editing.buildingId,
                unitNumber: editing.unitNumber,
                floor: editing.floor,
                type: editing.type,
                areaSqm: editing.areaSqm,
                status: editing.status,
                ownerName: editing.ownerName,
                tenantName: editing.tenantName ?? '',
                phone: editing.phone,
              }
            : {}
        }
        onSubmit={handleSubmit}
        submitLabel={editing ? 'Simpan' : 'Tambah'}
      />
    </div>
  );
}
