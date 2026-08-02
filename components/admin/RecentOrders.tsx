// components/admin/RecentOrders.tsx
"use client";

import Link from "next/link";
import { Receipt, ChevronRight } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";

const RecentOrders = () => {
  let index = 0;
  const { data, isLoading, isError } = useOrders();

  return (
    <div className="bg-bg rounded-2xl p-5 border border-border h-full flex flex-col">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-brand-secondary" />
          <p className="text-sm font-medium">Recent orders</p>
        </div>
        <Link
          href="/admin/orders"
          className="text-xs font-medium text-brand-primary hover:text-brand-primary/80 flex items-center transition-colors"
        >
          View all <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
        </Link>
      </div>

      {/* --- BODY --- */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading orders...</p>
        </div>
      ) : isError || !data ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-error">Failed to load orders</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No orders yet today</p>
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          {data.slice(0, 5).map((order, i) => {
            index++;
            return (
              <div
                key={order.id}
                className={`flex items-center gap-3 py-3 group cursor-pointer ${
                  i !== data.length - 1 ? "border-b border-border/60" : ""
                }`}
              >
                <div className="h-9 w-9 rounded-xl bg-bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0 transition-colors group-hover:bg-brand-primary/10 group-hover:text-brand-primary">
                  #{index}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground transition-colors group-hover:text-brand-primary">
                    {order.items.map((item) => item.name).join(", ")}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-muted-foreground">
                    <span>{order.cashier_id}</span>
                    <span className="h-1 w-1 rounded-full bg-border/80"></span>
                    <span>
                      {new Date(order.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <span className="text-sm font-bold shrink-0 text-foreground">
                  ₱{order.total}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
