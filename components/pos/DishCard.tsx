// components/pos/DishCard.tsx
'use client'

import { Dish } from '@/types/Dish'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import Image from 'next/image'
import { Plus, Soup } from 'lucide-react'

type Props = {
  dish: Dish
  onAdd: () => void
}

const DishCard = ({ dish, onAdd }: Props) => {
  const isSoldOut = dish.servings === 0
  const isLow = dish.servings > 0 && dish.servings <= 3

  return (
    <Card
      className={`overflow-hidden pt-0 gap-0 pb-3 border border-border bg-bg-muted shadow-none rounded-xl transition-shadow ${
        isSoldOut ? 'opacity-55' : 'hover:shadow-md'
      }`}
    >
      <div className="relative aspect-[4/3] w-full bg-bg flex items-center justify-center">
        {dish.image ? (
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <Soup className="size-6 text-muted-foreground" />
        )}
      </div>

      <CardContent className="space-y-1 pt-2.5 px-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm leading-tight line-clamp-1">{dish.name}</h3>
          <span className="whitespace-nowrap font-semibold text-sm text-brand-secondary">
            ₱{dish.price.toFixed(0)}
          </span>
        </div>
        <p
          className={`text-xs ${
            isSoldOut ? 'font-medium text-error' : isLow ? 'font-medium text-warning' : 'text-muted-foreground'
          }`}
        >
          {isSoldOut ? 'Sold out' : `${dish.servings} servings left`}
        </p>
      </CardContent>

      <CardFooter className="pt-2.5 px-2">
        <Button
          onClick={onAdd}
          disabled={isSoldOut}
          size="sm"
          className={`w-full gap-1 font-medium ${
            isSoldOut
              ? 'bg-bg text-muted-foreground border border-border'
              : 'bg-brand-primary text-white hover:bg-brand-primary/90'
          }`}
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  )
}

export default DishCard