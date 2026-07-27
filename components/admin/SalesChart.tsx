// components/admin/SalesChart.tsx
'use client'

import { Bar, BarChart, XAxis, CartesianGrid, Cell } from 'recharts'
import { TrendingUp } from 'lucide-react'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const mockData = [
  { day: 'Mon', sales: 1800 },
  { day: 'Tue', sales: 2200 },
  { day: 'Wed', sales: 2340 },
  { day: 'Thu', sales: 1950 },
  { day: 'Fri', sales: 2600 },
  { day: 'Sat', sales: 3100 },
  { day: 'Sun', sales: 2800 },
]

const chartConfig = {
  sales: {
    label: 'Sales',
    color: 'var(--color-brand-primary)',
  },
} satisfies ChartConfig

const SalesChart = () => {
  const weekTotal = mockData.reduce((sum, d) => sum + d.sales, 0)
  const bestDay = mockData.reduce((max, d) => (d.sales > max.sales ? d : max), mockData[0])

  return (
    <div className="bg-bg rounded-2xl p-4.5 border border-border">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium">Sales this week</p>
          <p className="text-xl font-semibold mt-1">₱{weekTotal.toLocaleString()}</p>
        </div>
        <span className="text-xs font-medium text-success bg-success/15 px-2 py-1 rounded-md flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          +8.4%
        </span>
      </div>

      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <BarChart data={mockData}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={11}
          />
          <ChartTooltip
            content={<ChartTooltipContent formatter={(value) => `₱${value}`} />}
          />
          <Bar dataKey="sales" radius={5}>
            {mockData.map((entry) => (
              <Cell
                key={entry.day}
                fill={entry.day === bestDay.day ? 'var(--color-brand-primary)' : 'var(--color-brand-secondary)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default SalesChart