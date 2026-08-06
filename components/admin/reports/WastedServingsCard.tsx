import React from "react";
import { Trash2 } from "lucide-react";

export function WastedServingsCard() {
  const wasteData = [
    {
      dish: "Beef Sinigang",
      wasted: "12 servings",
      reason: "Spoilage / Expired",
    },
    {
      dish: "Pork Sisig",
      wasted: "8 servings",
      reason: "Prep Error / Overcooked",
    },
    {
      dish: "Chicken Adobo",
      wasted: "5 servings",
      reason: "Unclaimed Customer Order",
    },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs text-card-foreground flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              Servings Wasted / Unsold
            </h3>
            <p className="text-xs text-muted-foreground">
              Logged waste tracking per dish per day
            </p>
          </div>
          <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
            <Trash2 className="h-4 w-4" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground">
                <th className="py-2.5 font-semibold">Dish Item</th>
                <th className="py-2.5 font-semibold">Wasted Quantity</th>
                <th className="py-2.5 font-semibold text-right">
                  Primary Reason
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {wasteData.map((row, i) => (
                <tr key={i} className="hover:bg-muted/20">
                  <td className="py-2.5 font-medium text-foreground">
                    {row.dish}
                  </td>
                  <td className="py-2.5 text-destructive font-medium">
                    {row.wasted}
                  </td>
                  <td className="py-2.5 text-right text-muted-foreground">
                    {row.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border/40 text-xs text-muted-foreground flex justify-between">
        <span>
          Estimated Cost Impact:{" "}
          <strong className="text-destructive">₱3,420.00</strong>
        </span>
        <span className="text-primary font-medium cursor-pointer hover:underline">
          Log Waste &rarr;
        </span>
      </div>
    </div>
  );
}
