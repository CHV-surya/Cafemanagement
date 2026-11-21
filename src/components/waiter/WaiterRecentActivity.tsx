import React, { useMemo } from 'react'
import { getActivitiesForWaiter, WaiterActivityLog } from '@/data/waiterData'
import {
  Clock,
  UtensilsCrossed,
  Flame,
  CheckCircle2,
  Users,
  BellRing,
  Activity,
} from 'lucide-react'

export interface WaiterRecentActivityProps {
  waiterId: string
  waiterName: string
}

export const WaiterRecentActivity: React.FC<WaiterRecentActivityProps> = ({
  waiterId,
  waiterName,
}) => {
  // Isolate activities strictly to this waiter
  const activities = useMemo(() => {
    return getActivitiesForWaiter(waiterId)
  }, [waiterId])

  const getActivityIcon = (type: WaiterActivityLog['type'], _status: WaiterActivityLog['status']) => {
    switch (type) {
      case 'order_placed':
        return <UtensilsCrossed className="w-3.5 h-3.5 text-sky-700" />
      case 'sent_to_kitchen':
        return <Flame className="w-3.5 h-3.5 text-rose-700" />
      case 'food_served':
        return <BellRing className="w-3.5 h-3.5 text-gold-dark" />
      case 'table_assigned':
        return <Users className="w-3.5 h-3.5 text-burgundy-dark" />
      case 'order_completed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
      default:
        return <Activity className="w-3.5 h-3.5 text-secondary-text" />
    }
  }

  const getStatusBg = (status: WaiterActivityLog['status']) => {
    switch (status) {
      case 'warning':
        return 'bg-amber-100 border-amber-300'
      case 'success':
        return 'bg-emerald-100 border-emerald-300'
      case 'primary':
        return 'bg-rose-100 border-rose-300'
      case 'info':
      default:
        return 'bg-sky-100 border-sky-300'
    }
  }

  return (
    <div className="rounded-2xl bg-cream-card p-5 sm:p-6 border border-cream-border shadow-subtle text-left space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cream-border">
        <div>
          <h3 className="font-display text-lg font-bold text-burgundy-dark">
            Recent Service Log
          </h3>
          <p className="text-xs text-secondary-text mt-0.5">
            Shift events recorded for Server {waiterName} ({waiterId}).
          </p>
        </div>
        <span className="text-[11px] font-semibold text-secondary-text bg-cream px-2 py-0.5 rounded-lg border border-cream-border">
          {activities.length} Entries
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3">
        {activities.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-cream/40 border border-cream-border/70 hover:bg-cream-card hover:shadow-2xs transition-all flex items-start gap-3"
          >
            {/* Icon Bubble */}
            <div
              className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getStatusBg(
                item.status
              )}`}
            >
              {getActivityIcon(item.type, item.status)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-burgundy-dark truncate">
                  {item.title}
                </span>
                <span className="text-[10px] text-secondary-text font-mono shrink-0 whitespace-nowrap">
                  {item.timestamp}
                </span>
              </div>

              <p className="text-[11px] text-main-text/90 mt-0.5 leading-snug">
                {item.description}
              </p>

              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-secondary-text font-semibold">
                <span className="bg-cream-card px-1.5 py-0.5 rounded border border-cream-border text-burgundy-dark font-bold">
                  {item.tableNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-gold-dark" />
                  {item.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
