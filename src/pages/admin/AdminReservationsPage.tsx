import React, { useState, useMemo } from 'react'
import {
  PageHeader,
  StatCard,
  Button,
  StatusBadge,
  Badge,
  Modal,
  Input,
  Select,
  DatePicker,
  EmptyState,
} from '@/components/common'
import { useReservationStore } from '@/store/useReservationStore'
import { DEMO_TABLES, TIME_SLOTS, GUEST_OPTIONS, StoredReservation } from '@/data/tableData'
import { formatDate } from '@/utils'
import {
  CalendarDays,
  Users,
  Clock,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  Eye,
  Phone,
  AlertCircle,
} from 'lucide-react'

export const AdminReservationsPage: React.FC = () => {
  const {
    reservations,
    cancelReservation,
    updateReservationStatus,
    addReservation,
    getTableAvailability,
  } = useReservationStore()

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [periodFilter, setPeriodFilter] = useState<'today' | 'upcoming' | 'all' | 'past'>('today')
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'seated' | 'completed' | 'cancelled'>('all')

  // Modals
  const [selectedRes, setSelectedRes] = useState<StoredReservation | null>(null)
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false)
  const [resToCancel, setResToCancel] = useState<StoredReservation | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // New reservation form state
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])
  const [newCustName, setNewCustName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newDate, setNewDate] = useState(todayStr)
  const [newTime, setNewTime] = useState('19:00')
  const [newGuests, setNewGuests] = useState('2')
  const [newTableId, setNewTableId] = useState('')
  const [newRequests, setNewRequests] = useState('')
  const [createError, setCreateError] = useState<string | null>(null)

  // Helper: Table friendly name
  const getTableName = (tableId: string) => {
    const table = DEMO_TABLES.find((t) => t.id === tableId)
    return table ? `${table.id} (${table.name} • ${table.zone})` : tableId
  }

  // Summary Metrics
  const metrics = useMemo(() => {
    const todayRes = reservations.filter((r) => r.date === todayStr)
    const todayConfirmed = todayRes.filter((r) => r.status === 'confirmed' || r.status === 'seated')
    const todayGuests = todayConfirmed.reduce((sum, r) => sum + r.guests, 0)
    const cancelledCount = reservations.filter((r) => r.status === 'cancelled').length

    return {
      todayBookings: todayConfirmed.length,
      todayGuests,
      totalReservations: reservations.length,
      cancelledCount,
    }
  }, [reservations, todayStr])

  // Filtered reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      // Period filter
      if (periodFilter === 'today' && res.date !== todayStr) return false
      if (periodFilter === 'upcoming' && (res.date < todayStr || res.status === 'cancelled')) return false
      if (periodFilter === 'past' && res.date >= todayStr) return false

      // Status filter
      if (statusFilter !== 'all' && res.status !== statusFilter) return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchId = res.id.toLowerCase().includes(q)
        const matchName = res.customerName.toLowerCase().includes(q)
        const matchPhone = res.phone.includes(q)
        const matchTable = res.tableId.toLowerCase().includes(q)
        if (!matchId && !matchName && !matchPhone && !matchTable) return false
      }

      return true
    })
  }, [reservations, periodFilter, statusFilter, searchQuery, todayStr])

  // Available tables for new booking modal
  const availableTablesForNewBooking = useMemo(() => {
    if (!isCreateModalOpen) return []
    const gCount = parseInt(newGuests, 10) || 2
    return getTableAvailability(newDate, newTime, gCount, 'No Preference').filter((t) => t.isSelectable)
  }, [isCreateModalOpen, newDate, newTime, newGuests, getTableAvailability])

  // Handle Cancel Action
  const handleConfirmCancel = () => {
    if (!resToCancel) return
    cancelReservation(resToCancel.id)
    setIsCancelConfirmOpen(false)
    setResToCancel(null)
  }

  // Handle Seat Guest
  const handleSeatGuest = (resId: string) => {
    updateReservationStatus(resId, 'seated')
  }

  // Handle Complete Reservation
  const handleCompleteGuest = (resId: string) => {
    updateReservationStatus(resId, 'completed')
  }

  // Handle Create Reservation
  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCustName.trim() || newCustName.trim().length < 2) {
      setCreateError('Customer name is required.')
      return
    }
    if (!newPhone.trim()) {
      setCreateError('Phone number is required.')
      return
    }
    if (!newTableId) {
      setCreateError('Please select an available table.')
      return
    }

    setCreateError(null)
    addReservation({
      customerName: newCustName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || `${newCustName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      date: newDate,
      time: newTime,
      guests: parseInt(newGuests, 10) || 2,
      tableId: newTableId,
      seatingPreference: 'No Preference',
      specialRequests: newRequests.trim() || undefined,
      status: 'confirmed',
    })

    // Reset & close
    setNewCustName('')
    setNewPhone('')
    setNewEmail('')
    setNewTableId('')
    setNewRequests('')
    setIsCreateModalOpen(false)
  }

  return (
    <div className="space-y-8 text-left pb-10">
      {/* 1. Header */}
      <PageHeader
        title="Reservations Management"
        subtitle="Live table booking schedule, VIP guest seatings, and table allocation."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Reservations' }]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="gold"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="shadow-gold text-xs font-semibold"
            >
              New Reservation
            </Button>
          </div>
        }
      />

      {/* 2. Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Bookings"
          value={`${metrics.todayBookings}`}
          change={{
            value: `${metrics.todayBookings} confirmed`,
            isPositive: true,
            label: 'scheduled today',
          }}
          description="Active dining reservations"
          icon={CalendarDays}
        />

        <StatCard
          title="Expected Guests Today"
          value={`${metrics.todayGuests}`}
          change={{
            value: "Dinner rush: 7-9 PM",
            isPositive: true,
            label: "peak covers",
          }}
          description="Total seats reserved"
          icon={Users}
        />

        <StatCard
          title="All System Bookings"
          value={`${metrics.totalReservations}`}
          change={{
            value: "Central reservation store",
            isPositive: true,
            label: "synced",
          }}
          description="Historical & future"
          icon={Clock}
        />

        <StatCard
          title="Cancelled Bookings"
          value={`${metrics.cancelledCount}`}
          change={{
            value: "Freed tables",
            isPositive: false,
            label: "available for walk-ins",
          }}
          description="No longer blocking tables"
          icon={XCircle}
        />
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="rounded-2xl bg-cream-card p-5 border border-cream-border shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-secondary-text" />
            <input
              type="text"
              placeholder="Search by ID, customer name, phone, or table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-cream border border-cream-border text-main-text placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-secondary-text hover:text-burgundy"
              >
                Clear
              </button>
            )}
          </div>

          {/* Period Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setPeriodFilter('today')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                periodFilter === 'today'
                  ? 'bg-burgundy text-cream shadow-2xs'
                  : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setPeriodFilter('upcoming')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                periodFilter === 'upcoming'
                  ? 'bg-burgundy text-cream shadow-2xs'
                  : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy'
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setPeriodFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                periodFilter === 'all'
                  ? 'bg-burgundy text-cream shadow-2xs'
                  : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy'
              }`}
            >
              All Bookings
            </button>
            <button
              type="button"
              onClick={() => setPeriodFilter('past')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                periodFilter === 'past'
                  ? 'bg-burgundy text-cream shadow-2xs'
                  : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy'
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {/* Status Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-cream-border/60 text-xs">
          <span className="text-secondary-text font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-gold-dark" />
            Status:
          </span>
          {(['all', 'confirmed', 'seated', 'completed', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                statusFilter === st
                  ? 'bg-gold/20 text-burgundy-dark border border-gold font-bold shadow-2xs'
                  : 'text-secondary-text hover:bg-cream border border-transparent'
              }`}
            >
              {st}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-secondary-text font-medium">
            Showing {filteredReservations.length} reservations
          </span>
        </div>
      </div>

      {/* 4. Reservations Table */}
      <div className="rounded-2xl bg-cream-card border border-cream-border shadow-subtle overflow-hidden">
        {filteredReservations.length === 0 ? (
          <EmptyState
            title="No Reservations Found"
            description="No bookings match the selected filters or search query."
            icon={CalendarDays}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setPeriodFilter('all')
                  setStatusFilter('all')
                }}
              >
                Reset Filters
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-cream-border bg-cream/50 text-secondary-text font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Booking ID</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Guests</th>
                  <th className="py-3.5 px-4">Table</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-border/60">
                {filteredReservations.map((res) => {
                  const isToday = res.date === todayStr
                  return (
                    <tr
                      key={res.id}
                      className="hover:bg-cream/40 transition-colors"
                    >
                      {/* Booking ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-gold-dark text-xs">
                          {res.id}
                        </div>
                        {isToday && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5 inline-block">
                            Today
                          </span>
                        )}
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-burgundy-dark text-sm">
                          {res.customerName}
                        </div>
                        <div className="text-[11px] text-secondary-text flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gold-dark" />
                            {res.phone}
                          </span>
                        </div>
                        {res.specialRequests && (
                          <div className="text-[10px] text-amber-900 bg-amber-50/70 px-1.5 py-0.5 rounded border border-amber-200/80 mt-1 inline-block italic max-w-[200px] truncate" title={res.specialRequests}>
                            "{res.specialRequests}"
                          </div>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-burgundy-dark">
                          {formatDate(res.date)}
                        </div>
                        <div className="text-[11px] text-secondary-text flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-gold-dark" />
                          {res.time}
                        </div>
                      </td>

                      {/* Guests */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-burgundy-dark">
                          <Users className="w-3.5 h-3.5 text-gold-dark" />
                          {res.guests} {res.guests === 1 ? 'Guest' : 'Guests'}
                        </span>
                      </td>

                      {/* Table */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-burgundy-dark bg-cream px-2 py-0.5 rounded border border-cream-border font-mono">
                          {res.tableId}
                        </span>
                        <div className="text-[10px] text-secondary-text mt-0.5 truncate max-w-[140px]">
                          {DEMO_TABLES.find((t) => t.id === res.tableId)?.zone || res.seatingPreference}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {res.status === 'confirmed' && (
                          <StatusBadge status="completed" label="Confirmed" />
                        )}
                        {res.status === 'seated' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            Seated
                          </span>
                        )}
                        {res.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                            Completed
                          </span>
                        )}
                        {res.status === 'cancelled' && (
                          <StatusBadge status="cancelled" label="Cancelled" />
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRes(res)}
                            className="p-1.5 text-secondary-text hover:text-burgundy"
                            title="View Booking Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {res.status === 'confirmed' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSeatGuest(res.id)}
                                className="py-1 px-2 text-[11px] text-emerald-800 border-emerald-200 hover:bg-emerald-50"
                                title="Mark Party as Seated"
                              >
                                Seat
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setResToCancel(res)
                                  setIsCancelConfirmOpen(true)
                                }}
                                className="py-1 px-2 text-[11px] text-status-danger hover:bg-rose-50"
                                title="Cancel Reservation (Frees Table)"
                              >
                                Cancel
                              </Button>
                            </>
                          )}

                          {res.status === 'seated' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCompleteGuest(res.id)}
                              className="py-1 px-2 text-[11px] text-stone-600 hover:bg-stone-100"
                            >
                              Finish
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL 1: RESERVATION DETAILS MODAL
         ========================================================================= */}
      {selectedRes && (
        <Modal
          isOpen={!!selectedRes}
          onClose={() => setSelectedRes(null)}
          title={`Booking ${selectedRes.id}`}
        >
          <div className="space-y-5 text-left text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-cream-border">
              <div>
                <span className="text-[10px] uppercase font-bold text-secondary-text">
                  Customer Name
                </span>
                <h4 className="font-display text-base font-bold text-burgundy-dark">
                  {selectedRes.customerName}
                </h4>
              </div>
              <div>
                <Badge
                  variant={
                    selectedRes.status === 'confirmed'
                      ? 'success'
                      : selectedRes.status === 'seated'
                      ? 'gold'
                      : selectedRes.status === 'cancelled'
                      ? 'danger'
                      : 'secondary'
                  }
                  size="md"
                >
                  {selectedRes.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-secondary-text font-medium">Contact Phone:</span>
                <p className="font-semibold text-burgundy-dark mt-0.5">{selectedRes.phone}</p>
              </div>
              <div>
                <span className="text-secondary-text font-medium">Email Address:</span>
                <p className="font-semibold text-burgundy-dark mt-0.5">{selectedRes.email}</p>
              </div>
              <div>
                <span className="text-secondary-text font-medium">Date & Time:</span>
                <p className="font-semibold text-burgundy-dark mt-0.5">
                  {formatDate(selectedRes.date)} at {selectedRes.time}
                </p>
              </div>
              <div>
                <span className="text-secondary-text font-medium">Party Size:</span>
                <p className="font-semibold text-burgundy-dark mt-0.5">
                  {selectedRes.guests} Guests
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-secondary-text font-medium">Assigned Table:</span>
                <p className="font-semibold text-burgundy-dark mt-0.5">
                  {getTableName(selectedRes.tableId)}
                </p>
              </div>
            </div>

            {selectedRes.specialRequests && (
              <div className="p-3 rounded-xl bg-cream border border-cream-border">
                <span className="text-[10px] font-bold uppercase text-secondary-text">
                  Special Requests / Guest Notes:
                </span>
                <p className="italic text-burgundy-dark mt-1 text-xs">
                  "{selectedRes.specialRequests}"
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-cream-border flex justify-end gap-2">
              {selectedRes.status === 'confirmed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleSeatGuest(selectedRes.id)
                    setSelectedRes(null)
                  }}
                  className="text-xs"
                >
                  Mark Party as Seated
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedRes(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* =========================================================================
          MODAL 2: CANCEL RESERVATION CONFIRMATION MODAL
         ========================================================================= */}
      {isCancelConfirmOpen && resToCancel && (
        <Modal
          isOpen={isCancelConfirmOpen}
          onClose={() => setIsCancelConfirmOpen(false)}
          title="Cancel Reservation"
        >
          <div className="space-y-4 text-left text-xs">
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-status-danger flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-sm">Release Table {resToCancel.tableId}?</h5>
                <p className="mt-0.5 text-xs text-rose-800">
                  Cancelling this booking for <strong>{resToCancel.customerName}</strong> will immediately free Table <strong>{resToCancel.tableId}</strong> on {formatDate(resToCancel.date)} at {resToCancel.time} for other guests and walk-ins.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCancelConfirmOpen(false)}
              >
                Keep Booking
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleConfirmCancel}
                className="bg-status-danger text-cream hover:bg-rose-700"
              >
                Yes, Cancel Booking
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* =========================================================================
          MODAL 3: NEW RESERVATION FORM MODAL (Admin Direct Booking)
         ========================================================================= */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Direct Reservation"
        >
          <form onSubmit={handleCreateReservation} className="space-y-4 text-left text-xs">
            {createError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-status-danger flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Customer Name *"
                placeholder="e.g. Ramesh Kulkarni"
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                required
              />

              <Input
                label="Mobile Phone *"
                type="tel"
                placeholder="e.g. 9876543210"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <DatePicker
                label="Date *"
                value={newDate}
                min={todayStr}
                onChange={(d) => setNewDate(d)}
              />

              <Select
                label="Time *"
                options={TIME_SLOTS.map((s) => ({ label: s.label, value: s.value }))}
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />

              <Select
                label="Party Size *"
                options={GUEST_OPTIONS}
                value={newGuests}
                onChange={(e) => setNewGuests(e.target.value)}
              />
            </div>

            {/* Table Selection Dropdown from Live Availability */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-1">
                Select Available Table *
              </label>
              {availableTablesForNewBooking.length === 0 ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>No available tables for {newGuests} guests at {newTime} on {newDate}. Please change date, time, or guest count.</span>
                </div>
              ) : (
                <select
                  value={newTableId}
                  onChange={(e) => setNewTableId(e.target.value)}
                  className="w-full rounded-xl bg-cream-card px-3 py-2 text-xs font-bold text-burgundy-dark border border-cream-border focus:ring-2 focus:ring-gold/40 focus:border-gold"
                  required
                >
                  <option value="">-- Choose an available table ({availableTablesForNewBooking.length} open) --</option>
                  {availableTablesForNewBooking.map((tbl) => (
                    <option key={tbl.id} value={tbl.id}>
                      {tbl.id} • {tbl.name} ({tbl.zone}, up to {tbl.capacity} seats, {tbl.seatingType})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-1">
                Special Requests / VIP Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={newRequests}
                onChange={(e) => setNewRequests(e.target.value)}
                placeholder="e.g. Anniversary dinner, window view requested..."
                className="w-full rounded-xl bg-cream-card px-3 py-2 text-xs text-main-text border border-cream-border focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>

            <div className="pt-3 border-t border-cream-border flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gold"
                size="sm"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                className="shadow-gold text-xs font-bold"
                disabled={!newTableId}
              >
                Confirm Direct Reservation
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
