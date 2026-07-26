// MobileCartBar.tsx
'use client'
import { useState } from 'react'
import { useCartStore } from '@/stores/CartStore'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import CartPanel from './CartPanel'
import { CartItem } from '@/types/CartItem'

type Props = {
  onCheckoutComplete?: (items: CartItem[]) => void
}

const MobileCartBar = ({ onCheckoutComplete }: Props) => {
  const { items } = useCartStore()
  const [sheetOpen, setSheetOpen] = useState(false)
  if (items.length === 0) return null

  const total = items.reduce((sum, item) => sum + item.item.price * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <button className="fixed bottom-0 left-0 right-0 bg-bg-muted border-t border-border rounded-t-2xl px-4 py-3 flex items-center justify-between shadow-lg">
          <span className="text-sm font-medium">{count} items · ₱{total}</span>
          <span className="bg-brand-primary text-white text-xs font-medium px-3.5 py-1.5 rounded-md">
            View cart
          </span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh]">
        <CartPanel
          onCheckoutComplete={(orderItems) => {
            setSheetOpen(false)
            onCheckoutComplete?.(orderItems)
          }}
        />
      </SheetContent>
    </Sheet>
  )
}

export default MobileCartBar