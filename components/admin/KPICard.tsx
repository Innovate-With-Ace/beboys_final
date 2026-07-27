// components/admin/KpiCard.tsx
import { LucideIcon } from 'lucide-react'

type Props = {
  label: string
  value: string | number
  subtext?: string
  subtextColor?: 'success' | 'muted'
  icon: LucideIcon
  iconColorClass?: string
}

const KpiCard = ({
  label,
  value,
  subtext,
  subtextColor = 'muted',
  icon: Icon,
  iconColorClass = 'bg-brand-primary/10 text-brand-primary',
}: Props) => {
  return (
    <div className="bg-white rounded-2xl p-3.5 border border-border">
      <div className="flex items-start justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className={`h-6.5 w-6.5 rounded-lg flex items-center justify-center shrink-0 ${iconColorClass}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <p className="text-xl font-semibold mt-2">{value}</p>
      {subtext && (
        <p className={`text-[11px] mt-0.5 flex items-center gap-1 ${
          subtextColor === 'success' ? 'text-success' : 'text-muted-foreground'
        }`}>
          {subtext}
        </p>
      )}
    </div>
  )
}

export default KpiCard