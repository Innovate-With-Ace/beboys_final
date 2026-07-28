'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useIngredientEditorStore } from '@/stores/IngredientEditorStore'
import { useInventoryStore } from '@/stores/InventoryStore'

const IngredientDialog = () => {
  const { isOpen, close, selectedIngredient, isEditing, } = useIngredientEditorStore()
  const {addIngredient} = useInventoryStore();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg text-brand-secondary">
            {selectedIngredient ? 'Edit ingredient' : 'Add ingredient'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Track {selectedIngredient ? 'and update' : 'a new'} raw ingredient and its stock level.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="ing-name">Ingredient name</Label>
            <Input
              id="ing-name"
              placeholder="e.g. Pork"
              defaultValue={selectedIngredient?.name ?? ''}
              key={`name-${selectedIngredient?.id ?? 'new'}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="unit">Unit</Label>
              <select
                id="unit"
                defaultValue={selectedIngredient?.unit ?? 'kg'}
                key={`unit-${selectedIngredient?.id ?? 'new'}`}
                className="w-full h-9 rounded-md border border-border bg-bg px-3 text-sm"
              >
                <option value="kg">kg</option>
                <option value="l">l</option>
                <option value="pcs">pcs</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stock">Current stock</Label>
              <Input
                id="stock"
                type="number"
                placeholder="20"
                min={0}
                defaultValue={selectedIngredient?.stock ?? ''}
                key={`stock-${selectedIngredient?.id ?? 'new'}`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="threshold">Low-stock threshold</Label>
            <Input
              id="threshold"
              type="number"
              placeholder="5"
              min={0}
              defaultValue={selectedIngredient?.low_stock_threshold ?? ''}
              key={`threshold-${selectedIngredient?.id ?? 'new'}`}
            />
            <p className="text-[11px] text-muted-foreground">
              Alerts appear when stock falls below this amount.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose>
            <Button variant="outline" className="flex-1">Cancel</Button>
          </DialogClose>
          <Button className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white">
            Save ingredient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default IngredientDialog