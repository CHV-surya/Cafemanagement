import { create } from 'zustand'
import { storageService } from '@/services/storageService'
import {
  Invoice,
  BillingTaxConfig,
  PaymentMethod,
  PaymentRecord,
  GenerateBillInput,
} from '@/types/billing'
import { DEFAULT_TAX_CONFIG, INITIAL_SEED_INVOICES } from '@/data/initialBillingData'
import { useOrderStore } from './useOrderStore'

const STORAGE_INVOICES_KEY = 'invoices'
const STORAGE_TAX_CONFIG_KEY = 'billing_tax_config'

// Generate unique human-readable Invoice ID e.g. INV-2026-008
export function generateInvoiceId(existingCount: number = 0): string {
  const currentYear = new Date().getFullYear()
  const sequence = String(existingCount + 7).padStart(3, '0')
  return `INV-${currentYear}-${sequence}`
}

// Generate unique payment ID e.g. PAY-1006
export function generatePaymentId(existingCount: number = 0): string {
  return `PAY-${1000 + existingCount + 6}`
}

function formatInvoiceDate(d: Date = new Date()): string {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatInvoiceTime(d: Date = new Date()): string {
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

interface BillingStoreState {
  invoices: Invoice[]
  taxConfig: BillingTaxConfig

  // Queries
  getInvoiceById: (id: string) => Invoice | undefined
  getInvoiceByOrderId: (orderId: string) => Invoice | undefined
  getInvoicesForWaiter: (waiterId: string) => Invoice[]

  // Actions
  generateInvoiceFromOrder: (input: GenerateBillInput) => {
    success: boolean
    invoice?: Invoice
    error?: string
  }

  recordPayment: (
    invoiceId: string,
    amount: number,
    method: PaymentMethod,
    staffId: string,
    staffName: string,
    note?: string
  ) => {
    success: boolean
    invoice?: Invoice
    error?: string
  }

  refundInvoice: (
    invoiceId: string,
    reason: string,
    staffId: string,
    staffName: string
  ) => {
    success: boolean
    invoice?: Invoice
    error?: string
  }

  updateTaxRate: (newGstRate: number) => { success: boolean; error?: string }

  resetToInitialDemo: () => void
}

export const useBillingStore = create<BillingStoreState>((set, get) => ({
  invoices: storageService.get<Invoice[]>(STORAGE_INVOICES_KEY, INITIAL_SEED_INVOICES),
  taxConfig: storageService.get<BillingTaxConfig>(
    STORAGE_TAX_CONFIG_KEY,
    DEFAULT_TAX_CONFIG
  ),

  getInvoiceById: (id) => {
    return get().invoices.find((inv) => inv.id === id)
  },

  getInvoiceByOrderId: (orderId) => {
    return get().invoices.find((inv) => inv.orderId === orderId)
  },

  getInvoicesForWaiter: (waiterId) => {
    return get().invoices.filter((inv) => inv.waiterId === waiterId)
  },

  generateInvoiceFromOrder: (input) => {
    const { getOrderById } = useOrderStore.getState()
    const order = getOrderById(input.orderId)

    if (!order) {
      return { success: false, error: `Order ${input.orderId} does not exist.` }
    }

    if (order.status === 'cancelled') {
      return {
        success: false,
        error: 'Cannot generate a billing invoice for a cancelled order.',
      }
    }

    // Check if an invoice already exists for this order (prevent duplicate invoices)
    const existingInvoice = get().getInvoiceByOrderId(input.orderId)
    if (existingInvoice) {
      return {
        success: true,
        invoice: existingInvoice,
      }
    }

    // Accurate financial calculations using captured immutable order item prices
    const subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const taxRate =
      input.customTaxRate !== undefined && input.customTaxRate >= 0
        ? input.customTaxRate
        : get().taxConfig.gstRate

    const taxAmount = Math.round(subtotal * (taxRate / 100))
    const cgstAmount = Math.round((taxAmount / 2) * 100) / 100
    const sgstAmount = Math.round((taxAmount / 2) * 100) / 100

    const discountAmount = Math.max(
      0,
      Math.min(subtotal + taxAmount, input.discountAmount || order.discount || 0)
    )

    const totalAmount = Math.max(0, subtotal + taxAmount - discountAmount)

    const now = new Date()
    const nowIso = now.toISOString()
    const invoiceId = generateInvoiceId(get().invoices.length)

    // Check if order already had a payment marked
    let initialPaymentStatus: Invoice['paymentStatus'] = 'Unpaid'
    let amountPaid = 0
    let remainingBalance = totalAmount
    const payments: PaymentRecord[] = []

    if (order.paymentStatus === 'paid') {
      initialPaymentStatus = 'Paid'
      amountPaid = totalAmount
      remainingBalance = 0
      payments.push({
        id: generatePaymentId(0),
        invoiceId,
        amount: totalAmount,
        method: 'Card', // default captured
        timestamp: nowIso,
        time: formatInvoiceTime(now),
        collectedByStaffId: input.staffId,
        collectedByStaffName: input.staffName,
        note: 'Settled upon order completion',
      })
    }

    const newInvoice: Invoice = {
      id: invoiceId,
      orderId: order.id,
      orderType: order.orderType,
      tableId: order.tableId,
      tableNumber: order.tableNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone || order.phone,
      waiterId: order.waiterId,
      waiterName: order.waiterName,
      items: order.items, // Historical captured items with locked purchase prices
      subtotal,
      taxRate,
      taxAmount,
      cgstAmount,
      sgstAmount,
      discountAmount,
      discountNote: input.discountNote,
      totalAmount,
      amountPaid,
      remainingBalance,
      paymentStatus: initialPaymentStatus,
      paymentMethod: payments.length > 0 ? payments[0].method : undefined,
      payments,
      createdAt: nowIso,
      updatedAt: nowIso,
      invoiceDate: formatInvoiceDate(now),
      invoiceTime: formatInvoiceTime(now),
      isFinalized: initialPaymentStatus === 'Paid',
      notes: input.notes || order.notes,
    }

    const updated = [newInvoice, ...get().invoices]
    set({ invoices: updated })
    storageService.set(STORAGE_INVOICES_KEY, updated)

    return { success: true, invoice: newInvoice }
  },

  recordPayment: (invoiceId, amount, method, staffId, staffName, note) => {
    const target = get().getInvoiceById(invoiceId)
    if (!target) {
      return { success: false, error: `Invoice ${invoiceId} not found.` }
    }

    if (target.paymentStatus === 'Paid') {
      return { success: false, error: 'This invoice has already been paid in full.' }
    }

    if (target.paymentStatus === 'Refunded') {
      return { success: false, error: 'Cannot record payment for a refunded invoice.' }
    }

    if (amount <= 0) {
      return { success: false, error: 'Payment amount must be greater than zero.' }
    }

    if (amount > target.remainingBalance) {
      return {
        success: false,
        error: `Payment amount (₹${amount}) exceeds remaining balance of ₹${target.remainingBalance}.`,
      }
    }

    const now = new Date()
    const nowIso = now.toISOString()
    const paymentId = generatePaymentId(target.payments.length + get().invoices.length)

    const paymentRecord: PaymentRecord = {
      id: paymentId,
      invoiceId: target.id,
      amount,
      method,
      timestamp: nowIso,
      time: formatInvoiceTime(now),
      collectedByStaffId: staffId,
      collectedByStaffName: staffName,
      note: note || `Payment of ₹${amount} recorded via ${method}`,
    }

    const newAmountPaid = target.amountPaid + amount
    const newRemainingBalance = Math.max(0, target.totalAmount - newAmountPaid)
    const newStatus: Invoice['paymentStatus'] =
      newRemainingBalance === 0 ? 'Paid' : 'Partially Paid'

    const updatedInvoice: Invoice = {
      ...target,
      amountPaid: newAmountPaid,
      remainingBalance: newRemainingBalance,
      paymentStatus: newStatus,
      paymentMethod: method,
      payments: [...target.payments, paymentRecord],
      updatedAt: nowIso,
      isFinalized: newStatus === 'Paid',
    }

    const updatedInvoices = get().invoices.map((inv) =>
      inv.id === invoiceId ? updatedInvoice : inv
    )

    set({ invoices: updatedInvoices })
    storageService.set(STORAGE_INVOICES_KEY, updatedInvoices)

    // If fully paid, synchronize order paymentStatus in useOrderStore without changing order's service status
    if (newStatus === 'Paid') {
      useOrderStore.getState().markOrderPaid(target.orderId, staffId, staffName)
    }

    return { success: true, invoice: updatedInvoice }
  },

  refundInvoice: (invoiceId, reason, staffId, staffName) => {
    const target = get().getInvoiceById(invoiceId)
    if (!target) {
      return { success: false, error: `Invoice ${invoiceId} not found.` }
    }

    if (target.paymentStatus === 'Refunded') {
      return { success: false, error: 'This invoice has already been refunded.' }
    }

    if (!reason || !reason.trim()) {
      return { success: false, error: 'A valid refund reason is required.' }
    }

    const now = new Date()
    const nowIso = now.toISOString()

    const updatedInvoice: Invoice = {
      ...target,
      paymentStatus: 'Refunded',
      amountPaid: 0,
      remainingBalance: 0,
      refundReason: reason.trim(),
      refundedAt: nowIso,
      refundedByStaffId: staffId,
      refundedByStaffName: staffName,
      updatedAt: nowIso,
      isFinalized: true,
    }

    const updatedInvoices = get().invoices.map((inv) =>
      inv.id === invoiceId ? updatedInvoice : inv
    )

    set({ invoices: updatedInvoices })
    storageService.set(STORAGE_INVOICES_KEY, updatedInvoices)

    return { success: true, invoice: updatedInvoice }
  },

  updateTaxRate: (newGstRate) => {
    if (newGstRate < 0 || newGstRate > 28) {
      return { success: false, error: 'GST rate must be between 0% and 28%.' }
    }

    const updatedConfig: BillingTaxConfig = {
      ...get().taxConfig,
      gstRate: newGstRate,
    }

    set({ taxConfig: updatedConfig })
    storageService.set(STORAGE_TAX_CONFIG_KEY, updatedConfig)
    return { success: true }
  },

  resetToInitialDemo: () => {
    set({
      invoices: INITIAL_SEED_INVOICES,
      taxConfig: DEFAULT_TAX_CONFIG,
    })
    storageService.set(STORAGE_INVOICES_KEY, INITIAL_SEED_INVOICES)
    storageService.set(STORAGE_TAX_CONFIG_KEY, DEFAULT_TAX_CONFIG)
  },
}))
