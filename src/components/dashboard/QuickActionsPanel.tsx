import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UtensilsCrossed,
  BookOpen,
  Grid3X3,
  CalendarDays,
  Users,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

export interface QuickActionItem {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  color: string
}

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    title: 'Manage Menu',
    description: 'Update dishes, seasonal pricing & availability',
    icon: BookOpen,
    path: '/admin/menu',
    color: 'text-gold-dark bg-gold/10 border-gold/30',
  },
  {
    title: 'View Orders',
    description: 'Active tickets, order dispatch & kitchen queue',
    icon: UtensilsCrossed,
    path: '/admin/orders',
    color: 'text-burgundy bg-burgundy/10 border-burgundy/20',
  },
  {
    title: 'Manage Tables',
    description: 'Floor layout, section zoning & seating status',
    icon: Grid3X3,
    path: '/admin/tables',
    color: 'text-gold-dark bg-gold/10 border-gold/30',
  },
  {
    title: 'View Reservations',
    description: 'Guest bookings, waitlists & party requests',
    icon: CalendarDays,
    path: '/admin/reservations',
    color: 'text-burgundy bg-burgundy/10 border-burgundy/20',
  },
  {
    title: 'Manage Staff',
    description: 'Employee rosters, shifts & server access',
    icon: Users,
    path: '/admin/staff',
    color: 'text-gold-dark bg-gold/10 border-gold/30',
  },
]

export const QuickActionsPanel: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="rounded-2xl bg-cream-card p-5 sm:p-6 border border-cream-border shadow-subtle text-left space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-cream-border">
        <div>
          <h3 className="font-display text-lg font-bold text-burgundy-dark">
            Management Quick Actions
          </h3>
          <p className="text-xs text-secondary-text mt-0.5">
            Direct shortcuts to restaurant operational modules.
          </p>
        </div>
        <span className="text-xs font-semibold text-gold-dark bg-gold/15 px-2.5 py-1 rounded-lg border border-gold/30 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> 5 Modules
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.title}
              type="button"
              onClick={() => navigate(action.path)}
              className="group p-4 rounded-xl border border-cream-border bg-cream/30 hover:bg-cream-card hover:border-gold/50 hover:shadow-subtle transition-all duration-200 text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border ${action.color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-secondary-text/50 group-hover:text-gold-dark group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="font-display text-sm font-bold text-burgundy-dark group-hover:text-gold-dark transition-colors">
                  {action.title}
                </h4>
                <p className="text-[11px] text-secondary-text mt-1 leading-snug line-clamp-2">
                  {action.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-cream-border/60 text-[10px] font-bold text-gold-dark uppercase tracking-wider group-hover:underline">
                Open Workspace →
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
