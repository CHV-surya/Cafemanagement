import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Badge } from '@/components/common'
import { BrandLogo } from '@/components/layout'
import { useAuthStore } from '@/store'
import { UserRole } from '@/types'
import {
  ShieldCheck,
  UtensilsCrossed,
  ChefHat,
  ArrowRight,
  Sparkles,
  Lock,
  UserCheck,
  LogOut
} from 'lucide-react'

export const StaffPortalPage: React.FC = () => {
  const { currentUser, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleAccessWorkspace = (role: UserRole) => {
    // If already logged in as this role, proceed directly to its dashboard
    if (isAuthenticated && currentUser?.role === role) {
      navigate(`/${role}/dashboard`)
    } else {
      // Otherwise navigate to login with the selected role pre-selected
      navigate(`/staff/login?role=${role}`)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-gold/30 selection:text-burgundy-dark">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <BrandLogo variant="dark" to="/" />
        <div className="flex items-center gap-3">
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-secondary-text bg-cream-card px-3 py-1.5 rounded-xl border border-cream-border">
                <UserCheck className="w-3.5 h-3.5 text-status-success" />
                Signed in as <strong className="text-burgundy-dark">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                leftIcon={<LogOut className="w-3.5 h-3.5 text-status-danger" />}
                className="text-xs text-status-danger hover:bg-rose-50"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/">
              <Button variant="ghost" size="sm">
                ← Back to Public Website
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Hub Content */}
      <div className="max-w-5xl mx-auto w-full py-10 sm:py-14 text-center">
        {/* Header Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-burgundy/10 text-burgundy border border-burgundy/20 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          BistroHub Internal Operations Portal
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-bold text-burgundy-dark mb-4">
          Staff Workspace Access
        </h1>
        <p className="text-xs sm:text-sm text-secondary-text max-w-xl mx-auto mb-10 leading-relaxed">
          Authorized restaurant terminals for management, dining floor, and kitchen operations. Select your station below to sign in.
        </p>

        {/* 3 Large Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
          {/* Card 1: Admin / Receptionist */}
          <div className="group rounded-3xl bg-cream-card p-7 border-2 border-cream-border hover:border-gold/60 shadow-subtle hover:shadow-premium hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-burgundy" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-burgundy text-gold flex items-center justify-center mb-6 shadow-subtle group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-7 h-7 stroke-[1.8]" />
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-xl font-bold text-burgundy-dark">
                  Admin / Receptionist
                </h3>
                <Badge variant="primary" size="sm">
                  Executive
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed mb-6">
                Manage restaurant operations, orders, reservations, tables and billing.
              </p>
            </div>

            <div className="pt-4 border-t border-cream-border/70">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleAccessWorkspace('admin')}
                rightIcon={<ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />}
                className="w-full text-xs sm:text-sm font-semibold"
              >
                Access Workspace
              </Button>
            </div>
          </div>

          {/* Card 2: Waiter */}
          <div className="group rounded-3xl bg-cream-card p-7 border-2 border-cream-border hover:border-gold/60 shadow-subtle hover:shadow-premium hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gold" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-gold text-burgundy-dark flex items-center justify-center mb-6 shadow-subtle group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-7 h-7 stroke-[1.8]" />
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-xl font-bold text-burgundy-dark">
                  Waiter
                </h3>
                <Badge variant="gold" size="sm">
                  Floor Service
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed mb-6">
                Manage assigned tables, take customer orders and track order progress.
              </p>
            </div>

            <div className="pt-4 border-t border-cream-border/70">
              <Button
                variant="gold"
                size="lg"
                onClick={() => handleAccessWorkspace('waiter')}
                rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                className="w-full shadow-gold text-xs sm:text-sm font-semibold"
              >
                Access Workspace
              </Button>
            </div>
          </div>

          {/* Card 3: Kitchen */}
          <div className="group rounded-3xl bg-cream-card p-7 border-2 border-cream-border hover:border-gold/60 shadow-subtle hover:shadow-premium hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-status-danger" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-burgundy-dark text-gold flex items-center justify-center mb-6 shadow-subtle group-hover:scale-105 transition-transform">
                <ChefHat className="w-7 h-7 stroke-[1.8]" />
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-xl font-bold text-burgundy-dark">
                  Kitchen
                </h3>
                <Badge variant="secondary" size="sm">
                  Excluded in V1
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed mb-6">
                Kitchen Display System (KDS) is intentionally excluded in this prototype scope. Live operations focus on Public Booking, Admin & Waiter POS.
              </p>
            </div>

            <div className="pt-4 border-t border-cream-border/70">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleAccessWorkspace('kitchen')}
                rightIcon={<ArrowRight className="w-4 h-4 text-burgundy group-hover:translate-x-1 transition-transform" />}
                className="w-full text-xs sm:text-sm font-semibold border-cream-border hover:border-gold/60"
              >
                Access Workspace
              </Button>
            </div>
          </div>
        </div>

        {/* Dedicated Login Link */}
        <div className="mt-12 pt-6 border-t border-cream-border text-center">
          <Link
            to="/staff/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-secondary-text hover:text-burgundy transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-gold" />
            Go directly to Role-Based Credentials Login Form
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto w-full text-center text-[11px] text-secondary-text/80">
        BistroHub Management System • End-to-End Restaurant Operational SaaS
      </div>
    </div>
  )
}
