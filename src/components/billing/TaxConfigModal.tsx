import React, { useState } from 'react'
import { Modal, Button } from '@/components/common'
import { useBillingStore } from '@/store/useBillingStore'
import { Settings, CheckCircle2, AlertCircle } from 'lucide-react'

export interface TaxConfigModalProps {
  isOpen: boolean
  onClose: () => void
}

export const TaxConfigModal: React.FC<TaxConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { taxConfig, updateTaxRate } = useBillingStore()
  const [gstRate, setGstRate] = useState<number>(taxConfig.gstRate)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const result = updateTaxRate(gstRate)
    if (!result.success) {
      setError(result.error || 'Failed to update GST rate.')
    } else {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 700)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gold-dark" />
          <span className="font-display text-lg font-bold text-burgundy-dark">
            Tax & GST Configuration
          </span>
        </div>
      }
      size="sm"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="gold"
            size="sm"
            onClick={handleSave}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            className="shadow-gold text-xs"
          >
            {success ? 'Saved!' : 'Save Tax Settings'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSave} className="space-y-4 text-left text-xs">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>GST Tax Rate successfully updated!</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1.5">
            Default Restaurant GST Rate (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="28"
              step="0.5"
              value={gstRate}
              onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl bg-cream-card px-3.5 py-2.5 text-sm font-bold text-burgundy-dark border border-cream-border focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
            <span className="absolute right-3.5 top-3 text-secondary-text font-bold text-xs">%</span>
          </div>
          <p className="text-[11px] text-secondary-text mt-1.5">
            Standard rates: 5% (Restaurant/Food), 12% or 18% (AC with liquor licenses).
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-cream/60 border border-cream-border space-y-1.5">
          <span className="font-bold text-burgundy-dark text-xs block">Current Billing Entity</span>
          <p className="text-[11px] text-secondary-text">{taxConfig.restaurantName}</p>
          <p className="text-[11px] font-mono text-secondary-text">GSTIN: {taxConfig.restaurantGstin}</p>
        </div>
      </form>
    </Modal>
  )
}
