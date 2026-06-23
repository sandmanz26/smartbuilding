import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { buildings, units, complaints as initialComplaints } from '@/data/mock'
import { complaintStatusLabel, complaintPriorityVariant } from '@/lib/status'
import type { Complaint } from '@/types'

const categoryLabel: Record<string, string> = {
  hvac: 'HVAC',
  plumbing: 'Plumbing',
  electrical: 'Elektrikal',
  security: 'Keamanan',
  cleanliness: 'Kebersihan',
  noise: 'Kebisingan',
  other: 'Lainnya',
}

export default function Complaints() {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints)

  function resolve(id: string) {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'resolved', assignee: c.assignee ?? 'Tim Teknik' } : c)),
    )
  }

  const openCount = complaints.filter((c) => c.status === 'open').length
  const urgentCount = complaints.filter((c) => c.priority === 'urgent' && c.status !== 'resolved').length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Keluhan & Tiket Layanan</h1>
        <p className="text-sm text-muted-foreground">
          Tiket keluhan penghuni — pelacakan dari pelaporan hingga penyelesaian.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Tiket Baru</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{openCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Urgent Belum Selesai</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{urgentCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Tiket</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{complaints.length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Keluhan</CardTitle>
          <CardDescription>Keluhan penghuni dari seluruh tower</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tower</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Pelapor</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Prioritas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((c) => {
                const building = buildings.find((b) => b.id === c.buildingId)
                const unit = units.find((u) => u.id === c.unitId)
                return (
                  <TableRow key={c.id}>
                    <TableCell>{building?.name}</TableCell>
                    <TableCell className="font-medium">{unit?.unitNumber}</TableCell>
                    <TableCell>{c.reportedBy}</TableCell>
                    <TableCell>{categoryLabel[c.category]}</TableCell>
                    <TableCell className="max-w-[260px] text-sm">{c.description}</TableCell>
                    <TableCell>
                      <Badge variant={complaintPriorityVariant[c.priority]} className="capitalize">{c.priority}</Badge>
                    </TableCell>
                    <TableCell>{complaintStatusLabel[c.status]}</TableCell>
                    <TableCell className="text-right">
                      {c.status !== 'resolved' && c.status !== 'closed' && (
                        <Button size="sm" variant="outline" onClick={() => resolve(c.id)}>
                          Tandai Selesai
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
