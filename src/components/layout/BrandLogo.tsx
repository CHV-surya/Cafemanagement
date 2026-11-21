import React from 'react'
import { Link } from 'react-router-dom'
import { Utensils } from 'lucide-react'
import { cn } from '@/utils'

export interface BrandLogoProps {
  to?: string
  variant?: 'light' | 'dark'
  collapsed?: boolean
  className?: string
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  to = '/',
  variant = 'dark',
  collapsed = false,
  className,
}) => {
  const isLight = variant === 'light'

  return (
    <Link
      to={to}
      className={cn(
        'group flex items-center gap-3 transition-opacity select-none',
        className
      )}
    >
      {/* Crest Icon */}
      <div
        className={cn(
          'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105',
          isLight
            ? 'bg-gold/20 text-gold border border-gold/40'
            : 'bg-burgundy text-gold border border-gold/30 shadow-subtle'
        )}
      >
        <Utensils className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
        </span>
      </div>

      {/* Brand Text */}
      {!collapsed && (
        <div className="flex flex-col text-left">
          <span
            className={cn(
              'font-display text-xl font-bold tracking-tight leading-none',
              isLight ? 'text-cream' : 'text-burgundy-dark'
            )}
          >
            Bistro<span className="text-gold">Hub</span>
          </span>
          <span
            className={cn(
              'text-[10px] uppercase font-semibold tracking-widest mt-1',
              isLight ? 'text-cream/60' : 'text-secondary-text'
            )}
          >
            SaaS Platform
          </span>
        </div>
      )}
    </Link>
  )
}
