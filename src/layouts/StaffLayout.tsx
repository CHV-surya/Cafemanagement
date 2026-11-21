import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar, TopNavbar, NotificationDrawer } from '@/components/layout'
import { WAITER_NAV_ITEMS, KITCHEN_NAV_ITEMS } from '@/data/navigation'
import { NavItem } from '@/types'

export interface StaffLayoutProps {
  navItems?: NavItem[]
  workspaceTitle?: string
  workspaceBadge?: string
  title?: string
  subtitle?: string
  children?: React.ReactNode
}

export const StaffLayout: React.FC<StaffLayoutProps> = ({
  navItems,
  workspaceTitle,
  workspaceBadge,
  title,
  subtitle,
  children,
}) => {
  const location = useLocation()
  const isKitchen = location.pathname.startsWith('/kitchen')

  // Auto-configure based on path if not explicitly provided
  const resolvedNavItems = navItems || (isKitchen ? KITCHEN_NAV_ITEMS : WAITER_NAV_ITEMS)
  const resolvedWorkspaceTitle = workspaceTitle || (isKitchen ? 'Kitchen Display (KDS)' : 'Service Station')
  const resolvedWorkspaceBadge = workspaceBadge || (isKitchen ? 'Chef' : 'Floor Staff')
  const resolvedTitle = title || (isKitchen ? 'Kitchen Operations' : 'Dining Floor Terminal')
  const resolvedSubtitle =
    subtitle || (isKitchen ? 'Real-time ticket queue and line station dispatch' : 'Live table service, active tickets & guest requests')

  return (
    <div className="min-h-screen bg-cream text-main-text selection:bg-gold/30 selection:text-burgundy-dark flex">
      {/* Configurable Burgundy Sidebar */}
      <Sidebar
        navItems={resolvedNavItems}
        workspaceTitle={resolvedWorkspaceTitle}
        workspaceBadge={resolvedWorkspaceBadge}
      />

      {/* Main Content Column */}
      <div className="flex flex-1 flex-col lg:pl-64 min-w-0 transition-all duration-200">
        {/* Top Navbar */}
        <TopNavbar
          title={resolvedTitle}
          subtitle={resolvedSubtitle}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children || <Outlet />}
        </main>
      </div>

      {/* Slide-out Notification Drawer */}
      <NotificationDrawer />
    </div>
  )
}
