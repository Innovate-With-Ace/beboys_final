import KpiGrid from "@/components/admin/KPIGrid";
import SalesChart from "@/components/admin/SalesChart";
import BestSellersList from "@/components/admin/BestSellersList";
import LowStockList from "@/components/admin/LowStockList";
import RecentOrders from "@/components/admin/RecentOrders";
import QuickActions from "@/components/admin/QuickActions";

export default function Page() {
  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* --- HEADER & QUICK ACTIONS --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-foreground">
            Good afternoon, Beboy
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s how today&apos;s going
          </p>
        </div>

        {/* We moved this up so it's instantly accessible! */}
        <div className="md:w-auto shrink-0">
          <QuickActions />
        </div>
      </div>

      {/* --- KPIs --- */}
      <KpiGrid />

      {/* --- TOP ROW: Sales & Best Sellers --- */}
      {/* Kept your 2/1 split because it's perfect */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col">
          <SalesChart />
        </div>
        <div className="flex flex-col">
          <BestSellersList />
        </div>
      </div>

      {/* --- BOTTOM ROW: Orders & Inventory --- */}
      {/* Split these into a 50/50 grid for better desktop usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <RecentOrders />
        </div>
        <div className="flex flex-col">
          <LowStockList />
        </div>
      </div>
    </div>
  );
}
