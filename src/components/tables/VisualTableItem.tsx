import React from 'react'
import { TableAvailabilityStatus } from '@/store/useReservationStore'
import { RestaurantTable } from '@/data/tableData'
import { cn } from '@/utils'
import { Users, Check, Lock, AlertCircle } from 'lucide-react'

export interface VisualTableItemProps {
  table: RestaurantTable
  status: TableAvailabilityStatus
  isSelectable: boolean
  isSelected: boolean
  unavailabilityReason?: string
  onSelect: (tableId: string) => void
  shape?: 'round' | 'rectangular'
}

/**
 * Determine realistic table shape based on table id or capacity.
 */
function getTableShape(table: RestaurantTable): 'round' | 'rectangular' {
  // 2-seaters are round (T01, T02, T03)
  if (table.capacity === 2) return 'round'
  // T05 (Central Hall round) and T07 (Garden round canopy) are round 4-seaters
  if (table.id === 'T05' || table.id === 'T07') return 'round'
  // All others (T04, T06, T08, T09, T10, T11, T12, T13, T14, T15) are rectangular
  return 'rectangular'
}

export const VisualTableItem: React.FC<VisualTableItemProps> = ({
  table,
  status,
  isSelectable,
  isSelected,
  unavailabilityReason,
  onSelect,
  shape: explicitShape,
}) => {
  const shape = explicitShape || getTableShape(table)
  const isAvailable = status === 'Available' && isSelectable

  // Color mapping based on status
  // Green = Available, Gold = Reserved, Red = Occupied, Grey = Unavailable
  const getStatusColorTheme = () => {
    if (isSelected) {
      return {
        tableBg: 'bg-gradient-to-br from-amber-50 to-gold/30',
        tableBorder: 'border-gold ring-4 ring-gold/40 shadow-gold',
        chairBg: 'bg-gold/40 border-gold-dark',
        numberColor: 'text-burgundy-dark font-extrabold',
        badgeBg: 'bg-gold text-burgundy-dark font-bold',
        indicatorDot: 'bg-gold animate-pulse',
      }
    }

    if (status === 'Occupied') {
      return {
        tableBg: 'bg-rose-50/70',
        tableBorder: 'border-rose-300 hover:border-rose-400',
        chairBg: 'bg-rose-100 border-rose-300',
        numberColor: 'text-rose-900 font-bold',
        badgeBg: 'bg-rose-100 text-rose-800',
        indicatorDot: 'bg-rose-500 animate-pulse',
      }
    }

    if (status === 'Reserved') {
      return {
        tableBg: 'bg-amber-50/70',
        tableBorder: 'border-amber-300 hover:border-amber-400',
        chairBg: 'bg-amber-100 border-amber-300',
        numberColor: 'text-amber-900 font-bold',
        badgeBg: 'bg-amber-100 text-amber-900',
        indicatorDot: 'bg-amber-500',
      }
    }

    if (!isSelectable) {
      // Grey / Unavailable due to capacity or seating mismatch
      return {
        tableBg: 'bg-stone-100/80',
        tableBorder: 'border-stone-300 opacity-70',
        chairBg: 'bg-stone-200 border-stone-300',
        numberColor: 'text-stone-500 font-semibold',
        badgeBg: 'bg-stone-200 text-stone-600',
        indicatorDot: 'bg-stone-400',
      }
    }

    // Available (Green)
    return {
      tableBg: 'bg-emerald-50/50 hover:bg-emerald-50/80',
      tableBorder: 'border-emerald-400 hover:border-emerald-600 shadow-xs hover:shadow-subtle',
      chairBg: 'bg-emerald-100 border-emerald-400',
      numberColor: 'text-emerald-950 font-bold',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      indicatorDot: 'bg-emerald-500',
    }
  }

  const theme = getStatusColorTheme()

  const handleClick = () => {
    if (isAvailable) {
      onSelect(table.id)
    }
  }

  // Render chairs positioned around the table
  const renderChairs = () => {
    if (shape === 'round') {
      if (table.capacity === 2) {
        // 2 chairs: top and bottom
        return (
          <>
            <div className={cn('absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-2 rounded-t-full border transition-all', theme.chairBg)} />
            <div className={cn('absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-2 rounded-b-full border transition-all', theme.chairBg)} />
          </>
        )
      }
      // 4 chairs: top, bottom, left, right
      return (
        <>
          <div className={cn('absolute -top-2.5 left-1/2 -translate-x-1/2 w-6 h-2 rounded-t-full border transition-all', theme.chairBg)} />
          <div className={cn('absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-6 h-2 rounded-b-full border transition-all', theme.chairBg)} />
          <div className={cn('absolute top-1/2 -left-2.5 -translate-y-1/2 w-2 h-6 rounded-l-full border transition-all', theme.chairBg)} />
          <div className={cn('absolute top-1/2 -right-2.5 -translate-y-1/2 w-2 h-6 rounded-r-full border transition-all', theme.chairBg)} />
        </>
      )
    }

    // Rectangular tables
    if (table.capacity === 4) {
      return (
        <>
          {/* 2 on top, 2 on bottom */}
          <div className="absolute -top-2.5 left-0 right-0 flex justify-around px-2">
            <span className={cn('w-5 h-2 rounded-t-md border transition-all', theme.chairBg)} />
            <span className={cn('w-5 h-2 rounded-t-md border transition-all', theme.chairBg)} />
          </div>
          <div className="absolute -bottom-2.5 left-0 right-0 flex justify-around px-2">
            <span className={cn('w-5 h-2 rounded-b-md border transition-all', theme.chairBg)} />
            <span className={cn('w-5 h-2 rounded-b-md border transition-all', theme.chairBg)} />
          </div>
        </>
      )
    }

    if (table.capacity === 6) {
      return (
        <>
          {/* 2 on top, 2 on bottom, 1 on each end */}
          <div className="absolute -top-2.5 left-0 right-0 flex justify-around px-4">
            <span className={cn('w-6 h-2 rounded-t-md border transition-all', theme.chairBg)} />
            <span className={cn('w-6 h-2 rounded-t-md border transition-all', theme.chairBg)} />
          </div>
          <div className="absolute -bottom-2.5 left-0 right-0 flex justify-around px-4">
            <span className={cn('w-6 h-2 rounded-b-md border transition-all', theme.chairBg)} />
            <span className={cn('w-6 h-2 rounded-b-md border transition-all', theme.chairBg)} />
          </div>
          <div className="absolute top-1/2 -left-2.5 -translate-y-1/2">
            <span className={cn('block w-2 h-6 rounded-l-md border transition-all', theme.chairBg)} />
          </div>
          <div className="absolute top-1/2 -right-2.5 -translate-y-1/2">
            <span className={cn('block w-2 h-6 rounded-r-md border transition-all', theme.chairBg)} />
          </div>
        </>
      )
    }

    if (table.capacity === 8) {
      return (
        <>
          {/* 3 on top, 3 on bottom, 1 left, 1 right */}
          <div className="absolute -top-2.5 left-0 right-0 flex justify-around px-3">
            <span className={cn('w-5 h-2 rounded-t-md border transition-all', theme.chairBg)} />
            <span className={cn('w-5 h-2 rounded-t-md border transition-all', theme.chairBg)} />
            <span className={cn('w-5 h-2 rounded-t-md border transition-all', theme.chairBg)} />
          </div>
          <div className="absolute -bottom-2.5 left-0 right-0 flex justify-around px-3">
            <span className={cn('w-5 h-2 rounded-b-md border transition-all', theme.chairBg)} />
            <span className={cn('w-5 h-2 rounded-b-md border transition-all', theme.chairBg)} />
            <span className={cn('w-5 h-2 rounded-b-md border transition-all', theme.chairBg)} />
          </div>
          <div className="absolute top-1/2 -left-2.5 -translate-y-1/2">
            <span className={cn('block w-2 h-7 rounded-l-md border transition-all', theme.chairBg)} />
          </div>
          <div className="absolute top-1/2 -right-2.5 -translate-y-1/2">
            <span className={cn('block w-2 h-7 rounded-r-md border transition-all', theme.chairBg)} />
          </div>
        </>
      )
    }

    // 10-seater banquet (T14, T15)
    return (
      <>
        {/* 4 on top, 4 on bottom, 1 left, 1 right */}
        <div className="absolute -top-2.5 left-0 right-0 flex justify-around px-3">
          <span className={cn('w-5 h-2 rounded-t-md border transition-all', theme.chairBg)} />
          <span className={cn('w-5 h-2 rounded-t-md border transition-all', theme.chairBg)} />
          <span className={cn('w-5 h-2 rounded-t-md border transition-all', theme.chairBg)} />
          <span className={cn('w-5 h-2 rounded-t-md border transition-all', theme.chairBg)} />
        </div>
        <div className="absolute -bottom-2.5 left-0 right-0 flex justify-around px-3">
          <span className={cn('w-5 h-2 rounded-b-md border transition-all', theme.chairBg)} />
          <span className={cn('w-5 h-2 rounded-b-md border transition-all', theme.chairBg)} />
          <span className={cn('w-5 h-2 rounded-b-md border transition-all', theme.chairBg)} />
          <span className={cn('w-5 h-2 rounded-b-md border transition-all', theme.chairBg)} />
        </div>
        <div className="absolute top-1/2 -left-2.5 -translate-y-1/2">
          <span className={cn('block w-2 h-8 rounded-l-md border transition-all', theme.chairBg)} />
        </div>
        <div className="absolute top-1/2 -right-2.5 -translate-y-1/2">
          <span className={cn('block w-2 h-8 rounded-r-md border transition-all', theme.chairBg)} />
        </div>
      </>
    )
  }

  // Dimension classes based on shape & capacity
  const getDimensionClass = () => {
    if (shape === 'round') {
      return table.capacity === 2
        ? 'w-20 h-20 rounded-full'
        : 'w-24 h-24 rounded-full'
    }

    switch (table.capacity) {
      case 4:
        return 'w-28 h-20 rounded-xl'
      case 6:
        return 'w-36 h-22 rounded-xl'
      case 8:
        return 'w-44 h-24 rounded-2xl'
      case 10:
        return 'w-52 h-24 rounded-2xl'
      default:
        return 'w-32 h-20 rounded-xl'
    }
  }

  return (
    <div
      onClick={handleClick}
      title={
        isAvailable
          ? `Click to select ${table.name} (${table.zone})`
          : unavailabilityReason || `${table.name} is ${status}`
      }
      className={cn(
        'relative inline-flex items-center justify-center p-3 sm:p-3.5 select-none transition-all duration-300',
        isAvailable
          ? 'cursor-pointer hover:scale-105 active:scale-95'
          : 'cursor-not-allowed'
      )}
    >
      {/* Surrounding Chairs */}
      {renderChairs()}

      {/* Main Table Surface */}
      <div
        className={cn(
          'relative flex flex-col items-center justify-center border-2 transition-all duration-300 z-10 shadow-xs',
          getDimensionClass(),
          theme.tableBg,
          theme.tableBorder
        )}
      >
        {/* Table Number & Status Indicator */}
        <div className="flex items-center gap-1">
          <span className={cn('font-display text-sm tracking-tight', theme.numberColor)}>
            {table.id}
          </span>
          <span className={cn('w-2 h-2 rounded-full shrink-0', theme.indicatorDot)} />
        </div>

        {/* Capacity Indicator */}
        <span className="flex items-center gap-0.5 text-[10px] text-secondary-text font-medium mt-0.5">
          <Users className="w-2.5 h-2.5 text-gold-dark shrink-0" />
          <span>{table.capacity}p</span>
        </span>

        {/* Selected badge overlay */}
        {isSelected && (
          <span className="absolute -top-2 -right-2 bg-gold text-burgundy-dark rounded-full p-0.5 shadow-md border border-cream">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </span>
        )}

        {/* Non-selectable lock icon */}
        {!isAvailable && !isSelected && (
          <span className="absolute -top-1.5 -right-1.5 bg-cream-card/90 text-stone-500 rounded-full p-0.5 shadow-2xs border border-cream-border">
            {status === 'Available' ? (
              <AlertCircle className="w-3 h-3 text-stone-400" />
            ) : (
              <Lock className="w-3 h-3 text-stone-400" />
            )}
          </span>
        )}
      </div>
    </div>
  )
}
