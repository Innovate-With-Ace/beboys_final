import KpiGrid from "@/components/admin/KPIGrid"
import SalesChart from '@/components/admin/SalesChart'
import BestSellersList from "@/components/admin/BestSellersList"
import LowStockList from "@/components/admin/LowStockList"
import RecentOrders from "@/components/admin/RecentOrders"
import QuickActions from "@/components/admin/QuickActions"

export default function Page() {
  return (
    <div className="">
      <div className="mb-6">
        <h1 className="font-heading font-semibold text-xl">Good afternoon, Beboy</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Here&apos;s how today&apos;s going</p>
      </div>

      <KpiGrid />

      <div className="mt-5 grid sm:grid-cols-1 md:grid-cols-3 gap-3">
        <div className="col-span-2">
          <SalesChart />
        </div>
        <BestSellersList />
      </div>

      <div className="mt-3">
        <LowStockList />
      </div>

      <div className="mt-3">
        <RecentOrders />
      </div>

      <div className="mt-3">
        <QuickActions />
      </div>
    </div>
  )
}