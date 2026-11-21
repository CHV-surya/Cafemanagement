/**
 * Centralized local storage service abstraction.
 * Type-safe storage wrapper ready for upcoming features without external dependencies.
 */

const STORAGE_PREFIX = 'bistrohub_'

export const storageService = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = window.localStorage.getItem(STORAGE_PREFIX + key)
      return item ? (JSON.parse(item) as T) : defaultValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  },

  set<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  },

  remove(key: string): void {
    try {
      window.localStorage.removeItem(STORAGE_PREFIX + key)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  },

  clear(): void {
    try {
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith(STORAGE_PREFIX))
        .forEach((key) => window.localStorage.removeItem(key))
    } catch (error) {
      console.warn('Error clearing BistroHub storage:', error)
    }
  },
}
