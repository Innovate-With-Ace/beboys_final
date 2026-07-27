// components/admin/RecentOrders.tsx
import Link from 'next/link'

type Order = {
  id: string
  items: string
  cashier: string
  time: string
  total: number
}

const mockOrders: Order[] = [
  { id: '38', items: 'Adobo x2, Rice x2', cashier: 'Ace', time: '2:12 PM', total: 150 },
  { id: '37', items: 'Sisig x1', cashier: 'Ace', time: '2:05 PM', total: 75 },
  { id: '36', items: 'Iced tea x3, Lumpia x2', cashier: 'Maria', time: '1:58 PM', total: 80 },
  { id: '35', items: 'Kare-kare x1, Rice x1', cashier: 'Maria', time: '1:47 PM', total: 100 },
]

const RecentOrders = () => {
  return (
    <div className="bg-bg-muted rounded-2xl p-4.5 border border-border">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">Recent orders</p>
        <Link href="/admin/orders" className="text-xs font-medium text-brand-primary hover:underline">
          View all
        </Link>
      </div>

      <div className="flex flex-col">
        {mockOrders.map((order, i) => (
          <div
            key={order.id}
            className={`flex items-center gap-2.5 py-2.5 ${
              i !== mockOrders.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <div className="h-7.5 w-7.5 rounded-full bg-bg flex items-center justify-center text-[11px] font-medium text-muted-foreground shrink-0">
              {order.id}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{order.items}</p>
              <p className="text-[11px] text-muted-foreground">
                Cashier: {order.cashier} · {order.time}
              </p>
            </div>
            <span className="text-sm font-medium shrink-0">₱{order.total}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentOrders