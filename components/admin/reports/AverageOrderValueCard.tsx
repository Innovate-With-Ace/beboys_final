import React from "react";
import { DollarSign } from "lucide-react";

export function AverageOrderValueCard() {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs text-card-foreground flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Average Order Value (AOV)
          </h3>
          <p className="text-xs text-muted-foreground">
            Mean spend per finalized table ticket
          </p>
        </div>
        <div className="p-2 rounded-lg bg-muted/40 text-muted-foreground">
          <DollarSign className="h-4 w-4" />
        </div>
      </div>

      <div className="my-6 flex flex-col items-center justify-center text-center">
        <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          ₱828.50
        </span>
        <span className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
          &uarr; 4.2% higher than industry baseline
        </span>
      </div>

      <div className="pt-3 border-t border-border/40 text-xs text-muted-foreground flex justify-between items-center">
        <span>Calculation Basis: Total Revenue / Total Completed Orders</span>
        <span className="text-primary font-medium cursor-pointer hover:underline">
          Deep dive &rarr;
        </span>
      </div>
    </div>
  );
}
