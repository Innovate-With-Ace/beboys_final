import React from "react";
import { PieChart as PieIcon } from "lucide-react";

export function SalesByCategoryCard() {
  const categories = [
    {
      name: "Rice Meals",
      share: "45%",
      amount: "₱56,025",
      color: "bg-primary",
    },
    { name: "Drinks", share: "25%", amount: "₱31,125", color: "bg-blue-500" },
    {
      name: "Desserts",
      share: "18%",
      amount: "₱22,410",
      color: "bg-amber-500",
    },
    {
      name: "Appetizers",
      share: "12%",
      amount: "₱14,940",
      color: "bg-emerald-500",
    },
  ];

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
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                <span className="font-medium text-foreground">
                  {cat.name} ({cat.share})
                </span>
              </div>
              <span className="text-muted-foreground">{cat.amount}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border/40 text-xs text-muted-foreground text-center">
        Dominant Category:{" "}
        <strong className="text-foreground">Rice Meals</strong>
      </div>
    </div>
  );
}
