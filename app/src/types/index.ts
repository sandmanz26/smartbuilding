export type AlarmSeverity = 'critical' | 'warning' | 'info'
export type AlarmStatus = 'active' | 'acknowledged' | 'resolved'
export type SystemStatus = 'normal' | 'warning' | 'fault' | 'offline'
export type WorkOrderStatus = 'open' | 'in_progress' | 'completed' | 'overdue'
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'critical'
export type DoorStatus = 'locked' | 'unlocked' | 'forced' | 'held_open'
export type UserRole = 'admin' | 'facility_manager' | 'technician' | 'viewer'

export interface Building {
  id: string
  name: string
  address: string
  floors: number
  areaSqm: number
  occupancy: number
  occupancyCapacity: number
  energyTodayKwh: number
  energyBudgetKwh: number
  activeAlarms: number
  status: SystemStatus
}

export interface Floor {
  id: string
  buildingId: string
  name: string
  level: number
  occupancy: number
  capacity: number
  tempC: number
  humidity: number
}

export interface HvacZone {
  id: string
  buildingId: string
  zoneName: string
  setpointC: number
  currentTempC: number
  mode: 'cooling' | 'heating' | 'auto' | 'off'
  fanSpeed: 'low' | 'medium' | 'high'
  status: SystemStatus
}

export interface EnergyReading {
  time: string
  electricity: number
  hvac: number
  lighting: number
}

export interface Alarm {
  id: string
  buildingId: string
  source: string
  message: string
  severity: AlarmSeverity
  status: AlarmStatus
  raisedAt: string
  acknowledgedBy?: string
}

export interface AccessPoint {
  id: string
  buildingId: string
  name: string
  location: string
  status: DoorStatus
  lastEventAt: string
  lastEventBy: string
}

export interface Asset {
  id: string
  buildingId: string
  name: string
  category: string
  location: string
  healthScore: number
  nextMaintenanceDate: string
}

export interface WorkOrder {
  id: string
  buildingId: string
  assetId?: string
  title: string
  priority: WorkOrderPriority
  status: WorkOrderStatus
  assignee: string
  createdAt: string
  dueAt: string
}

export interface SystemUser {
  id: string
  name: string
  email: string
  role: UserRole
  buildingsAccess: string[]
  lastActive: string
  status: 'active' | 'suspended'
}
