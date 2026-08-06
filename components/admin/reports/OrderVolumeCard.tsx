import React from "react";
import { BarChart3 } from "lucide-react";

export function OrderVolumeCard() {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs text-card-foreground flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Order Volume Trends (Peak Hours)
          </h3>
          <p className="text-xs text-muted-foreground">
            Average order counts distribution by hour
          </p>
        </div>
        <div className="p-2 rounded-lg bg-muted/40 text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
        </div>
      </div>
      <div className="w-full h-48 bg-muted/20 rounded-lg border border-dashed border-border/80 flex items-end justify-between px-3 py-3 gap-1">
        {[10, 15, 20, 25, 40, 85, 95, 50, 30, 45, 90, 100, 70, 30].map(
          (val, idx) => (
            <div
              key={idx}
              className="w-full bg-blue-500/20 rounded-t flex flex-col justify-end h-full"
            >
              <div
                className="w-full bg-blue-600 rounded-t"
                style={{ height: `${val}%` }}
              />
            </div>
          ),
        )}
      </div>
      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <span>
          Peak Traffic Window:{" "}
          <strong className="text-foreground">12:00 PM – 2:00 PM</strong>
        </span>
        <span>
          Busiest Day: <strong className="text-foreground">Saturday</strong>
        </span>
      </div>
    </div>
  );
}
