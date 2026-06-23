import type {
  Building,
  Floor,
  HvacZone,
  EnergyReading,
  Alarm,
  AccessPoint,
  Asset,
  WorkOrder,
  SystemUser,
  Unit,
  Invoice,
  Visitor,
  ParkingSlot,
  AmenityBooking,
  Complaint,
  Announcement,
  Lease,
  MeterReading,
  Vendor,
} from '@/types'

export const buildings: Building[] = [
  {
    id: 'bld-01',
    name: 'Tower Anggrek',
    address: 'Jl. Jend. Sudirman Kav. 52-53, Jakarta — Kompleks Apartemen Sudirman Residences',
    floors: 28,
    areaSqm: 42000,
    occupancy: 1840,
    occupancyCapacity: 2400,
    energyTodayKwh: 8240,
    energyBudgetKwh: 9500,
    activeAlarms: 3,
    status: 'warning',
  },
  {
    id: 'bld-02',
    name: 'Tower Bougenville',
    address: 'Jl. Jend. Sudirman Kav. 52-53, Jakarta — Kompleks Apartemen Sudirman Residences',
    floors: 18,
    areaSqm: 26500,
    occupancy: 980,
    occupancyCapacity: 1500,
    energyTodayKwh: 5120,
    energyBudgetKwh: 6000,
    activeAlarms: 0,
    status: 'normal',
  },
  {
    id: 'bld-03',
    name: 'Tower Cendana',
    address: 'Jl. Jend. Sudirman Kav. 52-53, Jakarta — Kompleks Apartemen Sudirman Residences',
    floors: 6,
    areaSqm: 38000,
    occupancy: 320,
    occupancyCapacity: 600,
    energyTodayKwh: 3870,
    energyBudgetKwh: 3500,
    activeAlarms: 1,
    status: 'fault',
  },
]

export const floors: Floor[] = [
  { id: 'flr-01', buildingId: 'bld-01', name: 'Ground Lobby', level: 0, occupancy: 210, capacity: 300, tempC: 23.5, humidity: 52 },
  { id: 'flr-02', buildingId: 'bld-01', name: 'Floor 5 - Office', level: 5, occupancy: 180, capacity: 200, tempC: 22.8, humidity: 48 },
  { id: 'flr-03', buildingId: 'bld-01', name: 'Floor 12 - Office', level: 12, occupancy: 165, capacity: 200, tempC: 24.6, humidity: 55 },
  { id: 'flr-04', buildingId: 'bld-01', name: 'Floor 20 - Executive', level: 20, occupancy: 60, capacity: 100, tempC: 23.0, humidity: 50 },
  { id: 'flr-05', buildingId: 'bld-02', name: 'Ground Lobby', level: 0, occupancy: 140, capacity: 250, tempC: 23.2, humidity: 51 },
  { id: 'flr-06', buildingId: 'bld-02', name: 'Floor 8 - Office', level: 8, occupancy: 190, capacity: 220, tempC: 22.9, humidity: 49 },
  { id: 'flr-07', buildingId: 'bld-03', name: 'Warehouse Bay A', level: 1, occupancy: 80, capacity: 150, tempC: 26.1, humidity: 60 },
]

export const hvacZones: HvacZone[] = [
  { id: 'hvac-01', buildingId: 'bld-01', zoneName: 'Zone A - Lobby', setpointC: 23, currentTempC: 23.5, mode: 'cooling', fanSpeed: 'medium', status: 'normal' },
  { id: 'hvac-02', buildingId: 'bld-01', zoneName: 'Zone B - Floor 5-10', setpointC: 22, currentTempC: 22.8, mode: 'cooling', fanSpeed: 'high', status: 'normal' },
  { id: 'hvac-03', buildingId: 'bld-01', zoneName: 'Zone C - Floor 11-20', setpointC: 23, currentTempC: 24.6, mode: 'cooling', fanSpeed: 'high', status: 'warning' },
  { id: 'hvac-04', buildingId: 'bld-01', zoneName: 'Zone D - Server Room', setpointC: 18, currentTempC: 18.4, mode: 'cooling', fanSpeed: 'high', status: 'normal' },
  { id: 'hvac-05', buildingId: 'bld-02', zoneName: 'Zone A - Lobby', setpointC: 23, currentTempC: 23.2, mode: 'auto', fanSpeed: 'low', status: 'normal' },
  { id: 'hvac-06', buildingId: 'bld-02', zoneName: 'Zone B - Office Floors', setpointC: 22, currentTempC: 22.9, mode: 'cooling', fanSpeed: 'medium', status: 'normal' },
  { id: 'hvac-07', buildingId: 'bld-03', zoneName: 'Zone A - Warehouse', setpointC: 25, currentTempC: 26.1, mode: 'cooling', fanSpeed: 'high', status: 'fault' },
]

