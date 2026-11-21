import React, { useState } from 'react'
import {
  PageHeader,
  StatCard,
  Button,
  Badge,
} from '@/components/common'
import { useAuthStore } from '@/store'
import {
  ChefHat,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Flame,
  ShieldCheck,
  Info,
} from 'lucide-react'

interface KDSTicket {
  id: string
  table: string
  elapsedMinutes: number
  server: string
  station: 'Grill' | 'Garde Manger' | 'Pastry'
  items: { name: string; quantity: number; notes?: string }[]
  status: 'preparing' | 'ready' | 'pending'
}

const INITIAL_TICKETS: KDSTicket[] = [
  {
    id: '#1043',
    table: 'Table 2',
    elapsedMinutes: 8,
    server: 'Sophie D.',
    station: 'Garde Manger',
    items: [
      { name: 'Pan-Seared Foie Gras', quantity: 1, notes: 'Extra fig chutney' },
      { name: 'Truffle Scallop Carpaccio', quantity: 2 },
    ],
    status: 'preparing',
  },
  {
    id: '#1042',
    table: 'Table 7',
    elapsedMinutes: 16,
    server: 'Sophie D.',
    station: 'Grill',
    items: [
      { name: 'Dry-Aged Wagyu Ribeye', quantity: 2, notes: 'Medium-rare, extra bordelaise' },
      { name: 'Duck Breast Confit', quantity: 1, notes: 'Skin extra crispy' },
    ],
    status: 'preparing',
  },
  {
    id: '#1040',
    table: 'Table 5',
    elapsedMinutes: 4,
    server: 'Laurent M.',
    station: 'Pastry',
    items: [
      { name: 'Grand Cru Dark Chocolate Soufflé', quantity: 2, notes: 'Fire now' },
      { name: 'Tarte Tatin aux Pommes', quantity: 1 },
    ],
    status: 'pending',
  },
]

export const KitchenDashboardPage: React.FC = () => {
  const { currentUser } = useAuthStore()
  const [stationFilter, setStationFilter] = useState<string>('All')

  const chefName = currentUser?.name || 'Chef Executive'
  const chefId = currentUser?.id || 'KTC001'

  const filteredTickets = INITIAL_TICKETS.filter(
    (t) => stationFilter === 'All' || t.station === stationFilter
  )

  const getTimerBadge = (minutes: number) => {
    if (minutes < 10) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Clock className="w-3 h-3 text-[#4F9564]" /> {minutes} min
        </span>
      )
    }
    if (minutes < 18) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
          <Clock className="w-3 h-3 text-[#D9A441]" /> {minutes} min
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 animate-pulse">
        <AlertTriangle className="w-3 h-3 text-[#D95353]" /> {minutes} min (Delayed)
      </span>
    )
  }

  return (
    <div className="space-y-8 text-left">
      <PageHeader
        title="Kitchen Display System (KDS)"
        subtitle={`Active Chef: ${chefName} (Station ID: ${chefId}) • Real-time ticket queue for line cooks and expeditor pass.`}
        breadcrumbs={[
          { label: 'Kitchen' },
          { label: 'KDS Dashboard' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/15 text-burgundy-dark border border-gold/30 text-xs font-semibold mr-1">
              <ShieldCheck className="w-4 h-4 text-gold-dark" />
              <span>Chef ID: <strong className="font-mono">{chefId}</strong></span>
            </span>
            <span className="text-xs font-semibold text-secondary-text">Station:</span>
            {['All', 'Grill', 'Garde Manger', 'Pastry'].map((st) => (
              <button
                key={st}
                onClick={() => setStationFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  stationFilter === st
                    ? 'bg-burgundy text-cream shadow-subtle'
                    : 'bg-cream-card text-secondary-text border border-cream-border hover:text-burgundy'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        }
      />

      {/* Prototype Scope Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3 text-xs shadow-2xs">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-burgundy-dark">Prototype Scope Note: Kitchen Display System (KDS)</h4>
          <p className="mt-0.5 text-secondary-text">
            Operational line cooking tickets and KDS workflows are intentionally excluded from this release scope. All active restaurant operations are focused on the Public Table Reservation experience, Admin Management Hub, and Waiter Dining Floor POS & Centralized Billing.
          </p>
        </div>
      </div>

      {/* KDS Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Tickets"
          value="5 Orders"
          change={{ value: "3 on Line", isPositive: true, label: "firing" }}
          description="Station load: 72%"
          icon={ChefHat}
        />
        <StatCard
          title="Avg Ticket Prep"
          value="14.2 min"
          change={{ value: "-1.8 min", isPositive: true, label: "vs target" }}
          description="Target: 16 min maximum"
          icon={Clock}
        />
        <StatCard
          title="Completed Today"
          value="64 Tickets"
          change={{ value: "100%", isPositive: true, label: "accuracy" }}
          description="Zero return remakes"
          icon={CheckCircle2}
        />
        <StatCard
          title="Expeditor Pass"
          value="2 Pending"
          change={{ value: "Hot Station", isPositive: true, label: "ready" }}
          description="Awaiting runner delivery"
          icon={Flame}
        />
      </div>

      {/* Live Ticket Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-burgundy-dark">
              Active KDS Order Tickets
            </h3>
            <Badge variant="danger" size="sm" dot>
              Live Expeditor
            </Badge>
          </div>
          <span className="text-xs text-secondary-text">
            Auto-refresh active (5s interval)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-2xl bg-cream-card border-2 border-cream-border p-5 shadow-subtle hover:shadow-premium transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between pb-3 border-b border-cream-border/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg font-bold text-burgundy-dark">
                        {ticket.table}
                      </span>
                      <span className="text-xs font-semibold text-secondary-text">
                        ({ticket.id})
                      </span>
                    </div>
                    <p className="text-[11px] text-secondary-text mt-0.5">
                      Server: {ticket.server} • {ticket.station}
                    </p>
                  </div>
                  {getTimerBadge(ticket.elapsedMinutes)}
                </div>

                {/* Items Checklist */}
                <div className="py-4 space-y-3">
                  {ticket.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-burgundy/10 text-burgundy font-bold text-xs">
                        {item.quantity}x
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-burgundy-dark leading-tight">
                          {item.name}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-status-danger font-medium mt-0.5 italic">
                            ★ {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-cream-border/80 flex items-center gap-2">
                <Button
                  variant="gold"
                  size="sm"
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  className="w-full shadow-gold"
                >
                  Mark Ready & Bump
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
