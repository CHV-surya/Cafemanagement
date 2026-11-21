import React, { useState, useEffect } from 'react'
import { Modal, Button } from '@/components/common'
import { Invoice, PaymentMethod } from '@/types/billing'
import { useBillingStore } from '@/store/useBillingStore'
import {
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

export interface RecordPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice | null
  staffId: string
  staffName: string
  onPaymentRecorded?: (invoice: Invoice) => void
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  invoice,
  staffId,
  staffName,
  onPaymentRecorded,
}) => {
  const { recordPayment } = useBillingStore()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash')
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full')
  const [partialAmount, setPartialAmount] = useState<string>('')
  const [cashTendered, setCashTendered] = useState<string>('')
  const [paymentNote, setPaymentNote] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset or initialize on modal open
  useEffect(() => {
    if (invoice) {
      setPaymentType('full')
      setPartialAmount(String(invoice.remainingBalance))
      setCashTendered(String(invoice.remainingBalance))
      setPaymentNote('')
      setError(null)
      setIsSubmitting(false)
    }
  }, [invoice, isOpen])

  if (!invoice) return null

  const payableAmount =
    paymentType === 'full'
      ? invoice.remainingBalance
      : parseFloat(partialAmount) || 0

  // Cash change due calculation
  const cashGiven = parseFloat(cashTendered) || 0
  const changeDue = Math.max(0, cashGiven - payableAmount)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (payableAmount <= 0) {
      setError('Payment amount must be greater than zero.')
      return
    }

    if (payableAmount > invoice.remainingBalance) {
      setError(
        `Payment amount (₹${payableAmount}) cannot exceed the remaining balance of ₹${invoice.remainingBalance}.`
      )
      return
    }

    setIsSubmitting(true)

    // Build structured reference note
    let finalNote = paymentNote.trim()
    if (paymentMethod === 'Cash' && cashGiven > payableAmount) {
      finalNote = `${finalNote ? `${finalNote} • ` : ''}Cash tendered ₹${cashGiven}, Change returned ₹${changeDue}`
    } else if (paymentMethod === 'UPI' && !finalNote) {
      finalNote = 'UPI QR Instant Settlement'
    } else if (paymentMethod === 'Card' && !finalNote) {
      finalNote = 'EDC POS Terminal Payment'
    }

    const result = recordPayment(
      invoice.id,
      payableAmount,
      paymentMethod,
      staffId,
      staffName,
      finalNote
    )

    setIsSubmitting(false)

    if (!result.success) {
      setError(result.error || 'Failed to record payment.')
    } else {
      if (onPaymentRecorded && result.invoice) {
        onPaymentRecorded(result.invoice)
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
          <CreditCard className="w-5 h-5 text-gold-dark" />
          <span className="font-display text-lg font-bold text-burgundy-dark">
            Collect Payment: {invoice.id}
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
            onClick={handleSubmit}
            disabled={isSubmitting || payableAmount <= 0}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            className="shadow-gold text-xs"
          >
            {isSubmitting
              ? 'Processing...'
              : `Confirm ₹${payableAmount.toLocaleString('en-IN')} Payment`}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
        {/* Error Banner */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Invoice Summary Card */}
        <div className="p-3.5 rounded-2xl bg-cream/50 border border-cream-border space-y-2">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-cream-border/70">
            <div>
              <span className="font-bold text-burgundy-dark text-sm block">
                {invoice.customerName}
              </span>
              <span className="text-secondary-text text-[11px]">
                {invoice.tableNumber || invoice.orderType} • Order {invoice.orderId}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-secondary-text block">
                Remaining Due
              </span>
              <span className="font-display text-lg font-bold text-burgundy-dark">
                ₹{invoice.remainingBalance.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex justify-between text-[11px] text-secondary-text pt-1">
            <span>Bill Total: ₹{invoice.totalAmount.toLocaleString('en-IN')}</span>
            <span>Already Paid: ₹{invoice.amountPaid.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Payment Method Selector (Cash, UPI, Card) */}
        <div>
          <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">
            Payment Mode *
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('Cash')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'Cash'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/30 font-bold'
                  : 'bg-cream-card border-cream-border text-secondary-text hover:border-gold'
              }`}
            >
              <Banknote className="w-5 h-5 text-emerald-600" />
              <span>Cash</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('UPI')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'UPI'
                  ? 'bg-sky-50 border-sky-500 text-sky-900 ring-2 ring-sky-500/30 font-bold'
                  : 'bg-cream-card border-cream-border text-secondary-text hover:border-gold'
              }`}
            >
              <QrCode className="w-5 h-5 text-sky-600" />
              <span>UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('Card')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'Card'
                  ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-500/30 font-bold'
                  : 'bg-cream-card border-cream-border text-secondary-text hover:border-gold'
              }`}
            >
              <CreditCard className="w-5 h-5 text-purple-600" />
              <span>Card / POS</span>
            </button>
          </div>
        </div>

        {/* Payment Type: Full vs Partial */}
        <div>
          <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1.5">
            Settlement Amount *
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setPaymentType('full')
                setPartialAmount(String(invoice.remainingBalance))
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                paymentType === 'full'
                  ? 'bg-burgundy text-cream border-burgundy shadow-2xs'
                  : 'bg-cream text-secondary-text border-cream-border hover:text-burgundy'
              }`}
            >
              Full Balance (₹{invoice.remainingBalance.toLocaleString('en-IN')})
            </button>

            <button
              type="button"
              onClick={() => setPaymentType('partial')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                paymentType === 'partial'
                  ? 'bg-burgundy text-cream border-burgundy shadow-2xs'
                  : 'bg-cream text-secondary-text border-cream-border hover:text-burgundy'
              }`}
            >
              Partial Amount
            </button>
          </div>

          {paymentType === 'partial' && (
            <div className="mt-2.5">
              <label className="block text-[11px] font-semibold text-secondary-text mb-1">
                Enter Partial Amount to Collect (₹)
              </label>
              <input
                type="number"
                min="1"
                max={invoice.remainingBalance}
                value={partialAmount}
                onChange={(e) => setPartialAmount(e.target.value)}
                placeholder="e.g. 500"
                className="w-full rounded-xl bg-cream-card px-3 py-2 text-sm text-burgundy-dark font-bold border border-cream-border focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              <p className="text-[10px] text-secondary-text mt-1">
                Remaining after this payment: ₹
                {Math.max(0, invoice.remainingBalance - (parseFloat(partialAmount) || 0)).toLocaleString('en-IN')}
              </p>
            </div>
          )}
        </div>

        {/* Cash Calculator (if cash selected) */}
        {paymentMethod === 'Cash' && (
          <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
            <span className="font-bold text-emerald-900 text-[11px] uppercase tracking-wider block">
              Cash Tendered Calculator
            </span>
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-[10px] text-secondary-text mb-1">
                  Cash Handed by Customer (₹)
                </label>
                <input
                  type="number"
                  min={payableAmount}
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  className="w-full rounded-lg bg-cream-card px-2.5 py-1.5 text-xs font-bold text-burgundy-dark border border-emerald-300"
                />
              </div>

              <div className="text-right">
                <span className="text-[10px] text-secondary-text block">Change to Return</span>
                <span className="font-display text-base font-bold text-emerald-900">
                  ₹{changeDue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Reference / Notes Input */}
        <div>
          <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">
            Reference / Memo (Optional)
          </label>
          <input
            type="text"
            value={paymentNote}
            onChange={(e) => setPaymentNote(e.target.value)}
            placeholder={
              paymentMethod === 'UPI'
                ? 'e.g. UPI Ref #892819028'
                : paymentMethod === 'Card'
                ? 'e.g. Visa ending in 4242'
                : 'e.g. Split table bill check'
            }
            className="w-full rounded-xl bg-cream-card px-3 py-2 text-xs text-main-text border border-cream-border focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>

        {/* Collector Notice */}
        <div className="pt-1 flex items-center justify-between text-[11px] text-secondary-text border-t border-cream-border/70">
          <span>Collected by: <strong>{staffName}</strong> ({staffId})</span>
          <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Instant Receipt
          </span>
        </div>
      </form>
    </Modal>
  )
}
