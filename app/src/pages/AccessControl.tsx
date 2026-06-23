import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { buildings, accessPoints } from '@/data/mock'
import { doorStatusLabel, doorStatusVariant } from '@/lib/status'

export default function AccessControl() {
  const issues = accessPoints.filter((a) => a.status === 'forced' || a.status === 'held_open')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Access Control</h1>
        <p className="text-sm text-muted-foreground">
          Status pintu, gate, dan log akses di seluruh gedung.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Access Point</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{accessPoints.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Perlu Perhatian</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{issues.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Terkunci Normal</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{accessPoints.filter((a) => a.status === 'locked').length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Access Point</CardTitle>
          <CardDescription>Status terkini pintu/gate dan event terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gedung</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Event Terakhir</TableHead>
                <TableHead>Oleh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessPoints.map((ap) => {
                const building = buildings.find((b) => b.id === ap.buildingId)
                return (
                  <TableRow key={ap.id}>
                    <TableCell>{building?.name}</TableCell>
                    <TableCell>{ap.name}</TableCell>
                    <TableCell>{ap.location}</TableCell>
                    <TableCell>
                      <Badge variant={doorStatusVariant[ap.status]}>{doorStatusLabel[ap.status]}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs">
                      {new Date(ap.lastEventAt).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>{ap.lastEventBy}</TableCell>
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
