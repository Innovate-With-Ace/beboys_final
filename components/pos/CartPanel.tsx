// CartPanel.tsx
'use client'
import { useCartStore } from "@/stores/CartStore"
import { useDishStore } from "@/stores/DishStore"
import CartDishCards from "./CartDishCards"
import { CartItem } from "@/types/CartItem"
import { useState } from "react"

type Props = {
  onCheckoutComplete?: (items: CartItem[]) => void
}

const CartPanel = ({ onCheckoutComplete }: Props) => {
  const { items, clearItem } = useCartStore()
  const { decrementServings } = useDishStore()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = () => {
    if (items.length <= 0) return
    setIsCheckingOut(true)

    const orderSnapshot = items
    items.forEach((item) => decrementServings(item.item.id, item.quantity))
    clearItem()

    onCheckoutComplete?.(orderSnapshot)
    setIsCheckingOut(false)
  }

  return (
    <div className="bg-bg-muted rounded-xl p-4 max-h-[calc(100vh-32px)] flex flex-col">
      <h2 className="font-medium text-sm mb-3 shrink-0">Current order</h2>

      <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0">
        {items.map((item) => (
          <CartDishCards key={item.item.id} {...item} />
        ))}
      </div>

      <div className="border-t border-border mt-3 pt-2.5 flex justify-between shrink-0">
        <span className="font-medium text-sm">Total</span>
        <span className="font-medium text-sm">
          ₱{items.reduce((sum, item) => sum + item.item.price * item.quantity, 0)}
        </span>
      </div>

      <button
        className="w-full mt-3 bg-brand-primary text-white rounded-md py-2.5 text-sm font-medium hover:bg-brand-primary/90 disabled:bg-brand-primary/40 shrink-0"
        onClick={handleCheckout}
        disabled={items.length <= 0}
      >
        Checkout
      </button>
    </div>
  )
}

export default CartPanel