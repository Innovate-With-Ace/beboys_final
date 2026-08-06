import React from "react";
import { AlertTriangle } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function LowStockAlertsCard() {
  const { data, error } = await supabaseAdmin
    .from("ingredients")
    .select("id, name, stock, unit, low_stock_threshold");

  const lowStockItems = (data ?? [])
    .filter((i) => i.stock <= i.low_stock_threshold)
    .sort(
      (a, b) =>
        a.stock / a.low_stock_threshold - b.stock / b.low_stock_threshold,
    );

  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs text-card-foreground flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              Low-Stock Alerts
            </h3>
            <p className="text-xs text-muted-foreground">
              Ingredients requiring immediate replenishment
            </p>
          </div>
          <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground">
                <th className="py-2.5 font-semibold">Ingredient Name</th>
                <th className="py-2.5 font-semibold text-center">
                  Current Stock
                </th>
                <th className="py-2.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {lowStockItems.map((item, i) => (
                <tr key={i} className="hover:bg-muted/20">
                  <td className="py-2.5 font-medium text-foreground">
                    {item.name}
                  </td>
                  <td className="py-2.5 text-center text-muted-foreground">
                    {item.stock} {item.unit}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                      Low Stock
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border/40 text-xs text-muted-foreground">
        <span>
          {lowStockItems.length} {lowStockItems.length === 1 ? "item" : "items"}{" "}
          need attention
        </span>
      </div>
    </div>
  );
}
