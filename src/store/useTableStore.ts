import { create } from 'zustand'
import { storageService } from '@/services/storageService'
import { DEMO_TABLES, RestaurantTable } from '@/data/tableData'
import { DEMO_TABLE_ASSIGNMENTS, TableWaiterAssignment } from '@/data/waiterData'
import { DEMO_ACCOUNTS, DemoStaffAccount } from '@/data/staffData'

interface TableStoreState {
  tables: RestaurantTable[]
  assignments: TableWaiterAssignment[]

  // Queries
  getTableById: (id: string) => RestaurantTable | undefined
  getAssignedTablesForWaiter: (waiterId: string) => RestaurantTable[]
  getTableIdsForWaiter: (waiterId: string) => string[]
  getWaiterForTable: (tableId: string) => string | undefined
  getAssignedWaiterAccount: (tableId: string) => DemoStaffAccount | undefined
  getSectionNameForWaiter: (waiterId: string) => string

  // Actions
  reassignWaiter: (tableId: string, newWaiterId: string, sectionName?: string) => { success: boolean; error?: string }
  resetToDefaultAssignments: () => void
}

const STORAGE_KEY = 'table_assignments'

export const useTableStore = create<TableStoreState>((set, get) => ({
  tables: DEMO_TABLES,
  assignments: storageService.get<TableWaiterAssignment[]>(
    STORAGE_KEY,
    DEMO_TABLE_ASSIGNMENTS
  ),

  getTableById: (id) => {
    return get().tables.find((t) => t.id === id)
  },

  getTableIdsForWaiter: (waiterId) => {
    return get()
      .assignments.filter((a) => a.waiterId === waiterId)
      .map((a) => a.tableId)
  },

  getAssignedTablesForWaiter: (waiterId) => {
    const tableIds = new Set(get().getTableIdsForWaiter(waiterId))
    return get().tables.filter((t) => tableIds.has(t.id))
  },

  getWaiterForTable: (tableId) => {
    return get().assignments.find((a) => a.tableId === tableId)?.waiterId
  },

  getAssignedWaiterAccount: (tableId) => {
    const waiterId = get().getWaiterForTable(tableId)
    if (!waiterId) return undefined
    return DEMO_ACCOUNTS.find((acc) => acc.id === waiterId && acc.role === 'waiter')
  },

  getSectionNameForWaiter: (waiterId) => {
    const assignment = get().assignments.find((a) => a.waiterId === waiterId)
    return assignment ? assignment.sectionName : 'General Dining Room'
  },

  reassignWaiter: (tableId, newWaiterId, sectionName) => {
    const waiter = DEMO_ACCOUNTS.find((a) => a.id === newWaiterId && a.role === 'waiter')
    if (!waiter) {
      return { success: false, error: 'Invalid waiter specified.' }
    }

    const currentAssignments = get().assignments
    const existingIndex = currentAssignments.findIndex((a) => a.tableId === tableId)

    let updated: TableWaiterAssignment[]
    if (existingIndex >= 0) {
      updated = currentAssignments.map((a, idx) => {
        if (idx === existingIndex) {
          return {
            ...a,
            waiterId: newWaiterId,
            sectionName: sectionName || a.sectionName,
          }
        }
        return a
      })
    } else {
      updated = [
        ...currentAssignments,
        {
          tableId,
          waiterId: newWaiterId,
          sectionName: sectionName || 'Dining Room Floor',
          shift: 'Evening Shift',
        },
      ]
    }

    set({ assignments: updated })
    storageService.set(STORAGE_KEY, updated)
    return { success: true }
  },

  resetToDefaultAssignments: () => {
    set({ assignments: DEMO_TABLE_ASSIGNMENTS })
    storageService.set(STORAGE_KEY, DEMO_TABLE_ASSIGNMENTS)
  },
}))
