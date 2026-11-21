import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'
import { NavItem } from '@/types'
import { cn } from '@/utils'
import { useUIStore, useAuthStore } from '@/store'
import { X, Sparkles, ChefHat, ShieldCheck, UtensilsCrossed, LogOut } from 'lucide-react'

export interface SidebarProps {
  navItems: NavItem[]
  workspaceTitle?: string
  workspaceBadge?: string
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  workspaceTitle = 'Management',
  workspaceBadge,
  className,
}) => {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore()
  const { currentUser, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setMobileSidebarOpen(false)
    navigate('/staff/login')
  }

  const getWorkspaceIcon = () => {
    switch (currentUser?.role) {
      case 'kitchen':
        return <ChefHat className="w-3.5 h-3.5 text-gold" />
      case 'waiter':
        return <UtensilsCrossed className="w-3.5 h-3.5 text-gold" />
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-gold" />
    }
  }

  const renderBadge = (item: NavItem) => {
    if (!item.badge) return null

    const colorClasses = {
      gold: 'bg-gold text-burgundy-dark font-bold',
      burgundy: 'bg-burgundy text-cream',
      success: 'bg-status-success text-white',
      danger: 'bg-status-danger text-white',
    }

    const badgeClass = item.badgeColor ? colorClasses[item.badgeColor] : 'bg-gold/20 text-gold'

    return (
      <span
        className={cn(
          'ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 shadow-2xs',
          badgeClass
        )}
      >
        {item.badge}
      </span>
    )
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-burgundy-dark text-cream select-none">
      {/* Brand & Workspace Header */}
      <div>
        <div className="flex h-16 items-center justify-between border-b border-burgundy-border/60 px-5">
          <BrandLogo variant="light" to="/admin/dashboard" />
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded-lg p-1.5 text-cream/70 hover:bg-burgundy lg:hidden transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Pill */}
        <div className="mx-4 my-3 px-3 py-2 rounded-xl bg-burgundy/80 border border-burgundy-border/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getWorkspaceIcon()}
            <span className="text-xs font-semibold tracking-wide text-cream/90">
              {workspaceTitle}
            </span>
          </div>
          {workspaceBadge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gold/20 text-gold border border-gold/30">
              {workspaceBadge}
            </span>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-1 px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={cn(
                  'group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200',
                  isActive
                    ? 'bg-burgundy text-white font-semibold shadow-subtle border-l-3 border-l-gold'
                    : 'text-cream/70 hover:text-cream hover:bg-burgundy/50'
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive ? 'text-gold' : 'text-cream/60 group-hover:text-gold/80'
                    )}
                  />
                )}
                <span className="truncate">{item.title}</span>
                {renderBadge(item)}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Sidebar Footer with Active Staff Identity & Logout */}
      <div className="p-3.5 border-t border-burgundy-border/60 bg-burgundy-dark/95 space-y-2">
        {currentUser ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-burgundy/50 border border-burgundy-border/60 text-left">
            <div className="min-w-0 flex-1 pr-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-cream truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-gold/20 text-gold shrink-0">
                  {currentUser.id}
                </span>
              </div>
              <p className="text-[10px] text-cream/60 uppercase tracking-wider font-medium truncate">
                {currentUser.role}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-cream/70 hover:text-rose-400 hover:bg-rose-950/40 transition-colors shrink-0"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-burgundy/40 border border-burgundy-border/50 text-left">
            <div className="w-2 h-2 rounded-full bg-status-success animate-pulse shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-cream truncate">
                BistroHub Cloud
              </p>
              <p className="text-[10px] text-cream/60 truncate flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-gold" /> Service Online (Live)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-40 border-r border-burgundy-border/80 shadow-elevated',
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-burgundy-dark/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 shadow-elevated animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
