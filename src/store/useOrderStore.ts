import { create } from 'zustand'
import { storageService } from '@/services/storageService'
import {
  Order,
  OrderStatus,
  CreateOrderInput,
  OrderItemDetail,
  OrderStatusHistoryEntry,
} from '@/types/order'
import { INITIAL_SEED_ORDERS } from '@/data/initialOrdersData'

const STORAGE_KEY = 'orders'

// Ordered progression of normal restaurant service
const ALLOWED_FORWARD_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['served', 'cancelled'],
  served: ['completed', 'cancelled'],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
}

export function isValidStatusTransition(current: OrderStatus, target: OrderStatus): boolean {
  if (current === target) return true
  const allowed = ALLOWED_FORWARD_TRANSITIONS[current] || []
  return allowed.includes(target)
}

// Generate unique human-readable Order ID e.g. #ORD-7301
export function generateOrderId(): string {
  const randomNum = Math.floor(7300 + Math.random() * 2600)
  return `#ORD-${randomNum}`
}

export function formatTimeNow(d: Date = new Date()): string {
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

interface OrderStoreState {
  orders: Order[]

  // Queries
  getOrderById: (id: string) => Order | undefined
  getOrdersForWaiter: (waiterId: string) => Order[]
  getActiveOrdersForWaiter: (waiterId: string) => Order[]
  getActiveOrderForTable: (tableId: string) => Order | undefined
  isTableOccupiedWithActiveOrder: (tableId: string) => boolean

  // Actions
  createOrder: (
    input: CreateOrderInput,
    staffId: string,
    staffName: string
  ) => { success: boolean; order?: Order; error?: string }

  updateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    staffId: string,
    staffName: string,
    note?: string
  ) => { success: boolean; error?: string }

  cancelOrder: (
    orderId: string,
    reason: string,
    staffId: string,
    staffName: string
  ) => { success: boolean; error?: string }

  addItemToOrder: (
    orderId: string,
    newItem: OrderItemDetail,
    staffId: string,
    staffName: string
  ) => { success: boolean; error?: string }

  markOrderPaid: (
    orderId: string,
    staffId: string,
    staffName: string
  ) => { success: boolean; error?: string }

  resetToInitialDemo: () => void
}

