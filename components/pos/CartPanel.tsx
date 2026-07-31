// components/pos/CartPanel.tsx
"use client";
import { useCartStore } from "@/stores/CartStore";
import { useDishStore } from "@/stores/DishStore";
import CartDishCards from "./CartDishCards";
import { CartItem } from "@/types/CartItem";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";

type Props = {
  onCheckoutComplete?: (items: CartItem[]) => void;
};

const CartPanel = ({ onCheckoutComplete }: Props) => {
  const { items, clearItem } = useCartStore();
  const { decrementServings } = useDishStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    if (items.length <= 0) return;
    setIsCheckingOut(true);

    const orderSnapshot = items;
    items.forEach((item) => decrementServings(item.item.id, item.quantity));
    clearItem();

    onCheckoutComplete?.(orderSnapshot);
    setIsCheckingOut(false);
  };

  const total = items.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0,
  );

  return (
    <div className="bg-bg-muted border border-border shadow-sm rounded-2xl p-4 max-h-[calc(100vh-32px)] flex flex-col">
      <div className="flex items-center gap-2 mb-4 shrink-0 pb-3 border-b border-border/50">
        <ShoppingBag className="h-4 w-4 text-brand-primary" />
        <h2 className="font-bold text-sm">Current Order</h2>
        <span className="ml-auto bg-bg text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
          {items.length} items
        </span>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 scrollbar-hide pr-1">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50 py-10">
            <ShoppingBag className="h-8 w-8 mb-2" />
            <p className="text-xs font-medium">Cart is empty</p>
          </div>
        ) : (
          items.map((item) => <CartDishCards key={item.item.id} {...item} />)
        )}
      </div>

      <div className="border-t border-border mt-4 pt-4 flex flex-col gap-3 shrink-0">
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm text-muted-foreground">
            Total
          </span>
          <span className="font-bold text-lg text-brand-secondary">
            ₱{total.toFixed(0)}
          </span>
        </div>

        <button
          className="w-full bg-brand-primary text-white rounded-xl py-3.5 text-sm font-bold shadow-md hover:bg-brand-primary/90 disabled:bg-brand-primary/40 disabled:shadow-none transition-all active:scale-[0.98] shrink-0 flex items-center justify-center gap-2"
          onClick={handleCheckout}
          disabled={items.length <= 0 || isCheckingOut}
        >
          {isCheckingOut ? "Processing..." : "Complete Checkout"}
        </button>
      </div>
    </div>
  );
};

export default CartPanel;
