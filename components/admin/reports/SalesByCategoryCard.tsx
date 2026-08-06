import React from "react";
import { PieChart as PieIcon } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";

interface CategorySales {
  category_id: string;
  category_name: string;
  total_sold: number;
  total_revenue: number;
}

const colorPalette = [
  "bg-primary",
  "bg-blue-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-rose-500",
];

export async function SalesByCategoryCard() {
  const { data, error } = await supabaseAdmin
    .from("sales_by_category")
    .select("*");

  if (error) {
    console.error("Error fetching sales by category:", error.message);
  }

  const categories: CategorySales[] = data || [];

  // 1. Calculate overall total revenue across all categories
  const grandTotalRevenue = categories.reduce(
    (acc, curr) => acc + (Number(curr.total_revenue) || 0),
    0,
  );

  // 2. Find the dominant category (highest revenue)
  const dominantCategory = categories.reduce(
    (max, curr) =>
      Number(curr.total_revenue) > Number(max?.total_revenue || 0) ? curr : max,
    categories[0],
  );

  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs text-card-foreground flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Sales by Category
          </h3>
          <p className="text-xs text-muted-foreground">
            Revenue proportions across menu groups
          </p>
        </div>
        <div className="p-2 rounded-lg bg-muted/40 text-muted-foreground">
          <PieIcon className="h-4 w-4" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-2">
        <div className="relative w-36 h-36 rounded-full border-8 border-primary/20 flex items-center justify-center bg-muted/10">
          <div className="absolute inset-2 rounded-full border-8 border-blue-500/30 flex items-center justify-center" />
          <div className="text-center">
            <span className="text-xs text-muted-foreground block">
              Total Mix
            </span>
            <span className="text-sm font-bold">100%</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1 w-full">
          {categories.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-4">
              No category data available.
            </div>
          ) : (
            categories.map((cat, i) => {
              const rev = Number(cat.total_revenue) || 0;
              const sharePercent =
                grandTotalRevenue > 0
                  ? Math.round((rev / grandTotalRevenue) * 100)
                  : 0;
              const colorClass = colorPalette[i % colorPalette.length];

              return (
                <div
                  key={cat.category_id || i}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${colorClass}`}
                    />
                    <span className="font-medium text-foreground">
                      {cat.category_name} ({sharePercent}%)
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    ₱
                    {rev.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 text-xs text-muted-foreground text-center">
        Dominant Category:{" "}
        <strong className="text-foreground">
          {dominantCategory ? dominantCategory.category_name : "N/A"}
        </strong>
      </div>
    </div>
  );
}
