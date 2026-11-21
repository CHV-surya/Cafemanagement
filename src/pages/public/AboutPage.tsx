import React from 'react'
import { PageHeader, Badge, Button } from '@/components/common'
import { Link } from 'react-router-dom'
import { CalendarCheck, Award, Heart, Utensils, Sparkles } from 'lucide-react'

export const AboutPage: React.FC = () => {
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <PageHeader
        title="Our Story & Culinary Ethos"
        subtitle="Where time-honored European gastronomy converges with modern restaurant craft."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About' },
        ]}
        actions={
          <Link to="/book-table">
            <Button variant="gold" size="md" leftIcon={<CalendarCheck className="w-4 h-4" />}>
              Reserve a Table
            </Button>
          </Link>
        }
      />

      {/* Main Narrative */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5 text-left">
          <Badge variant="gold" size="md">
            Established 2018
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-burgundy-dark leading-tight">
            Rooted in heritage, inspired by seasonality.
          </h2>
          <p className="text-sm text-secondary-text leading-relaxed">
            Founded by culinary artisans with roots in Parisian bistros and contemporary New York fine dining, BistroHub was conceived as a testament to the joy of gastronomy. Every menu item reflects countless hours of sauce reductions, artisanal dough fermentations, and deep relationships with small regional growers and organic purveyors.
          </p>
          <p className="text-sm text-secondary-text leading-relaxed">
            Beyond the kitchen, our restaurant is orchestrated by our proprietary BistroHub operational suite—allowing our kitchen brigade and front-of-house staff to synchronize effortlessly so that every guest feels like the only guest in the room.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl overflow-hidden shadow-elevated border border-cream-border">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
              alt="BistroHub Restaurant Interior"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Culinary Pillars */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-cream-card p-6 border border-cream-border shadow-subtle text-left">
          <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center mb-4">
            <Utensils className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-burgundy-dark mb-2">
            Scratch Kitchen Purity
          </h3>
          <p className="text-xs text-secondary-text leading-relaxed">
            Stocks simmered for 36 hours, pasta hand-rolled each morning, and in-house aged charcuterie crafted without artificial shortcuts.
          </p>
        </div>

        <div className="rounded-2xl bg-cream-card p-6 border border-cream-border shadow-subtle text-left">
          <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center mb-4">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-burgundy-dark mb-2">
            Warm, Attentive Hospitality
          </h3>
          <p className="text-xs text-secondary-text leading-relaxed">
            Dining is an emotional experience. Our floor team anticipates every need with discreet elegance and warm generosity.
          </p>
        </div>

        <div className="rounded-2xl bg-cream-card p-6 border border-cream-border shadow-subtle text-left">
          <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center mb-4">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-burgundy-dark mb-2">
            Sustained Excellence
          </h3>
          <p className="text-xs text-secondary-text leading-relaxed">
            Recognized consistently for culinary integrity, cellar curation, and zero-compromise kitchen sustainability.
          </p>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="mt-16 pt-12 border-t border-cream-border text-left">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-4 h-4 text-gold" />
          <h3 className="font-display text-xl font-bold text-burgundy-dark">
            Culinary & Service Leadership
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-cream-card p-5 border border-cream-border flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80"
              alt="Chef Antoine Mercer"
              className="w-14 h-14 rounded-full object-cover border border-cream-border"
            />
            <div>
              <h4 className="font-display text-sm font-bold text-burgundy-dark">
                Antoine Mercer
              </h4>
              <p className="text-xs text-gold-dark font-medium">Head Chef & Co-Founder</p>
              <p className="text-[11px] text-secondary-text mt-0.5">L’Arpège Alumni</p>
            </div>
          </div>

          <div className="rounded-2xl bg-cream-card p-5 border border-cream-border flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Laurent Moreau"
              className="w-14 h-14 rounded-full object-cover border border-cream-border"
            />
            <div>
              <h4 className="font-display text-sm font-bold text-burgundy-dark">
                Laurent Moreau
              </h4>
              <p className="text-xs text-gold-dark font-medium">General Manager & Sommelier</p>
              <p className="text-[11px] text-secondary-text mt-0.5">Court of Master Sommeliers</p>
            </div>
          </div>

          <div className="rounded-2xl bg-cream-card p-5 border border-cream-border flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
              alt="Sophie Dubois"
              className="w-14 h-14 rounded-full object-cover border border-cream-border"
            />
            <div>
              <h4 className="font-display text-sm font-bold text-burgundy-dark">
                Sophie Dubois
              </h4>
              <p className="text-xs text-gold-dark font-medium">Head of Guest Experience</p>
              <p className="text-[11px] text-secondary-text mt-0.5">Hospitality Director</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
