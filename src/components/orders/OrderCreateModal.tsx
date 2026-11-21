import React, { useState, useMemo } from 'react'
import { Modal, Button, SearchBar } from '@/components/common'
import { useOrderStore } from '@/store/useOrderStore'
import { DEMO_TABLES } from '@/data/tableData'
import { getAssignedTablesForWaiter, DEMO_TABLE_ASSIGNMENTS } from '@/data/waiterData'
import { MENU_ITEMS, MENU_CATEGORIES, MenuItem } from '@/data/menuData'
import { Order, OrderType, OrderItemDetail } from '@/types/order'
import {
  UtensilsCrossed,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
  Flame,
} from 'lucide-react'

export interface OrderCreateModalProps {
  isOpen: boolean
  onClose: () => void
  userRole?: 'admin' | 'waiter'
  waiterId: string
  waiterName: string
  defaultTableId?: string
  onOrderCreated?: (order: Order) => void
}

export const OrderCreateModal: React.FC<OrderCreateModalProps> = ({
  isOpen,
  onClose,
  userRole = 'waiter',
  waiterId,
  waiterName,
  defaultTableId,
  onOrderCreated,
}) => {
  const { createOrder, getActiveOrderForTable } = useOrderStore()

  // Available tables based on role
  const availableTables = useMemo(() => {
    if (userRole === 'admin') {
      return DEMO_TABLES
    }
    return getAssignedTablesForWaiter(waiterId)
  }, [userRole, waiterId])

  // Form states
  const [orderType, setOrderType] = useState<OrderType>('Dine-in')
  const [selectedTableId, setSelectedTableId] = useState<string>(
    defaultTableId || (availableTables[0]?.id ?? '')
  )
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [orderNotes, setOrderNotes] = useState('')

  // Menu filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Selected items with quantity and item-level notes: map of menuItemId -> OrderItemDetail
  const [selectedItemsMap, setSelectedItemsMap] = useState<Record<string, OrderItemDetail>>({})

  // Form submission feedback
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Reset or initialize on open
  React.useEffect(() => {
    if (isOpen) {
      if (defaultTableId) {
        setSelectedTableId(defaultTableId)
      } else if (availableTables.length > 0) {
        setSelectedTableId(availableTables[0].id)
      }
      setFormError(null)
      setIsSuccess(false)
    }
  }, [isOpen, defaultTableId, availableTables])

  // Active order check on selected table
  const activeOrderOnSelectedTable = useMemo(() => {
    if (orderType !== 'Dine-in' || !selectedTableId) return null
    return getActiveOrderForTable(selectedTableId)
  }, [orderType, selectedTableId, getActiveOrderForTable])

  // Filter menu items
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCat =
        selectedCategory === 'All' || item.category === selectedCategory
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  // Add or increment item
  const handleAddItem = (dish: MenuItem) => {
    setFormError(null)
    setSelectedItemsMap((prev) => {
      const current = prev[dish.id]
      if (current) {
        return {
          ...prev,
          [dish.id]: {
            ...current,
            quantity: current.quantity + 1,
          },
        }
      }
      return {
        ...prev,
        [dish.id]: {
          menuItemId: dish.id,
          name: dish.name,
          quantity: 1,
          price: dish.price, // Captured at order time
          category: dish.category,
        },
      }
    })
  }

  // Decrement item
  const handleDecrementItem = (dishId: string) => {
    setSelectedItemsMap((prev) => {
      const current = prev[dishId]
      if (!current) return prev
      if (current.quantity <= 1) {
        const copy = { ...prev }
        delete copy[dishId]
        return copy
      }
      return {
        ...prev,
        [dishId]: {
          ...current,
          quantity: current.quantity - 1,
        },
      }
    })
  }

  // Remove item completely
  const handleRemoveItem = (dishId: string) => {
    setSelectedItemsMap((prev) => {
      const copy = { ...prev }
      delete copy[dishId]
      return copy
    })
  }

  // Update item-level special instruction
  const handleItemNoteChange = (dishId: string, note: string) => {
    setSelectedItemsMap((prev) => {
      const current = prev[dishId]
      if (!current) return prev
      return {
        ...prev,
        [dishId]: {
          ...current,
          notes: note,
        },
      }
    })
  }

  // Array of selected items
  const selectedItemsList = useMemo(() => {
    return Object.values(selectedItemsMap)
  }, [selectedItemsMap])

  // Calculate financial figures
  const subtotal = useMemo(() => {
    return selectedItemsList.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    )
  }, [selectedItemsList])

  const tax = Math.round(subtotal * 0.05)
  const totalAmount = subtotal + tax

  // Handle Order Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Validation checks
    if (!customerName.trim()) {
      setFormError('Please enter a customer or party name.')
      return
    }

    if (selectedItemsList.length === 0) {
      setFormError('Please select at least one dish for the order.')
      return
    }

    if (orderType === 'Dine-in') {
      if (!selectedTableId) {
        setFormError('Please choose an assigned dining table.')
        return
      }
      if (activeOrderOnSelectedTable) {
        setFormError(
          `Table already has an active order (${activeOrderOnSelectedTable.id}). Please complete or add dishes to the existing ticket.`
        )
        return
      }
    }

    setIsSubmitting(true)

    // Resolve assigned waiter for this table or order
    const tableObj = DEMO_TABLES.find((t) => t.id === selectedTableId)
    const tableWaiterId =
      userRole === 'admin' && selectedTableId
        ? DEMO_TABLE_ASSIGNMENTS.find((a) => a.tableId === selectedTableId)?.waiterId || waiterId
        : waiterId

    const result = createOrder(
      {
        orderType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        tableId: orderType === 'Dine-in' ? selectedTableId : undefined,
        tableNumber: orderType === 'Dine-in' ? tableObj?.name || `Table ${selectedTableId}` : undefined,
        waiterId: tableWaiterId,
        waiterName: userRole === 'admin' ? `Admin Dispatch (${waiterName})` : waiterName,
        items: selectedItemsList,
        notes: orderNotes.trim(),
      },
      waiterId,
      waiterName
    )

    if (result.success && result.order) {
      setIsSubmitting(false)
      setIsSuccess(true)
      if (onOrderCreated) {
        onOrderCreated(result.order)
      }
      setTimeout(() => {
        handleReset()
        onClose()
      }, 1000)
    } else {
      setIsSubmitting(false)
      setFormError(result.error || 'Failed to submit order.')
    }
  }

  const handleReset = () => {
    setSelectedItemsMap({})
    setCustomerName('')
    setCustomerPhone('')
    setOrderNotes('')
    setSearchQuery('')
    setSelectedCategory('All')
    setFormError(null)
    setIsSuccess(false)
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gold/15 text-gold-dark">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-burgundy-dark">
              Create New Order Ticket
            </h3>
            <p className="text-xs text-secondary-text">
              Server: <strong className="text-burgundy-dark">{waiterName}</strong> (ID: {waiterId}) • {orderType}
            </p>
          </div>
        </div>
      }
      size="xl"
      footer={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div>
            <span className="text-xs text-secondary-text">Total Bill (with 5% GST):</span>
            <span className="font-display text-lg sm:text-xl font-bold text-burgundy-dark ml-2">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-secondary-text ml-2">
              ({selectedItemsList.reduce((s, it) => s + it.quantity, 0)} items)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={handleSubmit}
              disabled={selectedItemsList.length === 0 || isSubmitting || isSuccess || !!activeOrderOnSelectedTable}
              leftIcon={<Flame className="w-4 h-4" />}
              className="shadow-gold px-4"
            >
              {isSuccess
                ? 'Order Placed!'
                : isSubmitting
                ? 'Submitting...'
                : 'Fire Order to Kitchen'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-left text-xs max-h-[72vh] overflow-y-auto pr-1">
        {/* Error Warning */}
        {formError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium text-xs">{formError}</span>
          </div>
        )}

        {/* Section 1: Order Type & Destination */}
        <div className="p-4 rounded-2xl bg-cream/50 border border-cream-border space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-[11px] font-bold text-burgundy-dark uppercase tracking-wider mb-1">
                Order Type *
              </label>
              <div className="inline-flex rounded-xl bg-cream p-1 border border-cream-border">
                {(['Dine-in', 'Takeaway', 'Delivery'] as OrderType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setOrderType(type)
                      setFormError(null)
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      orderType === type
                        ? 'bg-burgundy text-cream shadow-2xs'
                        : 'text-secondary-text hover:text-burgundy'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Selector (Only for Dine-in) */}
            {orderType === 'Dine-in' && (
              <div className="flex-1 sm:max-w-xs">
                <label className="block text-[11px] font-bold text-burgundy-dark uppercase tracking-wider mb-1">
                  Assigned Table *
                </label>
                <select
                  value={selectedTableId}
                  onChange={(e) => {
                    setSelectedTableId(e.target.value)
                    setFormError(null)
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-cream-card border border-cream-border text-burgundy-dark font-semibold text-xs focus:ring-2 focus:ring-gold/50 focus:outline-none"
                >
                  {availableTables.map((t) => {
                    const hasActiveOrder = !!getActiveOrderForTable(t.id)
                    return (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.capacity} seats • {t.zone})
                        {hasActiveOrder ? ' — [OCCUPIED]' : ' — [Available]'}
                      </option>
                    )
                  })}
                </select>
              </div>
            )}
          </div>

          {/* Occupied Warning on Dine-in Table */}
          {activeOrderOnSelectedTable && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <p className="text-xs font-medium">
                <strong>Table Occupied:</strong> Active Order{' '}
                <span className="font-mono font-bold">{activeOrderOnSelectedTable.id}</span> is
                currently in progress on this table. You cannot open a new ticket here until the existing one is completed.
              </p>
            </div>
          )}

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-cream-border/70">
            <div>
              <label className="block text-[11px] font-bold text-burgundy-dark mb-1 uppercase tracking-wider">
                Customer / Guest Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value)
                  if (formError) setFormError(null)
                }}
                placeholder="e.g. Ananya Sharma or Walk-in"
                className="w-full px-3 py-2 rounded-xl bg-cream-card border border-cream-border text-burgundy-dark text-xs focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-burgundy-dark mb-1 uppercase tracking-wider">
                Mobile Number (Optional)
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98201 11223"
                className="w-full px-3 py-2 rounded-xl bg-cream-card border border-cream-border text-burgundy-dark text-xs focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Split Menu Browser & Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Menu Item Catalog (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-sm font-bold text-burgundy-dark">
                Browse Menu Dishes
              </h4>
              <span className="text-[11px] text-secondary-text">
                {filteredMenuItems.length} dishes
              </span>
            </div>

            {/* Search Input */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search dishes by name..."
            />

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-burgundy text-cream shadow-2xs'
                      : 'bg-cream text-secondary-text border border-cream-border hover:text-burgundy'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
              {filteredMenuItems.map((dish) => {
                const selected = selectedItemsMap[dish.id]
                const qty = selected ? selected.quantity : 0

                return (
                  <div
                    key={dish.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                      qty > 0
                        ? 'bg-gold/10 border-gold/40'
                        : 'bg-cream-card border-cream-border hover:bg-cream/40'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        />
                        <p className="font-bold text-xs text-burgundy-dark truncate">
                          {dish.name}
                        </p>
                      </div>
                      <p className="text-[10px] text-gold-dark font-bold mt-0.5">
                        ₹{dish.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {qty > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDecrementItem(dish.id)}
                            className="w-6 h-6 rounded-lg bg-cream border border-cream-border text-secondary-text hover:text-burgundy flex items-center justify-center font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center font-bold text-burgundy-dark text-xs">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddItem(dish)}
                            className="w-6 h-6 rounded-lg bg-gold text-burgundy-dark hover:bg-gold-hover flex items-center justify-center font-bold shadow-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddItem(dish)}
                          className="px-2.5 py-1 rounded-lg bg-cream border border-cream-border text-burgundy-dark hover:bg-gold hover:text-burgundy-dark text-[11px] font-bold transition-colors"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Order Cart Summary (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-cream/60 p-4 border border-cream-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-cream-border">
              <h4 className="font-display text-sm font-bold text-burgundy-dark">
                Selected Ticket Items
              </h4>
              <span className="text-[11px] font-bold text-gold-dark bg-gold/15 px-2 py-0.5 rounded-md">
                {selectedItemsList.length} dishes
              </span>
            </div>

            {selectedItemsList.length === 0 ? (
              <div className="py-8 text-center text-secondary-text">
                <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 text-secondary-text/40" />
                <p className="text-xs font-semibold">No dishes added yet</p>
                <p className="text-[11px] text-secondary-text/80 mt-0.5">
                  Select dishes from the menu on the left.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                {selectedItemsList.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="p-2.5 rounded-xl bg-cream-card border border-cream-border/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-gold/15 text-gold-dark text-[10px] font-bold flex items-center justify-center">
                          {item.quantity}x
                        </span>
                        <span className="font-bold text-burgundy-dark text-xs truncate max-w-[120px]">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-burgundy-dark text-xs">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.menuItemId)}
                          className="text-secondary-text hover:text-rose-600 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Item-level notes input */}
                    <input
                      type="text"
                      value={item.notes || ''}
                      onChange={(e) =>
                        handleItemNoteChange(item.menuItemId, e.target.value)
                      }
                      placeholder="Special note (e.g. less spicy, extra dip)..."
                      className="w-full px-2 py-1 rounded-lg bg-cream/70 border border-cream-border/60 text-[10px] text-burgundy-dark focus:outline-none focus:ring-1 focus:ring-gold/40 placeholder:text-secondary-text/60"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Overall Order Notes */}
            <div className="pt-2 border-t border-cream-border">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary-text mb-1">
                Kitchen Instructions (Order-level)
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Serve starters first, VIP guests..."
                className="w-full px-2.5 py-1.5 rounded-xl bg-cream-card border border-cream-border text-xs text-burgundy-dark focus:ring-2 focus:ring-gold/40 focus:outline-none"
              />
            </div>

            {/* Financial Totals Breakdown */}
            <div className="p-2.5 rounded-xl bg-cream-card border border-cream-border space-y-1 text-xs">
              <div className="flex justify-between text-secondary-text">
                <span>Subtotal:</span>
                <span className="font-semibold text-main-text">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-secondary-text">
                <span>GST Tax (5%):</span>
                <span className="font-semibold text-main-text">
                  ₹{tax.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="pt-1 border-t border-cream-border flex justify-between font-bold text-burgundy-dark text-sm">
                <span>Total Amount:</span>
                <span className="font-display text-gold-dark text-base">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
