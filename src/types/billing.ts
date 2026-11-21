import { OrderItemDetail, OrderType } from './order'

export type PaymentMethod = 'Cash' | 'UPI' | 'Card'

export type BillPaymentStatus = 'Unpaid' | 'Partially Paid' | 'Paid' | 'Refunded'

export interface PaymentRecord {
  id: string
  invoiceId: string
  amount: number
  method: PaymentMethod
  timestamp: string // ISO string
  time: string // e.g. "1:45 PM"
  collectedByStaffId: string
  collectedByStaffName: string
  note?: string
}

export interface Invoice {
  id: string // e.g. "INV-2026-001"
  orderId: string
  orderType: OrderType
  tableId?: string
  tableNumber?: string
  customerName: string
  customerPhone?: string
  waiterId: string
  waiterName: string
  items: OrderItemDetail[]
  subtotal: number
  taxRate: number // e.g. 5 for 5% GST
  taxAmount: number
  cgstAmount: number
  sgstAmount: number
  discountAmount: number
  discountNote?: string
  totalAmount: number
  amountPaid: number
  remainingBalance: number
  paymentStatus: BillPaymentStatus
  paymentMethod?: PaymentMethod
  payments: PaymentRecord[]
  createdAt: string
  updatedAt: string
  invoiceDate: string // e.g. "Nov 21, 2026"
  invoiceTime: string // e.g. "1:45 PM"
  isFinalized: boolean
  refundReason?: string
  refundedAt?: string
  refundedByStaffId?: string
  refundedByStaffName?: string
  notes?: string
}

export interface BillingTaxConfig {
  gstRate: number // Percentage, default 5
  restaurantName: string
  restaurantGstin: string
  restaurantAddress: string
  restaurantPhone: string
  fssaiNumber: string
}

export interface GenerateBillInput {
  orderId: string
  discountAmount?: number
  discountNote?: string
  customTaxRate?: number
  staffId: string
  staffName: string
  notes?: string
}