export const useOrderStore = create<OrderStoreState>((set, get) => ({
  orders: storageService.get<Order[]>(STORAGE_KEY, INITIAL_SEED_ORDERS),

  getOrderById: (id) => {
    return get().orders.find((o) => o.id === id)
  },

  getOrdersForWaiter: (waiterId) => {
    return get().orders.filter((o) => o.waiterId === waiterId)
  },

  getActiveOrdersForWaiter: (waiterId) => {
    return get().orders.filter(
      (o) =>
        o.waiterId === waiterId &&
        o.status !== 'completed' &&
        o.status !== 'cancelled'
    )
  },

  getActiveOrderForTable: (tableId) => {
    return get().orders.find(
      (o) =>
        o.tableId === tableId &&
        o.status !== 'completed' &&
        o.status !== 'cancelled'
    )
  },

  isTableOccupiedWithActiveOrder: (tableId) => {
    return !!get().getActiveOrderForTable(tableId)
  },

  createOrder: (input, staffId, staffName) => {
    // 1. Validation: Prevent empty orders
    if (!input.items || input.items.length === 0) {
      return { success: false, error: 'Cannot submit an order with zero items.' }
    }

    // 2. Validation: Dine-in table requirement & double-booking prevention
    if (input.orderType === 'Dine-in') {
      if (!input.tableId) {
        return { success: false, error: 'Table selection is required for Dine-in orders.' }
      }
      const existingActive = get().getActiveOrderForTable(input.tableId)
      if (existingActive) {
        return {
          success: false,
          error: `Table ${input.tableNumber || input.tableId} already has an active order (${existingActive.id}). Please add items to the existing order or complete it first.`,
        }
      }
    }

    // 3. Validation: Customer name
    if (!input.customerName || !input.customerName.trim()) {
      return { success: false, error: 'Customer or guest name is required.' }
    }

    // 4. Financial Calculations with Immutable Historical Item Pricing
    const itemsWithCapturedPrice = input.items.map((item) => ({
      ...item,
      quantity: Math.max(1, item.quantity),
      price: Math.max(0, item.price), // Immutable captured price
    }))

    const subtotal = itemsWithCapturedPrice.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    )
    const tax = Math.round(subtotal * 0.05) // Standard 5% restaurant GST
    const discount = Math.max(0, input.discount || 0)
    const totalAmount = Math.max(0, subtotal + tax - discount)

    const now = new Date()
    const nowIso = now.toISOString()
    const timeStr = formatTimeNow(now)
    const newOrderId = generateOrderId()

    const initialHistory: OrderStatusHistoryEntry = {
      status: 'pending',
      timestamp: nowIso,
      time: timeStr,
      updatedByStaffId: staffId,
      updatedByStaffName: staffName,
      note: 'Order initiated at terminal',
    }

    const itemsSummary = itemsWithCapturedPrice
      .map((it) => `${it.name} (x${it.quantity})`)
      .join(', ')

    const newOrder: Order = {
      id: newOrderId,
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone?.trim() || '',
      phone: input.customerPhone?.trim() || '',
      orderType: input.orderType,
      tableId: input.tableId,
      tableNumber: input.tableNumber,
      waiterId: input.waiterId,
      waiterName: input.waiterName,
      items: itemsWithCapturedPrice,
      itemsSummary,
      subtotal,
      tax,
      discount,
      totalAmount,
      amount: totalAmount,
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: nowIso,
      updatedAt: nowIso,
      orderTime: timeStr,
      notes: input.notes?.trim(),
      statusHistory: [initialHistory],
    }

    const updatedOrders = [newOrder, ...get().orders]
    set({ orders: updatedOrders })
    storageService.set(STORAGE_KEY, updatedOrders)

    return { success: true, order: newOrder }
  },

  updateOrderStatus: (orderId, newStatus, staffId, staffName, note) => {
    const targetOrder = get().getOrderById(orderId)
    if (!targetOrder) {
      return { success: false, error: `Order ${orderId} not found.` }
    }

    // Disallow transitions from terminal states
    if (targetOrder.status === 'completed') {
      return { success: false, error: 'Completed orders cannot be modified.' }
    }
    if (targetOrder.status === 'cancelled') {
      return { success: false, error: 'Cancelled orders cannot be reopened.' }
    }

    // Validate lifecycle sequence
    if (!isValidStatusTransition(targetOrder.status, newStatus)) {
      return {
        success: false,
        error: `Invalid transition from "${targetOrder.status}" to "${newStatus}". Order must proceed through standard lifecycle: Pending → Confirmed → Preparing → Ready → Served → Completed.`,
      }
    }

    const now = new Date()
    const nowIso = now.toISOString()
    const timeStr = formatTimeNow(now)

    const historyEntry: OrderStatusHistoryEntry = {
      status: newStatus,
      timestamp: nowIso,
      time: timeStr,
      updatedByStaffId: staffId,
      updatedByStaffName: staffName,
      note: note || `Status updated to ${newStatus}`,
    }

    // Auto mark paid when completing order
    const updatedPaymentStatus =
      newStatus === 'completed' ? 'paid' : targetOrder.paymentStatus

    const updatedOrders = get().orders.map((o) => {
      if (o.id !== orderId) return o
      return {
        ...o,
        status: newStatus,
        paymentStatus: updatedPaymentStatus,
        updatedAt: nowIso,
        statusHistory: [historyEntry, ...o.statusHistory],
      }
    })

    set({ orders: updatedOrders })
    storageService.set(STORAGE_KEY, updatedOrders)

    return { success: true }
  },

  cancelOrder: (orderId, reason, staffId, staffName) => {
    if (!reason || !reason.trim()) {
      return { success: false, error: 'A cancellation reason is required.' }
    }

    const targetOrder = get().getOrderById(orderId)
    if (!targetOrder) {
      return { success: false, error: `Order ${orderId} not found.` }
    }

    if (targetOrder.status === 'completed') {
      return { success: false, error: 'Completed orders cannot be cancelled.' }
    }
    if (targetOrder.status === 'cancelled') {
      return { success: false, error: 'This order is already cancelled.' }
    }

    const now = new Date()
    const nowIso = now.toISOString()
    const timeStr = formatTimeNow(now)

    const cancelHistory: OrderStatusHistoryEntry = {
      status: 'cancelled',
      timestamp: nowIso,
      time: timeStr,
      updatedByStaffId: staffId,
      updatedByStaffName: staffName,
      note: `Cancelled: ${reason.trim()}`,
    }

    const updatedOrders = get().orders.map((o) => {
      if (o.id !== orderId) return o
      return {
        ...o,
        status: 'cancelled' as OrderStatus,
        paymentStatus: 'refunded' as const,
        cancelReason: reason.trim(),
        cancelledBy: `${staffId} (${staffName})`,
        updatedAt: nowIso,
        statusHistory: [cancelHistory, ...o.statusHistory],
      }
    })

    set({ orders: updatedOrders })
    storageService.set(STORAGE_KEY, updatedOrders)

    return { success: true }
  },

  addItemToOrder: (orderId, newItem, staffId, staffName) => {
    const targetOrder = get().getOrderById(orderId)
    if (!targetOrder) {
      return { success: false, error: `Order ${orderId} not found.` }
    }

    if (targetOrder.status === 'completed' || targetOrder.status === 'cancelled') {
      return { success: false, error: 'Cannot add items to completed or cancelled orders.' }
    }

    const capturedItem: OrderItemDetail = {
      ...newItem,
      quantity: Math.max(1, newItem.quantity),
      price: Math.max(0, newItem.price),
    }

    // Check if item already exists in this order to increase quantity, or push new item
    let updatedItems: OrderItemDetail[]
    const existingIndex = targetOrder.items.findIndex(
      (it) => it.menuItemId === capturedItem.menuItemId && it.notes === capturedItem.notes
    )

    if (existingIndex >= 0) {
      updatedItems = targetOrder.items.map((it, idx) =>
        idx === existingIndex
          ? { ...it, quantity: it.quantity + capturedItem.quantity }
          : it
      )
    } else {
      updatedItems = [...targetOrder.items, capturedItem]
    }

    // Recalculate totals
    const subtotal = updatedItems.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    )
    const tax = Math.round(subtotal * 0.05)
    const totalAmount = Math.max(0, subtotal + tax - targetOrder.discount)

    const now = new Date()
    const nowIso = now.toISOString()
    const timeStr = formatTimeNow(now)

    const historyEntry: OrderStatusHistoryEntry = {
      status: targetOrder.status,
      timestamp: nowIso,
      time: timeStr,
      updatedByStaffId: staffId,
      updatedByStaffName: staffName,
      note: `Added ${capturedItem.quantity}x ${capturedItem.name} to order`,
    }

    const itemsSummary = updatedItems
      .map((it) => `${it.name} (x${it.quantity})`)
      .join(', ')

    const updatedOrders = get().orders.map((o) => {
      if (o.id !== orderId) return o
      return {
        ...o,
        items: updatedItems,
        itemsSummary,
        subtotal,
        tax,
        totalAmount,
        amount: totalAmount,
        updatedAt: nowIso,
        statusHistory: [historyEntry, ...o.statusHistory],
      }
    })

    set({ orders: updatedOrders })
    storageService.set(STORAGE_KEY, updatedOrders)

    return { success: true }
  },

  markOrderPaid: (orderId, staffId, staffName) => {
    const targetOrder = get().getOrderById(orderId)
    if (!targetOrder) {
      return { success: false, error: `Order ${orderId} not found.` }
    }

    const nowIso = new Date().toISOString()
    const historyEntry: OrderStatusHistoryEntry = {
      status: targetOrder.status,
      timestamp: nowIso,
      time: formatTimeNow(),
      updatedByStaffId: staffId,
      updatedByStaffName: staffName,
      note: 'Payment settled in full',
    }

    const updatedOrders = get().orders.map((o) => {
      if (o.id !== orderId) return o
      return {
        ...o,
        paymentStatus: 'paid' as const,
        updatedAt: nowIso,
        statusHistory: [historyEntry, ...o.statusHistory],
      }
    })

    set({ orders: updatedOrders })
    storageService.set(STORAGE_KEY, updatedOrders)

    return { success: true }
  },

  resetToInitialDemo: () => {
    set({ orders: INITIAL_SEED_ORDERS })
    storageService.set(STORAGE_KEY, INITIAL_SEED_ORDERS)
  },
}))
