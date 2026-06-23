import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { buildings } from '@/data/mock'

const reportTemplates = [
  { id: 'rpt-01', name: 'Laporan Konsumsi Energi Bulanan', desc: 'Breakdown energi per gedung per bulan' },
  { id: 'rpt-02', name: 'Laporan Kepatuhan Maintenance', desc: 'Status work order & SLA maintenance' },
  { id: 'rpt-03', name: 'Laporan Insiden & Alarm', desc: 'Rekap alarm dan waktu respons' },
  { id: 'rpt-04', name: 'Laporan Okupansi & Utilisasi Ruang', desc: 'Tren okupansi per lantai/gedung' },
]

const energyByBuilding = buildings.map((b) => ({
  name: b.name,
  energy: b.energyTodayKwh,
  budget: b.energyBudgetKwh,
}))

export default function Reports() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Laporan</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan analitik dan template laporan untuk stakeholder.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Energi vs Budget per Gedung</CardTitle>
          <CardDescription>Konsumsi hari ini dibandingkan dengan budget energi</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={energyByBuilding}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="energy" fill="var(--chart-1)" name="Konsumsi (kWh)" radius={4} />
              <Bar dataKey="budget" fill="var(--chart-3)" name="Budget (kWh)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Laporan</CardTitle>
          <CardDescription>Export laporan untuk audit & compliance (mock — tanpa backend)</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {reportTemplates.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="mr-1 h-4 w-4" />
                Export
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
