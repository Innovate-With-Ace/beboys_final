import React from "react";
import { CheckCircle2, Clock, Activity, XCircle } from "lucide-react";

export function OrderStatusCard() {
  const statuses = [
    {
      label: "Completed",
      count: 1240,
      percent: "82.5%",
      color: "bg-emerald-500",
      icon: CheckCircle2,
      textColor: "text-emerald-600",
    },
    {
      label: "Preparing",
      count: 145,
      percent: "9.6%",
      color: "bg-blue-500",
      icon: Clock,
      textColor: "text-blue-600",
    },
    {
      label: "Pending",
      count: 85,
      percent: "5.6%",
      color: "bg-amber-500",
      icon: Activity,
      textColor: "text-amber-600",
    },
    {
      label: "Cancelled",
      count: 34,
      percent: "2.3%",
      color: "bg-destructive",
      icon: XCircle,
      textColor: "text-destructive",
    },
  ];

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
        {statuses.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={i}
              className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-md bg-background shadow-2xs ${st.textColor}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{st.label}</p>
                  <p className="text-sm font-bold text-foreground">
                    {st.count}{" "}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      ({st.percent})
                    </span>
                  </p>
                </div>
              </div>
              <span className={`w-1.5 h-8 rounded-full ${st.color}`} />
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 text-xs text-muted-foreground flex justify-between">
        <span>
          Total Processed Orders:{" "}
          <strong className="text-foreground">1,504</strong>
        </span>
        <span className="text-emerald-600 font-medium">
          97.7% Fulfillment Rate
        </span>
      </div>
    </div>
  );
}
