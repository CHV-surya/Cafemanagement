import React from 'react'
import { cn } from '@/utils'
import { StatusType } from '@/types'

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType | string
  label?: string
  pulse?: boolean
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  pulse = false,
  className,
  ...props
}) => {
  const normalizedStatus = status.toLowerCase()

  const getStatusConfig = (s: string) => {
    switch (s) {
      case 'available':
      case 'ready':
      case 'served':
      case 'completed':
      case 'active':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-[#4F9564]',
          defaultLabel: s.charAt(0).toUpperCase() + s.slice(1),
        }
      case 'occupied':
      case 'preparing':
      case 'in-progress':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          dot: 'bg-[#D9A441]',
          defaultLabel: s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1),
        }
      case 'reserved':
      case 'pending':
        return {
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-600',
          defaultLabel: s.charAt(0).toUpperCase() + s.slice(1),
        }
      case 'cleaning':
      case 'cancelled':
      case 'inactive':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-[#D95353]',
          defaultLabel: s.charAt(0).toUpperCase() + s.slice(1),
        }
      default:
        return {
          bg: 'bg-cream-border/60 text-secondary-text border-cream-border',
          dot: 'bg-secondary-text',
          defaultLabel: s,
        }
    }
  }

  const config = getStatusConfig(normalizedStatus)
  const displayLabel = label || config.defaultLabel

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-2xs',
        config.bg,
        className
      )}
      {...props}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              config.dot
            )}
          />
        )}
        <span
          className={cn('relative inline-flex rounded-full h-2 w-2', config.dot)}
        />
      </span>
      {displayLabel}
    </span>
  )
}
