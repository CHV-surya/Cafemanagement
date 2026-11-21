import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  SearchBar,
  StatusBadge,
  Button,
  EmptyState,
} from '@/components/common'
import { OrderDetailsModal } from '@/components/orders/OrderDetailsModal'
import { AddItemsToOrderModal } from '@/components/orders/AddItemsToOrderModal'
import { useOrderStore, useAuthStore } from '@/store'
import { Order } from '@/types/order'
import {
  UtensilsCrossed,
  Eye,
  Clock,
  ArrowUpRight,
} from 'lucide-react'

export const RecentOrdersTable: React.FC = () => {
  const { orders } = useOrderStore()
  const { currentUser } = useAuthStore()

  const adminName = currentUser?.name || 'Laurent Moreau'
  const adminId = currentUser?.id || 'ADM001'

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderForAddingItems, setOrderForAddingItems] = useState<Order | null>(null)

  // Filter orders based on search query and status filter
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchQuery === '' ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.tableNumber && order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus =
        statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, statusFilter])

  // Count active orders for filter tabs
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: orders.length,
      pending: 0,
      preparing: 0,
      ready: 0,
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

  const filterTabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ]

  const getOrderTypeBadge = (type: Order['orderType']) => {
    switch (type) {
      case 'Dine-in':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-burgundy/10 text-burgundy-dark border border-burgundy/20">
            Dine-in
          </span>
        )
      case 'Takeaway':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gold/15 text-gold-dark border border-gold/30">
            Takeaway
          </span>
        )
      case 'Delivery':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            Delivery
          </span>
        )
    }
  }

  return (
    <div className="rounded-2xl bg-cream-card p-5 sm:p-6 border border-cream-border shadow-subtle text-left space-y-5">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cream-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-burgundy-dark">
              Recent Orders
            </h3>
            <span className="text-xs font-semibold text-secondary-text bg-cream px-2.5 py-0.5 rounded-full border border-cream-border">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'record' : 'records'}
            </span>
          </div>
          <p className="text-xs text-secondary-text mt-0.5">
            Real-time feed from centralized order store across tables, takeaway, and delivery.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-72">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by ID, guest, or dish..."
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {filterTabs.map((tab) => {
          const isActive = statusFilter === tab.key
          const count = statusCounts[tab.key] || 0
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-burgundy text-cream shadow-2xs'
                  : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy hover:bg-cream-card'
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

      {/* Orders Table Container */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No Orders Found"
          description={
            searchQuery
              ? `No orders matching "${searchQuery}". Try a different keyword.`
              : 'There are no orders with this status.'
          }
          icon={UtensilsCrossed}
          action={
            searchQuery || statusFilter !== 'all' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                }}
              >
                Reset Filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-left text-xs border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-cream-border bg-cream/40 text-secondary-text font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 max-w-xs">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Order Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-border/70">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-cream/30 transition-colors group"
                >
                  {/* Order ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-burgundy-dark">
                    {order.id}
                  </td>

                  {/* Customer & Destination */}
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-burgundy-dark">{order.customerName}</p>
                    <p className="text-[11px] text-secondary-text">{order.tableNumber || 'Takeaway'}</p>
                  </td>

                  {/* Order Type */}
                  <td className="py-3.5 px-4">
                    {getOrderTypeBadge(order.orderType)}
                  </td>

                  {/* Items Summary */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="truncate text-main-text font-medium" title={order.itemsSummary}>
                      {order.itemsSummary}
                    </p>
                    <span className="text-[10px] text-secondary-text">
                      {order.items.reduce((sum, it) => sum + it.quantity, 0)} items total
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 font-bold text-burgundy-dark font-display text-sm">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={order.status} />
                  </td>

                  {/* Order Time */}
                  <td className="py-3.5 px-4 text-secondary-text whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-gold-dark" />
                      {order.orderTime}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      className="py-1 px-2.5 text-xs font-semibold"
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Navigation Link */}
      <div className="pt-3 border-t border-cream-border flex items-center justify-between text-xs">
        <span className="text-secondary-text">
          Showing real-time records from centralized order store.
        </span>
        <Link
          to="/admin/orders"
          className="font-bold text-gold-dark hover:text-burgundy flex items-center gap-1 transition-colors"
        >
          View Full Orders Hub <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Order Details & Lifecycle Management Modal */}
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

      {/* Add Items to Order Modal */}
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
