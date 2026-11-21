import React from 'react'
import { cn } from '@/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-secondary-text"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-secondary-text/70">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full rounded-xl bg-cream-card px-4 py-2 text-sm text-main-text border transition-all duration-200 placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightIcon ? 'pr-10' : 'pr-3.5',
              error
                ? 'border-status-danger focus:ring-status-danger/30'
                : 'border-cream-border hover:border-burgundy/20',
              disabled && 'opacity-60 bg-cream/70 cursor-not-allowed',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-secondary-text/70">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-status-danger font-medium animate-fadeIn">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-secondary-text">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
