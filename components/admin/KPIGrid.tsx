// components/admin/KpiGrid.tsx
import KpiCard from './KPICard'
import { PhilippinePeso, Receipt, Flame, PackageX } from 'lucide-react'

const KpiGrid = () => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
     <KpiCard
        label="Today's sales"
        value="₱2,340"
        subtext="+12% vs yesterday"
        subtextColor="success"
        icon={PhilippinePeso}
        iconColorClass="bg-success/15 text-success"
        />

        <KpiCard
        label="Orders today"
        value={38}
        subtext="Avg ₱62/order"
        icon={Receipt}
        iconColorClass="bg-brand-primary/10 text-brand-primary"
        />

        <KpiCard
        label="Best seller"
        value="Adobo"
        subtext="14 sold today"
        icon={Flame}
        iconColorClass="bg-brand-secondary/15 text-brand-secondary"
        />

        <KpiCard
        label="Low stock"
        value={2}
        subtext="Soy sauce, Pork"
        icon={PackageX}
        iconColorClass="bg-warning/15 text-warning"
        />
    </div>
  )
}

export default KpiGrid