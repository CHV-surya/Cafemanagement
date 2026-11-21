import { create } from 'zustand'
import { UserProfile, UserRole } from '@/types'
import { DEMO_ACCOUNTS, DemoStaffAccount } from '@/data/staffData'
import { storageService } from '@/services/storageService'

interface LoginResult {
  success: boolean
  error?: string
  user?: UserProfile
}

interface AuthState {
  currentUser: UserProfile | null
  isAuthenticated: boolean
  role: UserRole | null
  login: (username: string, password: string) => LoginResult
  loginAsRole: (role: UserRole) => UserProfile
  logout: () => void
  switchRole: (role: UserRole) => void
}

const AUTH_STORAGE_KEY = 'auth_session'

// Read persisted session from LocalStorage
const getInitialUser = (): UserProfile | null => {
  return storageService.get<UserProfile | null>(AUTH_STORAGE_KEY, null)
}

const mapDemoToProfile = (account: DemoStaffAccount): UserProfile => ({
  id: account.id,
  name: account.name,
  email: account.email,
  role: account.role,
  username: account.username,
  shift: account.shift,
  avatarUrl: account.avatarUrl,
  isActive: account.isActive,
})

const initialUser = getInitialUser()

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: initialUser,
  isAuthenticated: Boolean(initialUser),
  role: initialUser ? initialUser.role : null,

  login: (username: string, password: string): LoginResult => {
    const trimmedUser = username.trim().toLowerCase()
    const trimmedPass = password.trim()

    // 1. Locate account in demo credentials
    const account = DEMO_ACCOUNTS.find(
      (acc) => acc.username.toLowerCase() === trimmedUser
    )

    if (!account) {
      return {
        success: false,
        error: `User "${username}" not found. Please check your username.`,
      }
    }

    // 2. Validate password
    if (account.passwordHash !== trimmedPass) {
      return {
        success: false,
        error: 'Incorrect password. Please verify credentials.',
      }
    }

    // 3. Verify active status
    if (!account.isActive) {
      return {
        success: false,
        error: 'This staff account is currently deactivated. Please contact restaurant management.',
      }
    }

    // 4. Successful login
    const profile = mapDemoToProfile(account)
    set({
      currentUser: profile,
      isAuthenticated: true,
      role: profile.role,
    })

    // Persist to LocalStorage
    storageService.set(AUTH_STORAGE_KEY, profile)

    return {
      success: true,
      user: profile,
    }
  },

  // Convenience quick-login by role for testing
  loginAsRole: (role: UserRole): UserProfile => {
    const account = DEMO_ACCOUNTS.find((a) => a.role === role && a.isActive) || DEMO_ACCOUNTS[0]
    const profile = mapDemoToProfile(account)

    set({
      currentUser: profile,
      isAuthenticated: true,
      role: profile.role,
    })

    storageService.set(AUTH_STORAGE_KEY, profile)
    return profile
  },

  logout: () => {
    set({
      currentUser: null,
      isAuthenticated: false,
      role: null,
    })
    storageService.remove(AUTH_STORAGE_KEY)
  },

  switchRole: (role: UserRole) => {
    const account = DEMO_ACCOUNTS.find((a) => a.role === role && a.isActive) || DEMO_ACCOUNTS[0]
    const profile = mapDemoToProfile(account)

    set({
      currentUser: profile,
      isAuthenticated: true,
      role: profile.role,
    })

    storageService.set(AUTH_STORAGE_KEY, profile)
  },
}))
