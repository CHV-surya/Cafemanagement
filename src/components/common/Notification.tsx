import React from 'react'
import { cn } from '@/utils'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'
import { NotificationItem } from '@/types'

export interface NotificationProps {
  notification: NotificationItem
  onMarkAsRead?: (id: string) => void
  onDismiss?: (id: string) => void
  className?: string
}

export const Notification: React.FC<NotificationProps> = ({
  notification,
  onMarkAsRead,
  onDismiss,
  className,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-status-success" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-gold-dark" />
      case 'danger':
        return <AlertCircle className="w-4 h-4 text-status-danger" />
      case 'info':
      default:
        return <Info className="w-4 h-4 text-burgundy" />
    }
  }

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return 'border-l-status-success'
      case 'warning':
        return 'border-l-gold'
      case 'danger':
        return 'border-l-status-danger'
      default:
        return 'border-l-burgundy'
    }
  }

  return (
    <div
      onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
      className={cn(
        'group relative p-3.5 rounded-xl border border-cream-border border-l-4 transition-all duration-200 cursor-pointer shadow-subtle hover:shadow-premium',
        notification.read ? 'bg-cream-card/70 opacity-80' : 'bg-cream-card font-medium',
        getBorderColor(),
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-cream/70 shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-burgundy-dark truncate">
              {notification.title}
            </h4>
            <span className="text-[10px] text-secondary-text shrink-0">
              {typeof notification.timestamp === 'string'
                ? notification.timestamp
                : notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary-text line-clamp-2">
            {notification.message}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDismiss(notification.id)
            }}
            className="absolute top-2.5 right-2.5 p-1 rounded-md text-secondary-text/60 hover:text-burgundy hover:bg-cream transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
