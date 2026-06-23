import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { buildings, units, visitors } from '@/data/mock'
import { visitorStatusLabel, visitorStatusVariant } from '@/lib/status'

export default function Visitors() {
  const checkedInCount = visitors.filter((v) => v.status === 'checked_in').length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Visitor Management</h1>
        <p className="text-sm text-muted-foreground">
          Log tamu masuk/keluar per tower untuk keamanan kompleks apartemen.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Sedang di Lokasi</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{checkedInCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Hari Ini</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{visitors.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Dijadwalkan</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{visitors.filter((v) => v.status === 'expected').length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log Tamu</CardTitle>
          <CardDescription>Riwayat dan status kunjungan tamu per unit</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tower</TableHead>
                <TableHead>Unit Tujuan</TableHead>
                <TableHead>Nama Tamu</TableHead>
                <TableHead>Keperluan</TableHead>
                <TableHead>No. Kendaraan</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.map((v) => {
                const building = buildings.find((b) => b.id === v.buildingId)
                const unit = units.find((u) => u.id === v.unitId)
                return (
                  <TableRow key={v.id}>
                    <TableCell>{building?.name}</TableCell>
                    <TableCell className="font-medium">{unit?.unitNumber}</TableCell>
                    <TableCell>{v.visitorName}</TableCell>
                    <TableCell>{v.purpose}</TableCell>
                    <TableCell>{v.vehiclePlate ?? '-'}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs">
                      {new Date(v.checkInAt).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs">
                      {v.checkOutAt ? new Date(v.checkOutAt).toLocaleString('id-ID') : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={visitorStatusVariant[v.status]}>{visitorStatusLabel[v.status]}</Badge>
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
