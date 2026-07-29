// data/orders.ts
import { Order } from '@/types/Order'

export const mockOrders: Order[] = [
  {
    id: '38',
    items: [
      { id: '1', name: 'Adobo', quantity: 2, price: 60 },
      { id: '4', name: 'Rice', quantity: 2, price: 15 },
    ],
    cashier: 'Ace',
    total: 150,
    status: 'completed',
    created_at: '2026-07-26T14:12:00Z',
  },
  {
    id: '37',
    items: [
      { id: '7', name: 'Sisig', quantity: 1, price: 75 },
    ],
    cashier: 'Ace',
    total: 75,
    status: 'cancelled',
    created_at: '2026-07-26T14:05:00Z',
  },
  {
    id: '36',
    items: [
      { id: '5', name: 'Iced tea', quantity: 3, price: 20 },
      { id: '6', name: 'Lumpia', quantity: 2, price: 10 },
    ],
    cashier: 'Maria',
    total: 80,
    status: 'completed',
    created_at: '2026-07-26T13:58:00Z',
  },
  {
    id: '35',
    items: [
      { id: '8', name: 'Kare-kare', quantity: 1, price: 85 },
      { id: '4', name: 'Rice', quantity: 1, price: 15 },
    ],
    cashier: 'Maria',
    total: 100,
    status: 'completed',
    created_at: '2026-07-26T13:47:00Z',
  },
  {
    id: '34',
    items: [
      { id: '2', name: 'Sinigang', quantity: 1, price: 65 },
      { id: '4', name: 'Rice', quantity: 1, price: 15 },
    ],
    cashier: 'Ace',
    total: 80,
    status: 'cancelled',
    created_at: '2026-07-26T13:30:00Z',
  },
  {
    id: '33',
    items: [
      { id: '10', name: 'Bottled water', quantity: 2, price: 15 },
    ],
    cashier: 'Maria',
    total: 30,
    status: 'completed',
    created_at: '2026-07-26T13:15:00Z',
  },
  {
    id: '32',
    items: [
      { id: '1', name: 'Adobo', quantity: 1, price: 60 },
      { id: '4', name: 'Rice', quantity: 1, price: 15 },
      { id: '5', name: 'Iced tea', quantity: 1, price: 20 },
    ],
    cashier: 'Ace',
    total: 95,
    status: 'completed',
    created_at: '2026-07-26T12:50:00Z',
  },
]