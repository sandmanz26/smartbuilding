import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { buildings, units, parkingSlots } from '@/data/mock'
import { parkingStatusLabel, parkingStatusVariant } from '@/lib/status'

export default function Parking() {
  const available = parkingSlots.filter((p) => p.status === 'available').length
  const occupied = parkingSlots.filter((p) => p.status === 'occupied').length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Parking Management</h1>
        <p className="text-sm text-muted-foreground">
          Status slot parkir dan kendaraan terdaftar per tower.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Slot</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{parkingSlots.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Terisi</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{occupied}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Tersedia</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{available}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Slot Parkir</CardTitle>
          <CardDescription>Status & kendaraan terdaftar per slot</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tower</TableHead>
                <TableHead>Kode Slot</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>No. Kendaraan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parkingSlots.map((p) => {
                const building = buildings.find((b) => b.id === p.buildingId)
                const unit = units.find((u) => u.id === p.unitId)
                return (
                  <TableRow key={p.id}>
                    <TableCell>{building?.name}</TableCell>
                    <TableCell className="font-medium">{p.slotCode}</TableCell>
                    <TableCell>{p.level}</TableCell>
                    <TableCell className="capitalize">{p.vehicleType === 'car' ? 'Mobil' : 'Motor'}</TableCell>
                    <TableCell>{unit?.unitNumber ?? '-'}</TableCell>
                    <TableCell>{p.vehiclePlate ?? '-'}</TableCell>
                    <TableCell>
                      <Badge variant={parkingStatusVariant[p.status]}>{parkingStatusLabel[p.status]}</Badge>
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
