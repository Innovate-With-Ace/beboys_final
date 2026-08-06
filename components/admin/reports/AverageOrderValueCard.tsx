// components/admin/reports/AverageOrderValueCard.tsx
import { DollarSign } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function AverageOrderValueCard() {
  const { data, error } = await supabaseAdmin
    .from("average_order_value")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching average order value:", error.message);
  }

  const aov = data?.aov ?? 0;

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
        <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-primary">
          ₱
          {Number(aov).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      <div className="pt-3 border-t border-border/40 text-xs text-muted-foreground flex justify-between items-center">
        <span>Calculation Basis: Total Revenue / Total Completed Orders</span>
      </div>
    </div>
  );
}
