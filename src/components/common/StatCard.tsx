import React from 'react'
import { cn } from '@/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { StatCardProps } from '@/types'

export interface ExtendedStatCardProps extends StatCardProps {
  onClick?: () => void
}

export const StatCard: React.FC<ExtendedStatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  description,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-cream-card p-5 border border-cream-border shadow-subtle hover:shadow-premium transition-all duration-200',
        onClick && 'cursor-pointer hover:-translate-y-0.5',
        className
      )}
    >
      {/* Top subtle gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
            {title}
          </p>
          <p className="font-display text-2xl font-bold tracking-tight text-burgundy-dark">
            {value}
          </p>
        </div>

        {Icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream border border-cream-border text-gold group-hover:text-gold-hover group-hover:bg-gold/10 transition-colors shrink-0">
            <Icon className="h-5 w-5 stroke-[1.8]" />
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-3.5 pt-3 border-t border-cream-border/60 flex items-center justify-between text-xs">
          {change && (
            <div className="flex items-center gap-1 font-medium">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-semibold',
                  change.isPositive
                    ? 'bg-status-success/15 text-status-success'
                    : 'bg-status-danger/15 text-status-danger'
                )}
              >
                {change.isPositive ? (
                  <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                ) : (
                  <TrendingDown className="w-3 h-3 stroke-[2.5]" />
                )}
                {change.value}
              </span>
              {change.label && (
                <span className="text-secondary-text text-[11px] ml-1">
                  {change.label}
                </span>
              )}
            </div>
          )}

          {description && !change && (
            <span className="text-secondary-text text-[11px] truncate">
              {description}
            </span>
          )}

          {description && change && (
            <span className="text-secondary-text text-[11px] truncate ml-auto">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
