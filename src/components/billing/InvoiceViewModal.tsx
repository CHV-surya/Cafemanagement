import React from 'react'
import { Modal, Button, StatusBadge } from '@/components/common'
import { Invoice } from '@/types/billing'
import { useBillingStore } from '@/store/useBillingStore'
import {
  Printer,
  Download,
  CreditCard,
  Receipt,
  Phone,
  Calendar,
  RotateCcw,
} from 'lucide-react'

export interface InvoiceViewModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice | null
  userRole?: 'admin' | 'waiter'
  onRecordPaymentClick?: (invoice: Invoice) => void
  onRefundClick?: (invoice: Invoice) => void
}

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  isOpen,
  onClose,
  invoice,
  userRole = 'admin',
  onRecordPaymentClick,
  onRefundClick,
}) => {
  const { taxConfig } = useBillingStore()

  if (!invoice) return null

  const handlePrint = () => {
    window.print()
  }

  const isFullyPaid = invoice.paymentStatus === 'Paid'
  const isRefunded = invoice.paymentStatus === 'Refunded'
  const hasRemainingBalance = invoice.remainingBalance > 0 && !isRefunded

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex flex-wrap items-center gap-3">
          <Receipt className="w-5 h-5 text-gold-dark" />
          <span className="font-display text-lg font-bold text-burgundy-dark">
            Invoice {invoice.id}
          </span>
          <StatusBadge
            status={
              invoice.paymentStatus === 'Paid'
                ? 'completed'
                : invoice.paymentStatus === 'Partially Paid'
                ? 'preparing'
                : invoice.paymentStatus === 'Refunded'
                ? 'cancelled'
                : 'pending'
            }
            label={invoice.paymentStatus}
          />
          {invoice.paymentMethod && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cream border border-cream-border text-secondary-text">
              via {invoice.paymentMethod}
            </span>
          )}
        </div>
      }
      size="lg"
      footer={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4 text-gold-dark" />}
              className="text-xs"
            >
              Print Invoice
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Download className="w-4 h-4 text-gold-dark" />}
              className="text-xs"
            >
              Download PDF
            </Button>

            {userRole === 'admin' && isFullyPaid && onRefundClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRefundClick(invoice)}
                leftIcon={<RotateCcw className="w-3.5 h-3.5 text-rose-600" />}
                className="text-xs text-rose-700 hover:bg-rose-50"
              >
                Issue Refund
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasRemainingBalance && onRecordPaymentClick && (
              <Button
                variant="gold"
                size="sm"
                onClick={() => onRecordPaymentClick(invoice)}
                leftIcon={<CreditCard className="w-4 h-4" />}
                className="shadow-gold text-xs"
              >
                Collect Payment (₹{invoice.remainingBalance.toLocaleString('en-IN')})
              </Button>
            )}

            <Button variant="primary" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-left text-xs max-h-[75vh] overflow-y-auto pr-1 printable-invoice">
        {/* Printable Invoice Container */}
        <div className="p-6 rounded-2xl bg-cream-card border border-cream-border shadow-2xs space-y-5">
          {/* 1. Restaurant Header & Tax Information */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-cream-border pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-bold tracking-tight text-burgundy-dark">
                  {taxConfig.restaurantName}
                </span>
              </div>
              <p className="text-secondary-text text-[11px] mt-1 max-w-sm">
                {taxConfig.restaurantAddress}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[10px] text-secondary-text mt-1.5 font-mono">
                <span>Phone: {taxConfig.restaurantPhone}</span>
                <span>•</span>
                <span>GSTIN: <strong>{taxConfig.restaurantGstin}</strong></span>
                <span>•</span>
                <span>FSSAI: {taxConfig.fssaiNumber}</span>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="font-mono text-sm font-bold text-burgundy-dark block">
                {invoice.id}
              </span>
              <span className="text-xs text-secondary-text block mt-0.5">
                Order: <strong className="font-mono text-burgundy-dark">{invoice.orderId}</strong>
              </span>
              <span className="text-[11px] text-secondary-text flex items-center gap-1 sm:justify-end mt-1">
                <Calendar className="w-3 h-3 text-gold-dark" />
                {invoice.invoiceDate} • {invoice.invoiceTime}
              </span>
            </div>
          </div>

          {/* 2. Customer & Dining Table Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-cream/50 border border-cream-border text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-secondary-text block">
                Billed To
              </span>
              <p className="font-bold text-burgundy-dark text-sm mt-0.5">
                {invoice.customerName}
              </p>
              {invoice.customerPhone && (
                <p className="text-secondary-text font-mono text-[11px] mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gold-dark" /> {invoice.customerPhone}
                </p>
              )}
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-secondary-text block">
                Dining Station
              </span>
              <p className="font-bold text-burgundy-dark text-sm mt-0.5">
                {invoice.tableNumber || invoice.orderType}
              </p>
              <span className="inline-block mt-0.5 text-[10px] font-semibold text-gold-dark bg-gold/15 px-1.5 py-0.2 rounded">
                {invoice.orderType}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-secondary-text block">
                Server Staff
              </span>
              <p className="font-bold text-burgundy-dark text-sm mt-0.5">
                {invoice.waiterName}
              </p>
              <p className="text-secondary-text font-mono text-[10px] mt-0.5">
                Staff ID: {invoice.waiterId}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-secondary-text block">
                Payment Status
              </span>
              <div className="mt-1">
                <StatusBadge
                  status={
                    invoice.paymentStatus === 'Paid'
                      ? 'completed'
                      : invoice.paymentStatus === 'Partially Paid'
                      ? 'preparing'
                      : invoice.paymentStatus === 'Refunded'
                      ? 'cancelled'
                      : 'pending'
                  }
                  label={invoice.paymentStatus}
                />
              </div>
            </div>
          </div>

          {/* 3. Itemized Line Items Table */}
          <div>
            <div className="rounded-xl border border-cream-border overflow-hidden">
              <table className="w-full text-left text-xs bg-cream-card">
                <thead>
                  <tr className="bg-cream/60 text-secondary-text text-[10px] uppercase font-bold tracking-wider border-b border-cream-border">
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-border/70">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-cream/20">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-burgundy-dark">{item.name}</span>
                        {item.category && (
                          <span className="text-[10px] text-secondary-text block">
                            {item.category}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-burgundy-dark">
                        {item.quantity}
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

              {/* 4. Financial Calculation Breakdown */}
              <div className="p-4 bg-cream/40 border-t border-cream-border space-y-2 text-xs">
                <div className="flex justify-between text-secondary-text">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-main-text">
                    ₹{invoice.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Clear GST Tax Breakdown */}
                <div className="flex justify-between text-secondary-text">
                  <span>
                    CGST ({invoice.taxRate / 2}%):
                  </span>
                  <span className="font-semibold text-main-text">
                    ₹{invoice.cgstAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-secondary-text">
                  <span>
                    SGST ({invoice.taxRate / 2}%):
                  </span>
                  <span className="font-semibold text-main-text">
                    ₹{invoice.sgstAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-secondary-text font-medium text-[11px] pb-1 border-b border-cream-border/60">
                  <span>Total GST ({invoice.taxRate}%):</span>
                  <span>₹{invoice.taxAmount.toLocaleString('en-IN')}</span>
                </div>

                {/* Discount */}
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>
                      Discount {invoice.discountNote ? `(${invoice.discountNote})` : ''}:
                    </span>
                    <span>-₹{invoice.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Grand Total */}
                <div className="pt-2 border-t border-cream-border flex justify-between font-bold text-sm text-burgundy-dark">
                  <span>Final Grand Total:</span>
                  <span className="font-display text-base text-gold-dark font-bold">
                    ₹{invoice.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Paid & Balance Breakdown */}
                <div className="pt-2 border-t border-cream-border/60 flex justify-between text-xs font-semibold">
                  <span className="text-emerald-800">Total Amount Paid:</span>
                  <span className="text-emerald-800">
                    ₹{invoice.amountPaid.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-xs font-bold">
                  <span className={invoice.remainingBalance > 0 ? 'text-amber-900' : 'text-secondary-text'}>
                    Outstanding Balance:
                  </span>
                  <span className={invoice.remainingBalance > 0 ? 'text-amber-900 font-display text-sm' : 'text-secondary-text'}>
                    ₹{invoice.remainingBalance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Payment Transaction Records */}
          {invoice.payments.length > 0 && (
            <div className="space-y-2">
              <span className="font-bold text-burgundy-dark text-xs uppercase tracking-wider block">
                Recorded Payments ({invoice.payments.length})
              </span>
              <div className="rounded-xl border border-cream-border divide-y divide-cream-border overflow-hidden">
                {invoice.payments.map((p) => (
                  <div key={p.id} className="p-3 bg-cream/30 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-burgundy-dark">{p.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/15 text-gold-dark border border-gold/30">
                          {p.method}
                        </span>
                        <span className="text-[11px] text-secondary-text">
                          {p.time} • by {p.collectedByStaffName} ({p.collectedByStaffId})
                        </span>
                      </div>
                      {p.note && (
                        <p className="text-[11px] text-secondary-text italic">{p.note}</p>
                      )}
                    </div>
                    <span className="font-display text-sm font-bold text-burgundy-dark">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Refund Notice (if applicable) */}
          {isRefunded && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-800">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Invoice Refunded</span>
              </div>
              <p className="text-xs">
                <strong>Refund Reason:</strong> {invoice.refundReason || 'Customer requested refund.'}
              </p>
              {invoice.refundedByStaffName && (
                <p className="text-[10px] text-rose-700">
                  Processed by {invoice.refundedByStaffName} ({invoice.refundedByStaffId}) on{' '}
                  {invoice.refundedAt ? new Date(invoice.refundedAt).toLocaleString() : ''}
                </p>
              )}
            </div>
          )}

          {/* 7. Footer Thank You Note & Terms */}
          <div className="pt-4 border-t border-cream-border/80 text-center space-y-1 text-[11px] text-secondary-text">
            <p className="font-display text-xs font-semibold text-burgundy-dark">
              Thank you for dining with BistroHub!
            </p>
            <p className="text-[10px]">
              Computer-generated tax invoice. No signature required. Applicable GST rates applied as per Indian Tax Norms.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
