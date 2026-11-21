import React from 'react'
import { Link } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'
import { RESTAURANT_INFO } from '@/data/mockData'
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react'

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-burgundy-dark text-cream border-t border-burgundy-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand Info & Socials */}
          <div className="space-y-4 md:col-span-1 text-left">
            <BrandLogo variant="light" to="/" />
            <p className="text-xs text-cream/70 leading-relaxed">
              {RESTAURANT_INFO.tagline}. Delicious food, cozy ambience, and unforgettable moments crafted daily.
            </p>

            {/* Social Media Icons */}
            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-gold mb-2.5">
                Connect With Us
              </p>
              <div className="flex items-center gap-3">
                {/* Instagram */}
                <a
                  href={RESTAURANT_INFO.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-burgundy/60 border border-burgundy-border flex items-center justify-center text-cream/80 hover:text-gold hover:border-gold/50 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href={RESTAURANT_INFO.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-burgundy/60 border border-burgundy-border flex items-center justify-center text-cream/80 hover:text-gold hover:border-gold/50 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href={RESTAURANT_INFO.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-burgundy/60 border border-burgundy-border flex items-center justify-center text-cream/80 hover:text-gold hover:border-gold/50 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="space-y-3 text-left">
            <h4 className="font-display text-sm font-bold text-gold uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-cream/70">
              <li>
                <Link to="/" className="hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-gold transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link to="/book-table" className="hover:text-gold transition-colors">
                  Book a Table
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold transition-colors">
                  About BistroHub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="space-y-3 text-left">
            <h4 className="font-display text-sm font-bold text-gold uppercase tracking-wider">
              Hours & Location
            </h4>
            <ul className="space-y-2.5 text-xs text-cream/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                <span>{RESTAURANT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>{RESTAURANT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>{RESTAURANT_INFO.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                <span>{RESTAURANT_INFO.hours}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: SaaS Staff Access */}
          <div className="space-y-3 text-left">
            <h4 className="font-display text-sm font-bold text-gold uppercase tracking-wider">
              Staff & Operations
            </h4>
            <p className="text-xs text-cream/70 leading-relaxed">
              Authorized restaurant staff only. Access management console, order dispatch, and kitchen display terminals.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <Link
                to="/staff/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-light transition-colors"
              >
                Staff Portal Login <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-cream/50">
                <Link to="/admin/dashboard" className="hover:underline">Admin</Link>
                <span>•</span>
                <Link to="/waiter/dashboard" className="hover:underline">Waiter</Link>
                <span>•</span>
                <Link to="/kitchen/dashboard" className="hover:underline">Kitchen</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-burgundy-border/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-cream/50 gap-4">
          <p>© {new Date().getFullYear()} BistroHub. All rights reserved. (Demonstration Platform)</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-cream/80 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-cream/80 cursor-pointer">Terms of Service</span>
            <span className="hover:text-cream/80 cursor-pointer">Table Policies</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
