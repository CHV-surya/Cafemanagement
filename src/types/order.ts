export type OrderType = 'Dine-in' | 'Takeaway' | 'Delivery'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'completed'
  | 'cancelled'

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export interface OrderItemDetail {
  menuItemId: string
  name: string
  quantity: number
  price: number // Captured at order time; immutable even if menu prices change later
  category?: string
  notes?: string
}

export interface OrderStatusHistoryEntry {
  status: OrderStatus
  timestamp: string // ISO string
  time: string // Formatted time e.g. "1:15 PM"
  updatedByStaffId: string
  updatedByStaffName: string
  note?: string
}

export interface Order {
  id: string
  customerName: string
  customerPhone?: string
  phone?: string // Convenient compatibility alias
  orderType: OrderType
  tableId?: string
  tableNumber?: string
  waiterId: string
  waiterName: string
  items: OrderItemDetail[]
  itemsSummary: string
  subtotal: number
  tax: number
  discount: number
  totalAmount: number
  amount: number // Compatibility alias for totalAmount
  status: OrderStatus
  paymentStatus: PaymentStatus
  createdAt: string
  updatedAt: string
  orderTime: string
  notes?: string
  statusHistory: OrderStatusHistoryEntry[]
  cancelReason?: string
  cancelledBy?: string
}

export interface CreateOrderInput {
  orderType: OrderType
  customerName: string
  customerPhone?: string
  tableId?: string
  tableNumber?: string
  waiterId: string
  waiterName: string
  items: OrderItemDetail[]
  notes?: string
  discount?: number
}
