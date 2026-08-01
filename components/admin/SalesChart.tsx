"use client";

import { Bar, BarChart, XAxis, CartesianGrid, Cell, YAxis } from "recharts";
import { TrendingUp, CalendarDays } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSales } from "@/hooks/useSales";
const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--color-brand-primary)",
  },
} satisfies ChartConfig;

const SalesChart = () => {
  const { data, isLoading, isError } = useSales();

  if (isLoading) {
    return (
      <div className="bg-bg rounded-2xl p-5 border border-border h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading sales...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-bg rounded-2xl p-5 border border-border h-full flex items-center justify-center">
        <p className="text-sm text-error">Failed to load sales data</p>
      </div>
    );
  }

  const chartData = data.map((row) => ({
    day: new Date(row.day).toLocaleDateString("en-US", { weekday: "short" }),
    sales: row.total_sales,
  }));

  const weekTotal = chartData.reduce((sum, d) => sum + d.sales, 0);
  const bestDay = chartData.reduce(
    (max, d) => (d.sales > max.sales ? d : max),
    chartData[0],
  );

  return (
    <div className="bg-bg rounded-2xl p-5 border border-border h-full flex flex-col">
      {/* --- HEADER --- */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              Sales this week
            </p>
          </div>
          <p className="text-2xl font-bold text-foreground">
            ₱{weekTotal.toLocaleString()}
          </p>
        </div>

        <span className="text-xs font-semibold text-success bg-success/15 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
          <TrendingUp className="h-3.5 w-3.5" />
          +8.4%
        </span>
      </div>

      {/* --- CHART --- */}
      <div className="flex-1 mt-auto">
        <ChartContainer config={chartConfig} className="h-55 w-full">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="var(--border)"
              opacity={0.5}
            />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              fontSize={12}
              className="fill-muted-foreground font-medium"
            />

            <YAxis hide domain={["auto", "auto"]} />

            <ChartTooltip
              cursor={{ fill: "var(--bg-muted)", opacity: 0.4 }}
              content={
                <ChartTooltipContent
                  formatter={(value) => `₱${value!.toLocaleString()}`}
                />
              }
            />

            <Bar dataKey="sales" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.day}
                  fill={
                    entry.day === bestDay.day
                      ? "var(--color-brand-primary)"
                      : "var(--color-brand-secondary)"
                  }
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default SalesChart;
