import React from 'react'
import { Outlet } from 'react-router-dom'
import { PublicHeader, PublicFooter } from '@/components/layout'

export interface PublicLayoutProps {
  children?: React.ReactNode
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-main-text selection:bg-gold/30 selection:text-burgundy-dark">
      {/* Navigation Header */}
      <PublicHeader />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  )
}
