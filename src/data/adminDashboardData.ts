export interface DailySalesDataPoint {
  day: string
  date: string
  revenue: number
  orders: number
  dineInRevenue: number
  takeawayRevenue: number
  covers: number
}

export interface AdminOrderDishItem {
  name: string
  quantity: number
  price: number
}

export interface AdminRecentOrder {
  id: string
  customerName: string
  phone: string
  orderType: 'Dine-in' | 'Takeaway' | 'Delivery'
  tableId?: string
  tableNumber?: string
  items: AdminOrderDishItem[]
  itemsSummary: string
  amount: number
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  orderTime: string
  createdAt: string
  notes?: string
  waiterId?: string
  waiterName?: string
}

export interface RevenueSummaryMetrics {
  totalWeeklyRevenue: number
  avgDailyRevenue: number
  peakSalesDay: string
  avgOrderValue: number
  dineInSharePercentage: number
  takeawaySharePercentage: number
}

// 7-day sales and order volume history for Recharts
export const DAILY_SALES_HISTORY: DailySalesDataPoint[] = [
  {
    day: 'Mon',
    date: '15 Nov',
    revenue: 48500,
    orders: 38,
    dineInRevenue: 36200,
    takeawayRevenue: 12300,
    covers: 94,
  },
  {
    day: 'Tue',
    date: '16 Nov',
    revenue: 52400,
    orders: 42,
    dineInRevenue: 39800,
    takeawayRevenue: 12600,
    covers: 106,
  },
  {
    day: 'Wed',
    date: '17 Nov',
    revenue: 61200,
    orders: 49,
    dineInRevenue: 46800,
    takeawayRevenue: 14400,
    covers: 122,
  },
  {
    day: 'Thu',
    date: '18 Nov',
    revenue: 58900,
    orders: 46,
    dineInRevenue: 44200,
    takeawayRevenue: 14700,
    covers: 114,
  },
  {
    day: 'Fri',
    date: '19 Nov',
    revenue: 76500,
    orders: 64,
    dineInRevenue: 60800,
    takeawayRevenue: 15700,
    covers: 158,
  },
  {
    day: 'Sat',
    date: '20 Nov',
    revenue: 89600,
    orders: 75,
    dineInRevenue: 73100,
    takeawayRevenue: 16500,
    covers: 186,
  },
  {
    day: 'Sun (Today)',
    date: '21 Nov',
    revenue: 74850,
    orders: 54,
    dineInRevenue: 60250,
    takeawayRevenue: 14600,
    covers: 142,
  },
]

export const REVENUE_SUMMARY_STATS: RevenueSummaryMetrics = {
  totalWeeklyRevenue: 461950,
  avgDailyRevenue: 65993,
  peakSalesDay: 'Saturday (₹89,600)',
  avgOrderValue: 1255,
  dineInSharePercentage: 78,
  takeawaySharePercentage: 22,
}

export const ADMIN_OVERVIEW_BASE = {
  totalOrders: 148,
  todayRevenue: 74850,
  totalCustomers: 1280,
  yesterdayRevenue: 64950,
  lastWeekOrders: 132,
  newCustomersToday: 26,
}