export const energyHistory: EnergyReading[] = [
  { time: '00:00', electricity: 320, hvac: 180, lighting: 60 },
  { time: '03:00', electricity: 280, hvac: 150, lighting: 40 },
  { time: '06:00', electricity: 410, hvac: 220, lighting: 90 },
  { time: '09:00', electricity: 780, hvac: 410, lighting: 150 },
  { time: '12:00', electricity: 920, hvac: 480, lighting: 160 },
  { time: '15:00', electricity: 880, hvac: 460, lighting: 155 },
  { time: '18:00', electricity: 760, hvac: 380, lighting: 170 },
  { time: '21:00', electricity: 480, hvac: 240, lighting: 100 },
]

export const alarms: Alarm[] = [
  { id: 'alm-01', buildingId: 'bld-01', source: 'HVAC Zone C', message: 'Suhu di atas setpoint selama 30 menit', severity: 'warning', status: 'active', raisedAt: '2026-06-23T08:12:00' },
  { id: 'alm-02', buildingId: 'bld-01', source: 'Chiller #2', message: 'Tekanan kondensor tinggi', severity: 'critical', status: 'active', raisedAt: '2026-06-23T07:45:00' },
  { id: 'alm-03', buildingId: 'bld-01', source: 'Access Point - Loading Dock', message: 'Pintu tertahan terbuka lebih dari 5 menit', severity: 'info', status: 'acknowledged', raisedAt: '2026-06-23T06:30:00', acknowledgedBy: 'Budi Santoso' },
  { id: 'alm-04', buildingId: 'bld-03', source: 'HVAC Zone A', message: 'Unit AHU gagal start', severity: 'critical', status: 'active', raisedAt: '2026-06-23T05:55:00' },
  { id: 'alm-05', buildingId: 'bld-02', source: 'Fire Panel', message: 'Self-test berhasil, tidak ada isu', severity: 'info', status: 'resolved', raisedAt: '2026-06-22T22:00:00', acknowledgedBy: 'System' },
]

export const accessPoints: AccessPoint[] = [
  { id: 'ap-01', buildingId: 'bld-01', name: 'Main Entrance', location: 'Ground Floor', status: 'locked', lastEventAt: '2026-06-23T08:00:00', lastEventBy: 'Auto Schedule' },
  { id: 'ap-02', buildingId: 'bld-01', name: 'Loading Dock', location: 'Basement 1', status: 'held_open', lastEventAt: '2026-06-23T07:50:00', lastEventBy: 'Security Guard 02' },
  { id: 'ap-03', buildingId: 'bld-01', name: 'Server Room Door', location: 'Floor 20', status: 'locked', lastEventAt: '2026-06-23T06:10:00', lastEventBy: 'Card #4471' },
  { id: 'ap-04', buildingId: 'bld-02', name: 'Main Entrance', location: 'Ground Floor', status: 'unlocked', lastEventAt: '2026-06-23T07:00:00', lastEventBy: 'Auto Schedule' },
  { id: 'ap-05', buildingId: 'bld-03', name: 'Warehouse Gate A', location: 'Bay A', status: 'forced', lastEventAt: '2026-06-23T05:40:00', lastEventBy: 'Unknown' },
]

