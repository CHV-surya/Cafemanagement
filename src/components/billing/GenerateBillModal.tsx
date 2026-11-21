import React, { useState, useMemo, useEffect } from 'react'
import { Modal, Button, StatusBadge } from '@/components/common'
import { useOrderStore } from '@/store/useOrderStore'
import { useBillingStore } from '@/store/useBillingStore'
import { Invoice } from '@/types/billing'
import { Order } from '@/types/order'
import {
  Receipt,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

export interface GenerateBillModalProps {
  isOpen: boolean
  onClose: () => void
  staffId: string
  staffName: string
  userRole?: 'admin' | 'waiter'
  defaultOrderId?: string
  onInvoiceGenerated?: (invoice: Invoice) => void
}

export const GenerateBillModal: React.FC<GenerateBillModalProps> = ({
  isOpen,
  onClose,
  staffId,
  staffName,
  userRole = 'admin',
  defaultOrderId,
  onInvoiceGenerated,
}) => {
  const { orders } = useOrderStore()
  const { invoices, taxConfig, generateInvoiceFromOrder } = useBillingStore()

  // Eligible orders: not cancelled
  const eligibleOrders = useMemo(() => {
    return orders.filter((o) => {
      if (o.status === 'cancelled') return false
      if (userRole === 'waiter' && o.waiterId !== staffId) return false
      return true
    })
  }, [orders, userRole, staffId])

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    defaultOrderId || (eligibleOrders[0]?.id ?? '')
  )
  const [customTaxRate, setCustomTaxRate] = useState<number>(taxConfig.gstRate)
  const [discountAmount, setDiscountAmount] = useState<string>('0')
  const [discountNote, setDiscountNote] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (defaultOrderId) {
      setSelectedOrderId(defaultOrderId)
    } else if (eligibleOrders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(eligibleOrders[0].id)
    }
  }, [defaultOrderId, eligibleOrders, selectedOrderId])

  const selectedOrder: Order | undefined = useMemo(() => {
    return eligibleOrders.find((o) => o.id === selectedOrderId)
  }, [eligibleOrders, selectedOrderId])

  // Check if an invoice already exists for this order
  const existingInvoice = useMemo(() => {
    if (!selectedOrderId) return null
    return invoices.find((inv) => inv.orderId === selectedOrderId) || null
  }, [invoices, selectedOrderId])

  // Calculations
  const subtotal = useMemo(() => {
    if (!selectedOrder) return 0
    return selectedOrder.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
  }, [selectedOrder])

  const taxAmount = Math.round(subtotal * (customTaxRate / 100))
  const parsedDiscount = Math.max(0, parseFloat(discountAmount) || 0)
  const finalDiscount = Math.min(subtotal + taxAmount, parsedDiscount)
  const totalAmount = Math.max(0, subtotal + taxAmount - finalDiscount)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedOrder) {
      setError('Please select an eligible order to generate bill.')
      return
    }

    setIsSubmitting(true)

    const result = generateInvoiceFromOrder({
      orderId: selectedOrder.id,
      discountAmount: finalDiscount,
      discountNote: discountNote.trim() || undefined,
      customTaxRate,
      staffId,
      staffName,
    })

    setIsSubmitting(false)

    if (!result.success || !result.invoice) {
      setError(result.error || 'Failed to generate bill.')
    } else {
      if (onInvoiceGenerated) {
        onInvoiceGenerated(result.invoice)
      }
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-gold-dark" />
          <span className="font-display text-lg font-bold text-burgundy-dark">
            Generate Official Bill
          </span>
        </div>
      }
      size="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            variant="gold"
            size="sm"
            onClick={handleGenerate}
            disabled={isSubmitting || !selectedOrder}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            className="shadow-gold text-xs"
          >
            {isSubmitting
              ? 'Generating...'
              : existingInvoice
              ? 'View / Finalize Invoice'
              : `Generate Bill (₹${totalAmount.toLocaleString('en-IN')})`}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleGenerate} className="space-y-4 text-left text-xs">
        {/* Error Banner */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Existing Invoice Notice */}
        {existingInvoice && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs">
            <span>
              An invoice (<strong>{existingInvoice.id}</strong>) already exists for this ticket.
            </span>
            <StatusBadge status={existingInvoice.paymentStatus === 'Paid' ? 'completed' : 'pending'} label={existingInvoice.paymentStatus} />
          </div>
        )}

        {/* Order Selector */}
        <div>
          <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1.5">
            Select Order Ticket *
          </label>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="w-full rounded-xl bg-cream-card px-3 py-2.5 text-xs font-bold text-burgundy-dark border border-cream-border focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            {eligibleOrders.map((ord) => (
              <option key={ord.id} value={ord.id}>
                {ord.id} • {ord.tableNumber || ord.orderType} • {ord.customerName} (₹{ord.totalAmount})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Order Preview */}
        {selectedOrder && (
          <div className="p-3.5 rounded-2xl bg-cream/50 border border-cream-border space-y-3">
            <div className="flex items-center justify-between border-b border-cream-border/70 pb-2">
              <div>
                <span className="font-bold text-burgundy-dark text-sm block">
                  {selectedOrder.customerName}
                </span>
                <span className="text-secondary-text text-[11px]">
                  {selectedOrder.tableNumber || selectedOrder.orderType} • Server: {selectedOrder.waiterName}
                </span>
              </div>
              <StatusBadge status={selectedOrder.status} />
            </div>

            {/* Line items list */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-main-text">
                    <strong className="text-gold-dark">{it.quantity}x</strong> {it.name}
                  </span>
                  <span className="font-semibold text-burgundy-dark">
                    ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="pt-2 border-t border-cream-border/70 flex justify-between font-bold text-xs text-burgundy-dark">
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Tax & Discount Customization */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-secondary-text uppercase tracking-wider mb-1">
              GST Tax Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="28"
                value={customTaxRate}
                onChange={(e) => setCustomTaxRate(parseFloat(e.target.value) || 0)}
                disabled={userRole !== 'admin'}
                className="w-full rounded-xl bg-cream-card px-3 py-2 text-xs font-bold text-burgundy-dark border border-cream-border disabled:opacity-70"
              />
              <span className="absolute right-3 top-2.5 text-secondary-text text-xs">%</span>
            </div>
            {userRole !== 'admin' && (
              <span className="text-[10px] text-secondary-text mt-0.5 block">
                Standard {taxConfig.gstRate}% GST applied
              </span>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-secondary-text uppercase tracking-wider mb-1">
              Discount Amount (₹)
            </label>
            <input
              type="number"
              min="0"
              max={subtotal + taxAmount}
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl bg-cream-card px-3 py-2 text-xs font-bold text-burgundy-dark border border-cream-border"
            />
          </div>
        </div>

        {/* Discount Reason */}
        {finalDiscount > 0 && (
          <div>
            <label className="block text-[11px] font-semibold text-secondary-text mb-1">
              Discount Reason / Promotion Tag
            </label>
            <input
              type="text"
              value={discountNote}
              onChange={(e) => setDiscountNote(e.target.value)}
              placeholder="e.g. Chef Special 10% Off, Regular Guest Loyalty"
              className="w-full rounded-xl bg-cream-card px-3 py-1.5 text-xs text-main-text border border-cream-border"
            />
          </div>
        )}

        {/* Live Calculation Box */}
        <div className="p-3 rounded-xl bg-cream/70 border border-cream-border space-y-1 text-xs">
          <div className="flex justify-between text-secondary-text">
            <span>Subtotal:</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-secondary-text">
            <span>GST ({customTaxRate}%):</span>
            <span>₹{taxAmount.toLocaleString('en-IN')}</span>
          </div>
          {finalDiscount > 0 && (
            <div className="flex justify-between text-emerald-800 font-semibold">
              <span>Discount Applied:</span>
              <span>-₹{finalDiscount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="pt-1.5 border-t border-cream-border flex justify-between font-bold text-sm text-burgundy-dark">
            <span>Final Total Payable:</span>
            <span className="font-display text-base text-gold-dark font-bold">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </form>
    </Modal>
  )
}
