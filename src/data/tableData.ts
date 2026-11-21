export interface RestaurantTable {
  id: string
  name: string
  capacity: number
  seatingType: 'Indoor' | 'Outdoor'
  zone: string
  description: string
}

export interface StoredReservation {
  id: string
  customerName: string
  phone: string
  email: string
  date: string
  time: string
  guests: number
  tableId: string
  seatingPreference: 'Indoor' | 'Outdoor' | 'No Preference'
  specialRequests?: string
  status: 'confirmed' | 'pending' | 'seated' | 'completed' | 'cancelled'
  createdAt: string
}

export const TIME_SLOTS = [
  { label: '11:30 AM', value: '11:30' },
  { label: '12:30 PM', value: '12:30' },
  { label: '1:30 PM', value: '13:30' },
  { label: '2:30 PM', value: '14:30' },
  { label: '6:00 PM', value: '18:00' },
  { label: '7:00 PM', value: '19:00' },
  { label: '8:00 PM', value: '20:00' },
  { label: '9:00 PM', value: '21:00' },
  { label: '10:00 PM', value: '22:00' },
] as const

export const SEATING_OPTIONS = [
  { label: 'No Preference', value: 'No Preference' },
  { label: 'Indoor Dining', value: 'Indoor' },
  { label: 'Outdoor Garden / Terrace', value: 'Outdoor' },
] as const

export const GUEST_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  label: `${i + 1} ${i === 0 ? 'Guest' : 'Guests'}`,
  value: String(i + 1),
}))

export const DEMO_TABLES: RestaurantTable[] = [
  {
    id: 'T01',
    name: 'Table 01',
    capacity: 2,
    seatingType: 'Indoor',
    zone: 'Window Booth',
    description: 'Cozy two-seater overlooking the promenade avenue.',
  },
  {
    id: 'T02',
    name: 'Table 02',
    capacity: 2,
    seatingType: 'Indoor',
    zone: 'Main Dining',
    description: 'Intimate candlelit table in the central dining hall.',
  },
  {
    id: 'T03',
    name: 'Table 03',
    capacity: 2,
    seatingType: 'Outdoor',
    zone: 'Garden Terrace',
    description: 'Romantic terrace table under fairy lanterns.',
  },
  {
    id: 'T04',
    name: 'Table 04',
    capacity: 4,
    seatingType: 'Indoor',
    zone: 'Main Dining',
    description: 'Comfortable 4-seater with plush burgundy banquette.',
  },
  {
    id: 'T05',
    name: 'Table 05',
    capacity: 4,
    seatingType: 'Indoor',
    zone: 'Central Hall',
    description: 'Spacious table positioned near the live open kitchen.',
  },
  {
    id: 'T06',
    name: 'Table 06',
    capacity: 4,
    seatingType: 'Outdoor',
    zone: 'Patio Veranda',
    description: 'Breezy outdoor dining with cushioned seating.',
  },
  {
    id: 'T07',
    name: 'Table 07',
    capacity: 4,
    seatingType: 'Outdoor',
    zone: 'Garden Terrace',
    description: 'Lush greenery views with umbrella canopy shade.',
  },
  {
    id: 'T08',
    name: 'Table 08',
    capacity: 4,
    seatingType: 'Indoor',
    zone: 'Corner Alcove',
    description: 'Quiet corner table ideal for family dinners.',
  },
  {
    id: 'T09',
    name: 'Table 09',
    capacity: 6,
    seatingType: 'Indoor',
    zone: 'Main Dining',
    description: 'Generous rectangular oak table for medium parties.',
  },
  {
    id: 'T10',
    name: 'Table 10',
    capacity: 6,
    seatingType: 'Indoor',
    zone: 'Wine Cellar Salon',
    description: 'Exclusive seating surrounded by our reserve wine collection.',
  },
  {
    id: 'T11',
    name: 'Table 11',
    capacity: 6,
    seatingType: 'Outdoor',
    zone: 'Veranda Lounge',
    description: 'Open-air veranda booth with relaxed lounge seating.',
  },
  {
    id: 'T12',
    name: 'Table 12',
    capacity: 8,
    seatingType: 'Indoor',
    zone: 'Royal Banquet Table',
    description: 'Polished mahogany banquet table for celebratory feasts.',
  },
  {
    id: 'T13',
    name: 'Table 13',
    capacity: 8,
    seatingType: 'Outdoor',
    zone: 'Covered Courtyard',
    description: 'Large courtyard table surrounded by fountain waters.',
  },
  {
    id: 'T14',
    name: 'Table 14',
    capacity: 10,
    seatingType: 'Indoor',
    zone: 'Grand Salon',
    description: 'Grand family dining suite with dedicated service runner.',
  },
  {
    id: 'T15',
    name: 'Table 15',
    capacity: 10,
    seatingType: 'Outdoor',
    zone: 'Private Garden Pavilion',
    description: 'Secluded outdoor pavilion table for large gatherings.',
  },
]

// Initial seed reservations for demonstration
export const INITIAL_DEMO_RESERVATIONS: StoredReservation[] = [
  {
    id: 'RES-DEMO-101',
    customerName: 'Ananya Sharma',
    phone: '9876543210',
    email: 'ananya.s@example.com',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    guests: 4,
    tableId: 'T04',
    seatingPreference: 'Indoor',
    specialRequests: 'Celebrating 5th anniversary, quiet table preferred.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'RES-DEMO-102',
    customerName: 'Vikramaditya Roy',
    phone: '9812345678',
    email: 'vikram.roy@example.com',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    guests: 2,
    tableId: 'T02',
    seatingPreference: 'Indoor',
    specialRequests: 'Window view if possible.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'RES-DEMO-103',
    customerName: 'Meera Deshmukh',
    phone: '9922334455',
    email: 'meera.d@example.com',
    date: new Date().toISOString().split('T')[0],
    time: '13:30',
    guests: 6,
    tableId: 'T09',
    seatingPreference: 'Indoor',
    specialRequests: 'High chair needed for child.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'RES-DEMO-104',
    customerName: 'Rohan Mehta',
    phone: '9871122334',
    email: 'rohan.m@example.com',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    guests: 8,
    tableId: 'T12',
    seatingPreference: 'Indoor',
    specialRequests: 'Pre-order chef tasting starters.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
]
