"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import { useOrders } from "@/hooks/useOrders";
import { Search, Loader2, AlertCircle } from "lucide-react";

const Page = () => {
  const { data, isLoading, isError } = useOrders();

  // 1. State to track the search input
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Derive the filtered data locally
  const filteredOrders = useMemo(() => {
    // If there's no data yet, return an empty array
    if (!data) return [];

    // If the search bar is empty, return everything
    if (!searchQuery.trim()) return data;

    const lowerCaseQuery = searchQuery.toLowerCase();

    return data.filter((order) => {
      // Check Order ID
      const matchesId = order.id
        .toString()
        .toLowerCase()
        .includes(lowerCaseQuery);

      // Check Cashier (fallback to 'system' if undefined)
      const matchesCashier = (order.cashier_id || "system")
        .toLowerCase()
        .includes(lowerCaseQuery);

      // Check Item Names (so they can search "Adobo" and see all orders containing it)
      const matchesItems = order.items.some((item) =>
        item.name.toLowerCase().includes(lowerCaseQuery),
      );

      return matchesId || matchesCashier || matchesItems;
    });
  }, [data, searchQuery]);

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-foreground">
            Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all customer orders
          </p>
        </div>
      </div>

      {/* MAIN CONTENT CARD */}
      <div className="bg-bg rounded-2xl p-5 border border-border flex flex-col gap-4 shadow-sm">
        {/* TOOLBAR */}
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order ID, cashier, or item..."
              className="pl-9 h-10 bg-background shadow-none border-border/60 focus-visible:ring-brand-primary"
            />
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="border border-border/60 rounded-xl overflow-hidden bg-background">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-brand-primary" />
              <p className="text-sm font-medium">Loading orders...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-error">
              <AlertCircle className="h-8 w-8 mb-4 opacity-80" />
              <p className="text-sm font-medium">Failed to load orders</p>
            </div>
          ) : (
            // Pass the newly filtered array instead of the raw data!
            <OrdersTable orders={filteredOrders} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
