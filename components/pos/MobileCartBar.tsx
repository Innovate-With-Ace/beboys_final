// components/pos/MobileCartBar.tsx
"use client";
import { useState } from "react";
import { useCartStore } from "@/stores/CartStore";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import CartPanel from "./CartPanel";
import { CartItem } from "@/types/CartItem";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type Props = {
  onCheckoutComplete?: (items: CartItem[]) => void;
  isCheckingOut?: boolean; // Add prop here
};

const MobileCartBar = ({ onCheckoutComplete, isCheckingOut }: Props) => {
  const { items } = useCartStore();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (items.length === 0) return null;

  const total = items.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0,
  );
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <button className="fixed bottom-4 left-4 right-4 bg-bg border border-border rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-[0.98] transition-transform z-50">
          <div className="flex flex-col items-start">
            <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
              Total ({count} items)
            </span>
            <span className="text-base font-bold text-brand-secondary">
              ₱{total.toFixed(0)}
            </span>
          </div>
          <span className="bg-brand-primary text-white text-sm font-bold px-5 py-2 rounded-xl shadow-sm">
            View Cart
          </span>
        </button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[90vh] p-0 border-t-0 bg-bg px-2 pb-6 pt-2"
      >
        <VisuallyHidden>
          <SheetTitle>Mobile Cart</SheetTitle>
        </VisuallyHidden>
        <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-4 mt-2" />

        <CartPanel
          isCheckingOut={isCheckingOut} // Pass it down!
          onCheckoutComplete={(orderItems) => {
            setSheetOpen(false);
            onCheckoutComplete?.(orderItems);
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default MobileCartBar;
