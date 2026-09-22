export type units = 'kg' | 'l' | 'pcs'

export type Ingredient = {
  id: string
  name: string
  unit: units
  stock: number
  low_stock_threshold: number 
  created_at: string
  updated_at: string
}

// Payload for ingredient dialog
export type IngredientPayload = {
  name : string;
  unit : units;
  stock : number;
  low_stock_threshold: number
}

export type StockAdjustment = {
  id: string
  ingredient_id: string | null
  ingredient_name: string
  change: number
  previous_stock: number
  new_stock: number
  reason: string
  note: string | null
  changed_by: string | null
  created_at: string
}