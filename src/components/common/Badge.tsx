import React from 'react'
import { cn } from '@/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'gold' | 'success' | 'danger' | 'secondary' | 'outline'
  size?: 'sm' | 'md'
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  className,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-burgundy/10 text-burgundy border-burgundy/20',
    gold: 'bg-gold/15 text-gold-dark border-gold/30',
    success: 'bg-status-success/15 text-status-success border-status-success/30',
    danger: 'bg-status-danger/15 text-status-danger border-status-danger/30',
    secondary: 'bg-cream-border text-secondary-text border-cream-border',
    outline: 'border-current bg-transparent',
  }

  const dotColors = {
    primary: 'bg-burgundy',
    gold: 'bg-gold',
    success: 'bg-status-success',
    danger: 'bg-status-danger',
    secondary: 'bg-secondary-text',
    outline: 'bg-current',
  }

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColors[variant]
          )}
        />
      )}
      {children}
    </span>
  )
}
