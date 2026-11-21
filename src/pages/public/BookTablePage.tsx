import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Input,
  Select,
  DatePicker,
  Button,
  Badge,
  StatusBadge,
} from '@/components/common'
import { TableCard, VisualFloorPlan } from '@/components/tables'
import {
  useReservationStore,
  TableWithAvailability,
} from '@/store/useReservationStore'
import {
  TIME_SLOTS,
  SEATING_OPTIONS,
  GUEST_OPTIONS,
  StoredReservation,
} from '@/data/tableData'
import { RESTAURANT_INFO } from '@/data/mockData'
import { formatDate } from '@/utils'
import {
  CalendarCheck,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  MapPin,
  Phone,
  ShieldCheck,
  AlertCircle,
  Home,
  Utensils,
  RefreshCw,
  Info,
  Compass,
  LayoutGrid,
  Map,
} from 'lucide-react'

// Helper for today's date in YYYY-MM-DD
function getTodayDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const BookTablePage: React.FC = () => {
  const { addReservation, getTableAvailability } = useReservationStore()
  const todayStr = useMemo(() => getTodayDateString(), [])

  // Form states
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [date, setDate] = useState(todayStr)
  const [time, setTime] = useState('19:00')
  const [guests, setGuests] = useState('2')
  const [seatingPreference, setSeatingPreference] = useState<'Indoor' | 'Outdoor' | 'No Preference'>('No Preference')
  const [selectedTableId, setSelectedTableId] = useState<string>('')
  const [specialRequests, setSpecialRequests] = useState('')

  // View mode: Visual Floor Plan vs Table Cards Grid
  const [viewMode, setViewMode] = useState<'floorplan' | 'grid'>('floorplan')

  // Validation & Error states
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmedReservation, setConfirmedReservation] = useState<StoredReservation | null>(null)

  // Calculate dynamic table availability based on selected date, time, guests, and seating
  const tablesWithAvailability: TableWithAvailability[] = useMemo(() => {
    const guestNum = parseInt(guests, 10) || 2
    return getTableAvailability(date, time, guestNum, seatingPreference)
  }, [date, time, guests, seatingPreference, getTableAvailability])

  // Count available tables
  const availableCount = useMemo(() => {
    return tablesWithAvailability.filter((t) => t.isSelectable).length
  }, [tablesWithAvailability])

  // Automatically deselect table if the newly calculated availability makes it invalid
  useEffect(() => {
    if (selectedTableId) {
      const currentSelected = tablesWithAvailability.find((t) => t.id === selectedTableId)
      if (!currentSelected || !currentSelected.isSelectable) {
        setSelectedTableId('')
      }
    }
  }, [tablesWithAvailability, selectedTableId])

  // Handler when user clicks "Book This Table" from the visual floor plan
  const handleBookThisTable = (tableId: string) => {
    setSelectedTableId(tableId)
    if (errors.table) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.table
        return next
      })
    }

    // Smooth scroll down to the guest contact card
    const formEl = document.getElementById('booking-guest-details')
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => {
        const nameInput = document.getElementById('customer-full-name')
        if (nameInput) nameInput.focus()
      }, 400)
    }
  }

  // Scroll back to floor plan
  const handleScrollToFloorPlan = () => {
    const el = document.getElementById('visual-floor-plan-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Full name validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name is required (minimum 2 characters).'
    }

    // Phone validation (10 digits)
    const cleanedPhone = phone.replace(/[\s\-()+]/g, '')
    if (!cleanedPhone) {
      newErrors.phone = 'Mobile number is required.'
    } else if (!/^\d{10}$/.test(cleanedPhone) && (cleanedPhone.length < 10 || cleanedPhone.length > 12)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.'
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
    }

    // Date validation (cannot be in the past)
    if (!date) {
      newErrors.date = 'Reservation date is required.'
    } else if (date < todayStr) {
      newErrors.date = 'Booking date cannot be in the past.'
    }

    // Time validation
    if (!time) {
      newErrors.time = 'Please select a preferred dining time slot.'
    }

    // Guests validation
    const guestNum = parseInt(guests, 10)
    if (isNaN(guestNum) || guestNum < 1 || guestNum > 10) {
      newErrors.guests = 'Number of guests must be between 1 and 10.'
    }

    // Table selection validation
    if (!selectedTableId) {
      newErrors.table = 'Please select an available table from the floor layout above.'
    } else {
      const chosenTable = tablesWithAvailability.find((t) => t.id === selectedTableId)
      if (!chosenTable || !chosenTable.isSelectable) {
        newErrors.table = 'The selected table is no longer available. Please select another.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      const errorField = document.querySelector('.text-status-danger')
      if (errorField) {
        errorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      try {
        const guestNum = parseInt(guests, 10)
        const newRes = addReservation({
          customerName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          date,
          time,
          guests: guestNum,
          tableId: selectedTableId,
          seatingPreference,
          specialRequests: specialRequests.trim(),
          status: 'confirmed',
        })

        setConfirmedReservation(newRes)
        setIsSubmitting(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (err) {
        console.error('Reservation error:', err)
        setIsSubmitting(false)
      }
    }, 600)
  }

  // Handle booking another table after confirmation
  const handleResetForNewBooking = () => {
    setConfirmedReservation(null)
    setSelectedTableId('')
    setSpecialRequests('')
    setErrors({})
  }

  // Resolve details of the selected table for confirmation display
  const confirmedTable = useMemo(() => {
    if (!confirmedReservation) return null
    return tablesWithAvailability.find((t) => t.id === confirmedReservation.tableId)
  }, [confirmedReservation, tablesWithAvailability])

  // Resolve currently chosen table details
  const activeSelectedTable = useMemo(() => {
    if (!selectedTableId) return null
    return tablesWithAvailability.find((t) => t.id === selectedTableId) || null
  }, [selectedTableId, tablesWithAvailability])

  return (
    <div className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full selection:bg-gold/30 selection:text-burgundy-dark text-left">
      {/* =========================================================================
          CONFIRMATION VIEW (Shown upon successful booking submission)
         ========================================================================= */}
      {confirmedReservation ? (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
          <div className="rounded-3xl bg-cream-card p-8 sm:p-12 border-2 border-gold/40 shadow-elevated text-center space-y-6 relative overflow-hidden">
            {/* Top gold shimmer bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-burgundy via-gold to-burgundy" />

            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-status-success/15 text-status-success mx-auto flex items-center justify-center border border-status-success/30 shadow-subtle">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <Badge variant="gold" size="md" className="mb-2">
                Booking Confirmed
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-burgundy-dark">
                We Look Forward to Welcoming You!
              </h2>
              <p className="text-xs sm:text-sm text-secondary-text mt-1 max-w-lg mx-auto">
                Your reservation at BistroHub is confirmed and logged in our floor management system. A confirmation has been stored in your session.
              </p>
            </div>

            {/* Reservation Summary Voucher Box */}
            <div className="rounded-2xl bg-cream/70 border border-cream-border p-6 text-left space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cream-border/80 pb-3 gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-text">
                    Reservation ID
                  </span>
                  <p className="font-mono text-base font-bold text-gold-dark tracking-wide">
                    {confirmedReservation.id}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-text">
                    Status
                  </span>
                  <div className="mt-0.5">
                    <StatusBadge status="completed" label="Confirmed & Reserved" pulse />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-secondary-text font-medium">Guest Name:</span>
                  <p className="font-bold text-burgundy-dark text-sm mt-0.5">
                    {confirmedReservation.customerName}
                  </p>
                </div>

                <div>
                  <span className="text-secondary-text font-medium">Contact Phone:</span>
                  <p className="font-semibold text-burgundy-dark text-sm mt-0.5">
                    {confirmedReservation.phone}
                  </p>
                </div>

                <div>
                  <span className="text-secondary-text font-medium">Date & Time:</span>
                  <p className="font-bold text-burgundy-dark text-sm mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    {formatDate(confirmedReservation.date)} at {confirmedReservation.time}
                  </p>
                </div>

                <div>
                  <span className="text-secondary-text font-medium">Party Size:</span>
                  <p className="font-semibold text-burgundy-dark text-sm mt-0.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gold" />
                    {confirmedReservation.guests} {confirmedReservation.guests === 1 ? 'Guest' : 'Guests'}
                  </p>
                </div>

                <div>
                  <span className="text-secondary-text font-medium">Selected Table:</span>
                  <p className="font-bold text-burgundy-dark text-sm mt-0.5">
                    {confirmedTable ? `${confirmedTable.id} – ${confirmedTable.name} (${confirmedTable.zone})` : confirmedReservation.tableId}
                  </p>
                </div>

                <div>
                  <span className="text-secondary-text font-medium">Seating Environment:</span>
                  <p className="font-semibold text-burgundy-dark text-sm mt-0.5">
                    {confirmedTable?.seatingType || confirmedReservation.seatingPreference}
                  </p>
                </div>
              </div>

              {confirmedReservation.specialRequests && (
                <div className="pt-3 border-t border-cream-border/80 text-xs">
                  <span className="text-secondary-text font-medium">Special Requests:</span>
                  <p className="text-burgundy-dark italic mt-0.5 bg-cream p-2.5 rounded-lg border border-cream-border">
                    "{confirmedReservation.specialRequests}"
                  </p>
                </div>
              )}
            </div>

            {/* Confirmation Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/">
                <Button variant="gold" size="lg" leftIcon={<Home className="w-4 h-4" />} className="shadow-gold w-full sm:w-auto">
                  Return to Homepage
                </Button>
              </Link>

              <Link to="/menu">
                <Button variant="secondary" size="lg" leftIcon={<Utensils className="w-4 h-4" />} className="w-full sm:w-auto">
                  View Menu Dishes
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                onClick={handleResetForNewBooking}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Book Another Table
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            STANDARD BOOKING EXPERIENCE (Two-Column Layout)
           ========================================================================= */
        <div>
          {/* Page Heading & Subtitle */}
          <div className="mb-8 space-y-2">
            <Badge variant="gold" size="sm" className="mb-1">
              Table Reservation
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-burgundy-dark">
              Reserve Your Perfect Table
            </h1>
            <p className="text-sm sm:text-base text-secondary-text max-w-2xl leading-relaxed">
              Make your dining experience special. Choose your preferred date, time and seating.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8 w-full">
            {/* 1. Reservation Preferences Card (Date, Time, Party Size, Seating) */}
            <div className="rounded-2xl bg-cream-card p-6 sm:p-7 border border-cream-border shadow-subtle space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-cream-border">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-burgundy text-cream text-xs font-bold">
                  1
                </span>
                <h3 className="font-display text-base sm:text-lg font-bold text-burgundy-dark">
                  Reservation Preferences
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Date Picker */}
                <div>
                  <DatePicker
                    label="Booking Date *"
                    value={date}
                    min={todayStr}
                    onChange={(newDate) => {
                      setDate(newDate)
                      if (errors.date) setErrors((prev) => ({ ...prev, date: '' }))
                    }}
                    error={errors.date}
                  />
                  <p className="text-[11px] text-secondary-text mt-1">
                    Bookings accepted up to 30 days in advance.
                  </p>
                </div>

                {/* Time Slots */}
                <div>
                  <Select
                    label="Preferred Time Slot *"
                    options={TIME_SLOTS.map((slot) => ({
                      label: slot.label,
                      value: slot.value,
                    }))}
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value)
                      if (errors.time) setErrors((prev) => ({ ...prev, time: '' }))
                    }}
                    error={errors.time}
                  />
                  <p className="text-[11px] text-secondary-text mt-1">
                    Table held for 2 hours from selected time.
                  </p>
                </div>

                {/* Number of Guests */}
                <div>
                  <Select
                    label="Number of Guests *"
                    options={GUEST_OPTIONS}
                    value={guests}
                    onChange={(e) => {
                      setGuests(e.target.value)
                      if (errors.guests) setErrors((prev) => ({ ...prev, guests: '' }))
                    }}
                    error={errors.guests}
                  />
                  <p className="text-[11px] text-secondary-text mt-1">
                    Parties &gt; 10, contact concierge.
                  </p>
                </div>

                {/* Preferred Seating Zone */}
                <div>
                  <Select
                    label="Preferred Seating Zone"
                    options={SEATING_OPTIONS.map((opt) => ({
                      label: opt.label,
                      value: opt.value,
                    }))}
                    value={seatingPreference}
                    onChange={(e) => setSeatingPreference(e.target.value as any)}
                  />
                  <p className="text-[11px] text-secondary-text mt-1">
                    Indoor, Outdoor, or No Preference.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Visual Restaurant Floor Layout Section */}
            <div
              id="visual-floor-plan-section"
              className="rounded-2xl bg-cream-card p-6 sm:p-7 border border-cream-border shadow-subtle space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-cream-border gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-burgundy text-cream text-xs font-bold">
                    2
                  </span>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-burgundy-dark">
                      Choose Your Dining Table *
                    </h3>
                    <p className="text-xs text-secondary-text">
                      Showing {availableCount} of {tablesWithAvailability.length} tables available for {guests} guests on {formatDate(date)} at {time}
                    </p>
                  </div>
                </div>

                {/* View Mode Toggle: Floor Plan vs Card Grid */}
                <div className="flex items-center gap-1 bg-cream p-1 rounded-xl border border-cream-border text-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode('floorplan')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                      viewMode === 'floorplan'
                        ? 'bg-burgundy text-cream shadow-2xs'
                        : 'text-secondary-text hover:text-burgundy'
                    }`}
                  >
                    <Map className="w-3.5 h-3.5" />
                    <span>Floor Layout</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                      viewMode === 'grid'
                        ? 'bg-burgundy text-cream shadow-2xs'
                        : 'text-secondary-text hover:text-burgundy'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Table Cards</span>
                  </button>
                </div>
              </div>

              {/* Table Selection Error Banner */}
              {errors.table && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-status-danger text-xs font-medium flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.table}</span>
                </div>
              )}

              {/* Selected Table Highlight Pill */}
              {activeSelectedTable && (
                <div className="p-3 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-between text-xs text-burgundy-dark font-medium animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-dark shrink-0" />
                    <span>
                      Selected <strong>{activeSelectedTable.name}</strong> ({activeSelectedTable.zone}, up to {activeSelectedTable.capacity} guests)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTableId('')}
                    className="text-[11px] underline text-secondary-text hover:text-burgundy ml-2"
                  >
                    Change Table
                  </button>
                </div>
              )}

              {/* View 1: Visual Restaurant Floor Plan */}
              {viewMode === 'floorplan' ? (
                <VisualFloorPlan
                  tablesWithAvailability={tablesWithAvailability}
                  selectedTableId={selectedTableId}
                  onSelectTable={(tId) => {
                    setSelectedTableId(tId)
                    if (errors.table) {
                      setErrors((prev) => {
                        const next = { ...prev }
                        delete next.table
                        return next
                      })
                    }
                  }}
                  onBookThisTable={handleBookThisTable}
                  targetDate={formatDate(date)}
                  targetTime={time}
                  guestCount={parseInt(guests, 10) || 2}
                />
              ) : (
                /* View 2: Traditional Table Cards Grid */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
                    {tablesWithAvailability.map((table) => (
                      <TableCard
                        key={table.id}
                        id={table.id}
                        name={table.name}
                        capacity={table.capacity}
                        seatingType={table.seatingType}
                        zone={table.zone}
                        status={table.status}
                        isSelected={selectedTableId === table.id}
                        isSelectable={table.isSelectable}
                        unavailabilityReason={table.unavailabilityReason}
                        onSelect={(tId) => {
                          setSelectedTableId(tId)
                          if (errors.table) {
                            setErrors((prev) => {
                              const next = { ...prev }
                              delete next.table
                              return next
                            })
                          }
                        }}
                      />
                    ))}
                  </div>

                  {activeSelectedTable && (
                    <div className="pt-2 flex justify-end">
                      <Button
                        variant="gold"
                        size="md"
                        onClick={() => handleBookThisTable(activeSelectedTable.id)}
                        leftIcon={<CalendarCheck className="w-4 h-4" />}
                        className="shadow-gold text-xs"
                      >
                        Book Table {activeSelectedTable.id}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <p className="text-[11px] text-secondary-text flex items-center gap-1.5 pt-1">
                <Info className="w-3.5 h-3.5 text-gold shrink-0" />
                Tables with capacity below your party size ({guests}) or already booked for this 2-hour window are disabled.
              </p>
            </div>

            {/* 3. Customer Contact Details & Confirmation Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div
                id="booking-guest-details"
                className="rounded-2xl bg-cream-card p-6 sm:p-7 border border-cream-border shadow-subtle space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-cream-border">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-burgundy text-cream text-xs font-bold">
                      3
                    </span>
                    <h3 className="font-display text-base sm:text-lg font-bold text-burgundy-dark">
                      Guest Contact & Final Confirmation
                    </h3>
                  </div>

                  {activeSelectedTable && (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Assigned: {activeSelectedTable.name} ({activeSelectedTable.zone})
                    </span>
                  )}
                </div>

                {/* Notice if no table is selected yet */}
                {!activeSelectedTable && (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-gold-dark shrink-0" />
                      <span>Please select an available table from the floor layout above to proceed.</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleScrollToFloorPlan}
                      className="text-xs shrink-0 py-1"
                    >
                      Select Table
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    id="customer-full-name"
                    label="Full Name *"
                    placeholder="e.g. Vikramaditya Roy"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }))
                    }}
                    error={errors.fullName}
                    required
                  />

                  <Input
                    label="Mobile Number *"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }))
                    }}
                    error={errors.phone}
                    helperText="10-digit mobile number."
                    required
                  />

                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="e.g. vikram@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
                    }}
                    error={errors.email}
                    helperText="Booking voucher sent here."
                    required
                  />
                </div>

                {/* Special Requests */}
                <div className="space-y-1.5 text-left pt-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g., Birthday celebration with candle, high chair required for infant, preference for quiet window booth..."
                    className="w-full rounded-xl bg-cream-card px-3.5 py-2.5 text-sm text-main-text border border-cream-border hover:border-burgundy/20 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                  />
                </div>

                {/* Summary Review Pill Before Submit */}
                {activeSelectedTable && (
                  <div className="p-3.5 rounded-xl bg-cream/70 border border-cream-border text-xs text-burgundy-dark flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-burgundy-dark">
                        {activeSelectedTable.name} ({activeSelectedTable.zone})
                      </span>
                      <span>•</span>
                      <span>{formatDate(date)} at {time}</span>
                      <span>•</span>
                      <span>{guests} {guests === '1' ? 'Guest' : 'Guests'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleScrollToFloorPlan}
                      className="text-[11px] underline text-gold-dark hover:text-burgundy font-semibold"
                    >
                      Change Table
                    </button>
                  </div>
                )}

                {/* Submit Action Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    isLoading={isSubmitting}
                    leftIcon={<CalendarCheck className="w-5 h-5" />}
                    className="w-full shadow-gold text-base font-bold py-3.5"
                  >
                    Confirm Table Reservation
                  </Button>
                  <p className="text-center text-xs text-secondary-text mt-2">
                    Instant confirmation. No booking fee or deposit required.
                  </p>
                </div>
              </div>
            </form>

            {/* Bottom Reassurance & Policy Highlights Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="rounded-2xl bg-cream-card p-4 border border-cream-border shadow-2xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-display text-xs font-bold text-burgundy-dark">15-Min Grace Period</h5>
                  <p className="text-[11px] text-secondary-text">Reserved tables held 15 mins past arrival.</p>
                </div>
              </div>

              <div className="rounded-2xl bg-cream-card p-4 border border-cream-border shadow-2xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-display text-xs font-bold text-burgundy-dark">2-Hour Dining Window</h5>
                  <p className="text-[11px] text-secondary-text">Unhurried, relaxed gourmet experience.</p>
                </div>
              </div>

              <div className="rounded-2xl bg-cream-card p-4 border border-cream-border shadow-2xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-display text-xs font-bold text-burgundy-dark">Instant Guarantee</h5>
                  <p className="text-[11px] text-secondary-text">Zero wait time with confirmed online booking.</p>
                </div>
              </div>

              <div className="rounded-2xl bg-cream-card p-4 border border-cream-border shadow-2xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-display text-xs font-bold text-burgundy-dark">Concierge & Banquets</h5>
                  <p className="text-[11px] text-secondary-text">{RESTAURANT_INFO.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
