import React, { useState, useMemo } from 'react'
import { Modal, Button, SearchBar } from '@/components/common'
import { useOrderStore } from '@/store/useOrderStore'
import { Order, OrderItemDetail } from '@/types/order'
import { MENU_ITEMS, MENU_CATEGORIES, MenuItem } from '@/data/menuData'
import { Plus, Minus } from 'lucide-react'

export interface AddItemsToOrderModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  staffId: string
  staffName: string
  onItemsAdded?: () => void
}

export const AddItemsToOrderModal: React.FC<AddItemsToOrderModalProps> = ({
  isOpen,
  onClose,
  order,
  staffId,
  staffName,
  onItemsAdded,
}) => {
  const { addItemToOrder } = useOrderStore()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItemsMap, setSelectedItemsMap] = useState<Record<string, OrderItemDetail>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  if (!order) return null

  const handleAddItem = (dish: MenuItem) => {
    setSelectedItemsMap((prev) => {
      const current = prev[dish.id]
      if (current) {
        return {
          ...prev,
          [dish.id]: { ...current, quantity: current.quantity + 1 },
        }
      }
      return {
        ...prev,
        [dish.id]: {
          menuItemId: dish.id,
          name: dish.name,
          quantity: 1,
          price: dish.price, // Captured price
          category: dish.category,
        },
      }
    })
  }

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
        [dishId]: { ...current, quantity: current.quantity - 1 },
      }
    })
  }

  const itemsToAddList = Object.values(selectedItemsMap)
  const additionalSubtotal = itemsToAddList.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  )

  const handleSubmit = () => {
    if (itemsToAddList.length === 0) return
    setIsSubmitting(true)

    itemsToAddList.forEach((item) => {
      addItemToOrder(order.id, item, staffId, staffName)
    })

    setIsSubmitting(false)
    setSelectedItemsMap({})
    if (onItemsAdded) onItemsAdded()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div>
          <span className="font-display text-lg font-bold text-burgundy-dark">
            Add More Dishes to {order.id}
          </span>
          <p className="text-xs text-secondary-text">
            {order.tableNumber || order.orderType} • Customer: {order.customerName}
          </p>
        </div>
      }
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            <span className="text-xs text-secondary-text">Additional Bill:</span>
            <span className="font-display text-base font-bold text-burgundy-dark ml-1.5">
              ₹{additionalSubtotal.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              disabled={itemsToAddList.length === 0 || isSubmitting}
              onClick={handleSubmit}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add {itemsToAddList.reduce((s, it) => s + it.quantity, 0)} Items
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-left text-xs max-h-[65vh] overflow-y-auto pr-1">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search dishes to add..."
        />

        {/* Category Filter */}
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

        {/* Menu Items List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
          {filteredMenuItems.map((dish) => {
            const selected = selectedItemsMap[dish.id]
            const qty = selected ? selected.quantity : 0

            return (
              <div
                key={dish.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                  qty > 0 ? 'bg-gold/10 border-gold/40' : 'bg-cream-card border-cream-border'
                }`}
              >
                <div>
                  <p className="font-bold text-xs text-burgundy-dark">{dish.name}</p>
                  <p className="text-[10px] text-gold-dark font-bold">₹{dish.price}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {qty > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDecrementItem(dish.id)}
                        className="w-6 h-6 rounded-lg bg-cream border border-cream-border text-secondary-text flex items-center justify-center font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center font-bold text-burgundy-dark text-xs">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddItem(dish)}
                        className="w-6 h-6 rounded-lg bg-gold text-burgundy-dark flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddItem(dish)}
                      className="px-2 py-0.5 rounded-lg bg-cream border border-cream-border text-burgundy-dark text-xs font-semibold hover:bg-gold"
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
    </Modal>
  )
}
