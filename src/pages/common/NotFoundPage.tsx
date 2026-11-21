import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/common'
import { BrandLogo } from '@/components/layout'
import { Compass, Home } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between p-6">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <BrandLogo variant="dark" to="/" />
      </div>

      <div className="max-w-md mx-auto text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-burgundy/10 text-gold flex items-center justify-center mx-auto border border-cream-border shadow-subtle">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="font-display text-4xl font-bold text-burgundy-dark">
          Page Not Found
        </h1>
        <p className="text-xs text-secondary-text leading-relaxed">
          The requested BistroHub page does not exist or has been relocated.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/">
            <Button variant="gold" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Return Home
            </Button>
          </Link>
          <Link to="/admin/dashboard">
            <Button variant="secondary" size="md">
              Admin Portal
            </Button>
          </Link>
        </div>
      </div>

      <div className="text-center text-[11px] text-secondary-text">
        BistroHub Management System
      </div>
    </div>
  )
}
