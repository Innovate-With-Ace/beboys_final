// components/admin/reports/IngredientUsageCard.tsx
import { Activity } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function IngredientUsageCard() {
  const { data: usage, error: usageError } = await supabaseAdmin
    .from("daily_ingredient_consumption")
    .select("*")
    .order("day", { ascending: true });

  const { data: mostConsumed, error: mostConsumedError } = await supabaseAdmin
    .from("most_consumed_ingredient")
    .select("*")
    .single();

  if (usageError) {
    console.error("Error fetching ingredient usage:", usageError.message);
  }
  if (mostConsumedError) {
    console.error(
      "Error fetching most consumed ingredient:",
      mostConsumedError.message,
    );
  }

  const usageData = usage ?? [];
  const maxValue = Math.max(...usageData.map((row) => row.total_consumed), 1);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs text-card-foreground flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Ingredient Usage Over Time
          </h3>
          <p className="text-xs text-muted-foreground">
            Total daily consumption across all ingredients
          </p>
        </div>
        <div className="p-2 rounded-lg bg-muted/40 text-muted-foreground">
          <Activity className="h-4 w-4" />
        </div>
      </div>

      {usageData.length === 0 ? (
        <div className="w-full h-48 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border/80 rounded-lg">
          No usage data available
        </div>
      ) : (
        <div className="w-full h-48 bg-muted/20 rounded-lg border border-dashed border-border/80 flex items-end justify-between px-3 py-3 gap-1">
          {usageData.map((row, i) => {
            const heightPercent = Math.max(
              (row.total_consumed / maxValue) * 100,
              4,
            );
            return (
              <div
                key={i}
                className="w-full bg-amber-500/20 rounded-t flex flex-col justify-end h-full"
                title={`${row.day}: ${row.total_consumed}`}
              >
                <div
                  className="w-full bg-amber-500 rounded-t"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <span>
          Most Consumed:{" "}
          <strong className="text-foreground">
            {mostConsumed?.name ?? "N/A"}
          </strong>
        </span>
        <span className="text-amber-600 font-medium">
          Tracking active stock burn
        </span>
      </div>
    </div>
  );
}
