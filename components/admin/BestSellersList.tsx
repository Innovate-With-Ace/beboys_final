// components/admin/BestSellersList.tsx
const mockBestSellers = [
  { name: 'Adobo', sold: 14, revenue: 840 },
  { name: 'Rice', sold: 28, revenue: 420 },
  { name: 'Sisig', sold: 9, revenue: 675 },
  { name: 'Iced tea', sold: 12, revenue: 240 },
]

const BestSellersList = () => {
  return (
    <div className="bg-bg rounded-2xl p-4.5 border border-border">
      <p className="text-sm font-medium mb-3">Best sellers today</p>
      <div className="flex flex-col gap-2">
        {mockBestSellers.map((dish, i) => (
          <div key={dish.name} className="flex items-center gap-3 bg-bg rounded-lg px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground w-4">{i + 1}</span>
            <span className="flex-1 text-sm font-medium">{dish.name}</span>
            <span className="text-xs text-muted-foreground">{dish.sold} sold</span>
            <span className="text-xs font-medium text-brand-secondary">₱{dish.revenue}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BestSellersList