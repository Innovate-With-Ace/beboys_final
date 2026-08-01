"use client";

import { useStats } from "@/hooks/useStats";
import KpiCard from "./KPICard";
import { PhilippinePeso, Receipt, Flame, PackageX } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useBestSellers } from "@/hooks/useBestSellers";
import { useLowStock } from "@/hooks/useLowStock";

const KpiGrid = () => {
  // 1. Get exact string for Today
  const todayDate = new Date();
  const today = todayDate.toISOString().split("T")[0];

  // 2. Get exact string for Yesterday
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useStats();

  // 3. Calculate Today's Total
  const todaysTotal =
    statsData
      ?.filter((item) => item.created_at.startsWith(today))
      .reduce((sum, item) => sum + item.total, 0) || 0;

  // 4. Calculate Yesterday's Total
  const yesterdaysTotal =
    statsData
      ?.filter((item) => item.created_at.startsWith(yesterday))
      .reduce((sum, item) => sum + item.total, 0) || 0;

  // 5. Math: Percentage Difference
  let percentChange = 0;
  if (yesterdaysTotal > 0) {
    percentChange = ((todaysTotal - yesterdaysTotal) / yesterdaysTotal) * 100;
  } else if (todaysTotal > 0) {
    percentChange = 100; // If yesterday was 0 but today has sales, that's a 100% increase!
  }

  // 6. Format the UI text and colors based on the math
  const isPositive = percentChange >= 0;
  const percentText = `${isPositive ? "+" : ""}${percentChange.toFixed(1)}% vs yesterday`;
  const percentColor = isPositive ? "success" : "muted"; // Assuming your KpiCard takes "error" for red

  // Grab today's order count for the second card
  const todaysOrderCount =
    statsData?.filter((item) => item.created_at.startsWith(today)).length || 0;

  const {
    data: bestSeller,
    isLoading: isBestSellersLoading,
    isError: isBestSellersError,
  } = useBestSellers();

  const {
    data: lowStock,
    isLoading: isLowStockLoading,
    isError: isLowStockError,
  } = useLowStock();

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
      <KpiCard
        label="Today's sales"
        value={`₱${todaysTotal.toLocaleString()}`}
        subtext={percentText}
        subtextColor={percentColor}
        icon={PhilippinePeso}
        iconColorClass="bg-success/15 text-success"
      />

      <KpiCard
        label="Orders today"
        value={todaysOrderCount}
        subtext={`Avg ₱${todaysOrderCount > 0 ? (todaysTotal / todaysOrderCount).toFixed(0) : 0}/order`}
        icon={Receipt}
        iconColorClass="bg-brand-primary/10 text-brand-primary"
      />

      {/* Static placeholders for now */}
      <KpiCard
        label="Best seller"
        value={bestSeller && bestSeller.length > 0 ? bestSeller[0].name : "N/A"}
        subtext={
          bestSeller && bestSeller.length > 0
            ? `₱${bestSeller[0].total_revenue.toLocaleString()} (${bestSeller[0].total_sold} sold)`
            : "No data"
        }
        icon={Flame}
        iconColorClass="bg-brand-secondary/15 text-brand-secondary"
      />

      <KpiCard
        label="Low stock"
        value={lowStock?.length ?? 0}
        subtext={lowStock?.map((i) => i.name).join(", ") || "All stocked"}
        icon={PackageX}
        iconColorClass="bg-warning/15 text-warning"
      />
    </div>
  );
};

export default KpiGrid;
