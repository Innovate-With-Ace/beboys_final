import { AverageOrderValueCard } from "@/components/admin/reports/AverageOrderValueCard";
import { BestSellingDishesCard } from "@/components/admin/reports/BestSellingDishesCard";
import { IngredientUsageCard } from "@/components/admin/reports/IngredientUsageCard";
import { LowStockAlertsCard } from "@/components/admin/reports/LowStockAlertsCard";
import { OrderStatusCard } from "@/components/admin/reports/OrderStatusCard";
import { OrderVolumeCard } from "@/components/admin/reports/OrderVolumeCard";
import { ReportsHeader } from "@/components/admin/reports/ReportsHeader";
import { RevenueChartCard } from "@/components/admin/reports/RevenueChartCard";
import { SalesByCategoryCard } from "@/components/admin/reports/SalesByCategoryCard";

interface ReportsPageProps {
  searchParams: Promise<{
    range?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const resolvedParams = await searchParams;
  const range = resolvedParams.range || "this_month";

  const now = new Date();
  let startDate = resolvedParams.startDate || "";
  let endDate = resolvedParams.endDate || "";

  // If custom dates weren't explicitly passed, calculate based on the dropdown range
  if (!startDate || !endDate) {
    if (range === "today") {
      startDate = now.toISOString().split("T")[0];
      endDate = startDate;
    } else if (range === "this_week") {
      const firstDayOfWeek = new Date(now);
      firstDayOfWeek.setDate(now.getDate() - now.getDay());
      startDate = firstDayOfWeek.toISOString().split("T")[0];

      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      endDate = lastDayOfWeek.toISOString().split("T")[0];
    } else if (range === "this_month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];
    } else if (range === "this_year") {
      startDate = new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0];
      endDate = new Date(now.getFullYear(), 11, 31).toISOString().split("T")[0];
    }
  }

  return (
    <div className="space-y-8 bg-muted/10 min-h-screen">
      {/* 1. HEADER */}
      <ReportsHeader currentRange={range} />

      {/* 2. SALES REPORTS SECTION */}
      <section className="space-y-4">
        <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Sales Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pass the computed dynamic variables as props */}
          <RevenueChartCard startDate={startDate} endDate={endDate} />
          <BestSellingDishesCard />
          <SalesByCategoryCard />
          <OrderVolumeCard />
        </div>
      </section>

      {/* 3. INVENTORY REPORTS SECTION */}
      <section className="space-y-4">
        <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Inventory Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LowStockAlertsCard />
          <IngredientUsageCard />
        </div>
      </section>

      {/* 4. OPERATIONAL SECTION */}
      <section className="space-y-4">
        <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Operational Section
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OrderStatusCard />
          <AverageOrderValueCard />
        </div>
      </section>
    </div>
  );
}
