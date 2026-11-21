import React from 'react'
import { cn } from '@/utils'
import { Calendar } from 'lucide-react'

export interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  min?: string
  max?: string
  error?: string
  disabled?: boolean
  className?: string
  placeholder?: string
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  min,
  max,
  error,
  disabled,
  className,
  placeholder,
}) => {
  const generatedId = React.useId()

  return (
    <div className={cn('w-full space-y-1.5 text-left', className)}>
      {label && (
        <label
          htmlFor={generatedId}
          className="block text-xs font-semibold uppercase tracking-wider text-secondary-text"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <Calendar className="absolute left-3.5 w-4 h-4 text-secondary-text pointer-events-none" />
        <input
          id={generatedId}
          type="date"
          value={value}
          min={min}
          max={max}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full pl-10 pr-3.5 py-2 rounded-xl text-sm bg-cream-card border transition-all duration-200 text-main-text focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold shadow-subtle [color-scheme:light]',
            error
              ? 'border-status-danger focus:ring-status-danger/30'
              : 'border-cream-border hover:border-burgundy/20',
            disabled && 'opacity-60 bg-cream/70 cursor-not-allowed'
          )}
        />
      </div>
      {error && (
        <p className="text-xs text-status-danger font-medium">{error}</p>
      )}
    </div>
  )
}
