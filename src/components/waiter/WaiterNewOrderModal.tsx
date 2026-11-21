import React, { useState } from 'react'
import { RestaurantTable } from '@/data/tableData'
import { getAssignedTablesForWaiter } from '@/data/waiterData'
import { AdminRecentOrder, AdminOrderDishItem } from '@/data/adminDashboardData'
import { Modal, Button } from '@/components/common'
import {
  Plus,
  Minus,
  Flame,
} from 'lucide-react'

export interface WaiterNewOrderModalProps {
  isOpen: boolean
  onClose: () => void
  waiterId: string
  waiterName: string
  defaultTable?: RestaurantTable | null
  onOrderCreated: (newOrder: AdminRecentOrder) => void
}

const DEMO_MENU_SELECTIONS = [
  { name: 'Paneer Tikka', category: 'Starters', price: 350 },
  { name: 'Chicken Biryani', category: 'Biryani & Rice', price: 450 },
  { name: 'Margherita Pizza', category: 'Pizza', price: 420 },
  { name: 'Creamy Pasta', category: 'Pasta', price: 440 },
  { name: 'Dal Makhani', category: 'Main Course', price: 390 },
  { name: 'Butter Naan', category: 'Main Course', price: 70 },
  { name: 'Veg Burger', category: 'Burgers', price: 290 },
  { name: 'Chocolate Brownie', category: 'Desserts', price: 220 },
  { name: 'Cold Coffee', category: 'Beverages', price: 180 },
  { name: 'Masala Chai', category: 'Beverages', price: 90 },
]

export const WaiterNewOrderModal: React.FC<WaiterNewOrderModalProps> = ({
  isOpen,
  onClose,
  waiterId,
  waiterName,
  defaultTable,
  onOrderCreated,
}) => {
  const assignedTables = getAssignedTablesForWaiter(waiterId)

  const [selectedTableId, setSelectedTableId] = useState<string>(
    defaultTable?.id || (assignedTables[0]?.id ?? '')
  )
  const [customerName, setCustomerName] = useState('Walk-in Guests')
  const [phone, setPhone] = useState('+91 98')
  const [notes, setNotes] = useState('')
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'Paneer Tikka': 1,
    'Butter Naan': 2,
    'Dal Makhani': 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Sync default table if it changes
  React.useEffect(() => {
    if (defaultTable) {
      setSelectedTableId(defaultTable.id)
    }
  }, [defaultTable])

  const handleQuantityChange = (dishName: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[dishName] || 0
      const updated = Math.max(0, current + delta)
      if (updated === 0) {
        const copy = { ...prev }
        delete copy[dishName]
        return copy
      }
      return { ...prev, [dishName]: updated }
    })
  }

  // Calculate order items and total
  const selectedItems: AdminOrderDishItem[] = Object.entries(quantities).map(
    ([name, quantity]) => {
      const dish = DEMO_MENU_SELECTIONS.find((d) => d.name === name)
      return {
        name,
        quantity,
        price: dish?.price || 200,
      }
    }
  )

  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedItems.length === 0) return

    setIsSubmitting(true)

    setTimeout(() => {
      const selectedTable = assignedTables.find((t) => t.id === selectedTableId)
      const randomOrderNum = Math.floor(7300 + Math.random() * 900)
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })

      const newOrder: AdminRecentOrder = {
        id: `#ORD-${randomOrderNum}`,
        customerName: customerName.trim() || 'Walk-in Guests',
        phone: phone.trim() || '+91 98200 00000',
        orderType: 'Dine-in',
        tableId: selectedTableId,
        tableNumber: selectedTable?.name || `Table ${selectedTableId}`,
        items: selectedItems,
        itemsSummary: selectedItems
          .map((it) => `${it.name} (x${it.quantity})`)
          .join(', '),
        amount: totalAmount,
        status: 'preparing',
        orderTime: timeStr,
        createdAt: now.toISOString(),
        notes: notes.trim() || 'Standard preparation.',
        waiterId,
        waiterName,
      }

      onOrderCreated(newOrder)
      setIsSubmitting(false)
      setIsSuccess(true)

      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 1200)
    }, 400)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-bold text-burgundy-dark">
            Take New Order (Server: {waiterName})
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gold/15 text-gold-dark border border-gold/30">
            {waiterId}
          </span>
        </div>
      }
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            <span className="text-xs text-secondary-text">Total Bill:</span>
            <span className="font-display text-lg font-bold text-burgundy-dark ml-1.5">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              disabled={selectedItems.length === 0 || isSubmitting || isSuccess}
              onClick={handleSubmit}
              leftIcon={<Flame className="w-4 h-4" />}
            >
              {isSuccess ? 'Sent to Kitchen!' : isSubmitting ? 'Firing...' : 'Fire to Kitchen'}
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
        {/* Table & Customer Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-cream/50 border border-cream-border">
          {/* Table Selector (Assigned Tables Only) */}
          <div>
            <label className="block text-[11px] font-bold text-burgundy-dark mb-1 uppercase tracking-wider">
              Assigned Table *
            </label>
            <select
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-cream-card border border-cream-border text-burgundy-dark font-semibold text-xs focus:ring-2 focus:ring-gold/50 focus:outline-none"
            >
              {assignedTables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.capacity} seats • {t.zone})
                </option>
              ))}
            </select>
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-[11px] font-bold text-burgundy-dark mb-1 uppercase tracking-wider">
              Customer / Party Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Rahul Verma"
              className="w-full px-3 py-2 rounded-xl bg-cream-card border border-cream-border text-burgundy-dark text-xs focus:ring-2 focus:ring-gold/50 focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] font-bold text-burgundy-dark mb-1 uppercase tracking-wider">
              Phone / Contact
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98..."
              className="w-full px-3 py-2 rounded-xl bg-cream-card border border-cream-border text-burgundy-dark text-xs focus:ring-2 focus:ring-gold/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Dish Selection Grid */}
        <div>
          <label className="block text-[11px] font-bold text-burgundy-dark mb-2 uppercase tracking-wider">
            Select Dishes for Ticket
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            {DEMO_MENU_SELECTIONS.map((dish) => {
              const qty = quantities[dish.name] || 0
              return (
                <div
                  key={dish.name}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    qty > 0
                      ? 'bg-gold/10 border-gold/40'
                      : 'bg-cream-card border-cream-border'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-burgundy-dark text-xs">{dish.name}</p>
                    <p className="text-[10px] text-secondary-text">
                      {dish.category} • ₹{dish.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(dish.name, -1)}
                      disabled={qty === 0}
                      className="w-6 h-6 rounded-lg bg-cream border border-cream-border text-secondary-text hover:text-burgundy flex items-center justify-center disabled:opacity-30"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold text-burgundy-dark text-xs">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(dish.name, 1)}
                      className="w-6 h-6 rounded-lg bg-gold/20 border border-gold/40 text-burgundy-dark hover:bg-gold hover:text-burgundy-dark flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-[11px] font-bold text-burgundy-dark mb-1 uppercase tracking-wider">
            Special Chef Instructions (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Mild spice, extra gravy, serve starters first..."
            className="w-full px-3 py-2 rounded-xl bg-cream-card border border-cream-border text-burgundy-dark text-xs focus:ring-2 focus:ring-gold/50 focus:outline-none"
          />
        </div>
      </form>
    </Modal>
  )
}
