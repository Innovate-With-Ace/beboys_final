import React from "react";
import { TrendingUp } from "lucide-react";

export function RevenueChartCard() {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs text-card-foreground flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Revenue Over Time
          </h3>
          <p className="text-xs text-muted-foreground">
            Daily earnings trend for the selected period
          </p>
        </div>
        <div className="p-2 rounded-lg bg-muted/40 text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
        </div>
      </div>
      <div className="w-full h-48 bg-muted/20 rounded-lg border border-dashed border-border/80 flex items-end justify-between px-4 py-3 gap-2">
        {[40, 65, 45, 80, 55, 95, 75, 85, 60, 90, 100, 85].map((val, idx) => (
          <div
            key={idx}
            className="w-full bg-primary/20 hover:bg-primary/30 rounded-t transition-all relative group flex flex-col justify-end"
            style={{ height: `${val}%` }}
          >
            <div
              className="w-full bg-primary rounded-t"
              style={{ height: "60%" }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <span>
          Total: <strong className="text-foreground">₱124,500.00</strong>
        </span>
        <span className="text-emerald-600 font-medium">
          +12.5% vs last period
        </span>
      </div>
    </div>
  );
}
