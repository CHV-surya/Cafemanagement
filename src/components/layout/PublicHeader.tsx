import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'
import { Button } from '@/components/common'
import { PUBLIC_NAV_ITEMS } from '@/data/navigation'
import { Menu, X, CalendarCheck, Lock } from 'lucide-react'
import { cn } from '@/utils'

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full bg-cream-card/95 border-b border-cream-border/80 backdrop-blur-md transition-all shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <BrandLogo variant="dark" to="/" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'px-3.5 py-2 rounded-xl text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'text-burgundy-dark font-semibold bg-cream border border-cream-border/70 shadow-2xs'
                      : 'text-secondary-text hover:text-burgundy hover:bg-cream/50'
                  )
                }
              >
                {item.title}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/staff/login">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Lock className="w-3.5 h-3.5 text-secondary-text" />}
                className="text-xs text-secondary-text hover:text-burgundy"
              >
                Staff Portal
              </Button>
            </Link>

            <Link to="/book-table">
              <Button
                variant="gold"
                size="md"
                leftIcon={<CalendarCheck className="w-4 h-4" />}
                className="shadow-gold"
              >
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/book-table">
              <Button variant="gold" size="sm" className="text-xs px-3">
                Book Now
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-burgundy-dark hover:bg-cream transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-cream-border bg-cream-card px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-burgundy text-cream font-semibold'
                      : 'text-main-text hover:bg-cream'
                  )
                }
              >
                {item.title}
              </NavLink>
            ))}
          </div>

          <div className="pt-2 border-t border-cream-border flex flex-col gap-2">
            <Link to="/book-table" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="gold" size="md" className="w-full">
                Book a Table
              </Button>
            </Link>
            <Link to="/staff/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="md" className="w-full">
                Staff Portal Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
