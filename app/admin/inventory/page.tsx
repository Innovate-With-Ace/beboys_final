'use client'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { mockIngredients } from '@/data/ingredients'
import { useInventoryStore } from '@/stores/InventoryStore'
import IngredientCard from '@/components/admin/inventory/IngredientCard'
import { useIngredientEditorStore } from '@/stores/IngredientEditorStore'
import IngredientDialog from '@/components/admin/inventory/IngredientDialog'

const Page = () => {

  const {setIngredients, ingredients} = useInventoryStore();
  const openForCreate = useIngredientEditorStore((s) => s.openForCreate); 

  useEffect(() => {
    setIngredients(mockIngredients);
  }, []);

  return (
    <div>
     <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-semibold text-xl text-brand-secondary">Inventory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Inventory Management</p>
        </div>

        <Button
          onClick={openForCreate}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Stock
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
        <div className="flex-1">
          <Input placeholder="Search items here" className="text-base bg-bg-muted/50" />
        </div>
      </div>

      <main className="mt-4">
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
            {ingredients.map((ing) => (
              <IngredientCard key={ing.id} ingredient={ing}/>
            ))}
        </div>
      </main>



      {/* Dialog box for editing */}


      <IngredientDialog />

      </div>

  )
}

export default Page