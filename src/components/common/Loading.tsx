import React from 'react'
import { cn } from '@/utils'
import { Loader2 } from 'lucide-react'

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
  className?: string
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  fullScreen = false,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const content = (
    <div className={cn('flex flex-col items-center justify-center p-6 text-center space-y-3', className)}>
      <div className="relative">
        <Loader2 className={cn('animate-spin text-gold', sizeClasses[size])} />
        <div className="absolute inset-0 rounded-full blur-xs bg-gold/20 -z-10" />
      </div>
      {text && (
        <p className="text-xs font-medium tracking-wide uppercase text-burgundy-dark/70">
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream/80 backdrop-blur-xs">
        {content}
      </div>
    )
  }

  return content
}
