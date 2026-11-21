import { DEMO_TABLES, RestaurantTable } from './tableData'
import { useTableStore } from '@/store/useTableStore'

export interface TableWaiterAssignment {
  tableId: string
  waiterId: string
  sectionName: string
  shift: string
}

export interface WaiterActivityLog {
  id: string
  waiterId: string
  type: 'order_placed' | 'sent_to_kitchen' | 'food_served' | 'table_assigned' | 'order_completed'
  title: string
  description: string
  tableNumber: string
  timestamp: string
  time: string
  status: 'info' | 'success' | 'warning' | 'primary'
}

// Centralized table assignments associating DEMO_TABLES with unique Waiter IDs
export const DEMO_TABLE_ASSIGNMENTS: TableWaiterAssignment[] = [
  // Waiter 1 (WTR001 - Sophie Dubois): Tables T01 - T05 (Main Dining Section)
  { tableId: 'T01', waiterId: 'WTR001', sectionName: 'Main Dining & Window Booths', shift: 'Evening Shift' },
  { tableId: 'T02', waiterId: 'WTR001', sectionName: 'Main Dining & Window Booths', shift: 'Evening Shift' },
  { tableId: 'T03', waiterId: 'WTR001', sectionName: 'Main Dining & Window Booths', shift: 'Evening Shift' },
  { tableId: 'T04', waiterId: 'WTR001', sectionName: 'Main Dining & Window Booths', shift: 'Evening Shift' },
  { tableId: 'T05', waiterId: 'WTR001', sectionName: 'Main Dining & Window Booths', shift: 'Evening Shift' },

  // Waiter 2 (WTR002 - Aarav Sharma): Tables T06 - T10 (Garden Terrace & Patio Section)
  { tableId: 'T06', waiterId: 'WTR002', sectionName: 'Garden Terrace & Veranda', shift: 'Evening Shift' },
  { tableId: 'T07', waiterId: 'WTR002', sectionName: 'Garden Terrace & Veranda', shift: 'Evening Shift' },
  { tableId: 'T08', waiterId: 'WTR002', sectionName: 'Garden Terrace & Veranda', shift: 'Evening Shift' },
  { tableId: 'T09', waiterId: 'WTR002', sectionName: 'Garden Terrace & Veranda', shift: 'Evening Shift' },
  { tableId: 'T10', waiterId: 'WTR002', sectionName: 'Garden Terrace & Veranda', shift: 'Evening Shift' },

  // Waiter 3 (WTR003 - Priya Patel): Tables T11 - T15 (Royal Banquet & Pavilion Section)
  { tableId: 'T11', waiterId: 'WTR003', sectionName: 'Royal Banquet & Private Pavilion', shift: 'Evening Shift' },
  { tableId: 'T12', waiterId: 'WTR003', sectionName: 'Royal Banquet & Private Pavilion', shift: 'Evening Shift' },
  { tableId: 'T13', waiterId: 'WTR003', sectionName: 'Royal Banquet & Private Pavilion', shift: 'Evening Shift' },
  { tableId: 'T14', waiterId: 'WTR003', sectionName: 'Royal Banquet & Private Pavilion', shift: 'Evening Shift' },
  { tableId: 'T15', waiterId: 'WTR003', sectionName: 'Royal Banquet & Private Pavilion', shift: 'Evening Shift' },
]

// Helper: Get table IDs assigned to a specific waiter (reactive to store)
export function getTableIdsForWaiter(waiterId: string): string[] {
  try {
    return useTableStore.getState().getTableIdsForWaiter(waiterId)
  } catch {
    return DEMO_TABLE_ASSIGNMENTS
      .filter((a) => a.waiterId === waiterId)
      .map((a) => a.tableId)
  }
}