export const assets: Asset[] = [
  { id: 'ast-01', buildingId: 'bld-01', name: 'Chiller Unit #1', category: 'HVAC', location: 'Rooftop', healthScore: 88, nextMaintenanceDate: '2026-07-10' },
  { id: 'ast-02', buildingId: 'bld-01', name: 'Chiller Unit #2', category: 'HVAC', location: 'Rooftop', healthScore: 54, nextMaintenanceDate: '2026-06-25' },
  { id: 'ast-03', buildingId: 'bld-01', name: 'Passenger Elevator A', category: 'Vertical Transport', location: 'Core Lift Lobby', healthScore: 95, nextMaintenanceDate: '2026-08-01' },
  { id: 'ast-04', buildingId: 'bld-02', name: 'Diesel Generator #1', category: 'Power', location: 'Basement 2', healthScore: 91, nextMaintenanceDate: '2026-07-15' },
  { id: 'ast-05', buildingId: 'bld-03', name: 'AHU Warehouse A', category: 'HVAC', location: 'Bay A', healthScore: 38, nextMaintenanceDate: '2026-06-24' },
]

export const workOrders: WorkOrder[] = [
  { id: 'wo-01', buildingId: 'bld-01', assetId: 'ast-02', title: 'Inspeksi tekanan kondensor Chiller #2', priority: 'critical', status: 'in_progress', assignee: 'Tim HVAC A', createdAt: '2026-06-23T07:50:00', dueAt: '2026-06-23T12:00:00' },
  { id: 'wo-02', buildingId: 'bld-01', assetId: 'ast-03', title: 'Maintenance rutin elevator A', priority: 'low', status: 'open', assignee: 'Vendor Lift Co.', createdAt: '2026-06-20T09:00:00', dueAt: '2026-06-28T17:00:00' },
  { id: 'wo-03', buildingId: 'bld-03', assetId: 'ast-05', title: 'Perbaikan AHU yang gagal start', priority: 'critical', status: 'overdue', assignee: 'Tim HVAC B', createdAt: '2026-06-22T06:00:00', dueAt: '2026-06-23T06:00:00' },
  { id: 'wo-04', buildingId: 'bld-02', title: 'Pembersihan area lobby mingguan', priority: 'medium', status: 'completed', assignee: 'Tim Cleaning', createdAt: '2026-06-21T08:00:00', dueAt: '2026-06-21T10:00:00' },
]

export const users: SystemUser[] = [
  { id: 'usr-01', name: 'Roy Saputra', email: 'roy.technubi@gmail.com', role: 'admin', buildingsAccess: ['bld-01', 'bld-02', 'bld-03'], lastActive: '2026-06-23T08:30:00', status: 'active' },
  { id: 'usr-02', name: 'Budi Santoso', email: 'budi.santoso@smartbuilding.id', role: 'facility_manager', buildingsAccess: ['bld-01'], lastActive: '2026-06-23T08:10:00', status: 'active' },
  { id: 'usr-03', name: 'Siti Aminah', email: 'siti.aminah@smartbuilding.id', role: 'technician', buildingsAccess: ['bld-01', 'bld-03'], lastActive: '2026-06-23T07:55:00', status: 'active' },
  { id: 'usr-04', name: 'Joko Wibowo', email: 'joko.wibowo@smartbuilding.id', role: 'viewer', buildingsAccess: ['bld-02'], lastActive: '2026-06-20T17:00:00', status: 'suspended' },
]

