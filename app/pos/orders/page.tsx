"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useOrders } from "@/hooks/useOrders";
import { Order, OrderStatus } from "@/types/Order";
import fetchApi from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ChefHat,
  CheckCircle2,
  Ban,
  Clock,
  ReceiptText,
  Loader2,
  History,
} from "lucide-react";

const ACTIVE_STATUSES: OrderStatus[] = ["pending", "preparing"];

function useElapsedLabel(createdAt: string) {
  const minutes = Math.max(
    0,
    Math.round((Date.now() - new Date(createdAt).getTime()) / 60000),
  );
  const urgency =
    minutes >= 15 ? "critical" : minutes >= 5 ? "warning" : "fresh";
  const label = minutes === 0 ? "just now" : `${minutes}m ago`;
  return { label, urgency };
}

const urgencyStyles: Record<string, string> = {
  fresh: "text-emerald-600 bg-emerald-500/10",
  warning: "text-amber-600 bg-amber-500/10",
  critical: "text-destructive bg-destructive/10",
};

function OrderQueueCard({ order }: { order: Order }) {
  const queryClient = useQueryClient();
  const { label, urgency } = useElapsedLabel(order.created_at);

  const updateOrder = useMutation({
    mutationFn: (status: OrderStatus) =>
      fetchApi<Order>(`/api/orders/${order.id}`, {
        body: JSON.stringify({ status }),
        method: "PATCH",
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData<Order[]>(["orders"], (old) =>
        old ? old.map((o) => (o.id === updated.id ? updated : o)) : [updated],
      );
      toast.success(
        updated.status === "completed"
          ? "Order completed"
          : updated.status === "preparing"
            ? "Order marked preparing"
            : "Order cancelled",
      );
    },
    onError: () => toast.error("Failed to update order. Please try again."),
  });

  const total = order.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  return (
    <div className="rounded-2xl border border-border/70 bg-card shadow-sm overflow-hidden flex flex-col">
      <div className="px-4 py-3 flex items-center justify-between border-b border-border/50 bg-muted/20">
        <div>
          <p className="text-sm font-bold text-foreground">
            #{order.id.slice(0, 6)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {order.cashier_name || "Mobile order"}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold ${urgencyStyles[urgency]}`}
        >
          <Clock className="h-3 w-3" />
          {label}
        </span>
      </div>

      <div className="p-4 flex-1 space-y-2">
        {order.items.map((item) => (
          <div
            key={item.dish_id}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-foreground">
              <span className="font-semibold">{item.quantity}×</span>{" "}
              {item.name}
            </span>
            <span className="text-muted-foreground">
              ₱{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5 border-t border-dashed border-border/60 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Total</span>
        <span className="font-bold text-foreground">
          ₱{total.toFixed(2)}
        </span>
      </div>

      <div className="p-3 pt-0 flex items-center gap-2">
        {order.status === "pending" && (
          <Button
            size="sm"
            className="flex-1 h-10 bg-brand-secondary text-brand-secondary-foreground hover:bg-brand-secondary/90 font-semibold gap-1.5"
            disabled={updateOrder.isPending}
            onClick={() => updateOrder.mutate("preparing")}
          >
            {updateOrder.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ChefHat className="h-4 w-4" />
            )}
            Start Preparing
          </Button>
        )}
        {order.status === "preparing" && (
          <Button
            size="sm"
            className="flex-1 h-10 bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary/90 font-semibold gap-1.5"
            disabled={updateOrder.isPending}
            onClick={() => updateOrder.mutate("completed")}
          >
            {updateOrder.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Mark Completed
          </Button>
        )}
        {(order.status === "pending" || order.status === "preparing") && (
          <Button
            size="sm"
            variant="outline"
            className="h-10 px-3 text-destructive border-destructive/30 hover:bg-destructive/10"
            disabled={updateOrder.isPending}
            onClick={() => updateOrder.mutate("cancelled")}
          >
            <Ban className="h-4 w-4" />
          </Button>
        )}
        {(order.status === "completed" || order.status === "cancelled") && (
          <span
            className={`flex-1 h-10 rounded-md flex items-center justify-center text-xs font-bold uppercase tracking-wide ${
              order.status === "completed"
                ? "text-brand-primary bg-brand-primary/10"
                : "text-destructive bg-destructive/10"
            }`}
          >
            {order.status}
          </span>
        )}
      </div>
    </div>
  );
}

export default function PosOrdersPage() {
  const { data = [], isLoading } = useOrders({ refetchInterval: 15000 });
  const [showHistory, setShowHistory] = useState(false);

  const pending = useMemo(
    () => data.filter((o) => o.status === "pending"),
    [data],
  );
  const preparing = useMemo(
    () => data.filter((o) => o.status === "preparing"),
    [data],
  );
  const history = useMemo(
    () => data.filter((o) => !ACTIVE_STATUSES.includes(o.status)).slice(0, 20),
    [data],
  );

  return (
    <main className="bg-bg min-h-screen p-4">
      <div className="flex items-center justify-between bg-bg-muted rounded-2xl px-4 py-3 mb-5 border border-border/40 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/pos"
            className="h-9 w-9 rounded-xl bg-background border border-border/60 flex items-center justify-center shrink-0 hover:bg-muted/40 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-heading font-bold text-sm text-foreground">
              Live Orders
            </h1>
            <p className="text-[11px] font-medium text-muted-foreground">
              {pending.length} waiting · {preparing.length} preparing
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs h-8"
          onClick={() => setShowHistory((v) => !v)}
        >
          <History className="h-3.5 w-3.5 text-muted-foreground" />
          {showHistory ? "Hide History" : "History"}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-2xl" />
          ))}
        </div>
      ) : pending.length === 0 && preparing.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-2xl bg-muted/10">
          <ReceiptText className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
          <p className="text-sm font-medium">No active orders</p>
          <p className="text-xs text-muted-foreground">
            New orders from the register or mobile app will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Waiting ({pending.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {pending.map((order) => (
                  <OrderQueueCard key={order.id} order={order} />
                ))}
              </div>
            </section>
          )}

          {preparing.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-secondary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-secondary" />
                Preparing ({preparing.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {preparing.map((order) => (
                  <OrderQueueCard key={order.id} order={order} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {showHistory && (
        <section className="space-y-3 mt-8 pt-6 border-t border-dashed border-border/60">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Recent History
          </h2>
          {history.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No completed or cancelled orders yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 opacity-70">
              {history.map((order) => (
                <OrderQueueCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
