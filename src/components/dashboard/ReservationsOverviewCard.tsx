import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useReservationStore } from '@/store'
import { DEMO_TABLES, StoredReservation } from '@/data/tableData'
import {
  StatusBadge,
  Button,
  Modal,
  EmptyState,
} from '@/components/common'
import {
  CalendarDays,
  Clock,
  Users,
  Phone,
  Mail,
  ArrowUpRight,
  Eye,
  Sparkles,
} from 'lucide-react'

export const ReservationsOverviewCard: React.FC = () => {
  const navigate = useNavigate()
  const { reservations } = useReservationStore()
  const [selectedRes, setSelectedRes] = useState<StoredReservation | null>(null)
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'upcoming' | 'all'>('today')

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  // Helper to map table ID to table friendly name
  const getTableName = (tableId: string) => {
    const table = DEMO_TABLES.find((t) => t.id === tableId)
    return table ? table.name : tableId
  }

  // Filter reservations based on active tab
  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      if (filterPeriod === 'today') {
        return res.date === todayStr
      }
      if (filterPeriod === 'upcoming') {
        return res.date >= todayStr && res.status !== 'cancelled'
      }
      return true
    })
  }, [reservations, filterPeriod, todayStr])

  return (
    <div className="rounded-2xl bg-cream-card p-5 sm:p-6 border border-cream-border shadow-subtle text-left space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cream-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-burgundy-dark">
              Upcoming Reservations
            </h3>
            <span className="text-xs font-semibold text-secondary-text bg-cream px-2.5 py-0.5 rounded-full border border-cream-border">
              {filteredReservations.length} Bookings
            </span>
          </div>
          <p className="text-xs text-secondary-text mt-0.5">
            Synchronized directly with the online table reservation engine.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-cream p-1 border border-cream-border">
            <button
              type="button"
              onClick={() => setFilterPeriod('today')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterPeriod === 'today'
                  ? 'bg-burgundy text-cream shadow-2xs'
                  : 'text-secondary-text hover:text-burgundy'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setFilterPeriod('upcoming')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterPeriod === 'upcoming'
                  ? 'bg-burgundy text-cream shadow-2xs'
                  : 'text-secondary-text hover:text-burgundy'
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setFilterPeriod('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterPeriod === 'all'
                  ? 'bg-burgundy text-cream shadow-2xs'
                  : 'text-secondary-text hover:text-burgundy'
              }`}
            >
              All
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/reservations')}
            rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            className="hidden sm:inline-flex text-xs py-1.5 px-3"
          >
            View All
          </Button>
        </div>
      </div>

      {/* Reservation List / Table */}
      {filteredReservations.length === 0 ? (
        <EmptyState
          title="No Reservations Scheduled"
          description={
            filterPeriod === 'today'
              ? 'No guest table bookings recorded for today yet.'
              : 'There are no matching reservations.'
          }
          icon={CalendarDays}
          action={
            <Button
              variant="gold"
              size="sm"
              onClick={() => navigate('/book-table')}
            >
              Make Demo Booking
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-cream-border bg-cream/40 text-secondary-text font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Party Size</th>
                <th className="py-3 px-4">Table</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-border/70">
              {filteredReservations.map((res) => (
                <tr
                  key={res.id}
                  className="hover:bg-cream/30 transition-colors group cursor-pointer"
                  onClick={() => setSelectedRes(res)}
                >
                  {/* Reservation ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-burgundy-dark whitespace-nowrap">
                    {res.id}
                  </td>

                  {/* Customer Name */}
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-burgundy-dark">{res.customerName}</p>
                    <p className="text-[11px] text-secondary-text truncate max-w-[140px]">{res.email}</p>
                  </td>

                  {/* Phone */}
                  <td className="py-3.5 px-4 text-secondary-text whitespace-nowrap">
                    <span className="font-mono text-[11px]">{res.phone}</span>
                  </td>

                  {/* Date & Time */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-semibold text-burgundy-dark flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold-dark" /> {res.time}
                    </p>
                    <p className="text-[10px] text-secondary-text">{res.date}</p>
                  </td>

                  {/* Party Size */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-semibold text-burgundy-dark bg-cream px-2 py-0.5 rounded-md border border-cream-border">
                      <Users className="w-3 h-3 text-gold" /> {res.guests} Guests
                    </span>
                  </td>

                  {/* Assigned Table */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-burgundy-dark">
                      {getTableName(res.tableId)}
                    </span>
                    <span className="block text-[10px] text-secondary-text">
                      {res.seatingPreference}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge
                      status={
                        res.status === 'confirmed'
                          ? 'ready'
                          : res.status === 'pending'
                          ? 'pending'
                          : 'cancelled'
                      }
                      label={res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                    />
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedRes(res)
                      }}
                      className="p-1 rounded-lg text-secondary-text hover:text-burgundy hover:bg-cream transition-colors"
                      title="Inspect reservation"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Navigation Bar */}
      <div className="pt-3 border-t border-cream-border flex items-center justify-between text-xs">
        <span className="text-secondary-text">
          Showing synced records from customer reservation storage.
        </span>
        <Link
          to="/admin/reservations"
          className="font-bold text-gold-dark hover:text-burgundy flex items-center gap-1 transition-colors"
        >
          View All Reservations <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Reservation Details Modal */}
      {selectedRes && (
        <Modal
          isOpen={!!selectedRes}
          onClose={() => setSelectedRes(null)}
          title={
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-burgundy-dark">
                Reservation {selectedRes.id}
              </span>
              <StatusBadge
                status={selectedRes.status === 'confirmed' ? 'ready' : selectedRes.status}
                label={selectedRes.status.toUpperCase()}
              />
            </div>
          }
          size="md"
          footer={
            <div className="flex items-center justify-end w-full gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedRes(null)}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-left text-xs">
            {/* Guest Summary Card */}
            <div className="p-4 rounded-xl bg-cream/50 border border-cream-border space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-secondary-text">Guest Name</p>
                  <p className="font-bold text-base text-burgundy-dark">{selectedRes.customerName}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gold/15 text-gold-dark border border-gold/30">
                  {selectedRes.guests} Guests
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-cream-border/70">
                <div className="flex items-center gap-1.5 text-secondary-text">
                  <Phone className="w-3.5 h-3.5 text-gold-dark" />
                  <span className="font-mono">{selectedRes.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-secondary-text truncate">
                  <Mail className="w-3.5 h-3.5 text-gold-dark" />
                  <span className="truncate">{selectedRes.email}</span>
                </div>
              </div>
            </div>

            {/* Time & Table Info */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-cream-card border border-cream-border">
              <div>
                <p className="text-[10px] uppercase font-bold text-secondary-text">Date & Time</p>
                <p className="font-bold text-burgundy-dark mt-0.5">{selectedRes.date}</p>
                <p className="text-gold-dark font-semibold mt-0.5">{selectedRes.time} Slot</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-secondary-text">Assigned Table</p>
                <p className="font-bold text-burgundy-dark mt-0.5">{getTableName(selectedRes.tableId)}</p>
                <p className="text-secondary-text mt-0.5">Preference: {selectedRes.seatingPreference}</p>
              </div>
            </div>

            {/* Special Requests */}
            {selectedRes.specialRequests && (
              <div className="p-3 rounded-xl bg-gold/10 border border-gold/25 text-burgundy-dark">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gold-dark flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Special Requests:
                </p>
                <p className="text-xs mt-1 font-medium">{selectedRes.specialRequests}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
