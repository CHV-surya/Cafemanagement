import React, { useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import {
  DAILY_SALES_HISTORY,
  REVENUE_SUMMARY_STATS,
  DailySalesDataPoint,
} from '@/data/adminDashboardData'
import { TrendingUp } from 'lucide-react'

// Custom tooltip component matching BistroHub design system
const CustomSalesTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: any[]
  label?: string
}) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as DailySalesDataPoint
    return (
      <div className="rounded-xl bg-cream-card p-3.5 border border-cream-border shadow-elevated text-left min-w-[200px]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-cream-border">
          <span className="font-display text-xs font-bold text-burgundy-dark">
            {label} ({dataPoint.date})
          </span>
          <span className="text-[10px] font-semibold text-gold-dark bg-gold/15 px-2 py-0.5 rounded-md">
            {dataPoint.orders} Orders
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-secondary-text">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D9A441]" />
              Total Revenue:
            </span>
            <span className="font-bold text-burgundy-dark">
              ₹{dataPoint.revenue.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-secondary-text pl-3.5">
            <span>• Dine-in:</span>
            <span className="font-semibold text-main-text">
              ₹{dataPoint.dineInRevenue.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-secondary-text pl-3.5">
            <span>• Takeaway:</span>
            <span className="font-semibold text-main-text">
              ₹{dataPoint.takeawayRevenue.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="pt-1.5 mt-1 border-t border-cream-border/70 flex items-center justify-between text-[10px] text-secondary-text">
            <span>Total Covers / Guests:</span>
            <span className="font-bold text-burgundy">{dataPoint.covers} guests</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export const SalesAnalyticsChart: React.FC = () => {
  const [chartMode, setChartMode] = useState<'revenue' | 'orders' | 'breakdown'>('revenue')

  return (
    <div className="rounded-2xl bg-cream-card p-5 sm:p-6 border border-cream-border shadow-subtle text-left space-y-6">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-burgundy-dark">
              Sales & Order Performance
            </h3>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#4F9564]" /> +14.2% vs last week
            </span>
          </div>
          <p className="text-xs text-secondary-text mt-0.5">
            Daily revenue in INR (₹) and order count distribution for the last 7 days.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="inline-flex rounded-xl bg-cream p-1 border border-cream-border shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartMode('revenue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartMode === 'revenue'
                ? 'bg-burgundy text-cream shadow-2xs'
                : 'text-secondary-text hover:text-burgundy'
            }`}
          >
            Revenue (₹)
          </button>
          <button
            type="button"
            onClick={() => setChartMode('breakdown')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartMode === 'breakdown'
                ? 'bg-burgundy text-cream shadow-2xs'
                : 'text-secondary-text hover:text-burgundy'
            }`}
          >
            Dine-in vs Takeaway
          </button>
          <button
            type="button"
            onClick={() => setChartMode('orders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartMode === 'orders'
                ? 'bg-burgundy text-cream shadow-2xs'
                : 'text-secondary-text hover:text-burgundy'
            }`}
          >
            Order Volume
          </button>
        </div>
      </div>

      {/* Revenue Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl bg-cream/50 p-3 border border-cream-border/70">
          <p className="text-[11px] font-medium text-secondary-text">7-Day Total Revenue</p>
          <p className="font-display text-base sm:text-lg font-bold text-burgundy-dark mt-0.5">
            ₹{REVENUE_SUMMARY_STATS.totalWeeklyRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-0.5">
            <TrendingUp className="w-2.5 h-2.5" /> +12.5% target met
          </p>
        </div>

        <div className="rounded-xl bg-cream/50 p-3 border border-cream-border/70">
          <p className="text-[11px] font-medium text-secondary-text">Daily Average</p>
          <p className="font-display text-base sm:text-lg font-bold text-burgundy-dark mt-0.5">
            ₹{REVENUE_SUMMARY_STATS.avgDailyRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-secondary-text mt-0.5">Across 7 operating days</p>
        </div>

        <div className="rounded-xl bg-cream/50 p-3 border border-cream-border/70">
          <p className="text-[11px] font-medium text-secondary-text">Peak Sales Day</p>
          <p className="font-display text-base sm:text-lg font-bold text-gold-dark mt-0.5">
            {REVENUE_SUMMARY_STATS.peakSalesDay}
          </p>
          <p className="text-[10px] text-secondary-text mt-0.5">Dinner cover capacity 98%</p>
        </div>

        <div className="rounded-xl bg-cream/50 p-3 border border-cream-border/70">
          <p className="text-[11px] font-medium text-secondary-text">Average Ticket Value</p>
          <p className="font-display text-base sm:text-lg font-bold text-burgundy-dark mt-0.5">
            ₹{REVENUE_SUMMARY_STATS.avgOrderValue.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-secondary-text mt-0.5">Dine-in: 78% • Takeaway: 22%</p>
        </div>
      </div>

      {/* Main Responsive Recharts Viewport */}
      <div className="h-[280px] sm:h-[320px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'revenue' ? (
            <AreaChart data={DAILY_SALES_HISTORY} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D9A441" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D9A441" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFE4D6" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#827875', fontSize: 11 }}
                axisLine={{ stroke: '#EFE4D6' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#827875', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${val / 1000}k`}
              />
              <Tooltip content={<CustomSalesTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Total Revenue"
                stroke="#D9A441"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGradient)"
                activeDot={{ r: 6, fill: '#421E20', stroke: '#D9A441', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : chartMode === 'breakdown' ? (
            <BarChart data={DAILY_SALES_HISTORY} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFE4D6" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#827875', fontSize: 11 }}
                axisLine={{ stroke: '#EFE4D6' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#827875', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${val / 1000}k`}
              />
              <Tooltip content={<CustomSalesTooltip />} />
              <Bar
                dataKey="dineInRevenue"
                name="Dine-in Revenue"
                fill="#421E20"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="takeawayRevenue"
                name="Takeaway Revenue"
                fill="#D9A441"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <AreaChart data={DAILY_SALES_HISTORY} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#421E20" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#421E20" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFE4D6" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#827875', fontSize: 11 }}
                axisLine={{ stroke: '#EFE4D6' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#827875', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${val}`}
              />
              <Tooltip content={<CustomSalesTooltip />} />
              <Area
                type="monotone"
                dataKey="orders"
                name="Completed Orders"
                stroke="#421E20"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#ordersGradient)"
                activeDot={{ r: 6, fill: '#D9A441', stroke: '#421E20', strokeWidth: 2 }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend & Note */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-cream-border text-xs text-secondary-text">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#421E20]" />
            Dine-in Operations
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9A441]" />
            Takeaway & Express
          </span>
        </div>
        <span className="text-[11px] italic">
          * Analytics computed from settled point-of-sale shift receipts.
        </span>
      </div>
    </div>
  )
}
