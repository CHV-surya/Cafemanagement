import React, { useMemo } from 'react'
import {
  PageHeader,
  StatCard,
  Button,
} from '@/components/common'
import {
  SalesAnalyticsChart,
  RecentOrdersTable,
  ReservationsOverviewCard,
  TablesOverviewCard,
  QuickActionsPanel,
} from '@/components/dashboard'
import { useAuthStore, useReservationStore, useUIStore, useOrderStore } from '@/store'
import { DEMO_TABLES } from '@/data/tableData'
import { ADMIN_OVERVIEW_BASE } from '@/data/adminDashboardData'
import {
  UtensilsCrossed,
  Receipt,
  CalendarDays,
  Grid3X3,
  Users,
  ShieldCheck,
  Calendar,
  Bell,
} from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  const { currentUser } = useAuthStore()
  const { reservations } = useReservationStore()
  const { setNotificationDrawerOpen } = useUIStore()
  const { orders } = useOrderStore()

  // Admin identity
  const adminName = currentUser?.name || 'Laurent Moreau'
  const adminId = currentUser?.id || 'ADM001'

  // Dynamic order stats from centralized store
  const totalOrdersCount = orders.length
  const completedOrdersRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  // Current formatted date
  const currentDateFormatted = useMemo(() => {
    const today = new Date()
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [])

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  // Derived Active Reservations count
  const todayActiveReservations = useMemo(() => {
    return reservations.filter(
      (r) => r.date === todayStr && r.status !== 'cancelled'
    )
  }, [reservations, todayStr])

  // Derived Available Tables count
  const tableCounts = useMemo(() => {
    const totalTables = DEMO_TABLES.length
    const occupiedOrReservedTableIds = new Set<string>()

    // Add tables with active dine-in orders
    orders.forEach((o) => {
      if (o.tableId && o.status !== 'completed' && o.status !== 'cancelled') {
        occupiedOrReservedTableIds.add(o.tableId)
      }
    })

    // Add tables booked today
    todayActiveReservations.forEach((r) => {
      occupiedOrReservedTableIds.add(r.tableId)
    })

    const occupiedOrReserved = occupiedOrReservedTableIds.size
    const available = Math.max(0, totalTables - occupiedOrReserved)
    return {
      total: totalTables,
      available,
      occupiedOrReserved,
      percentage: Math.round((available / totalTables) * 100),
    }
  }, [orders, todayActiveReservations])

  return (
    <div className="space-y-8 text-left pb-10">
      {/* 1. Dashboard Layout Header */}
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${adminName}. Here is what's happening at BistroHub today.`}
        breadcrumbs={[
          { label: 'Admin' },
          { label: 'Dashboard' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Current Date Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream border border-cream-border text-xs font-semibold text-secondary-text shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-gold-dark" />
              <span>{currentDateFormatted}</span>
            </span>

            {/* Admin Badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/15 text-burgundy-dark border border-gold/30 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-gold-dark" />
              <span>Admin ID: <strong className="font-mono">{adminId}</strong></span>
            </span>

            {/* Notifications Trigger Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNotificationDrawerOpen(true)}
              leftIcon={<Bell className="w-3.5 h-3.5 text-gold-dark" />}
              className="py-1.5 px-3 text-xs"
            >
              Alerts
            </Button>
          </div>
        }
      />

      {/* 2. Overview Statistics (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Stat 1: Total Orders */}
        <StatCard
          title="Total Orders"
          value={`${totalOrdersCount}`}
          change={{
            value: "+12.4%",
            isPositive: true,
            label: "vs last week",
          }}
          description="Centralized order store"
          icon={UtensilsCrossed}
        />

        {/* Stat 2: Today's Revenue */}
        <StatCard
          title="Today's Revenue"
          value={`₹${(completedOrdersRevenue || ADMIN_OVERVIEW_BASE.todayRevenue).toLocaleString('en-IN')}`}
          change={{
            value: "+15.2%",
            isPositive: true,
            label: "vs yesterday",
          }}
          description="Settled checks total"
          icon={Receipt}
        />

        {/* Stat 3: Active Reservations (Derived from useReservationStore) */}
        <StatCard
          title="Active Reservations"
          value={`${todayActiveReservations.length}`}
          change={{
            value: `${todayActiveReservations.length} confirmed`,
            isPositive: true,
            label: "today",
          }}
          description={`${todayActiveReservations.reduce((sum, r) => sum + r.guests, 0)} guests expected`}
          icon={CalendarDays}
        />

        {/* Stat 4: Available Tables (Derived from DEMO_TABLES & useReservationStore) */}
        <StatCard
          title="Available Tables"
          value={`${tableCounts.available} / ${tableCounts.total}`}
          change={{
            value: `${tableCounts.percentage}%`,
            isPositive: tableCounts.percentage > 50,
            label: "open floor",
          }}
          description={`${tableCounts.occupiedOrReserved} reserved or occupied`}
          icon={Grid3X3}
        />

        {/* Stat 5: Total Customers */}
        <StatCard
          title="Total Customers"
          value={`${ADMIN_OVERVIEW_BASE.totalCustomers.toLocaleString('en-IN')}`}
          change={{
            value: `+${ADMIN_OVERVIEW_BASE.newCustomersToday}`,
            isPositive: true,
            label: "new today",
          }}
          description="94% returning guest rating"
          icon={Users}
        />
      </div>

      {/* 7. Quick Actions Panel */}
      <QuickActionsPanel />

      {/* 3. Sales Overview Section (Recharts) */}
      <SalesAnalyticsChart />

      {/* 4. Recent Orders Table */}
      <RecentOrdersTable />

      {/* Two-Column Layout: Reservations Overview (Left) & Tables Overview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 5. Reservation Overview (7 cols) */}
        <div className="lg:col-span-7">
          <ReservationsOverviewCard />
        </div>

        {/* 6. Table Overview (5 cols) */}
        <div className="lg:col-span-5">
          <TablesOverviewCard />
        </div>
      </div>
    </div>
  )
}
