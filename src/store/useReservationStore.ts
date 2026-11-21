import { create } from 'zustand'
import { storageService } from '@/services/storageService'
import {
  StoredReservation,
  DEMO_TABLES,
  INITIAL_DEMO_RESERVATIONS,
  RestaurantTable,
} from '@/data/tableData'
import { useOrderStore } from './useOrderStore'

export type TableAvailabilityStatus = 'Available' | 'Reserved' | 'Occupied'

export interface TableWithAvailability extends RestaurantTable {
  status: TableAvailabilityStatus
  isSelectable: boolean
  unavailabilityReason?: string
}

interface ReservationState {
  reservations: StoredReservation[]
  addReservation: (reservation: Omit<StoredReservation, 'id' | 'createdAt'>) => StoredReservation
  cancelReservation: (id: string, reason?: string) => { success: boolean; error?: string }
  updateReservationStatus: (
    id: string,
    status: StoredReservation['status']
  ) => { success: boolean; error?: string }
  getTableAvailability: (
    date: string,
    time: string,
    guests: number,
    seatingPreference: 'Indoor' | 'Outdoor' | 'No Preference'
  ) => TableWithAvailability[]
  getReservationById: (id: string) => StoredReservation | undefined
  resetToInitialDemo: () => void
}

const STORAGE_KEY = 'reservations'

// Helper to convert "HH:mm" to total minutes from midnight
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return (hours || 0) * 60 + (minutes || 0)
}

// Generate unique human-readable reservation ID
export function generateReservationId(dateStr: string): string {
  const cleanDate = dateStr.replace(/-/g, '')
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  return `RES-${cleanDate}-${randomSuffix}`
}

export const useReservationStore = create<ReservationState>((set, get) => ({
  reservations: storageService.get<StoredReservation[]>(
    STORAGE_KEY,
    INITIAL_DEMO_RESERVATIONS
  ),

  addReservation: (newReservationData) => {
    const id = generateReservationId(newReservationData.date)
    const newReservation: StoredReservation = {
      ...newReservationData,
      id,
      createdAt: new Date().toISOString(),
    }

    const updated = [newReservation, ...get().reservations]
    set({ reservations: updated })
    storageService.set(STORAGE_KEY, updated)
    return newReservation
  },

  cancelReservation: (id, _reason) => {
    const res = get().reservations.find((r) => r.id === id)
    if (!res) {
      return { success: false, error: 'Reservation not found.' }
    }

    const updated = get().reservations.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status: 'cancelled' as const,
        }
      }
      return r
    })

    set({ reservations: updated })
    storageService.set(STORAGE_KEY, updated)
    return { success: true }
  },

  updateReservationStatus: (id, status) => {
    const res = get().reservations.find((r) => r.id === id)
    if (!res) {
      return { success: false, error: 'Reservation not found.' }
    }

    const updated = get().reservations.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status,
        }
      }
      return r
    })

    set({ reservations: updated })
    storageService.set(STORAGE_KEY, updated)
    return { success: true }
  },

  getTableAvailability: (date, time, guests, seatingPreference) => {
    const { reservations } = get()
    const targetMinutes = timeToMinutes(time)
    const todayStr = new Date().toISOString().split('T')[0]
    const currentNowMinutes = new Date().getHours() * 60 + new Date().getMinutes()

    return DEMO_TABLES.map((table) => {
      // 1. Check existing active reservations for this table on the target date (excluding cancelled)
      const matchingRes = reservations.find((res) => {
        if (res.tableId !== table.id || res.date !== date || res.status === 'cancelled') {
          return false
        }
        const resMinutes = timeToMinutes(res.time)
        // Two hour duration overlap check: |target - res| < 120 minutes
        return Math.abs(targetMinutes - resMinutes) < 120
      })

      // 2. Check if table is occupied right now with an active order from centralized order store
      let status: TableAvailabilityStatus = 'Available'
      let unavailabilityReason: string | undefined

      let activeOrder = undefined
      try {
        activeOrder = date === todayStr ? useOrderStore.getState().getActiveOrderForTable(table.id) : undefined
      } catch {
        // Safe fallback
      }

      if (activeOrder) {
        status = 'Occupied'
        unavailabilityReason = `Table currently occupied with active order ${activeOrder.id} (${activeOrder.status})`
      } else if (matchingRes) {
        const resMinutes = timeToMinutes(matchingRes.time)
        const isCurrentlyActiveNow =
          date === todayStr &&
          (matchingRes.status === 'seated' ||
            (currentNowMinutes >= resMinutes && currentNowMinutes < resMinutes + 120))

        status = isCurrentlyActiveNow ? 'Occupied' : 'Reserved'
        unavailabilityReason = `Booked for ${matchingRes.time} (${matchingRes.guests} guests)`
      } else if (table.capacity < guests) {
        unavailabilityReason = `Table capacity (${table.capacity}) is too small for ${guests} guests`
      } else if (
        seatingPreference !== 'No Preference' &&
        table.seatingType !== seatingPreference
      ) {
        unavailabilityReason = `Location is ${table.seatingType} (preference was ${seatingPreference})`
      }

      const isCapacitySufficient = table.capacity >= guests
      const isSelectable = status === 'Available' && isCapacitySufficient

      return {
        ...table,
        status,
        isSelectable,
        unavailabilityReason,
      }
    })
  },

  getReservationById: (id) => {
    return get().reservations.find((r) => r.id === id)
  },

  resetToInitialDemo: () => {
    set({ reservations: INITIAL_DEMO_RESERVATIONS })
    storageService.set(STORAGE_KEY, INITIAL_DEMO_RESERVATIONS)
  },
}))
