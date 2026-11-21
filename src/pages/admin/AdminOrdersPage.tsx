import React, { useState, useMemo } from 'react'
import {
  PageHeader,
  StatCard,
  Button,
  StatusBadge,
  SearchBar,
  EmptyState,
} from '@/components/common'
import {
  OrderCreateModal,
  OrderDetailsModal,
  AddItemsToOrderModal,
} from '@/components/orders'
import { useOrderStore, useAuthStore } from '@/store'
import { Order } from '@/types/order'
import {
  UtensilsCrossed,
  Plus,
  Eye,
  Clock,
  DollarSign,
  Receipt,
  CheckCircle2,
  Flame,
} from 'lucide-react'

export const AdminOrdersPage: React.FC = () => {
  const { currentUser } = useAuthStore()
  const { orders } = useOrderStore()

  const adminName = currentUser?.name || 'Laurent Moreau'
  const adminId = currentUser?.id || 'ADM001'

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderForAddingItems, setOrderForAddingItems] = useState<Order | null>(null)

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<'all' | 'today'>('today')

  const todayDateStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Search Query
      const matchesSearch =
        searchQuery === '' ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.tableNumber && order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.waiterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.waiterId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase())

      // 2. Status Filter
      const matchesStatus =
        statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase()

      // 3. Type Filter
      const matchesType =
        typeFilter === 'all' || order.orderType === typeFilter

      // 4. Date Filter
      const orderDateStr = order.createdAt.split('T')[0]
      const matchesDate = dateFilter === 'all' || orderDateStr === todayDateStr

      return matchesSearch && matchesStatus && matchesType && matchesDate
    })
  }, [orders, searchQuery, statusFilter, typeFilter, dateFilter, todayDateStr])

  // Aggregate KPI Metrics
  const metrics = useMemo(() => {
    const total = orders.length
    const active = orders.filter(
      (o) =>
        o.status === 'pending' ||
        o.status === 'confirmed' ||
        o.status === 'preparing' ||
        o.status === 'ready' ||
        o.status === 'served'
    ).length
    const preparing = orders.filter((o) => o.status === 'preparing').length
    const ready = orders.filter((o) => o.status === 'ready').length
    const completed = orders.filter((o) => o.status === 'completed').length
    const todayRevenue = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.totalAmount, 0)

    return { total, active, preparing, ready, completed, todayRevenue }
  }, [orders])

  // Count by status for tabs
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: orders.length,
      pending: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      served: 0,
      completed: 0,
      cancelled: 0,
    }
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status] += 1
      }
    })
    return counts
  }, [orders])

  const statusTabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'served', label: 'Served' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="space-y-8 text-left pb-10">
      {/* Page Header */}
      <PageHeader
        title="Orders Central Hub"
        subtitle="Single source of truth for restaurant ticket dispatch, real-time lifecycle tracking, and checks."
        breadcrumbs={[
          { label: 'Admin' },
          { label: 'Orders Hub' },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="gold"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="shadow-gold text-xs py-1.5"
            >
              New Order Ticket
            </Button>
          </div>
        }
      />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Orders"
          value={`${metrics.total} Orders`}
          change={{ value: `${orders.length} in database`, isPositive: true }}
          description="Across all shifts"
          icon={Receipt}
        />
        <StatCard
          title="Active Tickets"
          value={`${metrics.active} Active`}
          change={{ value: `${metrics.ready} Ready at pass`, isPositive: metrics.ready === 0 }}
          description="In service queue"
          icon={UtensilsCrossed}
        />
        <StatCard
          title="Kitchen Firing"
          value={`${metrics.preparing} Tickets`}
          change={{ value: "On line", isPositive: true }}
          description="Line stations active"
          icon={Flame}
        />
        <StatCard
          title="Completed Today"
          value={`${metrics.completed} Settled`}
          change={{ value: "100% fulfilled", isPositive: true }}
          description="Checks paid in full"
          icon={CheckCircle2}
        />
        <StatCard
          title="Settled Revenue"
          value={`₹${metrics.todayRevenue.toLocaleString('en-IN')}`}
          change={{ value: "+14.5% vs avg", isPositive: true }}
          description="From completed orders"
          icon={DollarSign}
        />
      </div>

      {/* Main Orders Table & Filter Section */}
      <div className="rounded-2xl bg-cream-card p-5 sm:p-6 border border-cream-border shadow-subtle space-y-5">
        {/* Top Control Bar: Search & Selectors */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cream-border">
          <div className="w-full md:w-80">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by ID, customer, table, waiter..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Order Type Filter */}
            <div className="flex items-center gap-1.5 bg-cream px-2 py-1 rounded-xl border border-cream-border">
              <span className="text-secondary-text font-semibold">Type:</span>
              {(['all', 'Dine-in', 'Takeaway', 'Delivery'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
                    typeFilter === t
                      ? 'bg-burgundy text-cream shadow-2xs'
                      : 'text-secondary-text hover:text-burgundy'
                  }`}
                >
                  {t === 'all' ? 'All' : t}
                </button>
              ))}
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-1.5 bg-cream px-2 py-1 rounded-xl border border-cream-border">
              <span className="text-secondary-text font-semibold">Date:</span>
              <button
                type="button"
                onClick={() => setDateFilter('today')}
                className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
                  dateFilter === 'today'
                    ? 'bg-burgundy text-cream shadow-2xs'
                    : 'text-secondary-text hover:text-burgundy'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDateFilter('all')}
                className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
                  dateFilter === 'all'
                    ? 'bg-burgundy text-cream shadow-2xs'
                    : 'text-secondary-text hover:text-burgundy'
                }`}
              >
                All Time
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.key
            const count = statusCounts[tab.key] || 0
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-burgundy text-cream shadow-2xs'
                    : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-cream/20 text-cream' : 'bg-cream-border/70 text-secondary-text'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            title="No Orders Found"
            description="No orders currently match the specified search or filter criteria."
            icon={UtensilsCrossed}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setTypeFilter('all')
                  setDateFilter('all')
                }}
              >
                Reset All Filters
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <table className="w-full text-left text-xs border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-cream-border bg-cream/40 text-secondary-text font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Station / Table</th>
                  <th className="py-3 px-4">Server</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 max-w-xs">Dishes & Quantity</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-border/70">
                {filteredOrders.map((order) => {
                  const itemsCount = order.items.reduce((s, it) => s + it.quantity, 0)
                  const isReady = order.status === 'ready'

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-cream/30 transition-colors ${
                        isReady ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-burgundy-dark whitespace-nowrap">
                        {order.id}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-burgundy-dark">{order.customerName}</p>
                        {order.customerPhone && (
                          <p className="text-[10px] text-secondary-text font-mono">{order.customerPhone}</p>
                        )}
                      </td>

                      {/* Table */}
                      <td className="py-3.5 px-4 font-semibold text-burgundy-dark whitespace-nowrap">
                        {order.tableNumber || 'Takeaway Counter'}
                      </td>

                      {/* Waiter */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-main-text">{order.waiterName}</p>
                        <p className="text-[10px] text-secondary-text font-mono">{order.waiterId}</p>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cream border border-cream-border text-secondary-text">
                          {order.orderType}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="truncate text-main-text font-medium" title={order.itemsSummary}>
                          {order.itemsSummary}
                        </p>
                        <span className="text-[10px] text-secondary-text">
                          {itemsCount} {itemsCount === 1 ? 'dish' : 'dishes'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-display font-bold text-burgundy-dark text-sm whitespace-nowrap">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={order.status} pulse={isReady} />
                      </td>

                      {/* Time */}
                      <td className="py-3.5 px-4 text-secondary-text whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-gold-dark" />
                          {order.orderTime}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Button
                          variant={isReady ? 'gold' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                          className="py-1 px-2.5 text-xs font-semibold"
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Create Modal (Admin Mode) */}
      <OrderCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        userRole="admin"
        waiterId={adminId}
        waiterName={adminName}
      />

      {/* Order Details & Lifecycle Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={orders.find((o) => o.id === selectedOrder.id) || selectedOrder}
          userRole="admin"
          staffId={adminId}
          staffName={adminName}
          onAddMoreItems={(ord) => setOrderForAddingItems(ord)}
        />
      )}

      {/* Add More Items to Order Modal */}
      {orderForAddingItems && (
        <AddItemsToOrderModal
          isOpen={!!orderForAddingItems}
          onClose={() => setOrderForAddingItems(null)}
          order={orders.find((o) => o.id === orderForAddingItems.id) || orderForAddingItems}
          staffId={adminId}
          staffName={adminName}
        />
      )}
    </div>
  )
}
