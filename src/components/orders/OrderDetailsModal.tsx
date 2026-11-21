import React, { useState } from 'react'
import { Modal, Button, StatusBadge } from '@/components/common'
import { useOrderStore } from '@/store/useOrderStore'
import { useBillingStore } from '@/store/useBillingStore'
import { Order, OrderStatus } from '@/types/order'
import { CancelOrderModal } from './CancelOrderModal'
import { InvoiceViewModal, GenerateBillModal } from '@/components/billing'
import {
  AlertTriangle,
  History,
  FileText,
  Plus,
  Flame,
  BellRing,
  Check,
  XCircle,
  CheckCircle2,
  Receipt,
} from 'lucide-react'

export interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  userRole?: 'admin' | 'waiter'
  staffId: string
  staffName: string
  onOrderUpdated?: () => void
  onAddMoreItems?: (order: Order) => void
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  userRole: _userRole = 'waiter',
  staffId,
  staffName,
  onOrderUpdated,
  onAddMoreItems,
}) => {
  const { updateOrderStatus, cancelOrder } = useOrderStore()
  const { getInvoiceByOrderId } = useBillingStore()

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isAdvancing, setIsAdvancing] = useState(false)

  if (!order) return null

  const existingInvoice = getInvoiceByOrderId(order.id)

  // Determine next authorized lifecycle step
  const getNextLifecycleStep = (current: OrderStatus): { target: OrderStatus; label: string; icon: React.ReactNode } | null => {
    switch (current) {
      case 'pending':
        return { target: 'confirmed', label: 'Confirm Order', icon: <Check className="w-3.5 h-3.5" /> }
      case 'confirmed':
        return { target: 'preparing', label: 'Send to Kitchen (Firing)', icon: <Flame className="w-3.5 h-3.5" /> }
      case 'preparing':
        return { target: 'ready', label: 'Plated & Ready for Pass', icon: <BellRing className="w-3.5 h-3.5" /> }
      case 'ready':
        return { target: 'served', label: 'Mark as Served to Table', icon: <CheckCircle2 className="w-3.5 h-3.5" /> }
      case 'served':
        return { target: 'completed', label: 'Complete Order & Settle', icon: <CheckCircle2 className="w-3.5 h-3.5" /> }
      default:
        return null
    }
  }

  const nextStep = getNextLifecycleStep(order.status)
  const isTerminal = order.status === 'completed' || order.status === 'cancelled'
  const canAddMoreItems = order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing'

  const handleAdvanceStatus = () => {
    if (!nextStep) return
    setIsAdvancing(true)
    setActionError(null)

    const result = updateOrderStatus(
      order.id,
      nextStep.target,
      staffId,
      staffName,
      `Advanced from ${order.status} to ${nextStep.target} via terminal`
    )

    setIsAdvancing(false)
    if (!result.success) {
      setActionError(result.error || 'Failed to update order status.')
    } else {
      if (onOrderUpdated) onOrderUpdated()
    }
  }

  const handleConfirmCancel = (reason: string) => {
    const result = cancelOrder(order.id, reason, staffId, staffName)
    if (result.success) {
      setIsCancelModalOpen(false)
      if (onOrderUpdated) onOrderUpdated()
    } else {
      setActionError(result.error || 'Failed to cancel order.')
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display text-lg font-bold text-burgundy-dark">
              Order {order.id}
            </span>
            <StatusBadge status={order.status} />
            {existingInvoice && (
              <span className="text-[10px] font-mono font-bold text-gold-dark bg-gold/15 px-2 py-0.5 rounded border border-gold/30">
                {existingInvoice.id} • {existingInvoice.paymentStatus}
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                order.paymentStatus === 'paid'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : order.paymentStatus === 'refunded'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-amber-50 text-amber-900 border-amber-200'
              }`}
            >
              {order.paymentStatus.toUpperCase()}
            </span>
          </div>
        }
        size="lg"
        footer={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2">
              {!isTerminal && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCancelModalOpen(true)}
                  leftIcon={<XCircle className="w-3.5 h-3.5 text-rose-600" />}
                  className="text-xs text-rose-700 hover:bg-rose-50"
                >
                  Cancel Order
                </Button>
              )}

              {canAddMoreItems && onAddMoreItems && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onAddMoreItems(order)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Add More Dishes
                </Button>
              )}

              {/* Billing Action: View Bill if exists, or Generate Bill */}
              {existingInvoice ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsInvoiceModalOpen(true)}
                  leftIcon={<Receipt className="w-3.5 h-3.5 text-gold-dark" />}
                  className="text-xs"
                >
                  View Bill ({existingInvoice.id})
                </Button>
              ) : (
                order.status !== 'cancelled' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsGenerateModalOpen(true)}
                    leftIcon={<Receipt className="w-3.5 h-3.5 text-gold-dark" />}
                    className="text-xs text-gold-dark hover:border-gold"
                  >
                    Generate Bill
                  </Button>
                )
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>

              {nextStep && (
                <Button
                  variant="gold"
                  size="sm"
                  onClick={handleAdvanceStatus}
                  disabled={isAdvancing}
                  leftIcon={nextStep.icon}
                  className="shadow-gold text-xs"
                >
                  {isAdvancing ? 'Updating...' : nextStep.label}
                </Button>
              )}
            </div>
          </div>
        }
      >
        <div className="space-y-4 text-left text-xs max-h-[70vh] overflow-y-auto pr-1">
          {/* Action Error Banner */}
          {actionError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* Cancellation Notice */}
          {order.status === 'cancelled' && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-800">
                <XCircle className="w-4 h-4" />
                <span>Order Cancelled</span>
              </div>
              <p className="text-xs">
                <strong>Reason:</strong> {order.cancelReason || 'No reason provided'}
              </p>
              {order.cancelledBy && (
                <p className="text-[10px] text-rose-700">
                  Authorized by: {order.cancelledBy}
                </p>
              )}
            </div>
          )}

          {/* Destination & Server Summary Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-cream/50 border border-cream-border">
            <div>
              <p className="text-[10px] uppercase font-bold text-secondary-text">Station / Table</p>
              <p className="font-bold text-burgundy-dark text-sm mt-0.5">
                {order.tableNumber || order.orderType}
              </p>
              <span className="inline-block mt-0.5 text-[10px] font-semibold text-gold-dark bg-gold/15 px-1.5 py-0.2 rounded">
                {order.orderType}
              </span>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-secondary-text">Customer</p>
              <p className="font-bold text-burgundy-dark text-sm mt-0.5">{order.customerName}</p>
              {order.customerPhone && (
                <p className="text-secondary-text font-mono text-[11px] mt-0.5">{order.customerPhone}</p>
              )}
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-secondary-text">Assigned Server</p>
              <p className="font-bold text-burgundy-dark text-sm mt-0.5">{order.waiterName}</p>
              <p className="text-secondary-text font-mono text-[10px] mt-0.5">ID: {order.waiterId}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-secondary-text">Placed At</p>
              <p className="font-bold text-burgundy-dark text-sm mt-0.5">{order.orderTime}</p>
              <p className="text-secondary-text text-[10px] mt-0.5">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Itemized Line Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-burgundy-dark text-xs uppercase tracking-wider">
                Itemized Dishes ({order.items.length} items)
              </p>
              <span className="text-[10px] text-secondary-text italic">
                * Prices captured at order time
              </span>
            </div>

            <div className="rounded-xl border border-cream-border divide-y divide-cream-border overflow-hidden">
              <table className="w-full text-left text-xs bg-cream-card">
                <thead>
                  <tr className="bg-cream/40 text-secondary-text text-[10px] uppercase font-semibold border-b border-cream-border">
                    <th className="py-2 px-3">Dish</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Price</th>
                    <th className="py-2 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-border/70">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-cream/20">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-burgundy-dark">{item.name}</span>
                        {item.category && (
                          <span className="text-[10px] text-secondary-text block">
                            {item.category}
                          </span>
                        )}
                        {item.notes && (
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 mt-0.5 inline-block font-medium">
                            Note: {item.notes}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-burgundy-dark">
                        {item.quantity}x
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-secondary-text">
                        ₹{item.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-burgundy-dark">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Financial Totals */}
              <div className="p-3 bg-cream/40 space-y-1.5 text-xs border-t border-cream-border">
                <div className="flex justify-between text-secondary-text">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-main-text">
                    ₹{order.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-secondary-text">
                  <span>GST Tax (5%):</span>
                  <span className="font-semibold text-main-text">
                    ₹{order.tax.toLocaleString('en-IN')}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Discount:</span>
                    <span className="font-semibold">
                      -₹{order.discount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-cream-border flex justify-between font-bold text-sm text-burgundy-dark">
                  <span>Grand Total:</span>
                  <span className="font-display text-base text-gold-dark font-bold">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Kitchen Notes */}
          {order.notes && (
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <FileText className="w-3 h-3" /> Special Instructions:
              </p>
              <p className="text-xs mt-0.5 font-medium">{order.notes}</p>
            </div>
          )}

          {/* Lifecycle & Status History Timeline */}
          <div>
            <p className="font-bold text-burgundy-dark text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-gold-dark" /> Status Event Timeline
            </p>
            <div className="space-y-2 p-3 rounded-xl bg-cream/30 border border-cream-border">
              {order.statusHistory.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-gold-dark mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-burgundy-dark capitalize">
                        {entry.status}
                      </span>
                      <span className="text-[10px] text-secondary-text font-mono">
                        {entry.time}
                      </span>
                    </div>
                    <p className="text-secondary-text text-[10px]">
                      By {entry.updatedByStaffName} ({entry.updatedByStaffId})
                      {entry.note ? ` • ${entry.note}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        orderId={order.id}
        onConfirmCancel={handleConfirmCancel}
      />

      {/* Invoice View Modal */}
      {existingInvoice && (
        <InvoiceViewModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          invoice={existingInvoice}
          userRole={_userRole}
        />
      )}

      {/* Generate Bill Modal */}
      {isGenerateModalOpen && (
        <GenerateBillModal
          isOpen={isGenerateModalOpen}
          onClose={() => setIsGenerateModalOpen(false)}
          staffId={staffId}
          staffName={staffName}
          userRole={_userRole}
          defaultOrderId={order.id}
          onInvoiceGenerated={() => {
            setIsGenerateModalOpen(false)
            setIsInvoiceModalOpen(true)
          }}
        />
      )}
    </>
  )
}
