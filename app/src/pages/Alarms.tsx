import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { buildings, alarms as initialAlarms } from '@/data/mock'
import { severityBadgeVariant, severityLabel } from '@/lib/status'
import { useState } from 'react'
import type { Alarm } from '@/types'

export default function Alarms() {
  const [alarms, setAlarms] = useState<Alarm[]>(initialAlarms)

  function acknowledge(id: string) {
    setAlarms((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'acknowledged', acknowledgedBy: 'Roy Saputra' } : a,
      ),
    )
  }

  const activeCount = alarms.filter((a) => a.status === 'active').length
  const criticalCount = alarms.filter((a) => a.severity === 'critical' && a.status !== 'resolved').length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Alarm & Notifikasi</h1>
        <p className="text-sm text-muted-foreground">
          Pantau dan tangani event abnormal dari seluruh subsistem gedung.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Alarm Aktif</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{activeCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Kritikal (belum resolved)</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{criticalCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Event</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{alarms.length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Alarm</CardTitle>
          <CardDescription>Acknowledge alarm untuk menandai sudah ditindaklanjuti</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Gedung</TableHead>
                <TableHead>Sumber</TableHead>
                <TableHead>Pesan</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alarms.map((a) => {
                const building = buildings.find((b) => b.id === a.buildingId)
                return (
                  <TableRow key={a.id}>
                    <TableCell className="whitespace-nowrap text-xs">
                      {new Date(a.raisedAt).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>{building?.name}</TableCell>
                    <TableCell>{a.source}</TableCell>
                    <TableCell className="max-w-[280px] text-sm">{a.message}</TableCell>
                    <TableCell>
                      <Badge variant={severityBadgeVariant[a.severity]}>{severityLabel[a.severity]}</Badge>
                    </TableCell>
                    <TableCell className="text-sm capitalize">
                      {a.status === 'active' ? 'Aktif' : a.status === 'acknowledged' ? `Diakui (${a.acknowledgedBy})` : 'Resolved'}
                    </TableCell>
                    <TableCell className="text-right">
                      {a.status === 'active' && (
                        <Button size="sm" variant="outline" onClick={() => acknowledge(a.id)}>
                          Acknowledge
                        </Button>
                      )}
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
