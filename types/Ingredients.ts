type units = 'kg' | 'l' | 'pcs'

export type Ingredient = {
  id: string
  name: string
  unit: units
  stock: number
  low_stock_threshold: number 
  created_at: string
  updated_at: string
}