// Helper: Get full RestaurantTable objects assigned to a specific waiter (reactive to store)
export function getAssignedTablesForWaiter(waiterId: string): RestaurantTable[] {
  try {
    return useTableStore.getState().getAssignedTablesForWaiter(waiterId)
  } catch {
    const tableIds = new Set(getTableIdsForWaiter(waiterId))
    return DEMO_TABLES.filter((t) => tableIds.has(t.id))
  }
}

// Helper: Get waiter ID assigned to a specific table (reactive to store)
export function getWaiterForTable(tableId: string): string | undefined {
  try {
    return useTableStore.getState().getWaiterForTable(tableId)
  } catch {
    return DEMO_TABLE_ASSIGNMENTS.find((a) => a.tableId === tableId)?.waiterId
  }
}

// Helper: Get section name assigned to a specific waiter (reactive to store)
export function getSectionNameForWaiter(waiterId: string): string {
  try {
    return useTableStore.getState().getSectionNameForWaiter(waiterId)
  } catch {
    const assignment = DEMO_TABLE_ASSIGNMENTS.find((a) => a.waiterId === waiterId)
    return assignment ? assignment.sectionName : 'General Dining Room'
  }
}

// Centralized activity logs tagged by unique waiter ID
export const DEMO_WAITER_ACTIVITIES: WaiterActivityLog[] = [
  // --- Waiter 1 (WTR001) Activity ---
  {
    id: 'ACT-101',
    waiterId: 'WTR001',
    type: 'food_served',
    title: 'Food Ready for Pickup',
    description: 'Hot pass: Chicken Biryani (x2) & Paneer Tikka (x1) ready for runner.',
    tableNumber: 'Table 02',
    timestamp: '5 min ago',
    time: '1:10 PM',
    status: 'warning',
  },
  {
    id: 'ACT-102',
    waiterId: 'WTR001',
    type: 'order_placed',
    title: 'New Order Placed',
    description: 'Order #ORD-7210 submitted for 2 covers (Masala Chai, Samosa Platter).',
    tableNumber: 'Table 01',
    timestamp: '14 min ago',
    time: '1:01 PM',
    status: 'info',
  },
  {
    id: 'ACT-103',
    waiterId: 'WTR001',
    type: 'sent_to_kitchen',
    title: 'Order Firing in Kitchen',
    description: 'Order #ORD-7201 sent to Curry & Tandoor station (Paneer Tikka, Dal Makhani).',
    tableNumber: 'Table 04',
    timestamp: '25 min ago',
    time: '12:50 PM',
    status: 'primary',
  },
  {
    id: 'ACT-104',
    waiterId: 'WTR001',
    type: 'food_served',
    title: 'Main Courses Served',
    description: 'Delivered chef specials to party of 4 at central booth.',
    tableNumber: 'Table 03',
    timestamp: '42 min ago',
    time: '12:33 PM',
    status: 'success',
  },
  {
    id: 'ACT-105',
    waiterId: 'WTR001',
    type: 'order_completed',
    title: 'Order Completed & Settled',
    description: 'Bill settled via UPI for ₹2,340. Table reset for next party.',
    tableNumber: 'Table 02',
    timestamp: '1 hr ago',
    time: '12:15 PM',
    status: 'success',
  },
  {
    id: 'ACT-106',
    waiterId: 'WTR001',
    type: 'table_assigned',
    title: 'Table Assigned to Guests',
    description: 'Seated party of 4 (Rahul Verma) with anniversary greeting.',
    tableNumber: 'Table 04',
    timestamp: '1.5 hrs ago',
    time: '11:45 AM',
    status: 'info',
  },

  // --- Waiter 2 (WTR002) Activity ---
  {
    id: 'ACT-201',
    waiterId: 'WTR002',
    type: 'food_served',
    title: 'Food Ready for Pickup',
    description: 'Garde Manger pass: Truffle Pasta & Tandoori Platter ready for Table 08.',
    tableNumber: 'Table 08',
    timestamp: '8 min ago',
    time: '1:07 PM',
    status: 'warning',
  },
  {
    id: 'ACT-202',
    waiterId: 'WTR002',
    type: 'sent_to_kitchen',
    title: 'Order Sent to Kitchen',
    description: 'Order #ORD-7213 fired for 4 guests at Garden Veranda.',
    tableNumber: 'Table 06',
    timestamp: '18 min ago',
    time: '12:57 PM',
    status: 'primary',
  },
  {
    id: 'ACT-203',
    waiterId: 'WTR002',
    type: 'food_served',
    title: 'Beverages & Starters Served',
    description: 'Served Fresh Lime Soda & Garlic Bread to Table 09.',
    tableNumber: 'Table 09',
    timestamp: '35 min ago',
    time: '12:40 PM',
    status: 'success',
  },
  {
    id: 'ACT-204',
    waiterId: 'WTR002',
    type: 'order_completed',
    title: 'Order Completed & Settled',
    description: 'Bill settled via Credit Card for ₹3,100. Table sanitized.',
    tableNumber: 'Table 10',
    timestamp: '1.1 hrs ago',
    time: '12:05 PM',
    status: 'success',
  },
  {
    id: 'ACT-205',
    waiterId: 'WTR002',
    type: 'table_assigned',
    title: 'Walk-in Table Assigned',
    description: 'Seated walk-in guests at Wine Cellar Nook.',
    tableNumber: 'Table 07',
    timestamp: '1.8 hrs ago',
    time: '11:22 AM',
    status: 'info',
  },

  // --- Waiter 3 (WTR003) Activity ---
  {
    id: 'ACT-301',
    waiterId: 'WTR003',
    type: 'food_served',
    title: 'Food Ready for Pickup',
    description: 'Grand Salon banquet pass: 5 courses ready for party of 10.',
    tableNumber: 'Table 14',
    timestamp: '4 min ago',
    time: '1:11 PM',
    status: 'warning',
  },
  {
    id: 'ACT-302',
    waiterId: 'WTR003',
    type: 'order_placed',
    title: 'VIP Banquet Order Placed',
    description: 'Order #ORD-7217 submitted for Heritage Booth celebration.',
    tableNumber: 'Table 11',
    timestamp: '16 min ago',
    time: '12:59 PM',
    status: 'info',
  },
  {
    id: 'ACT-303',
    waiterId: 'WTR003',
    type: 'sent_to_kitchen',
    title: 'Order Firing in Kitchen',
    description: 'Order #ORD-7216 sent to executive grill line (8 items).',
    tableNumber: 'Table 12',
    timestamp: '28 min ago',
    time: '12:47 PM',
    status: 'primary',
  },
  {
    id: 'ACT-304',
    waiterId: 'WTR003',
    type: 'food_served',
    title: 'Appetizers & Champagne Served',
    description: 'Delivered welcome champagne and warm bread service.',
    tableNumber: 'Table 13',
    timestamp: '52 min ago',
    time: '12:23 PM',
    status: 'success',
  },
  {
    id: 'ACT-305',
    waiterId: 'WTR003',
    type: 'order_completed',
    title: 'Corporate Party Completed',
    description: 'Corporate account settled for ₹6,280. 5-star feedback left.',
    tableNumber: 'Table 15',
    timestamp: '1.4 hrs ago',
    time: '11:35 AM',
    status: 'success',
  },
  {
    id: 'ACT-306',
    waiterId: 'WTR003',
    type: 'table_assigned',
    title: 'VIP Salon Table Assigned',
    description: 'Prepared Grand Salon table for Karan Malhotra VIP celebration.',
    tableNumber: 'Table 14',
    timestamp: '2 hrs ago',
    time: '11:15 AM',
    status: 'info',
  },
]

// Helper: Get activities for a specific waiter
export function getActivitiesForWaiter(waiterId: string): WaiterActivityLog[] {
  return DEMO_WAITER_ACTIVITIES.filter((a) => a.waiterId === waiterId)
}
