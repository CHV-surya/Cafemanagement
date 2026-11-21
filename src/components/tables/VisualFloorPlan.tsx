import React, { useState, useMemo } from 'react'
import { TableWithAvailability } from '@/store/useReservationStore'
import { VisualTableItem } from './VisualTableItem'
import { Button, Badge } from '@/components/common'
import {
  Compass,
  Sparkles,
  Trees,
  CheckCircle2,
  CalendarCheck,
  Eye,
  UtensilsCrossed,
  Info,
  Layers,
  Users,
  Sun,
  Flame,
  ArrowRight,
} from 'lucide-react'

export interface VisualFloorPlanProps {
  tablesWithAvailability: TableWithAvailability[]
  selectedTableId: string
  onSelectTable: (tableId: string) => void
  onBookThisTable?: (tableId: string) => void
  targetDate: string
  targetTime: string
  guestCount: number
}

type FloorZoneTab = 'all' | 'window' | 'main' | 'salons' | 'patio'

export const VisualFloorPlan: React.FC<VisualFloorPlanProps> = ({
  tablesWithAvailability,
  selectedTableId,
  onSelectTable,
  onBookThisTable,
  targetDate,
  targetTime,
  guestCount,
}) => {
  const [activeZoneTab, setActiveZoneTab] = useState<FloorZoneTab>('all')

  // Find currently selected table
  const selectedTable = useMemo(() => {
    return tablesWithAvailability.find((t) => t.id === selectedTableId) || null
  }, [tablesWithAvailability, selectedTableId])

  // Partition tables into realistic architectural zones
  const windowTables = useMemo(() => {
    return tablesWithAvailability.filter((t) => t.id === 'T01')
  }, [tablesWithAvailability])

  const mainDiningTables = useMemo(() => {
    return tablesWithAvailability.filter((t) =>
      ['T02', 'T04', 'T05', 'T08', 'T09'].includes(t.id)
    )
  }, [tablesWithAvailability])

  const salonTables = useMemo(() => {
    return tablesWithAvailability.filter((t) =>
      ['T10', 'T12', 'T14'].includes(t.id)
    )
  }, [tablesWithAvailability])

  const outdoorBistroTables = useMemo(() => {
    return tablesWithAvailability.filter((t) =>
      ['T03', 'T06', 'T07', 'T11'].includes(t.id)
    )
  }, [tablesWithAvailability])

  const outdoorPavilionTables = useMemo(() => {
    return tablesWithAvailability.filter((t) =>
      ['T13', 'T15'].includes(t.id)
    )
  }, [tablesWithAvailability])

  // Summary counts for legend
  const stats = useMemo(() => {
    let available = 0
    let reserved = 0
    let occupied = 0
    let unavailable = 0

    tablesWithAvailability.forEach((t) => {
      if (t.status === 'Occupied') occupied += 1
      else if (t.status === 'Reserved') reserved += 1
      else if (t.isSelectable) available += 1
      else unavailable += 1
    })

    return { available, reserved, occupied, unavailable, total: tablesWithAvailability.length }
  }, [tablesWithAvailability])

  const handleBookClick = () => {
    if (selectedTableId && onBookThisTable) {
      onBookThisTable(selectedTableId)
    } else {
      // Smooth scroll to the booking form
      const el = document.getElementById('booking-form-section')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <div className="space-y-5 text-left">
      {/* 1. Header with Title & Live Availability Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cream-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg sm:text-xl font-bold text-burgundy-dark flex items-center gap-2">
              <Compass className="w-5 h-5 text-gold-dark" />
              <span>Interactive Restaurant Floor Plan</span>
            </h3>
            <span className="text-xs font-semibold text-gold-dark bg-gold/15 px-2.5 py-0.5 rounded-full border border-gold/30">
              15 Tables Configured
            </span>
          </div>
          <p className="text-xs text-secondary-text mt-0.5">
            Click any green available table to select your preferred dining spot.
          </p>
        </div>

        {/* 2. Visual State Legend (Green, Gold, Red, Grey) */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs bg-cream/70 p-2 sm:px-3 sm:py-2 rounded-2xl border border-cream-border">
          {/* Green = Available */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-50/80 border border-emerald-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs" />
            <span className="font-semibold text-emerald-900 text-[11px]">
              Available ({stats.available})
            </span>
          </div>

          {/* Gold = Reserved */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-50/80 border border-amber-200">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-2xs" />
            <span className="font-semibold text-amber-900 text-[11px]">
              Reserved ({stats.reserved})
            </span>
          </div>

          {/* Red = Occupied */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-rose-50/80 border border-rose-200">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-2xs animate-pulse" />
            <span className="font-semibold text-rose-900 text-[11px]">
              Occupied ({stats.occupied})
            </span>
          </div>

          {/* Grey = Unavailable */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-stone-100 border border-stone-200">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
            <span className="font-semibold text-stone-600 text-[11px]">
              Unavailable ({stats.unavailable})
            </span>
          </div>
        </div>
      </div>

      {/* 3. Zone Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveZoneTab('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeZoneTab === 'all'
              ? 'bg-burgundy text-cream shadow-2xs'
              : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Full Floor Plan (15)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveZoneTab('window')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeZoneTab === 'window'
              ? 'bg-burgundy text-cream shadow-2xs'
              : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-sky-600" />
          <span>Window Seating (1)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveZoneTab('main')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeZoneTab === 'main'
              ? 'bg-burgundy text-cream shadow-2xs'
              : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-gold-dark" />
          <span>Main Dining (5)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveZoneTab('salons')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeZoneTab === 'salons'
              ? 'bg-burgundy text-cream shadow-2xs'
              : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Private Salons (3)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveZoneTab('patio')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeZoneTab === 'patio'
              ? 'bg-burgundy text-cream shadow-2xs'
              : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy'
          }`}
        >
          <Trees className="w-3.5 h-3.5 text-emerald-600" />
          <span>Outdoor Patio & Garden (6)</span>
        </button>
      </div>

      {/* 4. Realistic Restaurant Floor Layout Canvas */}
      <div className="relative rounded-3xl bg-cream/40 p-4 sm:p-6 border-2 border-cream-border shadow-inner overflow-hidden">
        {/* Subtle background floor grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#421E20 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          {/* =========================================================
              ZONE A & B: INDOOR DINING (Window, Main Hall, Salons)
             ========================================================= */}
          {(activeZoneTab === 'all' ||
            activeZoneTab === 'window' ||
            activeZoneTab === 'main' ||
            activeZoneTab === 'salons') && (
            <div
              className={`${
                activeZoneTab === 'all' ? 'lg:col-span-7' : 'lg:col-span-12'
              } space-y-5`}
            >
              {/* Indoor Section Header with Host Stand */}
              <div className="flex items-center justify-between pb-2 border-b border-cream-border/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-burgundy" />
                  <span className="font-display text-sm font-bold text-burgundy-dark tracking-wide uppercase">
                    Indoor Restaurant Floor
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-secondary-text bg-cream px-2 py-0.5 rounded border border-cream-border">
                  Hardwood Parquet & Air-Conditioned
                </span>
              </div>

              {/* 1. Window Promenade Seating Area */}
              {(activeZoneTab === 'all' || activeZoneTab === 'window') && (
                <div className="rounded-2xl bg-gradient-to-r from-sky-50/70 to-cream-card/90 p-4 border border-sky-200/70 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-sky-700" />
                      Window Promenade (Floor-to-Ceiling Glass View)
                    </span>
                    <span className="text-[10px] text-sky-700 font-medium bg-sky-100/60 px-2 py-0.5 rounded">
                      Natural Sunlight & Streetscape
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-around gap-6 py-2">
                    {windowTables.map((table) => (
                      <VisualTableItem
                        key={table.id}
                        table={table}
                        status={table.status}
                        isSelectable={table.isSelectable}
                        isSelected={selectedTableId === table.id}
                        unavailabilityReason={table.unavailabilityReason}
                        onSelect={onSelectTable}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Main Dining Hall Area */}
              {(activeZoneTab === 'all' || activeZoneTab === 'main') && (
                <div className="rounded-2xl bg-cream-card/90 p-4 sm:p-5 border border-cream-border shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-cream-border/60 pb-2">
                    <span className="text-xs font-bold text-burgundy-dark flex items-center gap-1.5">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-gold-dark" />
                      Main Dining Hall & Central Alcoves
                    </span>
                    <span className="text-[10px] text-secondary-text flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-600" />
                      Near Live Open Kitchen
                    </span>
                  </div>

                  {/* Tables in Main Dining */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center py-2">
                    {mainDiningTables.map((table) => (
                      <div key={table.id} className="flex flex-col items-center">
                        <VisualTableItem
                          table={table}
                          status={table.status}
                          isSelectable={table.isSelectable}
                          isSelected={selectedTableId === table.id}
                          unavailabilityReason={table.unavailabilityReason}
                          onSelect={onSelectTable}
                        />
                        <span className="text-[10px] font-medium text-secondary-text mt-1 text-center truncate max-w-[120px]">
                          {table.zone}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Maitre D' Stand Banner */}
                  <div className="pt-2 border-t border-cream-border/60 flex items-center justify-center gap-2 text-[10px] text-secondary-text">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    <span>Maitre D' & Host Reception Station at South Entrance</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  </div>
                </div>
              )}

              {/* 3. Private Salon & Wine Cellar Suites */}
              {(activeZoneTab === 'all' || activeZoneTab === 'salons') && (
                <div className="rounded-2xl bg-amber-50/40 p-4 sm:p-5 border border-amber-200/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                      Wine Cellar & Royal Banquet Suites
                    </span>
                    <span className="text-[10px] text-amber-800 font-semibold bg-amber-100/70 px-2 py-0.5 rounded">
                      Intimate Medium & Large Feasts
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-around gap-6 sm:gap-8 py-2">
                    {salonTables.map((table) => (
                      <div key={table.id} className="flex flex-col items-center">
                        <VisualTableItem
                          table={table}
                          status={table.status}
                          isSelectable={table.isSelectable}
                          isSelected={selectedTableId === table.id}
                          unavailabilityReason={table.unavailabilityReason}
                          onSelect={onSelectTable}
                        />
                        <span className="text-[10px] font-medium text-amber-900 mt-1 text-center">
                          {table.name} ({table.capacity} Seats)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              ZONE C: OUTDOOR PATIO & GARDEN TERRACE
             ========================================================= */}
          {(activeZoneTab === 'all' || activeZoneTab === 'patio') && (
            <div
              className={`${
                activeZoneTab === 'all' ? 'lg:col-span-5' : 'lg:col-span-12'
              } space-y-5`}
            >
              {/* Outdoor Section Header */}
              <div className="flex items-center justify-between pb-2 border-b border-cream-border/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="font-display text-sm font-bold text-emerald-950 tracking-wide uppercase">
                    Outdoor Patio & Garden
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Open Air & Fairy Lanterns
                </span>
              </div>

              {/* Outdoor Garden Terrace & Pavilion Layout */}
              <div className="rounded-2xl bg-gradient-to-b from-emerald-50/40 via-cream-card/90 to-emerald-50/20 p-4 sm:p-5 border border-emerald-200/80 shadow-2xs space-y-4">
                {/* 1. Veranda & Courtyard Bistro Seating */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Garden Veranda & Courtyard Seating
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded">
                      2 to 6 Seats
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:gap-6 justify-items-center py-2">
                    {outdoorBistroTables.map((table) => (
                      <div key={table.id} className="flex flex-col items-center">
                        <VisualTableItem
                          table={table}
                          status={table.status}
                          isSelectable={table.isSelectable}
                          isSelected={selectedTableId === table.id}
                          unavailabilityReason={table.unavailabilityReason}
                          onSelect={onSelectTable}
                        />
                        <span className="text-[10px] font-medium text-emerald-900 mt-1 text-center max-w-[130px]">
                          {table.zone} ({table.capacity}p)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Royal Garden Pavilions (T13 & T15) */}
                <div className="rounded-xl bg-emerald-100/35 p-3.5 sm:p-4 border border-emerald-200/70 space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <Trees className="w-3.5 h-3.5 text-emerald-600" />
                      Royal Garden Pavilions (Large Parties)
                    </span>
                    <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-200/50 px-2 py-0.5 rounded">
                      8 & 10 Seats
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-5 py-2">
                    {outdoorPavilionTables.map((table) => (
                      <div key={table.id} className="flex flex-col items-center w-full">
                        <VisualTableItem
                          table={table}
                          status={table.status}
                          isSelectable={table.isSelectable}
                          isSelected={selectedTableId === table.id}
                          unavailabilityReason={table.unavailabilityReason}
                          onSelect={onSelectTable}
                        />
                        <span className="text-[11px] font-semibold text-emerald-950 mt-1 text-center">
                          {table.name} ({table.capacity} Seats)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fountain Courtyard Decoration Line */}
                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-center gap-2 text-[10px] text-emerald-800">
                  <Trees className="w-3 h-3 text-emerald-600" />
                  <span>Surrounded by Potted Citrus Trees & Fountain Courtyard</span>
                  <Trees className="w-3 h-3 text-emerald-600" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Selected Table Spotlight Card & "Book This Table" CTA */}
      {selectedTable ? (
        <div className="rounded-2xl bg-gradient-to-r from-cream-card via-amber-50/30 to-cream-card p-5 sm:p-6 border-2 border-gold/70 shadow-gold flex flex-col md:flex-row md:items-center justify-between gap-5 animate-in fade-in duration-300">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gold/20 text-burgundy-dark font-display font-bold text-xl flex items-center justify-center border border-gold/50 shrink-0 shadow-xs">
              {selectedTable.id}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-display text-lg font-bold text-burgundy-dark">
                  {selectedTable.name}
                </h4>
                <Badge variant="gold" size="sm">
                  {selectedTable.zone}
                </Badge>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3" /> Ready to Book
                </span>
              </div>

              <p className="text-xs text-secondary-text">
                {selectedTable.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-burgundy-dark font-medium pt-1">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-gold-dark" />
                  Capacity: <strong>Up to {selectedTable.capacity} Guests</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-gold-dark" />
                  Setting: <strong>{selectedTable.seatingType} Dining</strong>
                </span>
                <span className="flex items-center gap-1 text-secondary-text">
                  Party: <strong>{guestCount} Guests on {targetDate} at {targetTime}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Book This Table Action */}
          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="gold"
              size="lg"
              onClick={handleBookClick}
              leftIcon={<CalendarCheck className="w-5 h-5" />}
              rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              className="w-full sm:w-auto shadow-gold text-sm font-bold py-3 px-6"
            >
              Book This Table
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-cream/70 border border-dashed border-cream-border p-4 text-center text-xs text-secondary-text flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-gold-dark shrink-0" />
          <span>
            Please select any highlighted <strong>Green</strong> table above to view seating details and proceed with your reservation.
          </span>
        </div>
      )}
    </div>
  )
}
