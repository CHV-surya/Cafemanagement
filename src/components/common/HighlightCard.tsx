import React from 'react'
import { cn } from '@/utils'

export interface HighlightCardProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  className?: string
}

export const HighlightCard: React.FC<HighlightCardProps> = ({
  title,
  description,
  icon: Icon,
  className,
}) => {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-cream-card p-6 sm:p-7 border border-cream-border shadow-subtle hover:shadow-premium hover:-translate-y-1 transition-all duration-300 text-left',
        className
      )}
    >
      {/* Top gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-cream border border-cream-border flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-burgundy-dark group-hover:shadow-gold transition-all duration-300 mb-5">
        <Icon className="w-6 h-6 stroke-[1.8]" />
      </div>

      {/* Content */}
      <h3 className="font-display text-lg font-bold text-burgundy-dark group-hover:text-gold-dark transition-colors mb-2">
        {title}
      </h3>
      <p className="text-xs text-secondary-text leading-relaxed">
        {description}
      </p>
    </div>
  )
}
