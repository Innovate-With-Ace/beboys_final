import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Dish } from '@/types/Dish'
import Image from 'next/image'
import { Soup } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useDishEditorStore } from '@/stores/DishEditorStore'

type Props = {
  dish: Dish
}

const DishCard = ({ dish }: Props) => {
  const openForEdit = useDishEditorStore((s) => s.openForEdit)
  const isOutOfStock = !dish.isAvailable || dish.servings_left <= 0
  const isLowStock = !isOutOfStock && dish.servings_left <= 3

  return (
    <Card
      className={cn(
        'p-0 rounded-md overflow-hidden gap-0 border-border/60 transition-all cursor-pointer hover:shadow-md hover:border-brand-primary/40'
      )}
    >
      <div className="relative size-32 w-full bg-muted flex items-center justify-center">
        {dish.image ? (
          <Image src={dish.image} alt={dish.name} fill className="object-cover" />
        ) : (
          <Soup className="text-muted-foreground size-8" strokeWidth={1.5} />
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-xs font-semibold text-white uppercase tracking-wide">
              Out of stock
            </span>
          </div>
        )}

        {isLowStock && (
          <span className="absolute top-1.5 right-1.5 bg-amber-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
            {dish.servings_left} left
          </span>
        )}
      </div>

      <CardContent className="p-2.5">
        <p className="font-medium text-sm truncate leading-tight">{dish.name}</p>
        <p className="text-sm text-brand-primary font-semibold mt-0.5">
          ₱{dish.price.toFixed(2)}
        </p>

        <CardFooter className='p-0'>
          <Button size={"sm"} className={'w-full bg-brand-primary hover:bg-brand-primary/80 hover:cursor-pointer'} onClick={()=>openForEdit(dish)}>Modify</Button>
        </CardFooter>
      </CardContent>
    </Card>
  )
}

export default DishCard