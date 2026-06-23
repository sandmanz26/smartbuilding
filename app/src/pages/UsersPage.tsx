import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { UserPlus } from 'lucide-react'
import { users, buildings } from '@/data/mock'

const roleLabel: Record<string, string> = {
  admin: 'Admin',
  facility_manager: 'Facility Manager',
  technician: 'Teknisi',
  viewer: 'Viewer',
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pengguna & Role</h1>
          <p className="text-sm text-muted-foreground">
            Kelola akses pengguna lintas gedung berdasarkan role.
          </p>
        </div>
        <Button>
          <UserPlus className="mr-1 h-4 w-4" />
          Tambah Pengguna
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>{users.length} pengguna terdaftar di sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Akses Gedung</TableHead>
                <TableHead>Aktif Terakhir</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{initials(u.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell>{roleLabel[u.role]}</TableCell>
                  <TableCell className="text-sm">
                    {u.buildingsAccess
                      .map((id) => buildings.find((b) => b.id === id)?.name)
                      .join(', ')}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs">
                    {new Date(u.lastActive).toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.status === 'active' ? 'secondary' : 'destructive'}>
                      {u.status === 'active' ? 'Aktif' : 'Suspended'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
