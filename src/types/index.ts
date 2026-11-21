import React from 'react'

// User & Role Types
export type UserRole = 'admin' | 'waiter' | 'kitchen' | 'manager'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: UserRole
  username?: string
  avatarUrl?: string
  shift?: string
  isActive?: boolean
}

// Navigation Types
export interface NavItem {
  title: string
  path: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  badgeColor?: 'gold' | 'burgundy' | 'success' | 'danger'
  exact?: boolean
  children?: NavItem[]
}

// Status Types
export type StatusType = 
  | 'available' 
  | 'occupied' 
  | 'reserved' 
  | 'cleaning'
  | 'pending'
  | 'in-progress'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'completed'
  | 'cancelled'
  | 'active'
  | 'inactive'

export type VariantType = 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'danger' | 'success'

// UI Component Props Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: string | number
    isPositive: boolean
    label?: string
  }
  icon?: React.ComponentType<{ className?: string }>
  description?: string
  className?: string
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  timestamp: string | Date
  read: boolean
  type?: 'info' | 'success' | 'warning' | 'danger'
  targetRole?: UserRole
}

export interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
  className?: string
}

// Domain Entity Placeholders (for future phases)
export interface TableItem {
  id: string
  number: number
  capacity: number
  status: 'available' | 'occupied' | 'reserved' | 'cleaning'
  currentOrderId?: string
  assignedWaiter?: string
  zone?: 'Main Dining' | 'Patio' | 'Bar Lounge' | 'Private Room'
}

export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  description?: string
  isAvailable: boolean
  imageUrl?: string
  tags?: string[]
}

export interface OrderItem {
  id: string
  tableNumber: number
  itemsCount: number
  totalAmount: number
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled'
  orderTime: string
  waiterName: string
}

export interface ReservationItem {
  id: string
  guestName: string
  guestPhone: string
  guestEmail?: string
  tableNumber?: number
  partySize: number
  dateTime: string
  status: 'confirmed' | 'pending' | 'seated' | 'cancelled'
  specialRequests?: string
}

export type { RestaurantTable, StoredReservation } from '@/data/tableData'
export type { TableAvailabilityStatus, TableWithAvailability } from '@/store/useReservationStore'
export * from './order'
export * from './billing'
