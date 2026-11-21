import React from 'react'
import { cn } from '@/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none'

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
      md: 'text-sm px-4 py-2 rounded-xl gap-2',
      lg: 'text-base px-6 py-2.5 rounded-xl gap-2.5',
      icon: 'h-9 w-9 rounded-xl p-0 flex items-center justify-center',
    }

    const variantStyles = {
      primary:
        'bg-burgundy text-cream hover:bg-burgundy-hover shadow-subtle hover:shadow border border-burgundy-light/20',
      gold:
        'bg-gold text-burgundy-dark font-semibold hover:bg-gold-hover shadow-gold hover:brightness-105 active:brightness-95',
      secondary:
        'bg-cream-border/60 text-main-text hover:bg-cream-border border border-cream-border',
      outline:
        'border border-burgundy/20 text-burgundy bg-transparent hover:bg-burgundy/5',
      ghost:
        'text-main-text bg-transparent hover:bg-burgundy/5 active:bg-burgundy/10',
      danger:
        'bg-status-danger text-white hover:brightness-110 shadow-subtle',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
