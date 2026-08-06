import React from "react";
import { Activity } from "lucide-react";

export function IngredientUsageCard() {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs text-card-foreground flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Ingredient Usage Over Time
          </h3>
          <p className="text-xs text-muted-foreground">
            Consumption rate for baseline inventory items
          </p>
        </div>
        <div className="p-2 rounded-lg bg-muted/40 text-muted-foreground">
          <Activity className="h-4 w-4" />
        </div>
      </div>
      <div className="w-full h-48 bg-muted/20 rounded-lg border border-dashed border-border/80 flex items-center justify-center p-4">
        <div className="w-full h-full flex items-end justify-between gap-1 opacity-75">
          {[30, 45, 35, 60, 75, 50, 65, 80, 95, 85, 70, 90].map((h, i) => (
            <div
              key={i}
              className="w-full bg-amber-500 rounded-t"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <span>
          Most Consumed:{" "}
          <strong className="text-foreground">Jasmine Rice</strong>
        </span>
        <span className="text-amber-600 font-medium">
          Tracking active stock burn
        </span>
      </div>
    </div>
  );
}
