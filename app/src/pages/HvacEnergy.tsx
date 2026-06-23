import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { buildings, hvacZones, energyHistory } from '@/data/mock'
import { statusBadgeVariant, statusLabel } from '@/lib/status'

export default function HvacEnergy() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">HVAC & Manajemen Energi</h1>
        <p className="text-sm text-muted-foreground">
          Monitoring zona HVAC dan breakdown konsumsi energi.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Breakdown Konsumsi Energi</CardTitle>
          <CardDescription>Listrik, HVAC, dan lighting — agregat portfolio</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={energyHistory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="electricity" stackId="1" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.5} name="Listrik" />
              <Area type="monotone" dataKey="hvac" stackId="1" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.5} name="HVAC" />
              <Area type="monotone" dataKey="lighting" stackId="1" stroke="var(--chart-4)" fill="var(--chart-4)" fillOpacity={0.5} name="Lighting" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zona HVAC</CardTitle>
          <CardDescription>Status setpoint vs suhu aktual per zona</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gedung</TableHead>
                <TableHead>Zona</TableHead>
                <TableHead>Setpoint</TableHead>
                <TableHead>Suhu Aktual</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Fan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hvacZones.map((z) => {
                const building = buildings.find((b) => b.id === z.buildingId)
                return (
                  <TableRow key={z.id}>
                    <TableCell>{building?.name}</TableCell>
                    <TableCell>{z.zoneName}</TableCell>
                    <TableCell>{z.setpointC}°C</TableCell>
                    <TableCell>{z.currentTempC}°C</TableCell>
                    <TableCell className="capitalize">{z.mode}</TableCell>
                    <TableCell className="capitalize">{z.fanSpeed}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant[z.status]}>{statusLabel[z.status]}</Badge>
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
