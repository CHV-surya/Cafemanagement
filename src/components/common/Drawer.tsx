import React, { useEffect } from 'react'
import { cn } from '@/utils'
import { X } from 'lucide-react'

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: string
  position?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  position = 'right',
  size = 'md',
  children,
  footer,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
  }

  const positionClasses = {
    right: 'inset-y-0 right-0 animate-in slide-in-from-right duration-300',
    left: 'inset-y-0 left-0 animate-in slide-in-from-left duration-300',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-burgundy-dark/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={cn(
          'fixed flex flex-col w-full bg-cream-card shadow-elevated border-l border-cream-border z-10',
          positionClasses[position],
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-center justify-between border-b border-cream-border px-6 py-4 bg-cream/40">
            <div>
              {title && (
                <h3 className="font-display text-lg font-bold text-burgundy-dark">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-0.5 text-xs text-secondary-text">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-secondary-text hover:bg-cream hover:text-burgundy transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-cream-border px-6 py-4 bg-cream/30">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
