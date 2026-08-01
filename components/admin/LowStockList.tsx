// components/admin/LowStockList.tsx
"use client";

import { PackageX, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLowStock } from "@/hooks/useLowStock";

const LowStockList = () => {
  const { data: lowStock, isLoading, isError } = useLowStock();

  return (
    <div className="bg-bg rounded-2xl p-5 border border-border h-full flex flex-col">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <p className="text-sm font-medium">Low stock alerts</p>
        </div>
        <span className="text-[11px] font-bold text-warning bg-warning/15 px-2 py-1 rounded-md">
          {lowStock?.length ?? 0} items
        </span>
      </div>

      {/* --- BODY --- */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      ) : isError || !lowStock ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-error">Failed to load stock levels</p>
        </div>
      ) : lowStock.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            All ingredients well stocked
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1">
          {lowStock.map((item) => {
            const ratio = item.stock / item.low_stock_threshold;
            const isCritical = ratio <= 0.5;

            const widthPercent = Math.min(
              Math.max((item.stock / item.low_stock_threshold) * 100, 5),
              100,
            );

            return (
              <div
                key={item.id}
                className="flex flex-col gap-2 bg-bg-muted/50 hover:bg-bg-muted transition-colors rounded-xl p-3 border border-border/40 hover:border-border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      isCritical
                        ? "bg-error/15 text-error"
                        : "bg-warning/15 text-warning"
                    }`}
                  >
                    <PackageX className="h-4.5 w-4.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-semibold truncate text-foreground">
                        {item.name}
                      </p>
                      <span
                        className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          isCritical
                            ? "bg-error/20 text-error"
                            : "bg-warning/20 text-warning"
                        }`}
                      >
                        {isCritical ? "Critical" : "Low"}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {item.stock}
                        {item.unit}
                      </span>{" "}
                      left of {item.low_stock_threshold}
                      {item.unit} threshold
                    </p>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-border/60 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCritical ? "bg-error" : "bg-warning"
                    }`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- FOOTER ACTION --- */}
      <Button
        asChild
        variant="outline"
        className="w-full mt-4 text-xs h-9 group"
        size="sm"
      >
        <Link
          href="/admin/ingredients"
          className="flex items-center justify-center gap-1.5"
        >
          View all ingredients
          <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </Button>
    </div>
  );
};

export default LowStockList;
