import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Megaphone } from 'lucide-react'
import { buildings, announcements } from '@/data/mock'

export default function Announcements() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pengumuman</h1>
          <p className="text-sm text-muted-foreground">
            Broadcast informasi ke penghuni — seluruh kompleks atau per tower.
          </p>
        </div>
        <Button>
          <Megaphone className="mr-1 h-4 w-4" />
          Buat Pengumuman
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {announcements.map((a) => {
          const building = a.buildingId ? buildings.find((b) => b.id === a.buildingId) : undefined
          return (
            <Card key={a.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{a.title}</CardTitle>
                  <Badge variant="outline">
                    {a.audience === 'all' ? 'Seluruh Kompleks' : building?.name}
                  </Badge>
                </div>
                <CardDescription>
                  Dipublikasikan {new Date(a.publishedAt).toLocaleString('id-ID')} oleh {a.publishedBy}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{a.body}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
