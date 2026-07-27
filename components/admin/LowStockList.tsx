// components/admin/LowStockList.tsx
import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Ingredient = {
  id: string
  name: string
  currentStock: number
  unit: string
  threshold: number
}

const mockLowStock: Ingredient[] = [
  { id: '1', name: 'Soy sauce', currentStock: 0.4, unit: 'L', threshold: 1 },
  { id: '2', name: 'Pork', currentStock: 1.2, unit: 'kg', threshold: 3 },
]

const LowStockList = () => {
  return (
    <div className="bg-bg-muted rounded-2xl p-4.5 border border-border">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium">Low stock ingredients</p>
        <span className="text-xs text-muted-foreground">{mockLowStock.length} items</span>
      </div>

      <div className="flex flex-col gap-2">
        {mockLowStock.map((item) => {
          const ratio = item.currentStock / item.threshold
          const isCritical = ratio <= 0.5

          return (
            <div key={item.id} className="flex items-center gap-2.5 bg-bg rounded-lg px-3 py-2.5">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                isCritical ? 'bg-error/15 text-error' : 'bg-warning/15 text-warning'
              }`}>
                <Package className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {item.currentStock}{item.unit} left · threshold {item.threshold}{item.unit}
                </p>
              </div>
              <span className={`text-[11px] font-medium px-2 py-1 rounded-md shrink-0 ${
                isCritical ? 'bg-error/15 text-error' : 'bg-warning/15 text-warning'
              }`}>
                {isCritical ? 'Critical' : 'Low'}
              </span>
            </div>
          )
        })}
      </div>

      <Button variant="outline" className="w-full mt-3 text-xs" size="sm">
        <Link href="/admin/ingredients">View all ingredients</Link>
      </Button>
    </div>
  )
}

export default LowStockList