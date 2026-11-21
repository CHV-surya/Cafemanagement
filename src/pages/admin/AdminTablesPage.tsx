import React, { useState, useMemo } from 'react'
import {
  PageHeader,
  StatCard,
  Button,
  Modal,
} from '@/components/common'
import { useTableStore } from '@/store/useTableStore'
import { useReservationStore, timeToMinutes } from '@/store/useReservationStore'
import { useOrderStore } from '@/store/useOrderStore'
import { DEMO_TABLES, RestaurantTable } from '@/data/tableData'
import { DEMO_ACCOUNTS } from '@/data/staffData'
import { OrderDetailsModal } from '@/components/orders/OrderDetailsModal'
import { Order } from '@/types/order'
import {
  Grid3X3,
  Users,
  CheckCircle2,
  Clock,
  UserCheck,
  RotateCcw,
  Eye,
  Filter,
  Compass,
  UtensilsCrossed,
} from 'lucide-react'

export const AdminTablesPage: React.FC = () => {
  const { assignments, reassignWaiter, resetToDefaultAssignments } = useTableStore()
  const { reservations } = useReservationStore()
  const { orders } = useOrderStore()

  // Filters
  const [filterType, setFilterType] = useState<'All' | 'Indoor' | 'Outdoor'>('All')
  const [filterStatus, setFilterStatus] = useState<'All' | 'Available' | 'Reserved' | 'Occupied'>('All')
  const [filterWaiter, setFilterWaiter] = useState<string>('All')

  // Reassignment Modal state
  const [tableToReassign, setTableToReassign] = useState<RestaurantTable | null>(null)
  const [newWaiterId, setNewWaiterId] = useState<string>('')
  const [reassignSuccessMsg, setReassignSuccessMsg] = useState<string | null>(null)

  // Order Details Modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])
  const nowMinutes = useMemo(() => new Date().getHours() * 60 + new Date().getMinutes(), [])

  // Active waiters list for assignment
  const activeWaiters = useMemo(() => {
    return DEMO_ACCOUNTS.filter((acc) => acc.role === 'waiter' && acc.isActive)
  }, [])

  // Derive comprehensive table info with live order, reservation, and waiter assignment
  const tablesWithLiveInfo = useMemo(() => {
    return DEMO_TABLES.map((table) => {
      // 1. Current Waiter Assignment
      const assignment = assignments.find((a) => a.tableId === table.id)
      const waiterId = assignment?.waiterId || 'WTR001'
      const waiterAccount = DEMO_ACCOUNTS.find((a) => a.id === waiterId)
      const waiterName = waiterAccount?.name || 'Assigned Waiter'
      const sectionName = assignment?.sectionName || table.zone

      // 2. Active Dine-in Order
      const activeOrder = orders.find(
        (o) =>
          o.tableId === table.id &&
          o.status !== 'completed' &&
          o.status !== 'cancelled'
      )

      // 3. Reservation today
      const todayRes = reservations.find(
        (r) => r.tableId === table.id && r.date === todayStr && r.status !== 'cancelled'
      )

      // 4. Calculate status
      let status: 'Available' | 'Reserved' | 'Occupied' = 'Available'
      let activeDetail: string | undefined

      if (activeOrder) {
        status = 'Occupied'
        activeDetail = `Active Order ${activeOrder.id} • ${activeOrder.customerName} (${activeOrder.status})`
      } else if (todayRes) {
        const resMinutes = timeToMinutes(todayRes.time)
        const isSeated =
          todayRes.status === 'seated' || Math.abs(nowMinutes - resMinutes) < 90

        if (isSeated) {
          status = 'Occupied'
          activeDetail = `Seated: ${todayRes.customerName} (${todayRes.guests} guests)`
        } else {
          status = 'Reserved'
          activeDetail = `Booked for ${todayRes.time} (${todayRes.customerName})`
        }
      }

      return {
        ...table,
        waiterId,
        waiterName,
        waiterAvatar: waiterAccount?.avatarUrl,
        sectionName,
        status,
        activeDetail,
        activeOrder,
        todayRes,
      }
    })
  }, [assignments, reservations, orders, todayStr, nowMinutes])

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = tablesWithLiveInfo.length
    const available = tablesWithLiveInfo.filter((t) => t.status === 'Available').length
    const occupied = tablesWithLiveInfo.filter((t) => t.status === 'Occupied').length
    const reserved = tablesWithLiveInfo.filter((t) => t.status === 'Reserved').length
    return { total, available, occupied, reserved }
  }, [tablesWithLiveInfo])

  // Filtered tables
  const filteredTables = useMemo(() => {
    return tablesWithLiveInfo.filter((tbl) => {
      if (filterType !== 'All' && tbl.seatingType !== filterType) return false
      if (filterStatus !== 'All' && tbl.status !== filterStatus) return false
      if (filterWaiter !== 'All' && tbl.waiterId !== filterWaiter) return false
      return true
    })
  }, [tablesWithLiveInfo, filterType, filterStatus, filterWaiter])

  // Handle open reassign modal
  const handleOpenReassign = (table: RestaurantTable, currentWaiterId: string) => {
    setTableToReassign(table)
    setNewWaiterId(currentWaiterId)
    setReassignSuccessMsg(null)
  }

  // Handle confirm reassign
  const handleConfirmReassign = () => {
    if (!tableToReassign || !newWaiterId) return
    const result = reassignWaiter(tableToReassign.id, newWaiterId)
    if (result.success) {
      const waiter = DEMO_ACCOUNTS.find((w) => w.id === newWaiterId)
      setReassignSuccessMsg(`Assigned ${tableToReassign.id} to ${waiter?.name || newWaiterId}`)
      setTimeout(() => {
        setTableToReassign(null)
        setReassignSuccessMsg(null)
      }, 700)
    }
  }

  return (
    <div className="space-y-8 text-left pb-10">
      {/* 1. Header */}
      <PageHeader
        title="Live Floor & Table Management"
        subtitle="Manage 15 restaurant tables, waiter zoning assignments, and live occupancy."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Tables' }]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => resetToDefaultAssignments()}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs"
              title="Reset table zoning to initial demo assignments"
            >
              Reset Assignments
            </Button>
          </div>
        }
      />

      {/* 2. Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tables"
          value={`${metrics.total}`}
          change={{
            value: "100% capacity",
            isPositive: true,
            label: "configured",
          }}
          description="15 dining stations"
          icon={Grid3X3}
        />

        <StatCard
          title="Available Now"
          value={`${metrics.available}`}
          change={{
            value: `${Math.round((metrics.available / metrics.total) * 100)}% free`,
            isPositive: metrics.available > 5,
            label: "ready for seating",
          }}
          description="Ready for walk-ins"
          icon={CheckCircle2}
        />

        <StatCard
          title="Occupied Tables"
          value={`${metrics.occupied}`}
          change={{
            value: `${metrics.occupied} active`,
            isPositive: true,
            label: "dining right now",
          }}
          description="Active service or seated"
          icon={UtensilsCrossed}
        />

        <StatCard
          title="Reserved Tables"
          value={`${metrics.reserved}`}
          change={{
            value: "Upcoming bookings",
            isPositive: true,
            label: "today",
          }}
          description="Held for booked guests"
          icon={Clock}
        />
      </div>

      {/* 3. Filters Toolbar */}
      <div className="rounded-2xl bg-cream-card p-5 border border-cream-border shadow-subtle flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Seating Type Filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-secondary-text font-semibold mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-gold-dark" />
            Environment:
          </span>
          {(['All', 'Indoor', 'Outdoor'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterType === type
                  ? 'bg-burgundy text-cream shadow-2xs'
                  : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-secondary-text font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-gold-dark" />
            Status:
          </span>
          {(['All', 'Available', 'Reserved', 'Occupied'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-gold/25 text-burgundy-dark border border-gold shadow-2xs'
                  : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Waiter Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-secondary-text font-semibold flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-gold-dark" />
            Waiter:
          </span>
          <select
            value={filterWaiter}
            onChange={(e) => setFilterWaiter(e.target.value)}
            className="rounded-xl bg-cream px-3 py-1.5 font-semibold text-burgundy-dark border border-cream-border focus:ring-2 focus:ring-gold/40 focus:border-gold"
          >
            <option value="All">All Waiters</option>
            {activeWaiters.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Table Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTables.map((table) => {
          const isOccupied = table.status === 'Occupied'
          const isReserved = table.status === 'Reserved'

          return (
            <div
              key={table.id}
              className={`rounded-2xl p-5 border-2 transition-all shadow-subtle hover:shadow-elevated flex flex-col justify-between space-y-4 ${
                isOccupied
                  ? 'bg-rose-50/40 border-rose-200'
                  : isReserved
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-cream-card border-cream-border hover:border-gold/50'
              }`}
            >
              {/* Card Top: Table Number, Status Badge, Capacity */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-cream-border/70">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-burgundy text-gold font-display font-bold text-base flex items-center justify-center shadow-2xs">
                      {table.id}
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-burgundy-dark">
                        {table.name}
                      </h4>
                      <p className="text-[11px] text-secondary-text">
                        {table.zone} • {table.seatingType}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isOccupied && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                        Occupied
                      </span>
                    )}
                    {isReserved && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Reserved
                      </span>
                    )}
                    {!isOccupied && !isReserved && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Capacity & Description */}
                <div className="py-2 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-secondary-text">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gold-dark" />
                      Seating Capacity:
                    </span>
                    <strong className="text-burgundy-dark font-semibold">
                      Up to {table.capacity} Guests
                    </strong>
                  </div>

                  {table.activeDetail && (
                    <div className="p-2 rounded-lg bg-cream/80 border border-cream-border text-[11px] font-medium text-burgundy-dark">
                      {table.activeDetail}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Bottom: Assigned Waiter & Actions */}
              <div className="pt-3 border-t border-cream-border/70 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {table.waiterAvatar ? (
                      <img
                        src={table.waiterAvatar}
                        alt={table.waiterName}
                        className="w-7 h-7 rounded-full object-cover border border-cream-border shadow-2xs"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center font-bold text-[10px]">
                        {table.waiterName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] text-secondary-text block leading-none">
                        Assigned Waiter:
                      </span>
                      <span className="font-bold text-burgundy-dark text-xs">
                        {table.waiterName}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenReassign(table, table.waiterId)}
                    className="py-1 px-2 text-[10px] text-secondary-text hover:text-burgundy"
                  >
                    Reassign
                  </Button>
                </div>

                {/* Quick Action if Occupied */}
                {table.activeOrder && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedOrder(table.activeOrder || null)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    className="w-full text-xs py-1.5"
                  >
                    View Active Order ({table.activeOrder.id})
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* =========================================================================
          MODAL: REASSIGN WAITER
         ========================================================================= */}
      {tableToReassign && (
        <Modal
          isOpen={!!tableToReassign}
          onClose={() => setTableToReassign(null)}
          title={`Reassign Waiter for ${tableToReassign.id}`}
        >
          <div className="space-y-4 text-left text-xs">
            {reassignSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{reassignSuccessMsg}</span>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-cream border border-cream-border space-y-1">
              <span className="text-[10px] uppercase font-bold text-secondary-text">
                Table Information
              </span>
              <h4 className="font-bold text-sm text-burgundy-dark">
                {tableToReassign.id} • {tableToReassign.name}
              </h4>
              <p className="text-[11px] text-secondary-text">
                {tableToReassign.zone} ({tableToReassign.seatingType}, {tableToReassign.capacity} Guests)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-1">
                Select New Waiter
              </label>
              <select
                value={newWaiterId}
                onChange={(e) => setNewWaiterId(e.target.value)}
                className="w-full rounded-xl bg-cream-card px-3 py-2 text-xs font-bold text-burgundy-dark border border-cream-border focus:ring-2 focus:ring-gold/40 focus:border-gold"
              >
                {activeWaiters.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.id}) - {w.shift}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-secondary-text mt-1.5">
                Reassigning will immediately update the designated waiter's dashboard and order creation table lists.
              </p>
            </div>

            <div className="pt-3 border-t border-cream-border flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTableToReassign(null)}
              >
                Cancel
              </Button>
              <Button
                variant="gold"
                size="sm"
                onClick={handleConfirmReassign}
                leftIcon={<UserCheck className="w-4 h-4" />}
                className="shadow-gold text-xs font-bold"
              >
                Save Assignment
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* =========================================================================
          MODAL: ACTIVE ORDER DETAILS
         ========================================================================= */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
          userRole="admin"
          staffId="ADM001"
          staffName="Laurent Moreau"
        />
      )}
    </div>
  )
}
