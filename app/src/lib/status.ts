import type {
  AlarmSeverity,
  SystemStatus,
  WorkOrderPriority,
  WorkOrderStatus,
  DoorStatus,
  UnitOccupancyStatus,
  InvoiceStatus,
  VisitorStatus,
  ParkingSlotStatus,
  ParkingUserType,
  AmenityBookingStatus,
  AmenityCategory,
  AmenityStatus,
  ComplaintStatus,
  ComplaintPriority,
  LeaseStatus,
  VendorStatus,
  VendorCategory,
  MeterType,
} from '@/types'

export const statusBadgeVariant: Record<SystemStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  normal: 'secondary',
  warning: 'outline',
  fault: 'destructive',
  offline: 'outline',
}

export const statusLabel: Record<SystemStatus, string> = {
  normal: 'Normal',
  warning: 'Perlu Perhatian',
  fault: 'Fault',
  offline: 'Offline',
}

export const severityBadgeVariant: Record<AlarmSeverity, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  critical: 'destructive',
  warning: 'outline',
  info: 'secondary',
}

export const severityLabel: Record<AlarmSeverity, string> = {
  critical: 'Kritikal',
  warning: 'Peringatan',
  info: 'Info',
}

export const priorityBadgeVariant: Record<WorkOrderPriority, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  critical: 'destructive',
  high: 'outline',
  medium: 'secondary',
  low: 'secondary',
}

export const workOrderStatusLabel: Record<WorkOrderStatus, string> = {
  open: 'Open',
  in_progress: 'Sedang Dikerjakan',
  completed: 'Selesai',
  overdue: 'Terlambat',
}

export const doorStatusLabel: Record<DoorStatus, string> = {
  locked: 'Terkunci',
  unlocked: 'Terbuka',
  forced: 'Dipaksa Terbuka',
  held_open: 'Tertahan Terbuka',
}

export const doorStatusVariant: Record<DoorStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  locked: 'secondary',
  unlocked: 'outline',
  forced: 'destructive',
  held_open: 'destructive',
}

export const unitStatusLabel: Record<UnitOccupancyStatus, string> = {
  occupied_owner: 'Dihuni Pemilik',
  occupied_tenant: 'Dihuni Penyewa',
  vacant: 'Kosong',
  for_sale: 'Dijual',
}

export const unitStatusVariant: Record<UnitOccupancyStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  occupied_owner: 'secondary',
  occupied_tenant: 'secondary',
  vacant: 'outline',
  for_sale: 'outline',
}

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  paid: 'Lunas',
  due: 'Belum Jatuh Tempo',
  overdue: 'Tertunggak',
}

export const invoiceStatusVariant: Record<InvoiceStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  paid: 'secondary',
  due: 'outline',
  overdue: 'destructive',
}

export const visitorStatusLabel: Record<VisitorStatus, string> = {
  checked_in: 'Sedang Berada di Lokasi',
  checked_out: 'Sudah Keluar',
  expected: 'Dijadwalkan',
}

export const visitorStatusVariant: Record<VisitorStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  checked_in: 'secondary',
  checked_out: 'outline',
  expected: 'outline',
}

export const parkingStatusLabel: Record<ParkingSlotStatus, string> = {
  occupied: 'Terisi',
  available: 'Tersedia',
  reserved: 'Dipesan',
}

export const parkingStatusVariant: Record<ParkingSlotStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  occupied: 'secondary',
  available: 'outline',
  reserved: 'outline',
}

export const parkingUserTypeLabel: Record<ParkingUserType, string> = {
  resident: 'Penghuni',
  visitor: 'Tamu',
}

export const parkingUserTypeVariant: Record<ParkingUserType, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  resident: 'secondary',
  visitor: 'outline',
}

export const amenityStatusLabel: Record<AmenityBookingStatus, string> = {
  confirmed: 'Terkonfirmasi',
  pending: 'Menunggu Konfirmasi',
  cancelled: 'Dibatalkan',
}

export const amenityStatusVariant: Record<AmenityBookingStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  confirmed: 'secondary',
  pending: 'outline',
  cancelled: 'destructive',
}

export const amenityFacilityStatusLabel: Record<AmenityStatus, string> = {
  active: 'Aktif',
  inactive: 'Tidak Aktif (Maintenance)',
}

export const amenityFacilityStatusVariant: Record<AmenityStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'secondary',
  inactive: 'destructive',
}

export const amenityCategoryLabel: Record<AmenityCategory, string> = {
  olahraga: 'Olahraga',
  rekreasi: 'Rekreasi',
  acara: 'Acara',
  kerja: 'Ruang Kerja',
  lainnya: 'Lainnya',
}

export const complaintStatusLabel: Record<ComplaintStatus, string> = {
  open: 'Baru',
  in_progress: 'Sedang Ditangani',
  resolved: 'Selesai',
  closed: 'Ditutup',
}

export const complaintPriorityVariant: Record<ComplaintPriority, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  urgent: 'destructive',
  high: 'destructive',
  medium: 'outline',
  low: 'secondary',
}

export const leaseStatusLabel: Record<LeaseStatus, string> = {
  active: 'Aktif',
  ending_soon: 'Akan Berakhir',
  expired: 'Berakhir',
  terminated: 'Diputus',
}

export const leaseStatusVariant: Record<LeaseStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'secondary',
  ending_soon: 'outline',
  expired: 'outline',
  terminated: 'destructive',
}

export const vendorStatusLabel: Record<VendorStatus, string> = {
  active: 'Aktif',
  inactive: 'Tidak Aktif',
}

export const vendorStatusVariant: Record<VendorStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'secondary',
  inactive: 'outline',
}

export const vendorCategoryLabel: Record<VendorCategory, string> = {
  cleaning: 'Kebersihan',
  security: 'Keamanan',
  hvac: 'HVAC',
  elevator: 'Lift',
  landscaping: 'Taman/Landscaping',
  pest_control: 'Pest Control',
  general: 'Umum',
}

export const meterTypeLabel: Record<MeterType, string> = {
  water: 'Air',
  electricity: 'Listrik',
}
