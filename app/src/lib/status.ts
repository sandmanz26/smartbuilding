import type { AlarmSeverity, SystemStatus, WorkOrderPriority, WorkOrderStatus, DoorStatus } from '@/types'

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
