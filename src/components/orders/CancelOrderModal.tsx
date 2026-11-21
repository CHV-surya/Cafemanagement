import React, { useState } from 'react'
import { Modal, Button } from '@/components/common'
import { AlertTriangle } from 'lucide-react'

export interface CancelOrderModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  onConfirmCancel: (reason: string) => void
  isSubmitting?: boolean
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  orderId,
  onConfirmCancel,
  isSubmitting = false,
}) => {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError('Please provide a specific reason for cancelling this order.')
      return
    }
    setError('')
    onConfirmCancel(reason.trim())
  }

  const handleClose = () => {
    setReason('')
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2 text-rose-700">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span className="font-display text-lg font-bold">
            Cancel Order {orderId}
          </span>
        </div>
      }
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="outline" size="sm" onClick={handleClose}>
            Back
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleSubmit}
            disabled={!reason.trim() || isSubmitting}
          >
            {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
        <p className="text-secondary-text">
          Cancelling this order is permanent. It will not continue through the kitchen preparation queue or service lifecycle.
        </p>

        <div>
          <label className="block text-[11px] font-bold text-burgundy-dark mb-1 uppercase tracking-wider">
            Required Cancellation Reason *
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (error) setError('')
            }}
            placeholder="e.g. Customer walked out due to emergency, dish unavailable, guest duplicate order..."
            rows={3}
            className="w-full px-3 py-2 rounded-xl bg-cream-card border border-cream-border text-burgundy-dark text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
            autoFocus
          />
          {error && <p className="text-xs text-rose-600 font-semibold mt-1">{error}</p>}
        </div>
      </form>
    </Modal>
  )
}
