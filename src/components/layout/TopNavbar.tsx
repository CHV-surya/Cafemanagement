import React from 'react'
import { Bell, Menu } from 'lucide-react'
import { ProfileDropdown } from './ProfileDropdown'
import { useNotificationStore, useUIStore } from '@/store'
import { cn } from '@/utils'

export interface TopNavbarProps {
  title?: string
  subtitle?: string
  className?: string
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  title,
  subtitle,
  className,
}) => {
  const { toggleMobileSidebar, setNotificationDrawerOpen } = useUIStore()
  const { unreadCount } = useNotificationStore()
  const unread = unreadCount()

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-cream-border/80 bg-cream-card/90 px-4 sm:px-6 backdrop-blur-md transition-all shadow-2xs',
        className
      )}
    >
      {/* Left side: Mobile hamburger & Context Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="rounded-xl p-2 text-burgundy-dark hover:bg-cream lg:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {title && (
          <div className="hidden sm:block">
            <h2 className="font-display text-base font-bold text-burgundy-dark leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] text-secondary-text truncate max-w-xs md:max-w-md">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Right side: Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Bell Button */}
        <button
          onClick={() => setNotificationDrawerOpen(true)}
          className="relative rounded-xl p-2 text-secondary-text hover:text-burgundy hover:bg-cream border border-cream-border/60 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/40"
          aria-label="Open notifications"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-burgundy-dark shadow-xs">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-cream-border/80 mx-0.5 sm:mx-1" />

        {/* Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  )
}
