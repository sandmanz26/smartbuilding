import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { buildings, assets, workOrders } from '@/data/mock'
import { priorityBadgeVariant, workOrderStatusLabel } from '@/lib/status'

export default function Maintenance() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Aset & Maintenance</h1>
        <p className="text-sm text-muted-foreground">
          Kesehatan aset kritikal dan tracking work order.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kesehatan Aset</CardTitle>
          <CardDescription>Skor kesehatan berdasarkan kondisi & riwayat maintenance</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets.map((a) => {
            const building = buildings.find((b) => b.id === a.buildingId)
            return (
              <div key={a.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{a.name}</h3>
                  <span className="text-xs text-muted-foreground">{a.category}</span>
                </div>
                <p className="text-xs text-muted-foreground">{building?.name} — {a.location}</p>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Health Score</span>
                    <span>{a.healthScore}%</span>
                  </div>
                  <Progress value={a.healthScore} className="h-2" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Maintenance berikutnya: {new Date(a.nextMaintenanceDate).toLocaleDateString('id-ID')}
                </p>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work Order</CardTitle>
          <CardDescription>Pekerjaan maintenance yang sedang berjalan</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gedung</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Prioritas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>PIC</TableHead>
                <TableHead>Tenggat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.map((wo) => {
                const building = buildings.find((b) => b.id === wo.buildingId)
                return (
                  <TableRow key={wo.id}>
                    <TableCell>{building?.name}</TableCell>
                    <TableCell className="max-w-[260px]">{wo.title}</TableCell>
                    <TableCell>
                      <Badge variant={priorityBadgeVariant[wo.priority]} className="capitalize">{wo.priority}</Badge>
                    </TableCell>
                    <TableCell>{workOrderStatusLabel[wo.status]}</TableCell>
                    <TableCell>{wo.assignee}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs">
                      {new Date(wo.dueAt).toLocaleString('id-ID')}
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
