// components/admin/ingredients/IngredientCard.tsx
import { Ingredient } from '@/types/Ingredients'
import { Carrot } from 'lucide-react'
import { useIngredientEditorStore } from '@/stores/IngredientEditorStore'

type Props = {
  ingredient: Ingredient
}

const IngredientCard = ({ ingredient }: Props) => {
  const openForEdit = useIngredientEditorStore((s) => s.openForEdit)

  const ratio = ingredient.stock / ingredient.low_stock_threshold
  const isCritical = ratio <= 0.5
  const isLow = !isCritical && ratio <= 1

  const status = isCritical ? 'Critical' : isLow ? 'Low' : 'In stock'
  const statusClass = isCritical
    ? 'bg-error/15 text-error'
    : isLow
    ? 'bg-warning/15 text-warning'
    : 'bg-success/15 text-success'
  const barClass = isCritical ? 'bg-error' : isLow ? 'bg-warning' : 'bg-success'
  const barWidth = Math.min(100, Math.round((ingredient.stock / ingredient.low_stock_threshold) * 50))

  return (
    <button
      onClick={() => openForEdit(ingredient)}
      className="text-left bg-bg-muted border border-border/60 rounded-2xl p-3.5 hover:border-brand-primary/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className={`h-8.5 w-8.5 rounded-lg flex items-center justify-center ${statusClass}`}>
          <Carrot className="h-4 w-4" />
        </div>
        <span className={`text-[10.5px] font-medium px-1.5 py-0.5 rounded-md ${statusClass}`}>
          {status}
        </span>
      </div>

      <p className="text-sm font-semibold">{ingredient.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {ingredient.stock}{ingredient.unit} left
      </p>

      <div className="mt-2 h-1.25 bg-bg rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${barWidth}%` }} />
      </div>
      <p className="text-[10.5px] text-muted-foreground/70 mt-1">
        Threshold: {ingredient.low_stock_threshold}{ingredient.unit}
      </p>
    </button>
  )
}

export default IngredientCard