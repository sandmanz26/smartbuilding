import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { buildings, units, invoices } from '@/data/mock'
import { invoiceStatusLabel, invoiceStatusVariant } from '@/lib/status'

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
}

export default function Billing() {
  const totalBilled = invoices.reduce((sum, i) => sum + i.amount, 0)
  const totalOverdue = invoices.filter((i) => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0)
  const overdueCount = invoices.filter((i) => i.status === 'overdue').length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Billing & Iuran</h1>
        <p className="text-sm text-muted-foreground">
          Tagihan IPL (Iuran Pemeliharaan Lingkungan) dan utilitas per unit.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Tagihan Bulan Ini</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatRupiah(totalBilled)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Tertunggak</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatRupiah(totalOverdue)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Jumlah Unit Tertunggak</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{overdueCount}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Invoice</CardTitle>
          <CardDescription>Status pembayaran iuran per unit</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tower</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => {
                const building = buildings.find((b) => b.id === inv.buildingId)
                const unit = units.find((u) => u.id === inv.unitId)
                return (
                  <TableRow key={inv.id}>
                    <TableCell>{building?.name}</TableCell>
                    <TableCell className="font-medium">{unit?.unitNumber}</TableCell>
                    <TableCell>{inv.period}</TableCell>
                    <TableCell>{inv.description}</TableCell>
                    <TableCell>{formatRupiah(inv.amount)}</TableCell>
                    <TableCell>{new Date(inv.dueDate).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>
                      <Badge variant={invoiceStatusVariant[inv.status]}>{invoiceStatusLabel[inv.status]}</Badge>
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
