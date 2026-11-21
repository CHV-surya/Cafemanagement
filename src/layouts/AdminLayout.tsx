import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar, TopNavbar, NotificationDrawer } from '@/components/layout'
import { ADMIN_NAV_ITEMS } from '@/data/navigation'

export interface AdminLayoutProps {
  children?: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-cream text-main-text selection:bg-gold/30 selection:text-burgundy-dark flex">
      {/* Burgundy Desktop & Mobile Sidebar */}
      <Sidebar
        navItems={ADMIN_NAV_ITEMS}
        workspaceTitle="Management Console"
        workspaceBadge="Admin"
      />

      {/* Main Content Column */}
      <div className="flex flex-1 flex-col lg:pl-64 min-w-0 transition-all duration-200">
        {/* Top Navbar */}
        <TopNavbar
          title="BistroHub Management"
          subtitle="Real-time restaurant operations, orders & revenue"
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
