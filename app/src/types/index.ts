export type AlarmSeverity = 'critical' | 'warning' | 'info'
export type AlarmStatus = 'active' | 'acknowledged' | 'resolved'
export type SystemStatus = 'normal' | 'warning' | 'fault' | 'offline'
export type WorkOrderStatus = 'open' | 'in_progress' | 'completed' | 'overdue'
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'critical'
export type DoorStatus = 'locked' | 'unlocked' | 'forced' | 'held_open'
export type UserRole = 'admin' | 'facility_manager' | 'technician' | 'viewer'

export type UnitOccupancyStatus = 'occupied_owner' | 'occupied_tenant' | 'vacant' | 'for_sale'
export type InvoiceStatus = 'paid' | 'due' | 'overdue'
export type VisitorStatus = 'checked_in' | 'checked_out' | 'expected'
export type ParkingVehicleType = 'car' | 'motorcycle'
export type ParkingSlotStatus = 'occupied' | 'available' | 'reserved'
export type ParkingUserType = 'resident' | 'visitor'
export type AmenityBookingStatus = 'confirmed' | 'pending' | 'cancelled'
export type AmenityCategory = 'olahraga' | 'rekreasi' | 'acara' | 'kerja' | 'lainnya'
export type AmenityStatus = 'active' | 'inactive'
export type AmenityAudience = 'all' | 'single_building'
export type ComplaintCategory = 'hvac' | 'plumbing' | 'electrical' | 'security' | 'cleanliness' | 'noise' | 'other'
export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent'
export type AnnouncementAudience = 'all' | 'single_building'

export type LeaseStatus = 'active' | 'ending_soon' | 'expired' | 'terminated'
export type MeterType = 'water' | 'electricity'
export type VendorCategory = 'cleaning' | 'security' | 'hvac' | 'elevator' | 'landscaping' | 'pest_control' | 'general'
export type VendorStatus = 'active' | 'inactive'

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
  petsAllowed: boolean
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

export interface Unit {
  id: string
  buildingId: string
  unitNumber: string
  floor: number
  type: string
  areaSqm: number
  status: UnitOccupancyStatus
  isListedForSale: boolean
  ownerName: string
  tenantName?: string
  phone: string
  hasPet: boolean
  parkingQuota: number
}

export interface Invoice {
  id: string
  unitId: string
  buildingId: string
  period: string
  description: string
  amount: number
  dueDate: string
  status: InvoiceStatus
}

export interface Visitor {
  id: string
  buildingId: string
  unitId: string
  visitorName: string
  purpose: string
  vehiclePlate?: string
  checkInAt: string
  checkOutAt?: string
  status: VisitorStatus
}

export interface ParkingSlot {
  id: string
  buildingId: string
  slotCode: string
  level: string
  vehicleType: ParkingVehicleType
  userType: ParkingUserType
  status: ParkingSlotStatus
  unitId?: string
  vehiclePlate?: string
}

export interface Amenity {
  id: string
  /** 'all' = shared facility usable by every tower; otherwise scoped to one building. */
  audience: AmenityAudience
  buildingId?: string
  name: string
  category: AmenityCategory
  operatingHoursStart: string
  operatingHoursEnd: string
  slotDurationMinutes: number
  capacityPerSlot: number
  status: AmenityStatus
}

export interface AmenityBooking {
  id: string
  buildingId: string
  amenityId: string
  unitId: string
  bookedBy: string
  date: string
  timeSlot: string
  status: AmenityBookingStatus
}

export interface Complaint {
  id: string
  buildingId: string
  unitId: string
  reportedBy: string
  category: ComplaintCategory
  description: string
  priority: ComplaintPriority
  status: ComplaintStatus
  createdAt: string
  assignee?: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  audience: AnnouncementAudience
  buildingId?: string
  publishedAt: string
  publishedBy: string
}

export interface Lease {
  id: string
  unitId: string
  buildingId: string
  tenantName: string
  tenantPhone: string
  startDate: string
  endDate: string
  monthlyRent: number
  depositAmount: number
  status: LeaseStatus
}

export interface MeterReading {
  id: string
  unitId: string
  buildingId: string
  meterType: MeterType
  period: string
  previousReading: number
  currentReading: number
  ratePerUnit: number
}

export interface Vendor {
  id: string
  name: string
  category: VendorCategory
  contactPerson: string
  phone: string
  contractStart: string
  contractEnd: string
  status: VendorStatus
}
