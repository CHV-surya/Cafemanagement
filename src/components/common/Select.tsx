import React from 'react'
import { cn } from '@/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
  helperText?: string
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      options,
      error,
      helperText,
      placeholder,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const selectId = id || generatedId

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-secondary-text"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full appearance-none rounded-xl bg-cream-card pl-3.5 pr-10 py-2 text-sm text-main-text border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold',
              error
                ? 'border-status-danger focus:ring-status-danger/30'
                : 'border-cream-border hover:border-burgundy/20',
              disabled && 'opacity-60 bg-cream/70 cursor-not-allowed',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-secondary-text">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && (
          <p className="text-xs text-status-danger font-medium">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-secondary-text">{helperText}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
