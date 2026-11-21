import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Input, Badge } from '@/components/common'
import { BrandLogo } from '@/components/layout'
import { useAuthStore } from '@/store'
import { UserRole } from '@/types'
import { DEMO_ACCOUNTS, ROLE_DETAILS, DemoStaffAccount } from '@/data/staffData'
import {
  Lock,
  User,
  ShieldCheck,
  UtensilsCrossed,
  ChefHat,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  KeyRound
} from 'lucide-react'

export const StaffLoginPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuthStore()

  // Initialize selected role from query param or default to 'admin'
  const initialRoleParam = searchParams.get('role') as UserRole
  const validInitialRole: UserRole =
    initialRoleParam && ['admin', 'waiter', 'kitchen'].includes(initialRoleParam)
      ? initialRoleParam
      : 'admin'

  const [selectedRole, setSelectedRole] = useState<UserRole>(validInitialRole)
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Redirect path if unauthenticated user was redirected here
  const redirectTarget = searchParams.get('redirect')

  // Set default credentials whenever switching role tabs
  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role)
    setError(null)

    // Pre-populate with first demo account for that role
    if (role === 'admin') {
      setUsername('admin')
      setPassword('admin123')
    } else if (role === 'waiter') {
      setUsername('waiter1')
      setPassword('waiter123')
    } else if (role === 'kitchen') {
      setUsername('kitchen')
      setPassword('kitchen123')
    }
  }

  // Quick auto-fill button for testing specific demo accounts
  const handleAutoFill = (acc: DemoStaffAccount) => {
    setUsername(acc.username)
    setPassword(acc.passwordHash)
    setError(null)
  }

  // Handle Login submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username.trim()) {
      setError('Username is required.')
      return
    }
    if (!password.trim()) {
      setError('Password is required.')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const result = login(username, password)
      setIsLoading(false)

      if (!result.success || !result.user) {
        setError(result.error || 'Authentication failed. Please verify credentials.')
        return
      }

      // Check role authorization destination
      const userRole = result.user.role

      if (redirectTarget && redirectTarget.startsWith(`/${userRole}`)) {
        navigate(redirectTarget)
      } else {
        switch (userRole) {
          case 'admin':
            navigate('/admin/dashboard')
            break
          case 'waiter':
            navigate('/waiter/dashboard')
            break
          case 'kitchen':
            navigate('/kitchen/dashboard')
            break
          default:
            navigate('/staff')
        }
      }
    }, 450)
  }

  // Filter demo accounts matching the currently selected tab
  const activeRoleDemoAccounts = DEMO_ACCOUNTS.filter(
    (acc) => acc.role === selectedRole
  )

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-gold/30 selection:text-burgundy-dark text-left">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <BrandLogo variant="dark" to="/" />
        <Link to="/staff">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Staff Portal
          </Button>
        </Link>
      </div>

      {/* Main Login Canvas */}
      <div className="max-w-xl mx-auto w-full py-8 sm:py-12 space-y-6">
        {/* Login Card */}
        <div className="rounded-3xl bg-cream-card p-6 sm:p-10 border border-cream-border shadow-elevated">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-burgundy text-gold flex items-center justify-center mx-auto shadow-subtle">
              <KeyRound className="w-7 h-7 stroke-[1.8]" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-burgundy-dark">
              Staff Station Login
            </h1>
            <p className="text-xs text-secondary-text max-w-sm mx-auto">
              Select your role category and authenticate with your designated staff credentials.
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="mb-6 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text">
              Target Workspace Station
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-cream border border-cream-border">
              {/* Admin Tab */}
              <button
                type="button"
                onClick={() => handleRoleTabChange('admin')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-burgundy text-cream shadow-subtle'
                    : 'text-secondary-text hover:text-burgundy-dark hover:bg-cream-border/40'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 mb-1 ${selectedRole === 'admin' ? 'text-gold' : ''}`} />
                <span>Admin</span>
              </button>

              {/* Waiter Tab */}
              <button
                type="button"
                onClick={() => handleRoleTabChange('waiter')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedRole === 'waiter'
                    ? 'bg-burgundy text-cream shadow-subtle'
                    : 'text-secondary-text hover:text-burgundy-dark hover:bg-cream-border/40'
                }`}
              >
                <UtensilsCrossed className={`w-4 h-4 mb-1 ${selectedRole === 'waiter' ? 'text-gold' : ''}`} />
                <span>Waiter</span>
              </button>

              {/* Kitchen Tab */}
              <button
                type="button"
                onClick={() => handleRoleTabChange('kitchen')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedRole === 'kitchen'
                    ? 'bg-burgundy text-cream shadow-subtle'
                    : 'text-secondary-text hover:text-burgundy-dark hover:bg-cream-border/40'
                }`}
              >
                <ChefHat className={`w-4 h-4 mb-1 ${selectedRole === 'kitchen' ? 'text-gold' : ''}`} />
                <span>Kitchen</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-status-danger text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Username Input */}
            <Input
              label="Staff Username *"
              placeholder="e.g. admin, waiter1, kitchen"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (error) setError(null)
              }}
              leftIcon={<User className="w-4 h-4 text-gold" />}
              required
            />

            {/* Password Input with Show/Hide Toggle */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text">
                Password *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-secondary-text/70">
                  <Lock className="w-4 h-4 text-gold" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError(null)
                  }}
                  placeholder="Enter staff security password"
                  className="w-full rounded-xl bg-cream-card pl-10 pr-11 py-2 text-sm text-main-text border border-cream-border hover:border-burgundy/20 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 p-1 rounded-md text-secondary-text hover:text-burgundy focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="gold"
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full shadow-gold font-bold text-sm py-3"
              >
                Sign In to {ROLE_DETAILS[selectedRole].title}
              </Button>
            </div>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-8 pt-6 border-t border-cream-border space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-burgundy-dark flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" /> Available Demo Accounts ({selectedRole.toUpperCase()})
              </span>
              <Badge variant="gold" size="sm">
                1-Click Auto Fill
              </Badge>
            </div>

            <div className="space-y-2">
              {activeRoleDemoAccounts.map((acc) => {
                const isSelected = username === acc.username
                return (
                  <div
                    key={acc.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                      isSelected
                        ? 'bg-cream border-gold/60'
                        : 'bg-cream/40 border-cream-border/70 hover:bg-cream'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-burgundy-dark">@{acc.username}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gold/15 text-gold-dark">
                          ID: {acc.id}
                        </span>
                        {!acc.isActive && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-secondary-text mt-0.5">
                        {acc.name} • PW: <code className="font-mono text-burgundy-dark">{acc.passwordHash}</code>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAutoFill(acc)}
                      className="px-2.5 py-1 rounded-lg bg-cream-card border border-cream-border text-[11px] font-semibold text-gold-dark hover:bg-gold hover:text-burgundy-dark transition-colors shrink-0 shadow-2xs"
                    >
                      {acc.isActive ? 'Auto Fill' : 'Test Inactive'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Security Disclosure */}
        <p className="text-center text-[11px] text-secondary-text">
          Frontend demonstration authentication system. Session maintained locally via browser storage.
        </p>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto w-full text-center text-[11px] text-secondary-text/80">
        BistroHub Management System • End-to-End Restaurant Operational SaaS
      </div>
    </div>
  )
}
