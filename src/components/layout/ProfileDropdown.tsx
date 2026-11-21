import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/common'
import { useAuthStore } from '@/store'
import { UserRole } from '@/types'
import {
  LogOut,
  ShieldCheck,
  UtensilsCrossed,
  ChefHat,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'

export const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { currentUser, switchRole, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!currentUser) return null

  const handleRoleSwitch = (role: UserRole, targetUrl: string) => {
    switchRole(role)
    setIsOpen(false)
    navigate(targetUrl)
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/staff/login')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-cream-border/40 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/40"
        aria-expanded={isOpen}
      >
        <Avatar
          src={currentUser.avatarUrl}
          name={currentUser.name}
          size="sm"
          status="online"
        />
        <div className="hidden md:flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-burgundy-dark truncate max-w-[120px]">
              {currentUser.name}
            </span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-gold/15 text-gold-dark font-bold">
              {currentUser.id}
            </span>
          </div>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-secondary-text">
            {currentUser.role}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-secondary-text hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-cream-card shadow-elevated border border-cream-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
          {/* User Info Header with Staff ID */}
          <div className="px-4 py-3 border-b border-cream-border/70 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-burgundy-dark">{currentUser.name}</p>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-gold/20 text-burgundy-dark border border-gold/40">
                {currentUser.id}
              </span>
            </div>
            <p className="text-[11px] text-secondary-text truncate">{currentUser.email}</p>
            {currentUser.shift && (
              <p className="text-[10px] font-semibold text-gold-dark pt-0.5">
                • {currentUser.shift}
              </p>
            )}
          </div>

          {/* Quick Role Switcher for Demo testing */}
          <div className="px-3 py-2 border-b border-cream-border/70">
            <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary-text/80">
              Workspace Switch
            </p>
            <div className="space-y-1">
              <button
                onClick={() => handleRoleSwitch('admin', '/admin/dashboard')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  currentUser.role === 'admin'
                    ? 'bg-burgundy text-cream font-semibold'
                    : 'text-main-text hover:bg-cream'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                  Admin Console
                </span>
                {currentUser.role === 'admin' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </button>

              <button
                onClick={() => handleRoleSwitch('waiter', '/waiter/dashboard')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  currentUser.role === 'waiter'
                    ? 'bg-burgundy text-cream font-semibold'
                    : 'text-main-text hover:bg-cream'
                }`}
              >
                <span className="flex items-center gap-2">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-gold" />
                  Waiter Terminal
                </span>
                {currentUser.role === 'waiter' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </button>

              <button
                onClick={() => handleRoleSwitch('kitchen', '/kitchen/dashboard')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  currentUser.role === 'kitchen'
                    ? 'bg-burgundy text-cream font-semibold'
                    : 'text-main-text hover:bg-cream'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ChefHat className="w-3.5 h-3.5 text-gold" />
                  Kitchen Display (KDS)
                </span>
                {currentUser.role === 'kitchen' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </button>
            </div>
          </div>

          {/* Links & Actions */}
          <div className="px-2 pt-1">
            <Link
              to="/"
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs text-secondary-text hover:text-burgundy hover:bg-cream rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                View Public Website
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-status-danger hover:bg-rose-50 rounded-lg transition-colors text-left font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out Session
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
