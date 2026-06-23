import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { buildings, units, amenityBookings } from '@/data/mock'
import { amenityStatusLabel, amenityStatusVariant } from '@/lib/status'

export default function Amenities() {
  const confirmedCount = amenityBookings.filter((a) => a.status === 'confirmed').length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Amenity Booking</h1>
        <p className="text-sm text-muted-foreground">
          Reservasi fasilitas bersama: kolam renang, gym, function hall, BBQ area.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Reservasi</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{amenityBookings.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Terkonfirmasi</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{confirmedCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Menunggu Konfirmasi</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{amenityBookings.filter((a) => a.status === 'pending').length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Reservasi</CardTitle>
          <CardDescription>Jadwal penggunaan fasilitas bersama per tower</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tower</TableHead>
                <TableHead>Fasilitas</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Dipesan Oleh</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Slot Waktu</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {amenityBookings.map((a) => {
                const building = buildings.find((b) => b.id === a.buildingId)
                const unit = units.find((u) => u.id === a.unitId)
                return (
                  <TableRow key={a.id}>
                    <TableCell>{building?.name}</TableCell>
                    <TableCell className="font-medium">{a.amenityName}</TableCell>
                    <TableCell>{unit?.unitNumber}</TableCell>
                    <TableCell>{a.bookedBy}</TableCell>
                    <TableCell>{new Date(a.date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>{a.timeSlot}</TableCell>
                    <TableCell>
                      <Badge variant={amenityStatusVariant[a.status]}>{amenityStatusLabel[a.status]}</Badge>
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
