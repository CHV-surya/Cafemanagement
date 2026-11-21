import React from 'react'
import { Navigate, useLocation, Link } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { UserRole } from '@/types'
import { Button, Badge } from '@/components/common'
import { ShieldAlert, LogOut, LayoutDashboard } from 'lucide-react'

export interface ProtectedRouteProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { isAuthenticated, currentUser, logout } = useAuthStore()
  const location = useLocation()

  // 1. Unauthenticated users cannot access protected workspaces
  if (!isAuthenticated || !currentUser) {
    return (
      <Navigate
        to={`/staff/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    )
  }

  // 2. Cross-role protection: user authenticated but role not allowed
  if (!allowedRoles.includes(currentUser.role)) {
    const getDashboardPath = (role: UserRole) => {
      switch (role) {
        case 'admin':
          return '/admin/dashboard'
        case 'waiter':
          return '/waiter/dashboard'
        case 'kitchen':
          return '/kitchen/dashboard'
        default:
          return '/staff'
      }
    }

    const assignedDashboard = getDashboardPath(currentUser.role)

    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-3xl bg-cream-card p-8 border border-cream-border shadow-elevated space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-status-danger border border-rose-200 flex items-center justify-center mx-auto shadow-subtle">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="danger" size="md">
              Access Restricted
            </Badge>
            <h2 className="font-display text-2xl font-bold text-burgundy-dark">
              Unauthorized Workspace
            </h2>
            <p className="text-xs text-secondary-text leading-relaxed">
              This module requires <strong>{allowedRoles.join(' / ').toUpperCase()}</strong> privileges. You are currently authenticated as{' '}
              <strong className="text-burgundy-dark">{currentUser.name}</strong> ({currentUser.role.toUpperCase()} - {currentUser.id}).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-cream border border-cream-border text-xs text-left text-secondary-text">
            <p className="font-semibold text-burgundy-dark mb-0.5">Active Session:</p>
            <p>ID: {currentUser.id} • Username: @{currentUser.username || currentUser.role}</p>
            <p>Shift: {currentUser.shift || 'Floor Service'}</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link to={assignedDashboard} className="w-full">
              <Button
                variant="gold"
                size="md"
                leftIcon={<LayoutDashboard className="w-4 h-4" />}
                className="w-full shadow-gold text-xs"
              >
                Go to My Dashboard
              </Button>
            </Link>

            <Button
              variant="outline"
              size="md"
              onClick={() => logout()}
              leftIcon={<LogOut className="w-4 h-4 text-status-danger" />}
              className="w-full text-xs text-status-danger border-rose-200 hover:bg-rose-50"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 3. User is authenticated and role is allowed
  return <>{children}</>
}
