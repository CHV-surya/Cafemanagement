import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DEMO_TABLES, RestaurantTable } from '@/data/tableData'
import { useReservationStore, useOrderStore, timeToMinutes } from '@/store'
import { StatusBadge, Button } from '@/components/common'
import {
  Users,
  ArrowUpRight,
} from 'lucide-react'

export interface TableLiveStatusInfo extends RestaurantTable {
  status: 'Available' | 'Reserved' | 'Occupied'
  activeNote?: string
}

export const TablesOverviewCard: React.FC = () => {
  const navigate = useNavigate()
  const { reservations } = useReservationStore()
  const { orders } = useOrderStore()
  const [filterType, setFilterType] = useState<'All' | 'Indoor' | 'Outdoor'>('All')
  const [filterStatus, setFilterStatus] = useState<'All' | 'Available' | 'Reserved' | 'Occupied'>('All')

  // Derive live status of all 15 DEMO_TABLES from today's orders and reservations
  const tablesWithStatus: TableLiveStatusInfo[] = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes()

    return DEMO_TABLES.map((table) => {
      // 1. Check if there is an active dine-in order on this table right now
      const activeOrder = orders.find(
        (o) =>
          o.tableId === table.id &&
          o.status !== 'completed' &&
          o.status !== 'cancelled'
      )

      if (activeOrder) {
        return {
          ...table,
          status: 'Occupied' as const,
          activeNote: `Active Order ${activeOrder.id} (${activeOrder.status})`,
        }
      }

      // 2. Find matching confirmed reservations for this table today
      const todayRes = reservations.find((res) => {
        return res.tableId === table.id && res.date === todayStr && res.status !== 'cancelled'
      })

      if (!todayRes) {
        return {
          ...table,
          status: 'Available' as const,
        }
      }

      const resMinutes = timeToMinutes(todayRes.time)
      const isCurrentlySeated =
        todayRes.status === 'seated' || Math.abs(nowMinutes - resMinutes) < 90

      if (isCurrentlySeated) {
        return {
          ...table,
          status: 'Occupied' as const,
          activeNote: `Seated: ${todayRes.customerName} (${todayRes.guests} guests)`,
        }
      }

      return {
        ...table,
        status: 'Reserved' as const,
        activeNote: `Booked for ${todayRes.time} (${todayRes.customerName})`,
      }
    })
  }, [reservations, orders])

  // Summary counts
  const counts = useMemo(() => {
    const total = tablesWithStatus.length
    const available = tablesWithStatus.filter((t) => t.status === 'Available').length
    const reserved = tablesWithStatus.filter((t) => t.status === 'Reserved').length
    const occupied = tablesWithStatus.filter((t) => t.status === 'Occupied').length
    return { total, available, reserved, occupied }
  }, [tablesWithStatus])

  // Filtered tables
  const filteredTables = useMemo(() => {
    return tablesWithStatus.filter((table) => {
      const matchesType = filterType === 'All' || table.seatingType === filterType
      const matchesStatus = filterStatus === 'All' || table.status === filterStatus
      return matchesType && matchesStatus
    })
  }, [tablesWithStatus, filterType, filterStatus])

  return (
    <div className="rounded-2xl bg-cream-card p-5 sm:p-6 border border-cream-border shadow-subtle text-left space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cream-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-burgundy-dark">
              Floor & Table Status
            </h3>
            <span className="text-xs font-semibold text-secondary-text bg-cream px-2.5 py-0.5 rounded-full border border-cream-border">
              {counts.available} of {counts.total} Available
            </span>
          </div>
          <p className="text-xs text-secondary-text mt-0.5">
            Real-time occupancy across 15 configured dining floor tables.
          </p>
        </div>

        {/* Action Link to Floor Plan */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/tables')}
          rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
          className="text-xs py-1.5 px-3 self-start sm:self-auto"
        >
          Manage Tables
        </Button>
      </div>

      {/* Occupancy Summary KPI Strip */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 text-center">
        <button
          type="button"
          onClick={() => setFilterStatus(filterStatus === 'Available' ? 'All' : 'Available')}
          className={`p-3 rounded-xl border transition-all ${
            filterStatus === 'Available'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/40'
              : 'bg-cream/40 border-cream-border hover:bg-cream-card'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4F9564]" />
            <span className="text-xs font-semibold text-emerald-900">Available</span>
          </div>
          <p className="font-display text-xl font-bold text-emerald-950 mt-1">{counts.available}</p>
          <p className="text-[10px] text-secondary-text">Ready to seat</p>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus(filterStatus === 'Reserved' ? 'All' : 'Reserved')}
          className={`p-3 rounded-xl border transition-all ${
            filterStatus === 'Reserved'
              ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-400/40'
              : 'bg-cream/40 border-cream-border hover:bg-cream-card'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
            <span className="text-xs font-semibold text-sky-900">Reserved</span>
          </div>
          <p className="font-display text-xl font-bold text-sky-950 mt-1">{counts.reserved}</p>
          <p className="text-[10px] text-secondary-text">Upcoming bookings</p>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus(filterStatus === 'Occupied' ? 'All' : 'Occupied')}
          className={`p-3 rounded-xl border transition-all ${
            filterStatus === 'Occupied'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/40'
              : 'bg-cream/40 border-cream-border hover:bg-cream-card'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9A441] animate-pulse" />
            <span className="text-xs font-semibold text-amber-900">Occupied</span>
          </div>
          <p className="font-display text-xl font-bold text-amber-950 mt-1">{counts.occupied}</p>
          <p className="text-[10px] text-secondary-text">Active dining covers</p>
        </button>
      </div>

      {/* Filter Tabs (Zone & Status) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1 text-xs">
          <span className="text-secondary-text font-semibold text-[11px] mr-1">Zone:</span>
          {(['All', 'Indoor', 'Outdoor'] as const).map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => setFilterType(z)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterType === z
                  ? 'bg-burgundy text-cream shadow-2xs'
                  : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy'
              }`}
            >
              {z}
            </button>
          ))}
        </div>

        {filterStatus !== 'All' && (
          <button
            type="button"
            onClick={() => setFilterStatus('All')}
            className="text-xs font-semibold text-gold-dark hover:underline"
          >
            Clear status filter
          </button>
        )}
      </div>

      {/* Tables Visual Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {filteredTables.map((table) => {
          const isAvailable = table.status === 'Available'
          const isReserved = table.status === 'Reserved'
          const isOccupied = table.status === 'Occupied'

          return (
            <div
              key={table.id}
              className={`relative rounded-xl p-3 border transition-all hover:shadow-subtle ${
                isAvailable
                  ? 'bg-cream-card border-cream-border hover:border-emerald-300'
                  : isReserved
                  ? 'bg-sky-50/50 border-sky-200 hover:border-sky-300'
                  : 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
              }`}
            >
              {/* Header: Name & Capacity */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-display text-xs font-bold text-burgundy-dark">
                  {table.name}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-secondary-text bg-cream/80 px-1.5 py-0.5 rounded border border-cream-border">
                  <Users className="w-2.5 h-2.5 text-gold-dark" />
                  {table.capacity}
                </span>
              </div>

              {/* Zone Tag */}
              <p className="text-[10px] text-secondary-text truncate mb-2">
                {table.zone} ({table.seatingType})
              </p>

              {/* Status Badge */}
              <div className="pt-2 border-t border-cream-border/60 flex items-center justify-between">
                <StatusBadge
                  status={
                    isAvailable ? 'available' : isReserved ? 'reserved' : 'occupied'
                  }
                  pulse={isOccupied}
                />
              </div>

              {/* Active Note if booked */}
              {table.activeNote && (
                <p className="text-[9px] text-secondary-text truncate mt-1.5" title={table.activeNote}>
                  {table.activeNote}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom Link */}
      <div className="pt-3 border-t border-cream-border flex items-center justify-between text-xs text-secondary-text">
        <span>Capacity: 68 total covers across 15 tables</span>
        <Link
          to="/admin/tables"
          className="font-bold text-gold-dark hover:text-burgundy flex items-center gap-1 transition-colors"
        >
          Full Floor Map & Layout <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
