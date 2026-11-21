import React, { useState, useMemo } from 'react'
import { RestaurantTable } from '@/data/tableData'
import { getAssignedTablesForWaiter } from '@/data/waiterData'
import { Order } from '@/types/order'
import { useReservationStore, timeToMinutes } from '@/store'
import { StatusBadge, Button, EmptyState } from '@/components/common'
import {
  Users,
  Plus,
  Eye,
  CheckCircle2,
} from 'lucide-react'

export interface WaiterAssignedTablesProps {
  waiterId: string
  waiterName: string
  orders: Order[]
  onTakeOrder: (table: RestaurantTable) => void
  onViewOrder: (order: Order) => void
}

export const WaiterAssignedTables: React.FC<WaiterAssignedTablesProps> = ({
  waiterId,
  waiterName: _waiterName,
  orders,
  onTakeOrder,
  onViewOrder,
}) => {
  const { reservations } = useReservationStore()
  const [statusFilter, setStatusFilter] = useState<'all' | 'Available' | 'Reserved' | 'Occupied'>('all')

  // Get strictly tables assigned to this waiter
  const assignedTables = useMemo(() => {
    return getAssignedTablesForWaiter(waiterId)
  }, [waiterId])

  // Enhance each assigned table with current live reservation/order data
  const tableDataWithStatus = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes()

    return assignedTables.map((table) => {
      // Find active order on this table assigned to this waiter
      const activeOrder = orders.find(
        (o) =>
          o.tableId === table.id &&
          o.status !== 'completed' &&
          o.status !== 'cancelled'
      )

      // Find reservation for this table today
      const todayRes = reservations.find(
        (r) => r.tableId === table.id && r.date === todayStr && r.status !== 'cancelled'
      )

      let status: 'Available' | 'Reserved' | 'Occupied' = 'Available'
      let guestCount = 0
      let detailNote: string | undefined

      if (activeOrder) {
        status = 'Occupied'
        guestCount = activeOrder.items.reduce((sum, it) => sum + it.quantity, 0)
        detailNote = `Active Order ${activeOrder.id} (${activeOrder.status})`
      } else if (todayRes) {
        const resMinutes = timeToMinutes(todayRes.time)
        const isSeatedNow = Math.abs(nowMinutes - resMinutes) < 90
        if (isSeatedNow) {
          status = 'Occupied'
          guestCount = todayRes.guests
          detailNote = `Seated: ${todayRes.customerName} (${todayRes.guests} guests)`
        } else {
          status = 'Reserved'
          guestCount = todayRes.guests
          detailNote = `Booked for ${todayRes.time} (${todayRes.customerName})`
        }
      }

      return {
        table,
        status,
        guestCount,
        activeOrder,
        detailNote,
      }
    })
  }, [assignedTables, orders, reservations])

  // Filtered tables
  const filteredTables = useMemo(() => {
    return tableDataWithStatus.filter((item) => {
      if (statusFilter === 'all') return true
      return item.status === statusFilter
    })
  }, [tableDataWithStatus, statusFilter])

  // Counts
  const counts = useMemo(() => {
    const total = tableDataWithStatus.length
    const available = tableDataWithStatus.filter((t) => t.status === 'Available').length
    const reserved = tableDataWithStatus.filter((t) => t.status === 'Reserved').length
    const occupied = tableDataWithStatus.filter((t) => t.status === 'Occupied').length
    return { total, available, reserved, occupied }
  }, [tableDataWithStatus])

  return (
    <div id="assigned-tables-section" className="rounded-2xl bg-cream-card p-5 sm:p-6 border border-cream-border shadow-subtle text-left space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cream-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-burgundy-dark">
              My Assigned Tables
            </h3>
            <span className="text-xs font-semibold text-gold-dark bg-gold/15 px-2.5 py-0.5 rounded-full border border-gold/30">
              Staff ID: {waiterId}
            </span>
          </div>
          <p className="text-xs text-secondary-text mt-0.5">
            Showing only tables assigned to your section ({counts.total} tables).
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-burgundy text-cream shadow-2xs'
                : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy'
            }`}
          >
            All ({counts.total})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('Occupied')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'Occupied'
                ? 'bg-amber-600 text-cream shadow-2xs'
                : 'bg-cream text-secondary-text border border-cream-border hover:text-amber-800'
            }`}
          >
            Occupied ({counts.occupied})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('Reserved')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'Reserved'
                ? 'bg-sky-700 text-cream shadow-2xs'
                : 'bg-cream text-secondary-text border border-cream-border hover:text-sky-800'
            }`}
          >
            Reserved ({counts.reserved})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('Available')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'Available'
                ? 'bg-emerald-700 text-cream shadow-2xs'
                : 'bg-cream text-secondary-text border border-cream-border hover:text-emerald-800'
            }`}
          >
            Available ({counts.available})
          </button>
        </div>
      </div>

      {/* Grid of Assigned Tables */}
      {filteredTables.length === 0 ? (
        <EmptyState
          title="No Tables In This Filter"
          description="None of your assigned tables currently match this status."
          action={
            <Button variant="outline" size="sm" onClick={() => setStatusFilter('all')}>
              Show All Tables
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredTables.map(({ table, status, guestCount: _guestCount, activeOrder, detailNote }) => {
            const isOccupied = status === 'Occupied'
            const isReserved = status === 'Reserved'
            const isAvailable = status === 'Available'

            return (
              <div
                key={table.id}
                className={`rounded-2xl p-4 border flex flex-col justify-between transition-all duration-200 ${
                  isOccupied
                    ? 'bg-amber-50/40 border-amber-200 hover:shadow-subtle'
                    : isReserved
                    ? 'bg-sky-50/40 border-sky-200 hover:shadow-subtle'
                    : 'bg-cream-card border-cream-border hover:border-emerald-300 hover:shadow-subtle'
                }`}
              >
                <div>
                  {/* Card Header: Table Name & Status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-base font-bold text-burgundy-dark">
                      {table.name}
                    </span>
                    <StatusBadge
                      status={
                        isAvailable ? 'available' : isReserved ? 'reserved' : 'occupied'
                      }
                      pulse={isOccupied}
                    />
                  </div>

                  {/* Zone & Capacity */}
                  <div className="flex items-center justify-between text-xs text-secondary-text mb-2.5">
                    <span>{table.zone} ({table.seatingType})</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-burgundy-dark bg-cream px-2 py-0.5 rounded-md border border-cream-border">
                      <Users className="w-3 h-3 text-gold-dark" />
                      {table.capacity} seats
                    </span>
                  </div>

                  {/* Active Order / Guest Info Box */}
                  <div className="my-2 p-2.5 rounded-xl bg-cream/70 border border-cream-border/70 text-xs min-h-[56px] flex flex-col justify-center">
                    {activeOrder ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-burgundy-dark text-[11px]">
                            {activeOrder.id}
                          </span>
                          <span className="font-bold text-gold-dark text-[11px]">
                            ₹{activeOrder.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-[10px] text-secondary-text truncate mt-0.5" title={activeOrder.itemsSummary}>
                          {activeOrder.itemsSummary}
                        </p>
                      </div>
                    ) : detailNote ? (
                      <p className="text-[11px] font-medium text-burgundy-dark line-clamp-2">
                        {detailNote}
                      </p>
                    ) : (
                      <p className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Clean & Ready to Seat
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="pt-3 border-t border-cream-border/70 mt-2">
                  {activeOrder ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewOrder(activeOrder)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      className="w-full text-xs font-semibold py-1.5"
                    >
                      View Order ({activeOrder.status})
                    </Button>
                  ) : (
                    <Button
                      variant={isAvailable ? 'gold' : 'secondary'}
                      size="sm"
                      onClick={() => onTakeOrder(table)}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      className="w-full text-xs font-semibold py-1.5"
                    >
                      {isAvailable ? 'Take Order' : 'Seat / Order'}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
