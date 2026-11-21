import {
  LayoutDashboard,
  UtensilsCrossed,
  Grid3X3,
  BookOpen,
  CalendarDays,
  Receipt,
  BarChart3,
  Settings,
  Bell,
  Clock,
  ChefHat,
  CheckCircle2,
  Users
} from 'lucide-react'
import { NavItem } from '@/types'

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { title: 'Home', path: '/' },
  { title: 'Menu', path: '/menu' },
  { title: 'Book a Table', path: '/book-table' },
  { title: 'About', path: '/about' },
]

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Live Floor & Tables',
    path: '/admin/tables',
    icon: Grid3X3,
    badge: '18/24',
    badgeColor: 'gold',
  },
  {
    title: 'Orders Hub',
    path: '/admin/orders',
    icon: UtensilsCrossed,
    badge: 7,
    badgeColor: 'danger',
  },
  {
    title: 'Reservations',
    path: '/admin/reservations',
    icon: CalendarDays,
    badge: 12,
    badgeColor: 'success',
  },
  {
    title: 'Menu Management',
    path: '/admin/menu',
    icon: BookOpen,
  },
  {
    title: 'Billing & POS',
    path: '/admin/billing',
    icon: Receipt,
  },
  {
    title: 'Analytics & Sales',
    path: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Staff Management',
    path: '/admin/staff',
    icon: Users,
  },
  {
    title: 'Restaurant Settings',
    path: '/admin/settings',
    icon: Settings,
  },
]

export const WAITER_NAV_ITEMS: NavItem[] = [
  {
    title: 'Waiter Dashboard',
    path: '/waiter/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Assigned Tables',
    path: '/waiter/tables',
    icon: Grid3X3,
    badge: '6 Active',
    badgeColor: 'gold',
  },
  {
    title: 'My Orders',
    path: '/waiter/orders',
    icon: UtensilsCrossed,
    badge: 4,
    badgeColor: 'danger',
  },
  {
    title: 'Table Bills & POS',
    path: '/waiter/billing',
    icon: Receipt,
  },
  {
    title: 'Ready for Service',
    path: '/waiter/ready-orders',
    icon: Bell,
    badge: 2,
    badgeColor: 'success',
  },
  {
    title: 'Quick Menu Lookup',
    path: '/waiter/menu',
    icon: BookOpen,
  },
]

export const KITCHEN_NAV_ITEMS: NavItem[] = [
  {
    title: 'Kitchen Dashboard',
    path: '/kitchen/dashboard',
    icon: ChefHat,
  },
  {
    title: 'Active KDS Tickets',
    path: '/kitchen/tickets',
    icon: Clock,
    badge: 5,
    badgeColor: 'danger',
  },
  {
    title: 'Appetizer & Cold Station',
    path: '/kitchen/cold-station',
    icon: UtensilsCrossed,
  },
  {
    title: 'Grill & Hot Line',
    path: '/kitchen/hot-station',
    icon: UtensilsCrossed,
    badge: 3,
    badgeColor: 'gold',
  },
  {
    title: 'Completed Tickets',
    path: '/kitchen/history',
    icon: CheckCircle2,
  },
]
