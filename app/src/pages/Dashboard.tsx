import { Building2, Zap, Bell, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { buildings, energyHistory, alarms } from '@/data/mock'
import { statusBadgeVariant, statusLabel, severityBadgeVariant, severityLabel } from '@/lib/status'

export default function Dashboard() {
  const totalOccupancy = buildings.reduce((sum, b) => sum + b.occupancy, 0)
  const totalCapacity = buildings.reduce((sum, b) => sum + b.occupancyCapacity, 0)
  const totalEnergyToday = buildings.reduce((sum, b) => sum + b.energyTodayKwh, 0)
  const totalEnergyBudget = buildings.reduce((sum, b) => sum + b.energyBudgetKwh, 0)
  const activeAlarms = alarms.filter((a) => a.status === 'active')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Portfolio Overview</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan kondisi seluruh gedung secara real-time.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Gedung</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buildings.length}</div>
            <p className="text-xs text-muted-foreground">
              {buildings.filter((b) => b.status !== 'normal').length} memerlukan perhatian
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Okupansi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOccupancy.toLocaleString('id-ID')} / {totalCapacity.toLocaleString('id-ID')}
            </div>
            <Progress value={(totalOccupancy / totalCapacity) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Energi Hari Ini</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnergyToday.toLocaleString('id-ID')} kWh</div>
            <p className="text-xs text-muted-foreground">
              Budget {totalEnergyBudget.toLocaleString('id-ID')} kWh
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alarm Aktif</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlarms.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeAlarms.filter((a) => a.severity === 'critical').length} kritikal
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Konsumsi Energi Portfolio</CardTitle>
            <CardDescription>Agregat seluruh gedung — kWh per 3 jam</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyHistory}>
                <defs>
                  <linearGradient id="colorElectricity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="electricity" stroke="var(--chart-1)" fill="url(#colorElectricity)" name="Listrik (kWh)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alarm Terbaru</CardTitle>
            <CardDescription>Lintas semua gedung</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {alarms.slice(0, 4).map((alarm) => (
              <div key={alarm.id} className="flex items-start justify-between gap-2 border-b pb-2 last:border-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{alarm.source}</span>
                  <span className="text-xs text-muted-foreground">{alarm.message}</span>
                </div>
                <Badge variant={severityBadgeVariant[alarm.severity]}>
                  {severityLabel[alarm.severity]}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status Gedung</CardTitle>
          <CardDescription>Kondisi operasional tiap gedung dalam portfolio</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {buildings.map((b) => (
            <div key={b.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{b.name}</h3>
                <Badge variant={statusBadgeVariant[b.status]}>{statusLabel[b.status]}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{b.address}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Okupansi</p>
                  <p className="font-medium">{b.occupancy}/{b.occupancyCapacity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Energi</p>
                  <p className="font-medium">{b.energyTodayKwh} kWh</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Lantai</p>
                  <p className="font-medium">{b.floors}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Alarm Aktif</p>
                  <p className="font-medium">{b.activeAlarms}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
