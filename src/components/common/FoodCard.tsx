import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './Button'
import { Badge } from './Badge'
import { formatINR, cn } from '@/utils'
import { ArrowRight, Utensils, Eye } from 'lucide-react'

export interface FoodCardProps {
  id?: string | number
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  badgeText?: string
  isVeg?: boolean
  actionLabel?: string
  viewMenuHref?: string
  onViewMenu?: () => void
  onViewDetails?: () => void
  className?: string
}

export const FoodCard: React.FC<FoodCardProps> = ({
  name,
  description,
  price,
  imageUrl,
  category,
  badgeText,
  isVeg,
  actionLabel,
  viewMenuHref = '/menu',
  onViewMenu,
  onViewDetails,
  className,
}) => {
  const [imageError, setImageError] = useState(false)

  const resolvedActionLabel = actionLabel || (onViewDetails ? 'View Details' : 'View Menu')
  const handleAction = onViewDetails || onViewMenu

  return (
    <div
      className={cn(
        'group flex flex-col justify-between overflow-hidden rounded-2xl bg-cream-card border border-cream-border shadow-subtle hover:shadow-premium transition-all duration-300 hover:-translate-y-1 text-left',
        className
      )}
    >
      {/* Top Media Container */}
      <div className="relative overflow-hidden aspect-[4/3] w-full bg-cream">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-cream/70 text-secondary-text">
            <Utensils className="h-10 w-10 text-gold/40" />
          </div>
        )}

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
          {/* Category Badge */}
          <Badge
            variant="primary"
            size="sm"
            className="bg-burgundy/90 text-cream backdrop-blur-xs border-burgundy-border shadow-2xs font-semibold"
          >
            {category}
          </Badge>

          {/* Optional Tag / Chef / Bestseller Badge */}
          {badgeText && (
            <Badge
              variant="gold"
              size="sm"
              className="bg-gold text-burgundy-dark shadow-2xs font-bold"
            >
              {badgeText}
            </Badge>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-center gap-2 min-w-0">
              {/* Veg / Non-Veg Indicator */}
              {isVeg !== undefined && (
                <span
                  className={cn(
                    'inline-flex items-center justify-center w-4 h-4 rounded-xs border-1.5 p-0.5 shrink-0 bg-white shadow-2xs',
                    isVeg ? 'border-emerald-600' : 'border-rose-700'
                  )}
                  title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                  aria-label={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                >
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      isVeg ? 'bg-emerald-600' : 'bg-rose-700'
                    )}
                  />
                </span>
              )}

              <h3 className="font-display text-base sm:text-lg font-bold text-burgundy-dark group-hover:text-gold-dark transition-colors line-clamp-1">
                {name}
              </h3>
            </div>

            <span className="font-display text-base sm:text-lg font-bold text-gold shrink-0">
              {formatINR(price)}
            </span>
          </div>

          <p className="text-xs text-secondary-text line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer / Action */}
        <div className="pt-3 border-t border-cream-border/70 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-secondary-text">
            {isVeg !== undefined ? (isVeg ? 'Pure Veg' : 'Non-Veg') : 'Chef Crafted'}
          </span>

          {handleAction ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAction}
              rightIcon={
                onViewDetails ? (
                  <Eye className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />
                )
              }
              className="text-xs border-burgundy/20 hover:border-gold hover:bg-gold/10"
            >
              {resolvedActionLabel}
            </Button>
          ) : (
            <Link to={viewMenuHref}>
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />}
                className="text-xs border-burgundy/20 hover:border-gold hover:bg-gold/10"
              >
                {resolvedActionLabel}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
