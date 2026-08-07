// components/admin/reports/OrderStatusCard.tsx
import { CheckCircle2, Clock, Activity, XCircle } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: typeof CheckCircle2; textColor: string }
> = {
  completed: {
    label: "Completed",
    color: "bg-emerald-500",
    icon: CheckCircle2,
    textColor: "text-emerald-600",
  },
  preparing: {
    label: "Preparing",
    color: "bg-blue-500",
    icon: Clock,
    textColor: "text-blue-600",
  },
  pending: {
    label: "Pending",
    color: "bg-amber-500",
    icon: Activity,
    textColor: "text-amber-600",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-destructive",
    icon: XCircle,
    textColor: "text-destructive",
  },
};

export async function OrderStatusCard() {
  const { data, error } = await supabaseAdmin
    .from("order_status_breakdown")
    .select("*");

  if (error) {
    console.error("Error fetching order status breakdown:", error.message);
  }

  const statuses = data ?? [];
  const totalOrders = statuses.reduce((sum, row) => sum + row.order_count, 0);
  const completedCount =
    statuses.find((s) => s.status === "completed")?.order_count ?? 0;
  const fulfillmentRate =
    totalOrders > 0 ? ((completedCount / totalOrders) * 100).toFixed(1) : "0.0";

  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs text-card-foreground flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Order Status Breakdown
          </h3>
          <p className="text-xs text-muted-foreground">
            Volume count and fulfillment percentages
          </p>
        </div>
        <div className="p-2 rounded-lg bg-muted/40 text-muted-foreground">
          <Activity className="h-4 w-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
        {statuses.map((st) => {
          const config = statusConfig[st.status] ?? statusConfig.pending;
          const Icon = config.icon;
          return (
            <div
              key={st.status}
              className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-md bg-background shadow-2xs ${config.textColor}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {config.label}
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {st.order_count}{" "}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      ({st.percent}%)
                    </span>
                  </p>
                </div>
              </div>
              <span className={`w-1.5 h-8 rounded-full ${config.color}`} />
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 text-xs text-muted-foreground flex justify-between">
        <span>
          Total Processed Orders:{" "}
          <strong className="text-foreground">{totalOrders}</strong>
        </span>
        <span className="text-emerald-600 font-medium">
          {fulfillmentRate}% Fulfillment Rate
        </span>
      </div>
    </div>
  );
}
