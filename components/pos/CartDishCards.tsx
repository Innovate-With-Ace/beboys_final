// components/pos/CartDishCards.tsx
import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash, Soup } from "lucide-react";
import { CartItem } from "@/types/CartItem";
import { useCartStore } from "@/stores/CartStore";

const CartDishCards = ({ item, quantity }: CartItem) => {
  const { decrementQuantity, addItem } = useCartStore();

  return (
    <div className="flex items-center gap-3 p-2 bg-bg rounded-xl border border-border/50 hover:border-border transition-colors">
      <div className="relative size-12 shrink-0 rounded-lg overflow-hidden bg-bg-muted flex items-center justify-center">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <Soup className="size-5 text-muted-foreground/50" />
        )}
      </div>

      <div className="flex-1 min-w-0 py-1">
        <p className="text-sm font-semibold truncate leading-tight">
          {item.name}
        </p>
        <p className="text-[13px] font-bold text-brand-secondary mt-0.5">
          ₱{(item.price * quantity).toFixed(0)}
        </p>
      </div>

      {/* Unified Control Pill */}
      <div className="flex items-center bg-bg-muted border border-border rounded-lg p-0.5 shrink-0">
        <button
          className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-bg text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => decrementQuantity(item)}
        >
          {quantity > 1 ? (
            <Minus className="h-3.5 w-3.5" />
          ) : (
            <Trash className="h-3.5 w-3.5 text-error" />
          )}
        </button>
        <span className="text-xs font-bold w-6 text-center">{quantity}</span>
        <button
          className="h-7 w-7 flex items-center justify-center rounded-md bg-bg shadow-sm border border-border/50 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
          onClick={() => addItem(item)}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default CartDishCards;
