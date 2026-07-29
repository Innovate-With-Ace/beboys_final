import { OrderItem } from "./OrderItem"

export type OrderStatus = "pending" | "preparing" | "cancelled" | "completed"

export type Order = {
  id: string
  items: OrderItem[]
  cashier_id: string
  total: number
  status: OrderStatus
  created_at: string
  updated_at: string
}