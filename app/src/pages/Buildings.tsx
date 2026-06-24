import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { buildings, floors } from '@/data/mock'
import { statusBadgeVariant, statusLabel } from '@/lib/status'

export default function Buildings() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Gedung & Lantai</h1>
        <p className="text-sm text-muted-foreground">
          Kelola portfolio gedung, kapasitas, dan kondisi tiap lantai.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {buildings.map((b) => (
          <Card key={b.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{b.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <Badge variant={b.petsAllowed ? 'secondary' : 'outline'}>
                    {b.petsAllowed ? 'Boleh Hewan' : 'Tidak Boleh Hewan'}
                  </Badge>
                  <Badge variant={statusBadgeVariant[b.status]}>{statusLabel[b.status]}</Badge>
                </div>
              </div>
              <CardDescription>{b.address}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><p className="text-muted-foreground">Luas Area</p><p className="font-medium">{b.areaSqm.toLocaleString('id-ID')} m²</p></div>
                <div><p className="text-muted-foreground">Jumlah Lantai</p><p className="font-medium">{b.floors}</p></div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Okupansi</span>
                  <span>{b.occupancy}/{b.occupancyCapacity}</span>
                </div>
                <Progress value={(b.occupancy / b.occupancyCapacity) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Lantai</CardTitle>
          <CardDescription>Okupansi, suhu, dan kelembapan per lantai</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gedung</TableHead>
                <TableHead>Lantai</TableHead>
                <TableHead>Okupansi</TableHead>
                <TableHead>Suhu</TableHead>
                <TableHead>Kelembapan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {floors.map((f) => {
                const building = buildings.find((b) => b.id === f.buildingId)
                return (
                  <TableRow key={f.id}>
                    <TableCell>{building?.name}</TableCell>
                    <TableCell>{f.name}</TableCell>
                    <TableCell>{f.occupancy}/{f.capacity}</TableCell>
                    <TableCell>{f.tempC}°C</TableCell>
                    <TableCell>{f.humidity}%</TableCell>
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
