import { UserRole } from '@/types'

export type StaffWorkspaceRole = 'admin' | 'waiter' | 'kitchen'

export interface DemoStaffAccount {
  id: string
  username: string
  passwordHash: string // For demonstration, plain password match
  name: string
  email: string
  role: UserRole
  isActive: boolean
  shift: string
  avatarUrl?: string
}

export const DEMO_ACCOUNTS: DemoStaffAccount[] = [
  // Admin / Receptionist
  {
    id: 'ADM001',
    username: 'admin',
    passwordHash: 'admin123',
    name: 'Laurent Moreau',
    email: 'laurent.admin@bistrohub.demo',
    role: 'admin',
    isActive: true,
    shift: 'General Operations & Floor Management',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },

  // Waiter 1
  {
    id: 'WTR001',
    username: 'waiter1',
    passwordHash: 'waiter123',
    name: 'Sophie Dubois',
    email: 'sophie.w1@bistrohub.demo',
    role: 'waiter',
    isActive: true,
    shift: 'Main Dining Floor (Tables 1-5)',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },

  // Waiter 2
  {
    id: 'WTR002',
    username: 'waiter2',
    passwordHash: 'waiter123',
    name: 'Aarav Sharma',
    email: 'aarav.w2@bistrohub.demo',
    role: 'waiter',
    isActive: true,
    shift: 'Garden Terrace & Veranda (Tables 6-10)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },

  // Waiter 3
  {
    id: 'WTR003',
    username: 'waiter3',
    passwordHash: 'waiter123',
    name: 'Priya Patel',
    email: 'priya.w3@bistrohub.demo',
    role: 'waiter',
    isActive: true,
    shift: 'Royal Banquet & Private Pavilion (Tables 11-15)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },

  // Kitchen / Head Chef
  {
    id: 'KTC001',
    username: 'kitchen',
    passwordHash: 'kitchen123',
    name: 'Chef Antoine Mercer',
    email: 'chef.antoine@bistrohub.demo',
    role: 'kitchen',
    isActive: true,
    shift: 'KDS Expeditor & Hot Line Pass',
    avatarUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
  },

  // Inactive Waiter Account (for testing inactive account validation)
  {
    id: 'WTR004',
    username: 'waiter_inactive',
    passwordHash: 'waiter123',
    name: 'Marcus Vance (On Leave)',
    email: 'marcus.w4@bistrohub.demo',
    role: 'waiter',
    isActive: false,
    shift: 'Account Deactivated (Medical Leave)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
]

export const ROLE_DETAILS = {
  admin: {
    title: 'Admin / Receptionist',
    description: 'Manage restaurant operations, orders, reservations, tables and billing.',
    badge: 'Operations & Management',
    dashboardRoute: '/admin/dashboard',
  },
  waiter: {
    title: 'Waiter',
    description: 'Manage assigned tables, take customer orders and track order progress.',
    badge: 'Floor Service',
    dashboardRoute: '/waiter/dashboard',
  },
  kitchen: {
    title: 'Kitchen',
    description: 'View incoming orders and monitor food preparation.',
    badge: 'KDS Display',
    dashboardRoute: '/kitchen/dashboard',
  },
  manager: {
    title: 'Manager',
    description: 'Floor and operational supervision.',
    badge: 'Supervisor',
    dashboardRoute: '/admin/dashboard',
  },
} as const
