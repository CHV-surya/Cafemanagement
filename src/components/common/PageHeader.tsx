import React from 'react'
import { cn } from '@/utils'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeaderProps } from '@/types'

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
  className,
}) => {
  return (
    <div className={cn('mb-6 space-y-2', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1.5 text-xs text-secondary-text">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-secondary-text/50" />}
              {crumb.href ? (
                <Link
                  to={crumb.href}
                  className="hover:text-burgundy transition-colors font-medium"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-burgundy-dark font-semibold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-burgundy-dark">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-secondary-text max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  )
}
