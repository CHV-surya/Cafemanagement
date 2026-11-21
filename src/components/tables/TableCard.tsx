import React from 'react'
import { StatusBadge } from '@/components/common'
import { TableAvailabilityStatus } from '@/store/useReservationStore'
import { cn } from '@/utils'
import { Users, Check, Trees, Home, Info } from 'lucide-react'

export interface TableCardProps {
  id: string
  name: string
  capacity: number
  seatingType: 'Indoor' | 'Outdoor'
  zone: string
  status: TableAvailabilityStatus
  isSelected?: boolean
  isSelectable?: boolean
  unavailabilityReason?: string
  onSelect?: (tableId: string) => void
  className?: string
}

export const TableCard: React.FC<TableCardProps> = ({
  id,
  name,
  capacity,
  seatingType,
  zone,
  status,
  isSelected = false,
  isSelectable = true,
  unavailabilityReason,
  onSelect,
  className,
}) => {
  const isAvailable = status === 'Available' && isSelectable

  const handleClick = () => {
    if (isAvailable && onSelect) {
      onSelect(id)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl p-4 border transition-all duration-200 select-none text-left',
        // Selected style
        isSelected
          ? 'bg-cream-card border-gold ring-2 ring-gold/40 shadow-gold -translate-y-0.5'
          : isAvailable
          ? 'bg-cream-card border-cream-border hover:border-gold/50 hover:shadow-subtle hover:-translate-y-0.5 cursor-pointer'
          : 'bg-cream/60 border-cream-border/70 opacity-60 cursor-not-allowed',
        className
      )}
    >
      {/* Top Header: Table ID & Status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'font-display text-base font-bold tracking-tight transition-colors',
              isSelected ? 'text-burgundy-dark font-extrabold' : 'text-burgundy-dark'
            )}
          >
            {id}
          </span>
          <span className="text-[11px] text-secondary-text">({name})</span>
        </div>

        {/* Selected Checkmark or Status Badge */}
        {isSelected ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold text-burgundy-dark shadow-xs">
            <Check className="w-3 h-3 stroke-[3]" /> Selected
          </span>
        ) : (
          <StatusBadge
            status={
              status === 'Available'
                ? isSelectable
                  ? 'available'
                  : 'cleaning'
                : status === 'Occupied'
                ? 'occupied'
                : 'reserved'
            }
            label={
              status === 'Available'
                ? isSelectable
                  ? 'Available'
                  : 'Unavailable'
                : status
            }
            pulse={status === 'Occupied'}
          />
        )}
      </div>

      {/* Middle: Zone & Seating Type */}
      <div className="space-y-1 mb-3">
        <p className="text-xs font-semibold text-burgundy-dark truncate">{zone}</p>
        <div className="flex items-center gap-3 text-[11px] text-secondary-text">
          <span className="inline-flex items-center gap-1">
            <Users className="w-3 h-3 text-gold shrink-0" />
            <span>Up to {capacity} guests</span>
          </span>
          <span className="inline-flex items-center gap-1">
            {seatingType === 'Outdoor' ? (
              <Trees className="w-3 h-3 text-emerald-600 shrink-0" />
            ) : (
              <Home className="w-3 h-3 text-burgundy shrink-0" />
            )}
            <span>{seatingType}</span>
          </span>
        </div>
      </div>

      {/* Bottom reason hint if not selectable */}
      {unavailabilityReason && !isSelected && (
        <div className="pt-2 border-t border-cream-border/60 flex items-start gap-1 text-[10px] text-secondary-text leading-tight">
          <Info className="w-3 h-3 text-secondary-text/80 shrink-0 mt-0.5" />
          <span className="truncate">{unavailabilityReason}</span>
        </div>
      )}

      {/* When Available & not selected, show a subtle click prompt */}
      {isAvailable && !isSelected && (
        <div className="pt-2 border-t border-cream-border/60 text-[10px] font-semibold text-gold group-hover:text-gold-dark transition-colors flex items-center justify-between">
          <span>Click to select</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold/50 group-hover:bg-gold" />
        </div>
      )}
    </div>
  )
}
