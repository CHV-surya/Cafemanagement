import React from 'react'
import { cn } from '@/utils'
import { Utensils } from 'lucide-react'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  action?: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Utensils,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-cream-border/80 bg-cream-card/50 my-4',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-gold border border-cream-border shadow-subtle mb-4">
        <Icon className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h3 className="font-display text-base font-bold text-burgundy-dark">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-xs text-secondary-text leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