export const units: Unit[] = [
  { id: 'unt-01', buildingId: 'bld-01', unitNumber: 'A-1205', floor: 12, type: '2BR', areaSqm: 65, status: 'occupied_owner', ownerName: 'Andi Wijaya', phone: '0812-1111-2222' },
  { id: 'unt-02', buildingId: 'bld-01', unitNumber: 'A-1206', floor: 12, type: '2BR', areaSqm: 65, status: 'occupied_tenant', ownerName: 'Lina Marpaung', tenantName: 'Reza Pratama', phone: '0813-2222-3333' },
  { id: 'unt-03', buildingId: 'bld-01', unitNumber: 'A-2001', floor: 20, type: '3BR Executive', areaSqm: 110, status: 'occupied_owner', ownerName: 'Hendra Gunawan', phone: '0811-3333-4444' },
  { id: 'unt-04', buildingId: 'bld-01', unitNumber: 'A-0501', floor: 5, type: 'Studio', areaSqm: 32, status: 'vacant', ownerName: 'Developer (Inventory)', phone: '-' },
  { id: 'unt-05', buildingId: 'bld-02', unitNumber: 'B-0805', floor: 8, type: '1BR', areaSqm: 45, status: 'occupied_tenant', ownerName: 'Maria Susanti', tenantName: 'Kevin Tanaka', phone: '0815-4444-5555' },
  { id: 'unt-06', buildingId: 'bld-02', unitNumber: 'B-0806', floor: 8, type: '1BR', areaSqm: 45, status: 'for_sale', ownerName: 'Developer (Inventory)', phone: '-' },
  { id: 'unt-07', buildingId: 'bld-03', unitNumber: 'C-0101', floor: 1, type: '2BR', areaSqm: 60, status: 'occupied_owner', ownerName: 'Dewi Anggraini', phone: '0816-5555-6666' },
]

export const invoices: Invoice[] = [
  { id: 'inv-01', unitId: 'unt-01', buildingId: 'bld-01', period: 'Juni 2026', description: 'Iuran Pemeliharaan Lingkungan (IPL)', amount: 1850000, dueDate: '2026-06-10', status: 'paid' },
  { id: 'inv-02', unitId: 'unt-02', buildingId: 'bld-01', period: 'Juni 2026', description: 'IPL + Air', amount: 2100000, dueDate: '2026-06-10', status: 'overdue' },
  { id: 'inv-03', unitId: 'unt-03', buildingId: 'bld-01', period: 'Juni 2026', description: 'IPL + Listrik Bersama', amount: 3200000, dueDate: '2026-06-15', status: 'due' },
  { id: 'inv-04', unitId: 'unt-05', buildingId: 'bld-02', period: 'Juni 2026', description: 'IPL', amount: 1450000, dueDate: '2026-06-10', status: 'paid' },
  { id: 'inv-05', unitId: 'unt-07', buildingId: 'bld-03', period: 'Juni 2026', description: 'IPL + Air', amount: 1700000, dueDate: '2026-06-05', status: 'overdue' },
]

export const visitors: Visitor[] = [
  { id: 'vis-01', buildingId: 'bld-01', unitId: 'unt-01', visitorName: 'Yusuf Rahman', purpose: 'Kunjungan Keluarga', vehiclePlate: 'B 1234 ABC', checkInAt: '2026-06-23T09:15:00', status: 'checked_in' },
  { id: 'vis-02', buildingId: 'bld-01', unitId: 'unt-02', visitorName: 'Kurir JNE', purpose: 'Pengiriman Paket', checkInAt: '2026-06-23T08:40:00', checkOutAt: '2026-06-23T08:50:00', status: 'checked_out' },
  { id: 'vis-03', buildingId: 'bld-02', unitId: 'unt-05', visitorName: 'Teknisi AC Panggilan', purpose: 'Servis AC Unit', vehiclePlate: 'B 5566 XYZ', checkInAt: '2026-06-23T10:00:00', status: 'checked_in' },
  { id: 'vis-04', buildingId: 'bld-03', unitId: 'unt-07', visitorName: 'Tamu Acara Arisan', purpose: 'Acara Pribadi', checkInAt: '2026-06-23T13:00:00', status: 'expected' },
]

