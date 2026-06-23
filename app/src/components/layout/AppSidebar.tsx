import {
  LayoutDashboard,
  Building2,
  Thermometer,
  Zap,
  Bell,
  DoorOpen,
  Wrench,
  FileBarChart,
  Users,
  Home,
  Receipt,
  UserCheck,
  CarFront,
  CalendarCheck,
  MessageSquareWarning,
  Megaphone,
  FileSignature,
  Gauge,
  HardHat,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const operationalItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Gedung & Lantai', url: '/buildings', icon: Building2 },
  { title: 'HVAC & Energi', url: '/hvac-energy', icon: Thermometer },
  { title: 'Alarm & Notifikasi', url: '/alarms', icon: Bell },
  { title: 'Access Control', url: '/access-control', icon: DoorOpen },
  { title: 'Aset & Maintenance', url: '/maintenance', icon: Wrench },
]

const residentItems = [
  { title: 'Unit & Penghuni', url: '/units', icon: Home },
  { title: 'Billing & Iuran', url: '/billing', icon: Receipt },
  { title: 'Visitor Management', url: '/visitors', icon: UserCheck },
  { title: 'Parking', url: '/parking', icon: CarFront },
  { title: 'Amenity Booking', url: '/amenities', icon: CalendarCheck },
  { title: 'Keluhan & Tiket', url: '/complaints', icon: MessageSquareWarning },
  { title: 'Pengumuman', url: '/announcements', icon: Megaphone },
]

const financeVendorItems = [
  { title: 'Manajemen Sewa', url: '/leases', icon: FileSignature },
  { title: 'Submetering', url: '/meter-readings', icon: Gauge },
  { title: 'Vendor & Kontraktor', url: '/vendors', icon: HardHat },
]

const adminItems = [
  { title: 'Laporan', url: '/reports', icon: FileBarChart },
  { title: 'Pengguna & Role', url: '/users', icon: Users },
]

function renderItems(items: typeof operationalItems) {
  return items.map((item) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild tooltip={item.title}>
        <NavLink
          to={item.url}
          end={item.url === '/'}
          className={({ isActive }) =>
            isActive ? 'font-medium text-foreground' : 'text-muted-foreground'
          }
        >
          <item.icon />
          <span>{item.title}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold">SmartBuilding</span>
            <span className="text-xs text-muted-foreground">Apartment BMS</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operasional Gedung</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(operationalItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Manajemen Penghuni</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(residentItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Keuangan & Vendor</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(financeVendorItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Administrasi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(adminItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback>RS</AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">Roy Saputra</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
