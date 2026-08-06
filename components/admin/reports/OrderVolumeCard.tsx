import React from "react";
import { Activity } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";

interface OrderVolumeItem {
  hour: number;
  order_count: number;
}

export async function OrderVolumeCard() {
  // 1. Fetch hourly distribution and busiest day data filtered by date range
  const { data: hourlyData, error: hourlyError } = await supabaseAdmin
    .from("order_volume_by_hour")
    .select("*");

  const { data: busiestDayData, error: busiestError } = await supabaseAdmin
    .from("busiest_day_of_week")
    .select("*")
    .limit(1)
    .single();

  if (hourlyError)
    console.error("Error fetching hourly order volume:", hourlyError.message);
  if (busiestError)
    console.error("Error fetching busiest day:", busiestError.message);

  const rawHours: OrderVolumeItem[] = hourlyData || [];

  // Group and sum counts by hour across the date range
  const hourlyMap: Record<number, number> = {};
  rawHours.forEach((item) => {
    const h = Number(item.hour);
    hourlyMap[h] = (hourlyMap[h] || 0) + (Number(item.order_count) || 0);
  });

  // Create a 24-hour array (0 to 23) to ensure continuous chart flow
  const fullDayHours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    order_count: hourlyMap[i] || 0,
  }));

  const maxOrders = Math.max(
    ...fullDayHours.map((item) => item.order_count),
    1,
  );
  const totalPeriodOrders = fullDayHours.reduce(
    (acc, curr) => acc + curr.order_count,
    0,
  );

  // Clean up trailing whitespace from database char/varchar padding if any
  const busiestDayName = busiestDayData?.day_name
    ? busiestDayData.day_name.trim()
    : "N/A";

  const formatHourLabel = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs text-card-foreground flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              Order Volume Trends
            </h3>
            <p className="text-xs text-muted-foreground">
              Hourly distribution of incoming orders
            </p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 text-muted-foreground">
            <Activity className="h-4 w-4" />
          </div>
        </div>

        {/* Dynamic Bar Chart Area */}
        <div className="w-full h-44 bg-muted/20 rounded-lg border border-dashed border-border/80 flex items-end justify-between px-3 py-3 gap-1 overflow-x-auto">
          {fullDayHours.map((item) => {
            const heightPercent = Math.max(
              (item.order_count / maxOrders) * 100,
              8,
            );
            return (
              <div
                key={item.hour}
                className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-all relative group flex flex-col justify-end min-w-[10px]"
                style={{ height: `${heightPercent}%` }}
                title={`${formatHourLabel(item.hour)}: ${item.order_count} orders`}
              >
                <div
                  className="w-full bg-primary rounded-t"
                  style={{ height: item.order_count > 0 ? "70%" : "0%" }}
                />
              </div>
            );
          })}
        </div>

        {/* Hour Axis Labels */}
        <div className="flex justify-between text-[10px] text-muted-foreground px-1 mt-1.5">
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>11 PM</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Total Orders:{" "}
          <strong className="text-foreground">{totalPeriodOrders}</strong>
        </span>
        <span>
          Peak Day:{" "}
          <strong className="text-foreground">{busiestDayName}</strong>
        </span>
      </div>
    </div>
  );
}
