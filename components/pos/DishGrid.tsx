// components/pos/DishGrid.tsx
'use client'

import { Dish } from '@/types/Dish'
import DishCard from './DishCard'
import { useCartStore } from '@/stores/CartStore'
import { Soup } from 'lucide-react'

type Props = {
  dishes: Dish[]
}

const DishGrid = ({ dishes }: Props) => {
  const { addItem } = useCartStore()

  if (dishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Soup className="size-8 text-muted-foreground mb-2" />
        <p className="text-sm font-medium">No items found</p>
        <p className="text-xs text-muted-foreground mt-1">Try a different search term.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {dishes.map((item, index) => (
        <DishCard key={index} dish={item} onAdd={() => addItem(item)} />
      ))}
    </div>
  )
}

export default DishGrid