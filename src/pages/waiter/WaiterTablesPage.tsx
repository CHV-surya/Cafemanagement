import React, { useState, useMemo } from 'react'
import {
  PageHeader,
  StatCard,
  Button,
} from '@/components/common'
import { useAuthStore } from '@/store/useAuthStore'
import { useTableStore } from '@/store/useTableStore'
import { useOrderStore } from '@/store/useOrderStore'
import { useReservationStore, timeToMinutes } from '@/store/useReservationStore'
import { RestaurantTable } from '@/data/tableData'
import { Order } from '@/types/order'
import { OrderCreateModal } from '@/components/orders/OrderCreateModal'
import { OrderDetailsModal } from '@/components/orders/OrderDetailsModal'
import {
  Grid3X3,
  CheckCircle2,
  UtensilsCrossed,
  Clock,
  Plus,
  Eye,
  Users,
} from 'lucide-react'

export const WaiterTablesPage: React.FC = () => {
  const { currentUser } = useAuthStore()
  const { getAssignedTablesForWaiter, getSectionNameForWaiter } = useTableStore()
  const { orders } = useOrderStore()
  const { reservations } = useReservationStore()

  const waiterId = currentUser?.id || 'WTR001'
  const waiterName = currentUser?.name || 'Staff Waiter'
  const sectionName = getSectionNameForWaiter(waiterId)

  // Modals
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<RestaurantTable | null>(null)
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])
  const nowMinutes = useMemo(() => new Date().getHours() * 60 + new Date().getMinutes(), [])

  // Assigned tables from centralized store
  const assignedTables = useMemo(() => {
    return getAssignedTablesForWaiter(waiterId)
  }, [getAssignedTablesForWaiter, waiterId])

  // Enhance each table with status & active order
  const tablesWithDetails = useMemo(() => {
    return assignedTables.map((table) => {
      const activeOrder = orders.find(
        (o) =>
          o.tableId === table.id &&
          o.status !== 'completed' &&
          o.status !== 'cancelled'
      )

      const todayRes = reservations.find(
        (r) => r.tableId === table.id && r.date === todayStr && r.status !== 'cancelled'
      )

      let status: 'Available' | 'Reserved' | 'Occupied' = 'Available'
      let note: string | undefined

      if (activeOrder) {
        status = 'Occupied'
        note = `Active Order ${activeOrder.id} • ${activeOrder.customerName} (${activeOrder.status})`
      } else if (todayRes) {
        const resMinutes = timeToMinutes(todayRes.time)
        const isSeated = todayRes.status === 'seated' || Math.abs(nowMinutes - resMinutes) < 90
        if (isSeated) {
          status = 'Occupied'
          note = `Seated: ${todayRes.customerName} (${todayRes.guests} guests)`
        } else {
          status = 'Reserved'
          note = `Booked for ${todayRes.time} (${todayRes.customerName})`
        }
      }

      return {
        table,
        status,
        activeOrder,
        todayRes,
        note,
      }
    })
  }, [assignedTables, orders, reservations, todayStr, nowMinutes])

  // Counts
  const counts = useMemo(() => {
    const total = tablesWithDetails.length
    const available = tablesWithDetails.filter((t) => t.status === 'Available').length
    const occupied = tablesWithDetails.filter((t) => t.status === 'Occupied').length
    const reserved = tablesWithDetails.filter((t) => t.status === 'Reserved').length
    return { total, available, occupied, reserved }
  }, [tablesWithDetails])

  const handleStartOrder = (table: RestaurantTable) => {
    setSelectedTableForOrder(table)
    setIsCreateOrderOpen(true)
  }

  return (
    <div className="space-y-8 text-left pb-10">
      {/* 1. Header */}
      <PageHeader
        title="My Assigned Tables"
        subtitle={`Tables assigned to you (${waiterName}) in ${sectionName}.`}
        breadcrumbs={[{ label: 'Waiter' }, { label: 'Assigned Tables' }]}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-secondary-text bg-cream px-3 py-1.5 rounded-xl border border-cream-border">
              Waiter ID: <strong className="font-mono text-burgundy-dark">{waiterId}</strong>
            </span>
          </div>
        }
      />

      {/* 2. Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Assigned Tables"
          value={`${counts.total}`}
          description={sectionName}
          icon={Grid3X3}
        />

        <StatCard
          title="Available Stations"
          value={`${counts.available}`}
          change={{
            value: "Open for guests",
            isPositive: true,
            label: "ready to seat",
          }}
          description="Ready for walk-in orders"
          icon={CheckCircle2}
        />

        <StatCard
          title="Occupied / Active"
          value={`${counts.occupied}`}
          change={{
            value: `${counts.occupied} dining`,
            isPositive: true,
            label: "active service",
          }}
          description="In service or seated"
          icon={UtensilsCrossed}
        />
      </div>

      {/* 3. Table Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tablesWithDetails.map(({ table, status, activeOrder, note }) => {
          const isOccupied = status === 'Occupied'
          const isReserved = status === 'Reserved'

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

                <div className="py-2 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-secondary-text">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gold-dark" />
                      Capacity:
                    </span>
                    <strong className="text-burgundy-dark font-semibold">
                      Up to {table.capacity} Guests
                    </strong>
                  </div>

                  {note && (
                    <div className="p-2 rounded-lg bg-cream/80 border border-cream-border text-[11px] font-medium text-burgundy-dark">
                      {note}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-cream-border/70 flex gap-2">
                {activeOrder ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedOrder(activeOrder)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    className="w-full text-xs py-2"
                  >
                    View Order ({activeOrder.id})
                  </Button>
                ) : (
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => handleStartOrder(table)}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    className="w-full shadow-gold text-xs font-bold py-2"
                  >
                    Take Dine-In Order
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Order Creation Modal */}
      {isCreateOrderOpen && (
        <OrderCreateModal
          isOpen={isCreateOrderOpen}
          onClose={() => {
            setIsCreateOrderOpen(false)
            setSelectedTableForOrder(null)
          }}
          userRole="waiter"
          waiterId={waiterId}
          waiterName={waiterName}
          defaultTableId={selectedTableForOrder?.id}
        />
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
          userRole="waiter"
          staffId={waiterId}
          staffName={waiterName}
        />
      )}
    </div>
  )
}
