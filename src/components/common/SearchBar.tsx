import React from 'react'
import { cn } from '@/utils'
import { Search, X } from 'lucide-react'

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  containerClassName?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search dishes, tables, orders...',
  className,
  containerClassName,
  ...props
}) => {
  const handleClear = () => {
    onChange('')
    if (onClear) onClear()
  }

  return (
    <div className={cn('relative flex items-center w-full', containerClassName)}>
      <Search className="absolute left-3.5 w-4 h-4 text-secondary-text pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-9 pr-9 py-2 rounded-xl text-sm bg-cream-card border border-cream-border text-main-text placeholder:text-secondary-text/60 transition-all focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold shadow-subtle',
          className
        )}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 p-1 rounded-md text-secondary-text hover:text-burgundy hover:bg-cream/80 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