export const parkingSlots: ParkingSlot[] = [
  { id: 'prk-01', buildingId: 'bld-01', slotCode: 'B1-A01', level: 'Basement 1', vehicleType: 'car', status: 'occupied', unitId: 'unt-01', vehiclePlate: 'B 1001 AGW' },
  { id: 'prk-02', buildingId: 'bld-01', slotCode: 'B1-A02', level: 'Basement 1', vehicleType: 'car', status: 'available' },
  { id: 'prk-03', buildingId: 'bld-01', slotCode: 'B1-A03', level: 'Basement 1', vehicleType: 'car', status: 'reserved', unitId: 'unt-03' },
  { id: 'prk-04', buildingId: 'bld-01', slotCode: 'B2-M10', level: 'Basement 2 (Motor)', vehicleType: 'motorcycle', status: 'occupied', unitId: 'unt-02', vehiclePlate: 'B 2002 PQR' },
  { id: 'prk-05', buildingId: 'bld-02', slotCode: 'B1-B05', level: 'Basement 1', vehicleType: 'car', status: 'occupied', unitId: 'unt-05', vehiclePlate: 'B 3003 LMN' },
  { id: 'prk-06', buildingId: 'bld-02', slotCode: 'B1-B06', level: 'Basement 1', vehicleType: 'car', status: 'available' },
  { id: 'prk-07', buildingId: 'bld-03', slotCode: 'GF-C01', level: 'Ground Floor', vehicleType: 'car', status: 'available' },
]

export const amenityBookings: AmenityBooking[] = [
  { id: 'amn-01', buildingId: 'bld-01', amenityName: 'Kolam Renang', unitId: 'unt-01', bookedBy: 'Andi Wijaya', date: '2026-06-23', timeSlot: '07:00 - 08:00', status: 'confirmed' },
  { id: 'amn-02', buildingId: 'bld-01', amenityName: 'Function Hall', unitId: 'unt-03', bookedBy: 'Hendra Gunawan', date: '2026-06-25', timeSlot: '18:00 - 21:00', status: 'pending' },
  { id: 'amn-03', buildingId: 'bld-02', amenityName: 'Gym', unitId: 'unt-05', bookedBy: 'Kevin Tanaka', date: '2026-06-23', timeSlot: '17:00 - 18:00', status: 'confirmed' },
  { id: 'amn-04', buildingId: 'bld-03', amenityName: 'BBQ Area', unitId: 'unt-07', bookedBy: 'Dewi Anggraini', date: '2026-06-24', timeSlot: '16:00 - 19:00', status: 'cancelled' },
]

export const complaints: Complaint[] = [
  { id: 'cmp-01', buildingId: 'bld-01', unitId: 'unt-02', reportedBy: 'Reza Pratama', category: 'plumbing', description: 'Kebocoran pipa air di kamar mandi', priority: 'high', status: 'in_progress', createdAt: '2026-06-22T19:00:00', assignee: 'Tim Plumbing A' },
  { id: 'cmp-02', buildingId: 'bld-01', unitId: 'unt-01', reportedBy: 'Andi Wijaya', category: 'noise', description: 'Suara berisik dari unit tetangga lantai atas', priority: 'medium', status: 'open', createdAt: '2026-06-23T07:30:00' },
  { id: 'cmp-03', buildingId: 'bld-02', unitId: 'unt-05', reportedBy: 'Kevin Tanaka', category: 'electrical', description: 'Lampu koridor lantai 8 mati', priority: 'low', status: 'resolved', createdAt: '2026-06-20T10:00:00', assignee: 'Tim Elektrikal' },
  { id: 'cmp-04', buildingId: 'bld-03', unitId: 'unt-07', reportedBy: 'Dewi Anggraini', category: 'security', description: 'Akses kartu lift sering gagal', priority: 'urgent', status: 'open', createdAt: '2026-06-23T06:45:00' },
]

