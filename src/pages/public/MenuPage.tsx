import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FoodCard,
  Button,
  Badge,
  SearchBar,
  Modal,
  Select,
  EmptyState,
} from '@/components/common'
import {
  MENU_CATEGORIES,
  DIETARY_FILTERS,
  SORT_OPTIONS,
  MENU_HERO_DATA,
  MENU_ITEMS,
  MenuItem,
  MenuCategoryType,
  DietaryFilterType,
  SortOptionType,
} from '@/data/menuData'
import { formatINR, cn } from '@/utils'
import {
  Sparkles,
  UtensilsCrossed,
  Clock,
  Flame,
  CheckCircle2,
  CalendarCheck,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react'

export const MenuPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryType>('All')
  const [selectedDietary, setSelectedDietary] = useState<DietaryFilterType>('All')
  const [sortBy, setSortBy] = useState<SortOptionType>('popularity')
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null)

  // Combined Filtering and Sorting logic
  const filteredDishes = useMemo(() => {
    return MENU_ITEMS.filter((dish) => {
      // 1. Category filter
      if (selectedCategory !== 'All' && dish.category !== selectedCategory) {
        return false
      }

      // 2. Dietary filter
      if (selectedDietary === 'Vegetarian' && !dish.isVeg) {
        return false
      }
      if (selectedDietary === 'Non-Vegetarian' && dish.isVeg) {
        return false
      }

      // 3. Search query filter (matches name, description, or ingredients)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesName = dish.name.toLowerCase().includes(query)
        const matchesDescription = dish.description.toLowerCase().includes(query)
        const matchesIngredient = dish.ingredients.some((ing) =>
          ing.toLowerCase().includes(query)
        )
        if (!matchesName && !matchesDescription && !matchesIngredient) {
          return false
        }
      }

      return true
    }).sort((a, b) => {
      // 4. Sorting logic
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'alpha':
          return a.name.localeCompare(b.name)
        case 'popularity':
        default:
          return b.popularity - a.popularity
      }
    })
  }, [selectedCategory, selectedDietary, searchQuery, sortBy])

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedDietary('All')
    setSortBy('popularity')
  }

  const isFilterActive =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedDietary !== 'All' ||
    sortBy !== 'popularity'

  return (
    <div className="flex flex-col w-full selection:bg-gold/30 selection:text-burgundy-dark text-left">
      {/* =========================================================================
          1. MENU HERO SECTION
          Subtle restaurant/food background image, dark burgundy/gold theme
         ========================================================================= */}
      <section className="relative min-h-[340px] sm:min-h-[400px] flex items-center overflow-hidden bg-burgundy-dark text-cream border-b border-burgundy-border">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={MENU_HERO_DATA.bgImage}
            alt="BistroHub Culinary Kitchen"
            className="w-full h-full object-cover object-center scale-105"
            loading="eager"
          />
          {/* Multi-layered dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy-dark/95 via-burgundy-dark/90 to-burgundy-dark/70" />
          <div className="absolute inset-0 bg-black/35" />
          {/* Ambient gold glow */}
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
          <div className="max-w-2xl space-y-4">
            {/* Breadcrumb & Pill */}
            <div className="flex items-center gap-2 text-xs text-cream/70">
              <Link to="/" className="hover:text-gold transition-colors font-medium">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-cream/40" />
              <span className="text-gold font-semibold">Our Menu</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Fresh Seasonal Gastronomy
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-cream">
              {MENU_HERO_DATA.heading}
            </h1>

            <p className="text-sm sm:text-base text-cream/80 max-w-xl leading-relaxed">
              {MENU_HERO_DATA.description}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SEARCH & FILTER CONTROLS BAR
          Category tabs, Dietary selector, Search Bar, and Sorting
         ========================================================================= */}
      <section className="sticky top-20 z-30 bg-cream/95 backdrop-blur-md border-b border-cream-border py-4 shadow-subtle transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
          {/* Top Row: Search input + Dietary pills + Sort dropdown */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="w-full lg:w-80 shrink-0">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                placeholder="Search dishes, ingredients..."
                className="bg-cream-card shadow-xs"
              />
            </div>

            {/* Dietary Pills & Sort Controls */}
            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">
              {/* Dietary Toggle Pills */}
              <div className="inline-flex items-center p-1 rounded-xl bg-cream-card border border-cream-border shadow-xs">
                {DIETARY_FILTERS.map((diet) => {
                  const isActive = selectedDietary === diet
                  return (
                    <button
                      key={diet}
                      onClick={() => setSelectedDietary(diet)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 select-none',
                        isActive
                          ? 'bg-burgundy text-cream shadow-2xs'
                          : 'text-secondary-text hover:text-burgundy-dark hover:bg-cream/60'
                      )}
                    >
                      {diet === 'Vegetarian' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                      {diet === 'Non-Vegetarian' && (
                        <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                      )}
                      <span>{diet}</span>
                    </button>
                  )
                })}
              </div>

              {/* Sorting Select */}
              <div className="w-48 shrink-0">
                <Select
                  options={SORT_OPTIONS.map((opt) => ({
                    label: `Sort: ${opt.label}`,
                    value: opt.value,
                  }))}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOptionType)}
                  className="bg-cream-card py-1.5 text-xs font-medium"
                />
              </div>

              {/* Reset Filters Action Button */}
              {isFilterActive && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-status-danger px-2.5 py-1.5 rounded-lg hover:bg-cream-card border border-transparent hover:border-cream-border transition-colors"
                  title="Clear all active filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Category Pills (Horizontally scrollable on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-text shrink-0 hidden md:inline-flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3 h-3 text-gold" /> Categories:
            </span>
            {MENU_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all duration-200 select-none',
                    isSelected
                      ? 'bg-burgundy text-cream shadow-subtle border border-burgundy'
                      : 'bg-cream-card text-secondary-text border border-cream-border hover:border-burgundy/30 hover:text-burgundy-dark'
                  )}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. MAIN FOOD DISPLAY GRID
          Responsive grid: 4 cols on desktop, 2-3 on tablet, 1-2 on mobile
         ========================================================================= */}
      <section className="py-10 sm:py-16 bg-cream min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-cream-border">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-burgundy-dark">
                {selectedCategory === 'All' ? 'All Dishes' : selectedCategory}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cream-card border border-cream-border text-secondary-text">
                {filteredDishes.length} {filteredDishes.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {selectedDietary !== 'All' && (
              <Badge variant="gold" size="sm" className="hidden sm:inline-flex">
                Filtered: {selectedDietary}
              </Badge>
            )}
          </div>

          {/* Cards Grid */}
          {filteredDishes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredDishes.map((dish) => (
                <FoodCard
                  key={dish.id}
                  id={dish.id}
                  name={dish.name}
                  category={dish.category}
                  price={dish.price}
                  description={dish.description}
                  imageUrl={dish.imageUrl}
                  isVeg={dish.isVeg}
                  badgeText={dish.badgeText}
                  actionLabel="View Details"
                  onViewDetails={() => setSelectedDish(dish)}
                />
              ))}
            </div>
          ) : (
            /* =========================================================================
                4. REUSABLE EMPTY STATE
                Shown when no dishes match filters
               ========================================================================= */
            <div className="py-12">
              <EmptyState
                icon={UtensilsCrossed}
                title="No Dishes Found"
                description={`We couldn't find any culinary items matching your selected criteria ("${
                  searchQuery || selectedCategory
                }"). Try modifying your search or clearing active filters.`}
                action={
                  <Button
                    variant="gold"
                    size="md"
                    onClick={handleResetFilters}
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                    className="shadow-gold"
                  >
                    Clear All Filters
                  </Button>
                }
              />
            </div>
          )}

          {/* Table Booking Banner at the bottom of the menu */}
          <div className="mt-16 rounded-3xl bg-cream-card border border-cream-border p-8 sm:p-10 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold-dark text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Table Reservations
              </div>
              <h3 className="font-display text-2xl font-bold text-burgundy-dark">
                Ready to Experience These Flavors?
              </h3>
              <p className="text-xs sm:text-sm text-secondary-text max-w-xl">
                Reserve your dining table online in seconds and enjoy freshly cooked specialties straight from our kitchen.
              </p>
            </div>
            <Link to="/book-table" className="shrink-0">
              <Button
                variant="gold"
                size="lg"
                leftIcon={<CalendarCheck className="w-4 h-4" />}
                className="shadow-gold"
              >
                Reserve a Table
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. REUSABLE FOOD DETAILS MODAL
          Opens on clicking "View Details" on any food card
         ========================================================================= */}
      {selectedDish && (
        <Modal
          isOpen={Boolean(selectedDish)}
          onClose={() => setSelectedDish(null)}
          size="lg"
          title={
            <div className="flex items-center gap-2.5">
              {/* Veg/Non-Veg Mark */}
              <span
                className={cn(
                  'inline-flex items-center justify-center w-4 h-4 rounded-xs border-1.5 p-0.5 shrink-0 bg-white shadow-2xs',
                  selectedDish.isVeg ? 'border-emerald-600' : 'border-rose-700'
                )}
                title={selectedDish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              >
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    selectedDish.isVeg ? 'bg-emerald-600' : 'bg-rose-700'
                  )}
                />
              </span>
              <span className="font-display text-xl font-bold text-burgundy-dark">
                {selectedDish.name}
              </span>
            </div>
          }
          description={`${selectedDish.category} • ${selectedDish.isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase text-secondary-text font-semibold">Price:</span>
                <span className="font-display text-xl font-bold text-gold">
                  {formatINR(selectedDish.price)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/book-table" onClick={() => setSelectedDish(null)}>
                  <Button
                    variant="gold"
                    size="sm"
                    leftIcon={<CalendarCheck className="w-4 h-4" />}
                    className="shadow-gold text-xs"
                  >
                    Book Table to Taste
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedDish(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-6 text-left">
            {/* Modal Image */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-cream border border-cream-border">
              <img
                src={selectedDish.imageUrl}
                alt={selectedDish.name}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {selectedDish.badgeText && (
                  <Badge variant="gold" size="sm" className="font-bold shadow-2xs">
                    {selectedDish.badgeText}
                  </Badge>
                )}
                <Badge variant="primary" size="sm" className="bg-burgundy/90 text-cream backdrop-blur-xs">
                  {selectedDish.category}
                </Badge>
              </div>
            </div>

            {/* Quick Meta Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-cream border border-cream-border text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-secondary-text tracking-wider">
                  Availability
                </span>
                <p className="font-semibold text-burgundy-dark flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-status-success shrink-0" />
                  {selectedDish.availability}
                </p>
              </div>

              {selectedDish.preparationTime && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-secondary-text tracking-wider">
                    Prep Time
                  </span>
                  <p className="font-semibold text-burgundy-dark flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                    {selectedDish.preparationTime}
                  </p>
                </div>
              )}

              {selectedDish.spiceLevel && (
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-secondary-text tracking-wider">
                    Spice Level
                  </span>
                  <p className="font-semibold text-burgundy-dark flex items-center gap-1.5 mt-0.5">
                    <Flame className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                    {selectedDish.spiceLevel}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy-dark">
                Culinary Description
              </h4>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                {selectedDish.fullDescription}
              </p>
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy-dark">
                Key Ingredients & Spices
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedDish.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-cream border border-cream-border text-main-text"
                  >
                    <CheckCircle2 className="w-3 h-3 text-gold shrink-0" />
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Dietary Badges */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy-dark">
                Dietary & Allergen Notes
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedDish.dietaryInfo.map((info) => (
                  <Badge key={info} variant="secondary" size="sm">
                    {info}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
