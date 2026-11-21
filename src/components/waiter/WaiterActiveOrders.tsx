import React, { useState, useMemo } from 'react'
import { Order } from '@/types/order'
import { StatusBadge, Button, Modal, EmptyState } from '@/components/common'
import {
  UtensilsCrossed,
  Clock,
  Eye,
  BellRing,
  CheckCircle2,
  Phone,
  FileText,
} from 'lucide-react'

export interface WaiterActiveOrdersProps {
  waiterId: string
  waiterName: string
  orders: Order[]
  onViewOrder: (order: Order) => void
}

export const WaiterActiveOrders: React.FC<WaiterActiveOrdersProps> = ({
  waiterId,
  waiterName,
  orders,
  onViewOrder,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Filter only active orders assigned to this waiter: pending, preparing, ready
  const activeOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.waiterId === waiterId &&
        (o.status === 'pending' || o.status === 'preparing' || o.status === 'ready')
    )
  }, [orders, waiterId])

  // Ready orders awaiting server pickup
  const readyOrders = useMemo(() => {
    return activeOrders.filter((o) => o.status === 'ready')
  }, [activeOrders])

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order)
    onViewOrder(order)
  }

  return (
    <div id="active-orders-section" className="rounded-2xl bg-cream-card p-5 sm:p-6 border border-cream-border shadow-subtle text-left space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cream-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-burgundy-dark">
              Active Orders Overview
            </h3>
            <span className="text-xs font-semibold text-gold-dark bg-gold/15 px-2.5 py-0.5 rounded-full border border-gold/30">
              {activeOrders.length} Active Tickets
            </span>
          </div>
          <p className="text-xs text-secondary-text mt-0.5">
            Real-time ticket queue for Server {waiterName} (Staff ID: {waiterId}).
          </p>
        </div>

        {readyOrders.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold animate-pulse">
            <BellRing className="w-3.5 h-3.5 text-gold-dark" />
            {readyOrders.length} {readyOrders.length === 1 ? 'ticket' : 'tickets'} ready at hot pass!
          </span>
        )}
      </div>

      {/* Urgent Kitchen Ready Banner if any order is ready */}
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
            onClick={() => handleOpenModal(readyOrders[0])}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            className="shrink-0 text-xs py-1.5"
          >
            Review Ticket
          </Button>
        </div>
      )}

      {/* Orders List / Table */}
      {activeOrders.length === 0 ? (
        <EmptyState
          title="No Active Orders"
          description="You currently have no pending, preparing, or ready orders in your section."
          icon={UtensilsCrossed}
        />
      ) : (
        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-cream-border bg-cream/40 text-secondary-text font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Table / Station</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4 max-w-xs">Items & Courses</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-border/70">
              {activeOrders.map((order) => {
                const totalItemsCount = order.items.reduce((s, it) => s + it.quantity, 0)
                const isReady = order.status === 'ready'

                return (
                  <tr
                    key={order.id}
                    className={`transition-colors hover:bg-cream/40 ${
                      isReady ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    {/* Order ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-burgundy-dark whitespace-nowrap">
                      {order.id}
                    </td>

                    {/* Table */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-burgundy-dark text-xs">
                        {order.tableNumber || 'Express Counter'}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-burgundy-dark">{order.customerName}</p>
                      {order.phone && (
                        <p className="text-[10px] text-secondary-text font-mono">{order.phone}</p>
                      )}
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="truncate text-main-text font-medium" title={order.itemsSummary}>
                        {order.itemsSummary}
                      </p>
                      <span className="text-[10px] text-secondary-text">
                        {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-display font-bold text-burgundy-dark text-sm whitespace-nowrap">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={order.status} pulse={isReady} />
                    </td>

                    {/* Order Time */}
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
                        onClick={() => handleOpenModal(order)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        className="py-1 px-2.5 text-xs font-semibold"
                      >
                        {isReady ? 'Serve Now' : 'Details'}
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={
            <div className="flex items-center gap-3">
              <span className="font-display text-lg font-bold text-burgundy-dark">
                Order Ticket {selectedOrder.id}
              </span>
              <StatusBadge status={selectedOrder.status} />
            </div>
          }
          size="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-secondary-text">
                Server: {selectedOrder.waiterName || waiterName} ({waiterId})
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                Close Ticket
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-left text-xs">
            {/* Table & Customer Details */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-cream/50 border border-cream-border">
              <div>
                <p className="text-[10px] uppercase font-bold text-secondary-text">Service Station</p>
                <p className="font-bold text-burgundy-dark text-sm mt-0.5">
                  {selectedOrder.tableNumber || 'Express Pick-up'}
                </p>
                <p className="text-secondary-text mt-0.5">Order Time: {selectedOrder.orderTime}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-secondary-text">Guest Details</p>
                <p className="font-bold text-burgundy-dark text-sm mt-0.5">{selectedOrder.customerName}</p>
                <p className="text-secondary-text flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-gold-dark" /> {selectedOrder.phone}
                </p>
              </div>
            </div>

            {/* Line Items List */}
            <div>
              <p className="font-bold text-burgundy-dark mb-2 text-xs uppercase tracking-wider">
                Dishes to Serve
              </p>
              <div className="rounded-xl border border-cream-border divide-y divide-cream-border overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between bg-cream-card">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-gold/15 text-gold-dark font-bold text-[11px] flex items-center justify-center">
                        {item.quantity}x
                      </span>
                      <span className="font-semibold text-main-text">{item.name}</span>
                    </div>
                    <span className="font-bold text-burgundy-dark">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}

                <div className="p-3 bg-cream/40 flex items-center justify-between font-bold text-sm text-burgundy-dark border-t border-cream-border">
                  <span>Grand Total (Taxes incl.)</span>
                  <span className="font-display text-base text-gold-dark">
                    ₹{selectedOrder.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.notes && (
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Kitchen Instructions:
                </p>
                <p className="text-xs mt-0.5 font-medium">{selectedOrder.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
