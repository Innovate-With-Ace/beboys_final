import { AverageOrderValueCard } from "@/components/admin/reports/AverageOrderValueCard";
import { BestSellingDishesCard } from "@/components/admin/reports/BestSellingDishesCard";
import { IngredientUsageCard } from "@/components/admin/reports/IngredientUsageCard";
import { LowStockAlertsCard } from "@/components/admin/reports/LowStockAlertsCard";
import { OrderStatusCard } from "@/components/admin/reports/OrderStatusCard";
import { OrderVolumeCard } from "@/components/admin/reports/OrderVolumeCard";
import { ReportsHeader } from "@/components/admin/reports/ReportsHeader";
import { RevenueChartCard } from "@/components/admin/reports/RevenueChartCard";
import { SalesByCategoryCard } from "@/components/admin/reports/SalesByCategoryCard";
import { WastedServingsCard } from "@/components/admin/reports/WastedServingsCard";

export default function ReportsPage() {
  return (
    <div className="max-w-7xl space-y-8 bg-muted/10 min-h-screen">
      {/* 1. HEADER */}
      <ReportsHeader />
      {/* 2. SALES REPORTS SECTION */}
      <section className="space-y-4">
        <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Sales Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RevenueChartCard />
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
          <div className="md:col-span-2">
            <WastedServingsCard />
          </div>
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
