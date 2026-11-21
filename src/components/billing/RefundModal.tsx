import React, { useState } from 'react'
import { Modal, Button } from '@/components/common'
import { Invoice } from '@/types/billing'
import { useBillingStore } from '@/store/useBillingStore'
import { RotateCcw, AlertTriangle } from 'lucide-react'

export interface RefundModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice | null
  staffId: string
  staffName: string
  onRefundProcessed?: (invoice: Invoice) => void
}

export const RefundModal: React.FC<RefundModalProps> = ({
  isOpen,
  onClose,
  invoice,
  staffId,
  staffName,
  onRefundProcessed,
}) => {
  const { refundInvoice } = useBillingStore()
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!invoice) return null

  const handleRefund = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError('Please provide a mandatory reason for issuing this refund.')
      return
    }

    setIsSubmitting(true)
    const result = refundInvoice(invoice.id, reason.trim(), staffId, staffName)
    setIsSubmitting(false)

    if (!result.success || !result.invoice) {
      setError(result.error || 'Failed to process refund.')
    } else {
      if (onRefundProcessed) {
        onRefundProcessed(result.invoice)
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
          <RotateCcw className="w-5 h-5 text-rose-600" />
          <span className="font-display text-lg font-bold text-burgundy-dark">
            Process Invoice Refund ({invoice.id})
          </span>
        </div>
      }
      size="sm"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={handleRefund}
            disabled={isSubmitting || !reason.trim()}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            {isSubmitting ? 'Processing...' : 'Authorize Refund'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleRefund} className="space-y-4 text-left text-xs">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 space-y-1">
          <span className="font-bold text-rose-900 block text-xs">
            Refund Amount: ₹{invoice.amountPaid.toLocaleString('en-IN')}
          </span>
          <p className="text-[11px] text-rose-800">
            For {invoice.customerName} • Order {invoice.orderId} ({invoice.tableNumber || invoice.orderType})
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1.5">
            Mandatory Refund Reason *
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Customer cancelled before preparation, billing discrepancy corrected, order returned..."
            className="w-full rounded-xl bg-cream-card px-3.5 py-2.5 text-xs text-main-text border border-cream-border focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400"
            required
          />
        </div>

        <div className="text-[10px] text-secondary-text">
          Authorized by Admin: <strong>{staffName}</strong> ({staffId}). This action is logged permanently into audit records.
        </div>
      </form>
    </Modal>
  )
}
