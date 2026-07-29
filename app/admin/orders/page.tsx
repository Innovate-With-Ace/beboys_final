import React from 'react'
import { Input } from '@/components/ui/input'
import OrdersTable from '@/components/admin/orders/OrdersTable'
import { mockOrders } from '@/data/orders'
const page = () => {
  return (
   <div>
         <div className="mb-6">
           <div>
             <h1 className="font-heading font-semibold text-xl text-brand-secondary">Orders</h1>
             <p className="text-sm text-muted-foreground mt-0.5">View Orders Here</p>
           </div>
         </div>

          <div>
            <Input placeholder='Search customer name or order number'/>
           </div>


          <main className='mt-4'>
            <OrdersTable orders={mockOrders}/>
          </main>
         </div>
  )
}

export default page