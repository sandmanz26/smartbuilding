import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { buildings, units } from '@/data/mock'
import { unitStatusLabel, unitStatusVariant } from '@/lib/status'

export default function Units() {
  const occupiedCount = units.filter((u) => u.status === 'occupied_owner' || u.status === 'occupied_tenant').length
  const vacantCount = units.filter((u) => u.status === 'vacant' || u.status === 'for_sale').length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Unit & Penghuni</h1>
        <p className="text-sm text-muted-foreground">
          Data unit apartemen lintas tower: status hunian, pemilik, dan penyewa.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Unit</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{units.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Dihuni</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{occupiedCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Kosong / Dijual</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{vacantCount}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Unit</CardTitle>
          <CardDescription>Detail unit per tower beserta data kontak</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tower</TableHead>
                <TableHead>No. Unit</TableHead>
                <TableHead>Lantai</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Luas</TableHead>
                <TableHead>Pemilik</TableHead>
                <TableHead>Penyewa</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((u) => {
                const building = buildings.find((b) => b.id === u.buildingId)
                return (
                  <TableRow key={u.id}>
                    <TableCell>{building?.name}</TableCell>
                    <TableCell className="font-medium">{u.unitNumber}</TableCell>
                    <TableCell>{u.floor}</TableCell>
                    <TableCell>{u.type}</TableCell>
                    <TableCell>{u.areaSqm} m²</TableCell>
                    <TableCell>{u.ownerName}</TableCell>
                    <TableCell>{u.tenantName ?? '-'}</TableCell>
                    <TableCell>{u.phone}</TableCell>
                    <TableCell>
                      <Badge variant={unitStatusVariant[u.status]}>{unitStatusLabel[u.status]}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
