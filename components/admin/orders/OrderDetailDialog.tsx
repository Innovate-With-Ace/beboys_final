// components/admin/orders/OrderDetailDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus } from "@/types/Order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import fetchApi from "@/lib/api";
import { toast } from "sonner";
import { Loader2, ChefHat, CheckCircle2, Ban } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
};

const statusConfig: Record<OrderStatus, { className: string; label: string }> =
  {
    cancelled: {
      className: "bg-error/10 text-error border-error/20",
      label: "Cancelled",
    },
    completed: {
      className:
        "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
      label: "Completed",
    },
    pending: {
      className: "bg-warning/15 text-warning border-warning/20",
      label: "Pending",
    },
    preparing: {
      className:
        "bg-brand-secondary/15 text-brand-secondary border-brand-secondary/20",
      label: "Preparing",
    },
  };

const OrderDetailDialog = ({ open, onOpenChange, order }: Props) => {
  const queryClient = useQueryClient();

  // 1. All hooks must be declared first, unconditionally
  const updateOrder = useMutation({
    mutationFn: (status: OrderStatus) =>
      fetchApi<Order>(`/api/orders/${order?.id}`, {
        body: JSON.stringify({ status }),
        method: "PATCH",
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData<Order[]>(["orders"], (old) =>
        old ? old.map((o) => (o.id === updated.id ? updated : o)) : [updated],
      );
      toast.success("Order status updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update order status. Please try again.");
    },
  });

  // 2. NOW you can safely do early returns after all hooks have run
  if (!order) return null;

  // 3. Dynamically find the live, up-to-date order from the query cache so UI updates instantly!
  const cachedOrders = queryClient.getQueryData<Order[]>(["orders"]);
  const liveOrder = cachedOrders?.find((o) => o.id === order.id) || order;

  const currentStatus = statusConfig[liveOrder.status] ?? statusConfig.pending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* HEADER */}
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl border-border max-h-[85vh] flex flex-col">
        <DialogHeader className="px-6 py-4 bg-muted/30 border-b border-border flex-row items-center justify-between space-y-0 shrink-0">
          <div>
            <DialogTitle className="text-base font-semibold text-foreground">
              Order #{liveOrder.id.toString().slice(0, 6)}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              {new Date(liveOrder.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </DialogDescription>
          </div>

          <span
            className={`text-[11px] font-bold px-3 py-1 rounded-full border tracking-wide uppercase shrink-0 ${currentStatus.className}`}
          >
            {currentStatus.label}
          </span>
        </DialogHeader>

        {/* BODY ITEMS */}
        <div className="px-6 py-5 flex-1 overflow-y-auto">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
            Order Items
          </p>
          <div className="flex flex-col gap-3">
            {liveOrder.items.map((item) => (
              <div
                key={item.dish_id}
                className="flex justify-between items-center py-1.5 border-b border-border/40 last:border-0"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty:{" "}
                    <span className="font-semibold text-foreground">
                      {item.quantity}
                    </span>{" "}
                    · ₱{item.price} each
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-border my-5" />

          {/* META INFO */}
          <div className="space-y-2 bg-muted/20 p-3.5 rounded-xl border border-border/60">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Cashier ID</span>
              <span className="font-medium text-foreground">
                {liveOrder.cashier_id || "System"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-border/40">
              <span className="font-semibold text-foreground">
                Total Amount
              </span>
              <span className="text-base font-bold text-brand-primary">
                ₱
                {liveOrder.items
                  .reduce((sum, i) => sum + i.price * i.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border shrink-0 flex flex-col gap-2.5">
          {/* Status Flow Action Buttons */}
          <div className="flex items-center justify-between gap-2 w-full">
            {liveOrder.status === "pending" && (
              <Button
                disabled={updateOrder.isPending}
                onClick={() => updateOrder.mutate("preparing")}
                className="flex-1 bg-brand-secondary text-brand-secondary-foreground hover:bg-brand-secondary/90 font-medium"
                size="sm"
              >
                {updateOrder.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ChefHat className="h-4 w-4 mr-2" />
                )}
                Mark Preparing
              </Button>
            )}

            {(liveOrder.status === "pending" ||
              liveOrder.status === "preparing") && (
              <Button
                disabled={updateOrder.isPending}
                onClick={() => updateOrder.mutate("completed")}
                className="flex-1 bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary/90 font-medium"
                size="sm"
              >
                {updateOrder.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Mark Completed
              </Button>
            )}

            {liveOrder.status !== "cancelled" &&
              liveOrder.status !== "completed" && (
                <Button
                  disabled={updateOrder.isPending}
                  variant="outline"
                  onClick={() => updateOrder.mutate("cancelled")}
                  className="text-error border-error/30 hover:bg-error/10 hover:text-error"
                  size="sm"
                >
                  <Ban className="h-4 w-4" />
                </Button>
              )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
