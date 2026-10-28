import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order, OrderStatus } from "@/types/Order";
import { Button } from "@/components/ui/button";
import { Eye, ReceiptText } from "lucide-react";
import { useState } from "react";
import OrderDetailDialog from "./OrderDetailDialog";

type Props = {
  orders?: Order[];
};

const statusConfig: Record<OrderStatus, { className: string; label: string }> =
  {
    cancelled: {
      className:
        "inline-block bg-error/10 px-2.5 py-1 rounded-md text-error text-[11px] uppercase tracking-wider font-bold",
      label: "Cancelled",
    },
    completed: {
      className:
        "inline-block bg-brand-primary/10 px-2.5 py-1 rounded-md text-brand-primary text-[11px] uppercase tracking-wider font-bold",
      label: "Completed",
    },
    pending: {
      className:
        "inline-block bg-warning/15 px-2.5 py-1 rounded-md text-warning text-[11px] uppercase tracking-wider font-bold",
      label: "Pending",
    },
    preparing: {
      className:
        "inline-block bg-brand-secondary/15 px-2.5 py-1 rounded-md text-brand-secondary text-[11px] uppercase tracking-wider font-bold",
      label: "Preparing",
    },
  };

const formatPeso = (amount: number) =>
  amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const getTotal = (order: Order) =>
  order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const OrdersTable = ({ orders = [] }: Props) => {
  // Track the actual order object instead of a boolean
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ReceiptText className="h-10 w-10 text-muted-foreground mb-3 opacity-20" />
        <p className="text-sm font-medium">No orders found</p>
        <p className="text-xs text-muted-foreground mt-1">
          When customers place orders, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ===================== DESKTOP: TABLE (lg and up) ===================== */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader className="bg-bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[90px] font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Items</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold text-right">Total</TableHead>
              <TableHead className="text-center font-semibold w-[120px]">
                Status
              </TableHead>
              <TableHead className="text-right font-semibold w-[160px]">
                Time
              </TableHead>
              <TableHead className="text-center font-semibold w-[80px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => {
              const currentStatus =
                statusConfig[order.status] || statusConfig.pending;

              return (
                <TableRow
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="group cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium text-muted-foreground">
                    #{order.id.toString().slice(0, 6)}
                  </TableCell>

                  <TableCell className="max-w-[250px] truncate text-sm">
                    {order.items
                      .map((i) => `${i.name} x${i.quantity}`)
                      .join(", ")}
                  </TableCell>

                  <TableCell className="text-sm">
                    {order.cashier_name || "System"}
                  </TableCell>

                  <TableCell className="text-right font-semibold text-foreground">
                    ₱{formatPeso(getTotal(order))}
                  </TableCell>

                  <TableCell className="text-center">
                    <span className={currentStatus.className}>
                      {currentStatus.label}
                    </span>
                  </TableCell>

                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatTime(order.created_at)}
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground group-hover:text-brand-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation(); // Stops the row click from firing twice
                        setSelectedOrder(order);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* ===================== MOBILE / TABLET: CARDS (below lg) ===================== */}
      <div className="lg:hidden p-3 space-y-3">
        {orders.map((order) => {
          const currentStatus =
            statusConfig[order.status] || statusConfig.pending;

          return (
            <div
              key={order.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedOrder(order)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedOrder(order);
                }
              }}
              className="rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs cursor-pointer transition-colors hover:border-brand-primary/40 active:bg-muted/30 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-foreground">
                  #{order.id.toString().slice(0, 6)}
                </span>
                <span className={currentStatus.className}>
                  {currentStatus.label}
                </span>
              </div>

              <p className="text-sm text-foreground line-clamp-2">
                {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
              </p>

              <div className="flex items-end justify-between gap-2 pt-2 border-t border-dashed border-border/60">
                <div className="min-w-0 text-xs text-muted-foreground space-y-0.5">
                  <p className="truncate">{order.cashier_name || "System"}</p>
                  <p>{formatTime(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-base font-bold text-foreground tabular-nums">
                    ₱{formatPeso(getTotal(order))}
                  </span>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Render exactly ONE dialog outside the loops */}
      {selectedOrder && (
        <OrderDetailDialog
          open={!!selectedOrder}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}
    </>
  );
};

export default OrdersTable;
