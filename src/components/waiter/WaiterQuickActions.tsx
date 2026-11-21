import React from 'react'
import {
  Grid3X3,
  UtensilsCrossed,
  PlusCircle,
  History,
  ChevronRight,
  Zap,
} from 'lucide-react'

export interface WaiterQuickActionsProps {
  onScrollToTables: () => void
  onScrollToOrders: () => void
  onOpenNewOrder: () => void
  onOpenHistory: () => void
}

export const WaiterQuickActions: React.FC<WaiterQuickActionsProps> = ({
  onScrollToTables,
  onScrollToOrders,
  onOpenNewOrder,
  onOpenHistory,
}) => {
  return (
    <div className="rounded-2xl bg-cream-card p-5 sm:p-6 border border-cream-border shadow-subtle text-left space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-cream-border">
        <div>
          <h3 className="font-display text-lg font-bold text-burgundy-dark">
            Floor Operations
          </h3>
          <p className="text-xs text-secondary-text mt-0.5">
            Rapid service actions and table dispatch shortcuts.
          </p>
        </div>
        <span className="text-xs font-semibold text-gold-dark bg-gold/15 px-2.5 py-1 rounded-lg border border-gold/30 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" /> 4 Actions
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Action 1: Create New Order */}
        <button
          type="button"
          onClick={onOpenNewOrder}
          className="group p-4 rounded-xl border border-gold/40 bg-gold/10 hover:bg-gold/20 hover:border-gold hover:shadow-subtle transition-all duration-200 text-left flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-gold/40 bg-gold text-burgundy-dark font-bold group-hover:scale-110 transition-transform">
                <PlusCircle className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-secondary-text group-hover:text-gold-dark group-hover:translate-x-0.5 transition-all" />
            </div>
            <h4 className="font-display text-sm font-bold text-burgundy-dark group-hover:text-gold-dark transition-colors">
              Create New Order
            </h4>
            <p className="text-[11px] text-secondary-text mt-1 leading-snug">
              Punch new ticket for an assigned table & send to kitchen line.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-gold/30 text-[10px] font-bold text-gold-dark uppercase tracking-wider group-hover:underline">
            Launch Terminal →
          </div>
        </button>

        {/* Action 2: View My Tables */}
        <button
          type="button"
          onClick={onScrollToTables}
          className="group p-4 rounded-xl border border-cream-border bg-cream/30 hover:bg-cream-card hover:border-cream-border/80 hover:shadow-subtle transition-all duration-200 text-left flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-burgundy/20 bg-burgundy/10 text-burgundy group-hover:scale-110 transition-transform">
                <Grid3X3 className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-secondary-text/50 group-hover:text-gold-dark group-hover:translate-x-0.5 transition-all" />
            </div>
            <h4 className="font-display text-sm font-bold text-burgundy-dark group-hover:text-gold-dark transition-colors">
              View My Tables
            </h4>
            <p className="text-[11px] text-secondary-text mt-1 leading-snug">
              Review assigned floor sections, occupancy status & seating.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-cream-border/60 text-[10px] font-bold text-gold-dark uppercase tracking-wider group-hover:underline">
            Floor Grid →
          </div>
        </button>

        {/* Action 3: View Active Orders */}
        <button
          type="button"
          onClick={onScrollToOrders}
          className="group p-4 rounded-xl border border-cream-border bg-cream/30 hover:bg-cream-card hover:border-cream-border/80 hover:shadow-subtle transition-all duration-200 text-left flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-sky-300 bg-sky-50 text-sky-800 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-secondary-text/50 group-hover:text-gold-dark group-hover:translate-x-0.5 transition-all" />
            </div>
            <h4 className="font-display text-sm font-bold text-burgundy-dark group-hover:text-gold-dark transition-colors">
              View Active Orders
            </h4>
            <p className="text-[11px] text-secondary-text mt-1 leading-snug">
              Track tickets preparing in kitchen and ready at expediter pass.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-cream-border/60 text-[10px] font-bold text-gold-dark uppercase tracking-wider group-hover:underline">
            Kitchen Queue →
          </div>
        </button>

        {/* Action 4: View Order History */}
        <button
          type="button"
          onClick={onOpenHistory}
          className="group p-4 rounded-xl border border-cream-border bg-cream/30 hover:bg-cream-card hover:border-cream-border/80 hover:shadow-subtle transition-all duration-200 text-left flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-cream-border bg-cream text-secondary-text group-hover:scale-110 transition-transform">
                <History className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-secondary-text/50 group-hover:text-gold-dark group-hover:translate-x-0.5 transition-all" />
            </div>
            <h4 className="font-display text-sm font-bold text-burgundy-dark group-hover:text-gold-dark transition-colors">
              Order History
            </h4>
            <p className="text-[11px] text-secondary-text mt-1 leading-snug">
              Settled checks and fulfilled covers completed during this shift.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-cream-border/60 text-[10px] font-bold text-gold-dark uppercase tracking-wider group-hover:underline">
            View Settled →
          </div>
        </button>
      </div>
    </div>
  )
}
