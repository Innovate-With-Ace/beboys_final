import React from 'react'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Minus, Plus, Trash, Soup } from 'lucide-react'
import { CartItem } from '@/types/CartItem'
import { useCartStore } from '@/stores/CartStore'

const CartDishCards = ({ item, quantity }: CartItem) => {
  const { decrementQuantity, addItem } = useCartStore()

  return (
    <Card className="rounded-xl p-2.5 border border-border bg-bg-muted shadow-none">
      <CardContent className="p-0">
        <div className="flex flex-row items-center gap-3">
          <div className="relative size-13 shrink-0 rounded-lg overflow-hidden bg-bg flex items-center justify-center">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            ) : (
              <Soup className="size-5 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.name}</p>
            <p className="text-xs font-semibold text-brand-secondary mt-0.5">
              ₱{item.price * quantity}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-bg rounded-lg p-1 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 rounded-md hover:bg-bg-muted"
              onClick={() => decrementQuantity(item)}
            >
              {quantity > 1 ? (
                <Minus className="h-3.5 w-3.5" />
              ) : (
                <Trash className="h-3.5 w-3.5 text-error" />
              )}
            </Button>
            <span className="text-sm font-semibold min-w-[16px] text-center">
              {quantity}
            </span>
            <Button
              size="icon"
              className="h-6 w-6 rounded-md bg-brand-primary hover:bg-brand-primary/90"
              onClick={() => addItem(item)}
            >
              <Plus className="h-3.5 w-3.5 text-white" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CartDishCards