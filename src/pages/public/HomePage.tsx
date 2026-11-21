import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Badge, HighlightCard, FoodCard } from '@/components/common'
import {
  HERO_DATA,
  HIGHLIGHTS_DATA,
  FEATURED_DISHES_DATA,
  SPECIAL_OFFER_DATA,
  ABOUT_PREVIEW_DATA,
} from '@/data/homeData'
import {
  CalendarCheck,
  UtensilsCrossed,
  ArrowRight,
  Sparkles,
  Star,
  CheckCircle2,
  Gift,
  HeartHandshake
} from 'lucide-react'

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col w-full selection:bg-gold/30 selection:text-burgundy-dark">
      {/* =========================================================================
          1. HERO SECTION
          Large restaurant interior background with dark overlay, left-aligned content
         ========================================================================= */}
      <section className="relative min-h-[580px] lg:min-h-[720px] flex items-center overflow-hidden bg-burgundy-dark text-cream border-b border-burgundy-border">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_DATA.bgImage}
            alt="BistroHub Restaurant Interior"
            className="w-full h-full object-cover object-center scale-105 animate-in fade-in duration-700"
            loading="eager"
          />
          {/* Multi-layered dark overlay for high contrast readability and rich burgundy tones */}
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy-dark via-burgundy-dark/85 to-burgundy-dark/50" />
          <div className="absolute inset-0 bg-black/30" />
          {/* Subtle gold radial ambient glow */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full text-left">
          <div className="max-w-2xl space-y-6">
            {/* Top Rating & Welcome Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-card/10 backdrop-blur-md text-gold border border-gold/30 text-xs font-semibold shadow-subtle animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>BistroHub Dining Experience</span>
              <span className="text-cream/50">•</span>
              <div className="flex items-center gap-1 text-cream/90">
                <Star className="w-3 h-3 fill-gold text-gold" />
                <span>4.9 / 5 Rated</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-cream leading-[1.08] drop-shadow-sm">
              {HERO_DATA.heading}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-cream/85 max-w-xl font-normal leading-relaxed">
              {HERO_DATA.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/menu">
                <Button
                  variant="gold"
                  size="lg"
                  leftIcon={<UtensilsCrossed className="w-4 h-4" />}
                  className="shadow-gold text-sm sm:text-base font-semibold"
                >
                  View Menu
                </Button>
              </Link>

              <Link to="/book-table">
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<CalendarCheck className="w-4 h-4 text-gold" />}
                  className="border-cream/40 text-cream hover:bg-cream/15 text-sm sm:text-base backdrop-blur-xs"
                >
                  Book a Table
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 border-t border-cream/20 flex flex-wrap items-center gap-6 text-xs text-cream/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                <span>Open Today: 11:30 AM – 11:30 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                <span>Instant Online Table Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. RESTAURANT HIGHLIGHTS
          Four reusable highlight cards: Fresh Ingredients, Chef's Specials, Cozy Ambience, Quick Service
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-cream border-b border-cream-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-dark">
              Why Dine With Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-burgundy-dark">
              Crafted With Passion, Served With Warmth
            </h2>
            <p className="text-sm text-secondary-text leading-relaxed">
              Every detail of your visit is orchestrated to provide wholesome flavors, relaxed comfort, and impeccable hospitality.
            </p>
          </div>

          {/* Four Highlight Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HIGHLIGHTS_DATA.map((item) => (
              <HighlightCard
                key={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURED MENU SECTION
          Heading: "Discover Our Favorites", 6 food cards with realistic dishes
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-cream-card/60 border-b border-cream-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 text-left max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-dark">
                Chef's Recommendations
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-burgundy-dark">
                Discover Our Favorites
              </h2>
              <p className="text-sm text-secondary-text leading-relaxed">
                A hand-curated selection of signature creations loved by our guests, made fresh to order with authentic recipes.
              </p>
            </div>

            <Link to="/menu" className="self-start md:self-auto shrink-0">
              <Button
                variant="outline"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4 text-gold" />}
                className="border-cream-border bg-cream hover:bg-cream-border text-xs sm:text-sm font-semibold"
              >
                View Full Menu
              </Button>
            </Link>
          </div>

          {/* 6 Featured Food Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {FEATURED_DISHES_DATA.map((dish) => (
              <FoodCard
                key={dish.id}
                name={dish.name}
                category={dish.category}
                price={dish.price}
                description={dish.description}
                imageUrl={dish.imageUrl}
                badgeText={dish.badgeText}
                viewMenuHref="/menu"
              />
            ))}
          </div>

          {/* Bottom Explore Banner */}
          <div className="mt-12 p-6 rounded-2xl bg-cream border border-cream-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-burgundy-dark">
                  Craving something specific?
                </h4>
                <p className="text-xs text-secondary-text">
                  Explore our complete selection of wood-fired specialties, regional mains, and mocktails.
                </p>
              </div>
            </div>
            <Link to="/menu">
              <Button variant="gold" size="sm" className="shadow-gold shrink-0 text-xs">
                Browse Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SPECIAL OFFERS SECTION
          Heading: "Make Your Dining Moments Special", promotional offer, Book Your Table button
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-burgundy-dark text-cream border border-burgundy-border shadow-elevated">
            {/* Background Image Texture */}
            <div className="absolute inset-0 z-0">
              <img
                src={SPECIAL_OFFER_DATA.bgImage}
                alt="Dining celebration"
                className="w-full h-full object-cover opacity-20 filter saturate-150"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-burgundy-dark via-burgundy-dark/95 to-burgundy-dark/80" />
            </div>

            {/* Gold Accent Glow */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-gold/20 rounded-full blur-3xl pointer-events-none" />

            {/* Offer Content */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16 text-left">
              <div className="lg:col-span-8 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/30 text-xs font-semibold">
                  <Gift className="w-3.5 h-3.5" />
                  {SPECIAL_OFFER_DATA.badge}
                </div>

                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cream tracking-tight leading-tight">
                  {SPECIAL_OFFER_DATA.heading}
                </h2>

                <p className="text-sm sm:text-base text-cream/80 max-w-2xl leading-relaxed">
                  {SPECIAL_OFFER_DATA.subtitle}
                </p>

                {/* Promo Code Box */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="px-4 py-2 rounded-xl bg-burgundy border border-gold/40 flex items-center gap-2.5 shadow-2xs">
                    <span className="text-xs uppercase text-cream/70 font-medium">Use Code:</span>
                    <span className="font-mono text-sm font-bold tracking-widest text-gold">
                      {SPECIAL_OFFER_DATA.promoCode}
                    </span>
                  </div>
                  <span className="text-xs text-cream/60">
                    {SPECIAL_OFFER_DATA.terms}
                  </span>
                </div>
              </div>

              {/* Offer CTA Column */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <Link to="/book-table" className="w-full">
                  <Button
                    variant="gold"
                    size="lg"
                    leftIcon={<CalendarCheck className="w-4 h-4" />}
                    className="w-full shadow-gold font-bold text-sm sm:text-base"
                  >
                    Book Your Table
                  </Button>
                </Link>

                <Link to="/menu" className="w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-cream/30 text-cream hover:bg-cream/10 text-sm"
                  >
                    Explore Seasonal Menu
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. ABOUT PREVIEW SECTION
          Restaurant image, short introduction, Our Story button
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-cream-card border-t border-cream-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Image Column with Decorative Frame */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto rounded-3xl overflow-hidden shadow-elevated border border-cream-border aspect-[4/3] bg-cream">
                <img
                  src={ABOUT_PREVIEW_DATA.imageUrl}
                  alt="BistroHub Restaurant Ambience"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-cream text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                    Warm & Inviting
                  </span>
                  <h4 className="font-display text-lg font-bold">
                    Designed for memorable conversations
                  </h4>
                </div>
              </div>

              {/* Floating Badge Card */}
              <div className="hidden sm:flex absolute -bottom-6 -right-6 rounded-2xl bg-burgundy-dark text-cream p-4 border border-burgundy-border shadow-elevated items-center gap-3 max-w-xs text-left">
                <div className="w-10 h-10 rounded-xl bg-gold text-burgundy-dark flex items-center justify-center shrink-0 font-bold">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-cream">Hospitality First</p>
                  <p className="text-[11px] text-cream/70 leading-tight">Every guest greeted like family.</p>
                </div>
              </div>
            </div>

            {/* Text Narrative Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <Badge variant="gold" size="md">
                {ABOUT_PREVIEW_DATA.badge}
              </Badge>

              <h2 className="font-display text-3xl sm:text-4xl font-bold text-burgundy-dark leading-tight">
                {ABOUT_PREVIEW_DATA.heading}
              </h2>

              <p className="text-sm text-secondary-text leading-relaxed">
                {ABOUT_PREVIEW_DATA.description}
              </p>

              {/* Three Key Pillars */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-main-text">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>{ABOUT_PREVIEW_DATA.storyPoint1}</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-main-text">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>{ABOUT_PREVIEW_DATA.storyPoint2}</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-main-text">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>{ABOUT_PREVIEW_DATA.storyPoint3}</span>
                </div>
              </div>

              {/* CTA Button to About Page */}
              <div className="pt-4">
                <Link to="/about">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-4 h-4 text-gold" />}
                    className="shadow-subtle"
                  >
                    Our Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
