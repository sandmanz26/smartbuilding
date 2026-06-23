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
} from '@/types'

export const buildings: Building[] = [
  {
    id: 'bld-01',
    name: 'Sudirman Tower',
    address: 'Jl. Jend. Sudirman Kav. 52-53, Jakarta',
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
    name: 'Thamrin Nine Annex',
    address: 'Jl. M.H. Thamrin No.9, Jakarta',
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
    name: 'Kuningan Logistics Hub',
    address: 'Jl. HR Rasuna Said, Jakarta',
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
