'use client'
import DishGrid from '@/components/pos/DishGrid'
import CartPanel from '@/components/pos/CartPanel'
import { Input } from '@/components/ui/input'
import { useDishStore } from '@/stores/DishStore'
import { useEffect, useState } from 'react'
import { Soup, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MobileCartBar from '@/components/pos/MobileCartBar'
import OrderSummaryDialog from '@/components/pos/OrderSummaryDialog'
import { CartItem } from '@/types/CartItem'
import { useRouter } from 'next/navigation'
const Page = () => {
  const router = useRouter();
  const {dishes, setDishes} = useDishStore();
  const [search, setSearch] = useState('');
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [lastOrder, setLastOrder] = useState<CartItem[]>([])
  const servingsSetToday = useDishStore((s) => s.servingSetToday)


  // useEffect(() => {
  //   setDishes(mockDishes);

  // }, []);

  useEffect(() => {
    if (!servingsSetToday) {
      router.replace('/pos/setup')
    }
  }, [servingsSetToday])


    const filteredDishes = dishes.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    )
  return (
    <main className="bg-bg min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-bg-muted rounded-2xl px-4 py-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-8.5 w-8.5 rounded-[10px] bg-brand-primary flex items-center justify-center">
              <Soup className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-semibold text-sm">Today&apos;s menu</h1>
              <p className="text-[11px] text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <a href="/pos/setup" className='flex items-center justify-around gap-2'>
                <ClipboardList className="h-3.5 w-3.5" />
                Set servings
              </a>
            </Button>
            <div className="h-7.5 w-7.5 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-medium">
              A
            </div>
          </div>
        </div>

     <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
  <div className="w-full lg:w-[70%]">
    <Input placeholder="Search food here" className="mb-4" value={search} onChange={(e) => setSearch(e.target.value)} />
    <DishGrid dishes={filteredDishes} />
  </div>

  {/* Desktop cart */}
  <div className="hidden lg:block flex-1 sticky top-4 self-start">
        <CartPanel onCheckoutComplete={(items) => { setLastOrder(items); setSummaryOpen(true) }} />
      </div>
  </div>

    {/* Mobile bottom sheet trigger */}
    <div className="lg:hidden">
      <MobileCartBar onCheckoutComplete={(items) => { setLastOrder(items); setSummaryOpen(true) }} />
    </div>


    <OrderSummaryDialog
        open={summaryOpen}
        onOpenChange={setSummaryOpen}
        items={lastOrder}
        cashierName="Ace"
        onNewOrder={() => setSummaryOpen(false)}
      />

    </main>
  )
}

export default Page