export const announcements: Announcement[] = [
  { id: 'ann-01', title: 'Pemeliharaan Tangki Air Bersih', body: 'Akan dilakukan pembersihan tangki air bersih pada 25 Juni 2026 pukul 22:00-02:00. Pasokan air dapat terganggu sementara.', audience: 'all', publishedAt: '2026-06-22T09:00:00', publishedBy: 'Manajemen Gedung' },
  { id: 'ann-02', title: 'Perbaikan Chiller Tower Anggrek', body: 'Sedang dilakukan perbaikan unit chiller. Suhu AC area lobby & koridor mungkin sedikit lebih hangat dari biasanya.', audience: 'single_building', buildingId: 'bld-01', publishedAt: '2026-06-23T08:00:00', publishedBy: 'Tim Teknik' },
  { id: 'ann-03', title: 'Jadwal Fogging Nyamuk', body: 'Fogging area taman dan basement akan dilaksanakan 26 Juni 2026 pukul 06:00.', audience: 'all', publishedAt: '2026-06-21T15:00:00', publishedBy: 'Manajemen Gedung' },
]

export const leases: Lease[] = [
  { id: 'lse-01', unitId: 'unt-02', buildingId: 'bld-01', tenantName: 'Reza Pratama', tenantPhone: '0813-2222-3333', startDate: '2025-09-01', endDate: '2026-08-31', monthlyRent: 12000000, depositAmount: 24000000, status: 'active' },
  { id: 'lse-02', unitId: 'unt-05', buildingId: 'bld-02', tenantName: 'Kevin Tanaka', tenantPhone: '0815-4444-5555', startDate: '2025-07-01', endDate: '2026-06-30', monthlyRent: 8500000, depositAmount: 17000000, status: 'ending_soon' },
  { id: 'lse-03', unitId: 'unt-04', buildingId: 'bld-01', tenantName: 'Mira Lestari (mantan penyewa)', tenantPhone: '0817-6666-7777', startDate: '2024-01-01', endDate: '2024-12-31', monthlyRent: 6000000, depositAmount: 12000000, status: 'expired' },
]

export const meterReadings: MeterReading[] = [
  { id: 'mtr-01', unitId: 'unt-01', buildingId: 'bld-01', meterType: 'water', period: 'Juni 2026', previousReading: 120, currentReading: 138, ratePerUnit: 12000 },
  { id: 'mtr-02', unitId: 'unt-01', buildingId: 'bld-01', meterType: 'electricity', period: 'Juni 2026', previousReading: 4500, currentReading: 4810, ratePerUnit: 1700 },
  { id: 'mtr-03', unitId: 'unt-02', buildingId: 'bld-01', meterType: 'water', period: 'Juni 2026', previousReading: 95, currentReading: 109, ratePerUnit: 12000 },
  { id: 'mtr-04', unitId: 'unt-05', buildingId: 'bld-02', meterType: 'electricity', period: 'Juni 2026', previousReading: 3100, currentReading: 3360, ratePerUnit: 1700 },
  { id: 'mtr-05', unitId: 'unt-07', buildingId: 'bld-03', meterType: 'water', period: 'Juni 2026', previousReading: 60, currentReading: 71, ratePerUnit: 12000 },
]

export const vendors: Vendor[] = [
  { id: 'vnd-01', name: 'CV Bersih Sentosa', category: 'cleaning', contactPerson: 'Pak Slamet', phone: '021-5550101', contractStart: '2026-01-01', contractEnd: '2026-12-31', status: 'active' },
  { id: 'vnd-02', name: 'PT Garda Aman Sejahtera', category: 'security', contactPerson: 'Ibu Ratna', phone: '021-5550202', contractStart: '2025-06-01', contractEnd: '2026-05-31', status: 'active' },
  { id: 'vnd-03', name: 'CV Sejuk Teknik HVAC', category: 'hvac', contactPerson: 'Pak Bayu', phone: '021-5550303', contractStart: '2026-02-01', contractEnd: '2027-01-31', status: 'active' },
  { id: 'vnd-04', name: 'PT Lift Nusantara', category: 'elevator', contactPerson: 'Pak Joko', phone: '021-5550404', contractStart: '2024-01-01', contractEnd: '2025-12-31', status: 'inactive' },
  { id: 'vnd-05', name: 'CV Hijau Lestari Landscaping', category: 'landscaping', contactPerson: 'Ibu Sari', phone: '021-5550505', contractStart: '2026-03-01', contractEnd: '2027-02-28', status: 'active' },
]
