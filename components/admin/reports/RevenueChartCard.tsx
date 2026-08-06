import { supabaseAdmin } from "@/lib/supabase/server";
import { TrendingUp } from "lucide-react";

interface RevenueChartCardProps {
  startDate: string;
  endDate: string;
}

export async function RevenueChartCard({
  startDate,
  endDate,
}: RevenueChartCardProps) {
  // 1. Fetch real data from Supabase
  const { data, error } = await supabaseAdmin
    .from("revenue_over_time")
    .select("*")
    .gte("day", startDate)
    .lte("day", endDate)
    .order("day", { ascending: true });

  if (error) {
    console.error("Error fetching revenue:", error.message);
  }

  // Fallback to empty array if no data comes back
  const chartData = data || [];

  // 2. Calculate total revenue dynamically from the rows
  const totalRevenue = chartData.reduce(
    (acc, curr) => acc + (Number(curr.revenue) || 0),
    0,
  );

  // 3. Find the maximum revenue to calculate proportional bar heights (percentage)
  const maxRevenue = Math.max(
    ...chartData.map((item) => Number(item.revenue) || 0),
    1,
  );

  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs text-card-foreground flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Revenue Over Time
          </h3>
          <p className="text-xs text-muted-foreground">
            Daily earnings trend for August 2026
          </p>
        </div>
        <div className="p-2 rounded-lg bg-muted/40 text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
        </div>
      </div>

      {/* Dynamic Bar Chart Area */}
      <div className="w-full h-48 bg-muted/20 rounded-lg border border-dashed border-border/80 flex items-end justify-between px-4 py-3 gap-2 overflow-x-auto">
        {chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
            No revenue data available for this period.
          </div>
        ) : (
          chartData.map((item, idx) => {
            // Calculate height percentage relative to the peak revenue day
            const revenueNum = Number(item.revenue) || 0;
            const heightPercent = Math.max((revenueNum / maxRevenue) * 100, 10); // Minimum 10% height so it's visible

            return (
              <div
                key={idx}
                className="w-full bg-primary/20 hover:bg-primary/30 rounded-t transition-all relative group flex flex-col justify-end min-w-[16px]"
                style={{ height: `${heightPercent}%` }}
                title={`${item.day}: ₱${revenueNum.toLocaleString()} (${item.order_count} orders)`}
              >
                <div
                  className="w-full bg-primary rounded-t"
                  style={{ height: "60%" }}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Footer Details */}
      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <span>
          Total:{" "}
          <strong className="text-foreground">
            ₱
            {totalRevenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </strong>
        </span>
        <span className="text-emerald-600 font-medium">
          {chartData.length} {chartData.length === 1 ? "day" : "days"} recorded
        </span>
      </div>
    </div>
  );
}
