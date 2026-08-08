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

const OrdersTable = ({ orders = [] }: Props) => {
  // 1. Track the actual order object instead of a boolean
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
            const totalAmount = order.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0,
            );

            const currentStatus =
              statusConfig[order.status] || statusConfig.pending;

            return (
              <TableRow
                key={order.id}
                // 2. Make the whole row clickable
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
                  ₱
                  {totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>

                <TableCell className="text-center">
                  <span className={currentStatus.className}>
                    {currentStatus.label}
                  </span>
                </TableCell>

                <TableCell className="text-right text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground group-hover:text-brand-primary transition-colors"
                    // The row onClick handles this now, but leaving this prevents a bug if they specifically click the icon
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

      {/* 3. Render exactly ONE dialog outside the table loop */}
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
