import { Dialog, DialogContent } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Check } from "lucide-react"
import { CartItem } from "@/types/CartItem"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CartItem[]
  cashierName: string
  onNewOrder: () => void
}

const OrderSummaryDialog = ({ open, onOpenChange, items, cashierName, onNewOrder }: Props) => {
  const total = items.reduce((sum, item) => sum + item.item.price * item.quantity, 0)
  const timestamp = new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl p-5">
        <div className="text-center mb-3.5">
          <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-2">
            <Check className="h-5 w-5 text-success" />
          </div>
          <h2 className="font-medium text-[15px]">Order summary</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Beboy&apos;s Kagawad&apos;s Best Eatery</p>
        </div>

        <div className="border-y border-dashed border-border py-2.5 flex flex-col gap-1.5">
          {items.map((item) => (
            <div key={item.item.id} className="flex justify-between text-sm">
              <span>{item.item.name} <span className="text-muted-foreground">x{item.quantity}</span></span>
              <span>₱{item.item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between py-2.5">
          <span className="font-medium text-sm">Total</span>
          <span className="font-medium text-sm">₱{total}</span>
        </div>

        <p className="text-[11px] text-muted-foreground mb-3">
          {timestamp} · Cashier: {cashierName}
        </p>

        <div className="mb-3">
          <label className="text-xs text-muted-foreground block mb-1">Email (optional)</label>
          <Input placeholder="name@example.com" />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onNewOrder}>
            New order
          </Button>
          <Button className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white">
            Send summary
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OrderSummaryDialog