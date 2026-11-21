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
  CheckCircle2,
  BellRing,
  Receipt,
  IdCard,
} from 'lucide-react'

export const WaiterOrdersPage: React.FC = () => {
  const { currentUser } = useAuthStore()
  const { orders } = useOrderStore()

  // Waiter identity - strictly enforced
  const waiterId = currentUser?.id || 'WTR001'
  const waiterName = currentUser?.name || 'Sophie Dubois'

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderForAddingItems, setOrderForAddingItems] = useState<Order | null>(null)

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Data Isolation: Filter orders strictly assigned to this waiter
  const myOrders = useMemo(() => {
    return orders.filter((o) => o.waiterId === waiterId)
  }, [orders, waiterId])

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return myOrders.filter((order) => {
      const matchesSearch =
        searchQuery === '' ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.tableNumber && order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [myOrders, searchQuery, statusFilter])

  // KPI Metrics for this waiter
  const metrics = useMemo(() => {
    const total = myOrders.length
    const active = myOrders.filter(
      (o) =>
        o.status === 'pending' ||
        o.status === 'confirmed' ||
        o.status === 'preparing' ||
        o.status === 'ready' ||
        o.status === 'served'
    ).length
    const ready = myOrders.filter((o) => o.status === 'ready').length
    const completed = myOrders.filter((o) => o.status === 'completed').length
    const sales = myOrders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.totalAmount, 0)

    return { total, active, ready, completed, sales }
  }, [myOrders])

  // Ready orders awaiting server delivery
  const readyOrders = useMemo(() => {
    return myOrders.filter((o) => o.status === 'ready')
  }, [myOrders])

  // Count by status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: myOrders.length,
      active: metrics.active,
      ready: metrics.ready,
      completed: metrics.completed,
      cancelled: myOrders.filter((o) => o.status === 'cancelled').length,
    }
    return counts
  }, [myOrders, metrics])

  const statusTabs = [
    { key: 'all', label: 'All My Tickets', count: statusCounts.all },
    { key: 'ready', label: 'Ready for Service', count: statusCounts.ready },
    { key: 'completed', label: 'Settled / Completed', count: statusCounts.completed },
    { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
  ]

  return (
    <div className="space-y-8 text-left pb-10">
      {/* Page Header */}
      <PageHeader
        title="My Orders Terminal"
        subtitle={`Floor server order tracking for ${waiterName} (Staff ID: ${waiterId}).`}
        breadcrumbs={[
          { label: 'Waiter' },
          { label: 'My Orders' },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/15 text-burgundy-dark border border-gold/30 text-xs font-semibold">
              <IdCard className="w-4 h-4 text-gold-dark" />
              <span>Server ID: <strong className="font-mono">{waiterId}</strong></span>
            </span>

            <Button
              variant="gold"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="shadow-gold text-xs py-1.5"
            >
              Take New Order
            </Button>
          </div>
        }
      />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Total Tickets"
          value={`${metrics.total} Orders`}
          change={{ value: `${metrics.completed} settled`, isPositive: true }}
          description="Taken during this shift"
          icon={Receipt}
        />
        <StatCard
          title="Active in Service"
          value={`${metrics.active} Tickets`}
          change={{
            value: `${metrics.ready} Ready for pickup`,
            isPositive: metrics.ready === 0,
          }}
          description="Across your section"
          icon={UtensilsCrossed}
        />
        <StatCard
          title="Hot Pass Ready"
          value={`${metrics.ready} Ready`}
          change={{ value: "Runner alert", isPositive: metrics.ready === 0 }}
          description="Plated & waiting"
          icon={BellRing}
        />
        <StatCard
          title="Today's Settled Sales"
          value={`₹${metrics.sales.toLocaleString('en-IN')}`}
          change={{
            value: `₹${metrics.completed ? Math.round(metrics.sales / metrics.completed).toLocaleString('en-IN') : 0}`,
            isPositive: true,
            label: 'avg',
          }}
          description="From fulfilled covers"
          icon={CheckCircle2}
        />
      </div>

      {/* Urgent Ready Banner if any ticket is ready */}
      {readyOrders.length > 0 && (
        <div className="rounded-2xl bg-gold/15 border border-gold/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gold text-burgundy-dark font-bold shrink-0 shadow-xs">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-burgundy-dark">
                Food Plated & Ready for Service!
              </h4>
              <p className="text-xs text-secondary-text mt-0.5">
                {readyOrders.map((ro) => `${ro.tableNumber || 'Table'} (${ro.itemsSummary})`).join(' • ')}
              </p>
            </div>
          </div>

          <Button
            variant="gold"
            size="sm"
            onClick={() => setSelectedOrder(readyOrders[0])}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            className="shrink-0 text-xs py-1.5"
          >
            Serve First Ticket
          </Button>
        </div>
      )}

      {/* Orders Table Container */}
      <div className="rounded-2xl bg-cream-card p-5 sm:p-6 border border-cream-border shadow-subtle space-y-5">
        {/* Top Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-border">
          <div className="w-full sm:w-80">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by ticket ID, table, or dish..."
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {statusTabs.map((tab) => {
              const isActive = statusFilter === tab.key
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
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Table */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            title="No Matching Tickets"
            description="You have no tickets matching this search or filter in your section."
            icon={UtensilsCrossed}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                }}
              >
                Reset Filter
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <table className="w-full text-left text-xs border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b border-cream-border bg-cream/40 text-secondary-text font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Station / Table</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 max-w-xs">Dishes Summary</th>
                  <th className="py-3 px-4">Amount</th>
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
                      <td className="py-3.5 px-4 font-mono font-bold text-burgundy-dark whitespace-nowrap">
                        {order.id}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-burgundy-dark whitespace-nowrap">
                        {order.tableNumber || order.orderType}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-burgundy-dark">{order.customerName}</p>
                        {order.customerPhone && (
                          <p className="text-[10px] text-secondary-text font-mono">{order.customerPhone}</p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="truncate text-main-text font-medium" title={order.itemsSummary}>
                          {order.itemsSummary}
                        </p>
                        <span className="text-[10px] text-secondary-text">
                          {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-display font-bold text-burgundy-dark text-sm whitespace-nowrap">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={order.status} pulse={isReady} />
                      </td>

                      <td className="py-3.5 px-4 text-secondary-text whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-gold-dark" />
                          {order.orderTime}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Button
                          variant={isReady ? 'gold' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                          className="py-1 px-2.5 text-xs font-semibold"
                        >
                          {isReady ? 'Serve' : 'Details'}
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

      {/* Create Order Modal */}
      <OrderCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        userRole="waiter"
        waiterId={waiterId}
        waiterName={waiterName}
      />

      {/* Order Details & Lifecycle Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={orders.find((o) => o.id === selectedOrder.id) || selectedOrder}
          userRole="waiter"
          staffId={waiterId}
          staffName={waiterName}
          onAddMoreItems={(ord) => setOrderForAddingItems(ord)}
        />
      )}

      {/* Add More Items to Order Modal */}
      {orderForAddingItems && (
        <AddItemsToOrderModal
          isOpen={!!orderForAddingItems}
          onClose={() => setOrderForAddingItems(null)}
          order={orders.find((o) => o.id === orderForAddingItems.id) || orderForAddingItems}
          staffId={waiterId}
          staffName={waiterName}
        />
      )}
    </div>
  )
}
