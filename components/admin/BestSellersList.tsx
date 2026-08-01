"use client";

import { useBestSellers } from "@/hooks/useBestSellers";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, UtensilsCrossed, AlertCircle } from "lucide-react";

const BestSellersList = () => {
  const { data, isLoading, error } = useBestSellers();

  return (
    <div className="bg-bg rounded-2xl p-4.5 border border-border h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="h-4 w-4 text-brand-secondary" />
        <p className="text-sm font-medium">Best sellers today</p>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {/* --- 1. LOADING STATE --- */}
        {isLoading && (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-bg-muted/50 rounded-xl px-3 py-2.5"
              >
                <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                <Skeleton className="h-4 flex-1 rounded" />
                <Skeleton className="h-4 w-12 rounded shrink-0" />
                <Skeleton className="h-4 w-12 rounded shrink-0" />
              </div>
            ))}
          </>
        )}

        {/* --- 2. ERROR STATE --- */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-border rounded-xl flex-1 bg-error/5">
            <AlertCircle className="h-6 w-6 text-error mb-2 opacity-80" />
            <p className="text-sm font-medium text-error">
              Failed to load data
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Please try refreshing the page.
            </p>
          </div>
        )}

        {/* --- 3. EMPTY STATE --- */}
        {!isLoading && !error && (!data || data.length === 0) && (
          <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-border rounded-xl flex-1 bg-bg-muted/30">
            <UtensilsCrossed className="h-6 w-6 text-muted-foreground mb-2 opacity-50" />
            <p className="text-sm font-medium">No sales yet</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Waiting for the first order today!
            </p>
          </div>
        )}

        {/* --- 4. SUCCESS STATE --- */}
        {!isLoading &&
          !error &&
          data &&
          data.length > 0 &&
          data.slice(0, 5).map((dish, i) => {
            // Limit to top 5 so the card doesn't get too long
            // Add Gold/Silver/Bronze colors for the top 3
            const rankColors = [
              "bg-yellow-500/15 text-yellow-600 font-bold", // 1st
              "bg-slate-400/15 text-slate-600 font-bold", // 2nd
              "bg-orange-500/15 text-orange-600 font-bold", // 3rd
            ];

            const rankClass =
              rankColors[i] || "bg-bg-muted text-muted-foreground font-medium";

            return (
              <div
                key={dish.name}
                className="flex items-center gap-3 bg-bg-muted/40 hover:bg-bg-muted transition-colors rounded-xl px-3 py-2.5 border border-transparent hover:border-border/60"
              >
                {/* Rank Number */}
                <div
                  className={`h-6 w-6 flex items-center justify-center rounded-full text-[11px] shrink-0 ${rankClass}`}
                >
                  {i + 1}
                </div>

                {/* Dish Name */}
                <span className="flex-1 text-sm font-medium truncate">
                  {dish.name}
                </span>

                {/* Sold Count */}
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {dish.total_sold} sold
                </span>

                {/* Revenue */}
                <span className="text-xs font-semibold text-brand-secondary whitespace-nowrap w-12 text-right">
                  ₱{dish.total_revenue}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BestSellersList;