// Realistic sample orders covering all requested statuses (Pending, Preparing, Ready, Completed, Cancelled)
// Associated with specific Waiter IDs for server-isolated floor terminal views
export const SAMPLE_RECENT_ORDERS: AdminRecentOrder[] = [
  // --- Waiter 1 (WTR001 - Sophie Dubois) Orders (Tables T01 - T05) ---
  {
    id: '#ORD-7201',
    customerName: 'Rahul Verma',
    phone: '+91 98210 54321',
    orderType: 'Dine-in',
    tableId: 'T04',
    tableNumber: 'Table 04',
    items: [
      { name: 'Paneer Tikka', quantity: 2, price: 350 },
      { name: 'Dal Makhani', quantity: 1, price: 390 },
      { name: 'Butter Naan', quantity: 4, price: 70 },
    ],
    itemsSummary: 'Paneer Tikka (x2), Dal Makhani (x1), Butter Naan (x4)',
    amount: 1370,
    status: 'preparing',
    orderTime: '1:15 PM',
    createdAt: '2026-11-21T13:15:00',
    notes: 'Mild spice for gravy, extra butter on naan.',
    waiterId: 'WTR001',
    waiterName: 'Sophie Dubois',
  },
  {
    id: '#ORD-7202',
    customerName: 'Priya Sundaram',
    phone: '+91 98450 12389',
    orderType: 'Dine-in',
    tableId: 'T02',
    tableNumber: 'Table 02',
    items: [
      { name: 'Chicken Biryani', quantity: 2, price: 450 },
      { name: 'Paneer Tikka', quantity: 1, price: 350 },
      { name: 'Cold Coffee', quantity: 2, price: 180 },
    ],
    itemsSummary: 'Chicken Biryani (x2), Paneer Tikka (x1), Cold Coffee (x2)',
    amount: 1610,
    status: 'ready',
    orderTime: '1:05 PM',
    createdAt: '2026-11-21T13:05:00',
    notes: 'Extra raita and onions served alongside.',
    waiterId: 'WTR001',
    waiterName: 'Sophie Dubois',
  },
  {
    id: '#ORD-7210',
    customerName: 'Sanjay Singhania',
    phone: '+91 98440 33445',
    orderType: 'Dine-in',
    tableId: 'T01',
    tableNumber: 'Table 01',
    items: [
      { name: 'Masala Chai', quantity: 2, price: 90 },
      { name: 'Samosa Platter', quantity: 2, price: 120 },
    ],
    itemsSummary: 'Masala Chai (x2), Samosa Platter (x2)',
    amount: 420,
    status: 'pending',
    orderTime: '1:32 PM',
    createdAt: '2026-11-21T13:32:00',
    notes: 'Hot chai with less sugar.',
    waiterId: 'WTR001',
    waiterName: 'Sophie Dubois',
  },
  {
    id: '#ORD-7207',
    customerName: 'Kavita Nair',
    phone: '+91 97110 88990',
    orderType: 'Dine-in',
    tableId: 'T05',
    tableNumber: 'Table 05',
    items: [
      { name: 'Margherita Pizza', quantity: 2, price: 420 },
      { name: 'Iced Tea', quantity: 2, price: 130 },
    ],
    itemsSummary: 'Margherita Pizza (x2), Iced Tea (x2)',
    amount: 1100,
    status: 'cancelled',
    orderTime: '12:40 PM',
    createdAt: '2026-11-21T12:40:00',
    notes: 'Cancelled before prep due to unexpected flight rescheduling.',
    waiterId: 'WTR001',
    waiterName: 'Sophie Dubois',
  },
  {
    id: '#ORD-7211',
    customerName: 'Ananya Sen',
    phone: '+91 98311 44556',
    orderType: 'Dine-in',
    tableId: 'T03',
    tableNumber: 'Table 03',
    items: [
      { name: 'Creamy Pasta', quantity: 2, price: 440 },
      { name: 'Chocolate Brownie', quantity: 2, price: 220 },
      { name: 'Cold Coffee', quantity: 2, price: 180 },
    ],
    itemsSummary: 'Creamy Pasta (x2), Chocolate Brownie (x2), Cold Coffee (x2)',
    amount: 1680,
    status: 'completed',
    orderTime: '11:30 AM',
    createdAt: '2026-11-21T11:30:00',
    notes: 'Patio table lunch. Paid via Credit Card.',
    waiterId: 'WTR001',
    waiterName: 'Sophie Dubois',
  },
  {
    id: '#ORD-7212',
    customerName: 'Siddharth Roy',
    phone: '+91 98202 33445',
    orderType: 'Dine-in',
    tableId: 'T02',
    tableNumber: 'Table 02',
    items: [
      { name: 'Chicken Biryani', quantity: 3, price: 450 },
      { name: 'Dal Makhani', quantity: 1, price: 390 },
      { name: 'Butter Naan', quantity: 6, price: 70 },
      { name: 'Masala Chai', quantity: 2, price: 90 },
    ],
    itemsSummary: 'Biryani (x3), Dal Makhani (x1), Naan (x6), Chai (x2)',
    amount: 2340,
    status: 'completed',
    orderTime: '12:15 PM',
    createdAt: '2026-11-21T12:15:00',
    notes: 'Previous sitting on Table 02. Settled with UPI.',
    waiterId: 'WTR001',
    waiterName: 'Sophie Dubois',
  },

  // --- Waiter 2 (WTR002 - Aarav Sharma) Orders (Tables T06 - T10) ---
  {
    id: '#ORD-7203',
    customerName: 'Amit & Sneha Patel',
    phone: '+91 97690 99881',
    orderType: 'Dine-in',
    tableId: 'T07',
    tableNumber: 'Table 07',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 420 },
      { name: 'Creamy Pasta', quantity: 1, price: 440 },
      { name: 'Masala Chai', quantity: 2, price: 90 },
    ],
    itemsSummary: 'Margherita Pizza (x1), Creamy Pasta (x1), Masala Chai (x2)',
    amount: 1040,
    status: 'completed',
    orderTime: '12:20 PM',
    createdAt: '2026-11-21T12:20:00',
    notes: 'Guest requested crispy pizza crust. Settled with card.',
    waiterId: 'WTR002',
    waiterName: 'Aarav Sharma',
  },
  {
    id: '#ORD-7205',
    customerName: 'Sunita Rao',
    phone: '+91 99200 44556',
    orderType: 'Dine-in',
    tableId: 'T09',
    tableNumber: 'Table 09',
    items: [
      { name: 'Paneer Tikka', quantity: 1, price: 350 },
      { name: 'Veg Burger', quantity: 1, price: 290 },
      { name: 'Fresh Lime Soda', quantity: 2, price: 120 },
    ],
    itemsSummary: 'Paneer Tikka (x1), Veg Burger (x1), Fresh Lime Soda (x2)',
    amount: 880,
    status: 'completed',
    orderTime: '12:00 PM',
    createdAt: '2026-11-21T12:00:00',
    notes: 'Family seated in central dining. Settled with UPI.',
    waiterId: 'WTR002',
    waiterName: 'Aarav Sharma',
  },
  {
    id: '#ORD-7213',
    customerName: 'Rajesh Khanna',
    phone: '+91 98110 44332',
    orderType: 'Dine-in',
    tableId: 'T06',
    tableNumber: 'Table 06',
    items: [
      { name: 'Chicken Biryani', quantity: 2, price: 450 },
      { name: 'Paneer Tikka', quantity: 2, price: 350 },
      { name: 'Cold Coffee', quantity: 2, price: 180 },
    ],
    itemsSummary: 'Chicken Biryani (x2), Paneer Tikka (x2), Cold Coffee (x2)',
    amount: 1960,
    status: 'preparing',
    orderTime: '1:18 PM',
    createdAt: '2026-11-21T13:18:00',
    notes: 'Patio veranda table. Firing in grill station.',
    waiterId: 'WTR002',
    waiterName: 'Aarav Sharma',
  },
  {
    id: '#ORD-7214',
    customerName: 'Neha Deshmukh',
    phone: '+91 98400 55667',
    orderType: 'Dine-in',
    tableId: 'T08',
    tableNumber: 'Table 08',
    items: [
      { name: 'Creamy Pasta', quantity: 3, price: 440 },
      { name: 'Margherita Pizza', quantity: 2, price: 420 },
      { name: 'Chocolate Brownie', quantity: 3, price: 220 },
    ],
    itemsSummary: 'Creamy Pasta (x3), Margherita Pizza (x2), Brownie (x3)',
    amount: 2820,
    status: 'ready',
    orderTime: '1:08 PM',
    createdAt: '2026-11-21T13:08:00',
    notes: 'Plated at hot pass. Immediate runner required.',
    waiterId: 'WTR002',
    waiterName: 'Aarav Sharma',
  },
  {
    id: '#ORD-7215',
    customerName: 'Farhan Akhtar',
    phone: '+91 97220 88990',
    orderType: 'Dine-in',
    tableId: 'T10',
    tableNumber: 'Table 10',
    items: [
      { name: 'Chicken Biryani', quantity: 4, price: 450 },
      { name: 'Dal Makhani', quantity: 2, price: 390 },
      { name: 'Butter Naan', quantity: 6, price: 70 },
    ],
    itemsSummary: 'Chicken Biryani (x4), Dal Makhani (x2), Butter Naan (x6)',
    amount: 3000,
    status: 'completed',
    orderTime: '11:50 AM',
    createdAt: '2026-11-21T11:50:00',
    notes: 'Promenade veranda luncheon. Paid cash.',
    waiterId: 'WTR002',
    waiterName: 'Aarav Sharma',
  },

  // --- Waiter 3 (WTR003 - Priya Patel) Orders (Tables T11 - T15) ---
  {
    id: '#ORD-7208',
    customerName: 'Karan Malhotra',
    phone: '+91 98700 11223',
    orderType: 'Dine-in',
    tableId: 'T14',
    tableNumber: 'Table 14',
    items: [
      { name: 'Paneer Tikka', quantity: 3, price: 350 },
      { name: 'Chicken Biryani', quantity: 4, price: 450 },
      { name: 'Dal Makhani', quantity: 2, price: 390 },
      { name: 'Butter Naan', quantity: 8, price: 70 },
      { name: 'Chocolate Brownie', quantity: 4, price: 220 },
    ],
    itemsSummary: 'Banquet Feast: Paneer Tikka (x3), Chicken Biryani (x4), Dal Makhani (x2), Naan (x8), Brownie (x4)',
    amount: 5070,
    status: 'ready',
    orderTime: '12:55 PM',
    createdAt: '2026-11-21T12:55:00',
    notes: 'Grand salon VIP celebration. Expedited table runner service.',
    waiterId: 'WTR003',
    waiterName: 'Priya Patel',
  },
  {
    id: '#ORD-7216',
    customerName: 'Arvind & Divya',
    phone: '+91 98990 12345',
    orderType: 'Dine-in',
    tableId: 'T12',
    tableNumber: 'Table 12',
    items: [
      { name: 'Margherita Pizza', quantity: 2, price: 420 },
      { name: 'Creamy Pasta', quantity: 2, price: 440 },
      { name: 'Fresh Lime Soda', quantity: 4, price: 120 },
      { name: 'Chocolate Brownie', quantity: 3, price: 220 },
    ],
    itemsSummary: 'Pizza (x2), Pasta (x2), Lime Soda (x4), Brownie (x3)',
    amount: 2860,
    status: 'preparing',
    orderTime: '1:22 PM',
    createdAt: '2026-11-21T13:22:00',
    notes: 'Mezzanine balcony party. Extra napkins requested.',
    waiterId: 'WTR003',
    waiterName: 'Priya Patel',
  },
  {
    id: '#ORD-7217',
    customerName: 'Meenakshi Sundaram',
    phone: '+91 97112 33445',
    orderType: 'Dine-in',
    tableId: 'T11',
    tableNumber: 'Table 11',
    items: [
      { name: 'Paneer Tikka', quantity: 2, price: 350 },
      { name: 'Veg Burger', quantity: 2, price: 290 },
      { name: 'Cold Coffee', quantity: 2, price: 180 },
    ],
    itemsSummary: 'Paneer Tikka (x2), Veg Burger (x2), Cold Coffee (x2)',
    amount: 1640,
    status: 'pending',
    orderTime: '1:30 PM',
    createdAt: '2026-11-21T13:30:00',
    notes: 'Heritage booth lunch. Starters first.',
    waiterId: 'WTR003',
    waiterName: 'Priya Patel',
  },
  {
    id: '#ORD-7218',
    customerName: 'Vikramaditya Roy',
    phone: '+91 98123 45678',
    orderType: 'Dine-in',
    tableId: 'T13',
    tableNumber: 'Table 13',
    items: [
      { name: 'Chicken Biryani', quantity: 4, price: 450 },
      { name: 'Paneer Tikka', quantity: 2, price: 350 },
      { name: 'Dal Makhani', quantity: 2, price: 390 },
      { name: 'Butter Naan', quantity: 8, price: 70 },
      { name: 'Cold Coffee', quantity: 4, price: 180 },
    ],
    itemsSummary: 'Courtyard Banquet: Biryani (x4), Paneer Tikka (x2), Dal Makhani (x2), Naan (x8)',
    amount: 4560,
    status: 'completed',
    orderTime: '12:10 PM',
    createdAt: '2026-11-21T12:10:00',
    notes: 'Covered courtyard anniversary gathering. Settled via Amex.',
    waiterId: 'WTR003',
    waiterName: 'Priya Patel',
  },
  {
    id: '#ORD-7219',
    customerName: 'Kapoor Family',
    phone: '+91 98770 99881',
    orderType: 'Dine-in',
    tableId: 'T15',
    tableNumber: 'Table 15',
    items: [
      { name: 'Margherita Pizza', quantity: 4, price: 420 },
      { name: 'Creamy Pasta', quantity: 4, price: 440 },
      { name: 'Veg Burger', quantity: 4, price: 290 },
      { name: 'Chocolate Brownie', quantity: 6, price: 220 },
      { name: 'Fresh Lime Soda', quantity: 8, price: 120 },
    ],
    itemsSummary: 'Private Pavilion Grand Feast: 26 dishes & beverages total',
    amount: 6880,
    status: 'completed',
    orderTime: '11:40 AM',
    createdAt: '2026-11-21T11:40:00',
    notes: 'Private Garden Pavilion celebration. Paid in full.',
    waiterId: 'WTR003',
    waiterName: 'Priya Patel',
  },

  // --- Express & Delivery Orders (Non-floor specific) ---
  {
    id: '#ORD-7204',
    customerName: 'Vikram Rathore',
    phone: '+91 98112 33445',
    orderType: 'Takeaway',
    tableNumber: 'Express Counter',
    items: [
      { name: 'Veg Burger', quantity: 2, price: 290 },
      { name: 'Chocolate Brownie', quantity: 2, price: 220 },
    ],
    itemsSummary: 'Veg Burger (x2), Chocolate Brownie (x2)',
    amount: 1020,
    status: 'pending',
    orderTime: '1:28 PM',
    createdAt: '2026-11-21T13:28:00',
    notes: 'Takeaway bag with disposable cutlery.',
  },
  {
    id: '#ORD-7206',
    customerName: 'Deepak Joshi',
    phone: '+91 98330 66778',
    orderType: 'Delivery',
    tableNumber: 'Dispatch Pass #3',
    items: [
      { name: 'Chicken Biryani', quantity: 3, price: 450 },
      { name: 'Creamy Pasta', quantity: 1, price: 440 },
      { name: 'Chocolate Brownie', quantity: 3, price: 220 },
    ],
    itemsSummary: 'Chicken Biryani (x3), Creamy Pasta (x1), Chocolate Brownie (x3)',
    amount: 2450,
    status: 'preparing',
    orderTime: '1:10 PM',
    createdAt: '2026-11-21T13:10:00',
    notes: 'Delivery driver assigned. Package tamper-evident sealed.',
  },
  {
    id: '#ORD-7209',
    customerName: 'Neha Gupta',
    phone: '+91 99300 22334',
    orderType: 'Takeaway',
    tableNumber: 'Express Counter',
    items: [
      { name: 'Creamy Pasta', quantity: 2, price: 440 },
      { name: 'Garlic Bread', quantity: 1, price: 220 },
    ],
    itemsSummary: 'Creamy Pasta (x2), Garlic Bread (x1)',
    amount: 1100,
    status: 'completed',
    orderTime: '11:45 AM',
    createdAt: '2026-11-21T11:45:00',
    notes: 'Pick-up order completed on time.',
  },
]
