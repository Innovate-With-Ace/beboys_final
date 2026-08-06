import React from "react";
import { AlertTriangle } from "lucide-react";

export function LowStockAlertsCard() {
  const lowStockItems = [
    { name: "Chicken Breast (kg)", stock: 3.5, unit: "kg", threshold: 5.0 },
    { name: "Cooking Oil (L)", stock: 2.0, unit: "L", threshold: 10.0 },
    { name: "Jasmine Rice (sack)", stock: 1, unit: "sack", threshold: 3 },
    { name: "Garlic (kg)", stock: 0.8, unit: "kg", threshold: 2.0 },
  ];

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
      <div className="mt-4 pt-3 border-t border-border/40 text-xs text-muted-foreground flex justify-between items-center">
        <span>4 items need attention</span>
        <span className="text-primary font-medium cursor-pointer hover:underline">
          Create Purchase Order &rarr;
        </span>
      </div>
    </div>
  );
}
