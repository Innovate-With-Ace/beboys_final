// components/pos/OrderSummaryDialog.tsx
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Receipt } from "lucide-react";
import { CartItem } from "@/types/CartItem";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  cashierName: string;
  onNewOrder: () => void;
};

const OrderSummaryDialog = ({
  open,
  onOpenChange,
  items,
  cashierName,
  onNewOrder,
}: Props) => {
  const total = items.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0,
  );
  const timestamp = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-[24px] p-6 bg-bg border-border shadow-xl">
        <VisuallyHidden>
          <DialogTitle>Order Summary</DialogTitle>
        </VisuallyHidden>

        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-3 shadow-sm ring-4 ring-success/5">
            <Check className="h-7 w-7 text-success" />
          </div>
          <h2 className="font-bold text-lg text-foreground">
            Checkout Complete
          </h2>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            Beboy's Kagawad's Best Eatery
          </p>
        </div>

        {/* Receipt Container */}
        <div className="bg-bg-muted rounded-xl p-4 border border-border/50 mb-5">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-dashed border-border">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Order Details
            </span>
          </div>

          <div className="flex flex-col gap-2.5 mb-3">
            {items.map((item) => (
              <div key={item.item.id} className="flex justify-between text-sm">
                <span className="font-medium text-foreground">
                  {item.item.name}{" "}
                  <span className="text-muted-foreground ml-1">
                    x{item.quantity}
                  </span>
                </span>
                <span className="font-mono text-brand-secondary font-medium">
                  ₱{(item.item.price * item.quantity).toFixed(0)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-dashed border-border">
            <span className="font-bold text-sm">Total Paid</span>
            <span className="font-mono font-bold text-lg text-brand-secondary">
              ₱{total.toFixed(0)}
            </span>
          </div>
        </div>

        <p className="text-[11px] font-medium text-muted-foreground text-center mb-5">
          {timestamp} • Cashier: {cashierName}
        </p>

        <div className="mb-4">
          <label className="text-xs font-bold text-foreground block mb-1.5 ml-1">
            Email E-Receipt (Optional)
          </label>
          <Input
            placeholder="customer@email.com"
            className="rounded-xl bg-bg shadow-sm border-border"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl font-bold"
            onClick={onNewOrder}
          >
            New Order
          </Button>
          <Button className="flex-1 rounded-xl font-bold bg-brand-primary hover:bg-brand-primary/90 text-white shadow-md">
            Send Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSummaryDialog;
