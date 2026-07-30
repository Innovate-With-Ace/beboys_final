'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useIngredientEditorStore } from '@/stores/IngredientEditorStore'
import { useInventoryStore } from '@/stores/InventoryStore'
import { useForm } from 'react-hook-form'
import { Ingredient, IngredientPayload } from '@/types/Ingredients'
import fetchApi from '@/lib/api'
import { AlertTriangle, Trash2 } from 'lucide-react'
import {toast} from 'sonner'

const DEFAULT_VALUES: IngredientPayload = {
  name: '',
  unit: 'kg',
  stock: 0,
  low_stock_threshold: 0,
}

const IngredientDialog = () => {
  const { isOpen, close, selectedIngredient } = useIngredientEditorStore()
  const { addIngredient, updateIngredient, removeIngredient } = useInventoryStore()
  
  // STATES FOR DELETION
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IngredientPayload>({
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (isOpen) {
      setShowDeleteConfirm(false)
      if (selectedIngredient) {
        reset({
          name: selectedIngredient.name,
          unit: selectedIngredient.unit,
          stock: selectedIngredient.stock,
          low_stock_threshold: selectedIngredient.low_stock_threshold,
        })
      } else {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isOpen, selectedIngredient, reset])


  // POST and PATCH
  const onSubmit = async (data: IngredientPayload) => {
    try {
      let res: Ingredient

      if (selectedIngredient) {
        res = await fetchApi<Ingredient>(`/api/ingredients/${selectedIngredient.id}`, {
          body: JSON.stringify(data),
          method: 'PATCH',
        })
        updateIngredient(res)
        
      } else {
        res = await fetchApi<Ingredient>('/api/ingredients', {
          body: JSON.stringify(data),
          method: 'POST',
        })
        addIngredient(res)
      }

      close();

      toast.success("Ingredient Successfully saved");

    } catch (err) {
      console.error('Failed to save ingredient:', err);
      toast.error(err instanceof Error ? err.message : "Failed to save ingredient. Please try again")
    }
  }

  // DELETE
  const handleDelete = async () => {
    if (!selectedIngredient) return
    
    try {
      setIsDeleting(true)
      await fetchApi(`/api/ingredients/${selectedIngredient.id}`, {
        method: 'DELETE',
      })
      
      if (removeIngredient) {
        removeIngredient(selectedIngredient)
      }

      toast.success("Ingredient deleted");

      close()
    } catch (err) {
      console.error('Failed to delete ingredient:', err)
      toast.error(err instanceof Error ? err.message : "Failed to save ingredient. Please try again");
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg text-brand-secondary">
            {selectedIngredient ? 'Edit ingredient' : 'Add ingredient'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Track {selectedIngredient ? 'and update' : 'a new'} raw ingredient and its stock level.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Ingredient Name */}
            <div className="space-y-1.5">
              <Label htmlFor="ing-name">Ingredient name</Label>
              <Input
                id="ing-name"
                placeholder="e.g. Pork"
                {...register('name', {
                  required: 'Ingredient name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Unit & Current Stock */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="unit">Unit</Label>
                <select
                  id="unit"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...register('unit', { required: true })}
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
                  {...register('stock', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Stock cannot be negative' },
                  })}
                />
                {errors.stock && (
                  <p className="text-xs text-destructive">{errors.stock.message}</p>
                )}
              </div>
            </div>

            {/* Low-stock Threshold */}
            <div className="space-y-1.5">
              <Label htmlFor="threshold">Low-stock threshold</Label>
              <Input
                id="threshold"
                type="number"
                placeholder="5"
                min={0}
                {...register('low_stock_threshold', {
                  valueAsNumber: true,
                  min: { value: 0, message: 'Threshold cannot be negative or equal' },
                })}
              />
              {errors.low_stock_threshold ? (
                <p className="text-xs text-destructive">
                  {errors.low_stock_threshold.message}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Alerts appear when stock falls below this amount.
                </p>
              )}
            </div>
          </div>

          {/* ⚠️ GITHUB-STYLE DANGER ZONE ⚠️ */}
          {selectedIngredient && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
              <div className="flex items-center gap-2 text-destructive font-medium text-xs uppercase tracking-wider">
                <AlertTriangle className="h-4 w-4" />
                <span>Danger Zone</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">
                    Delete this ingredient
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Once deleted, it will be permanently removed from inventory records.
                  </p>
                </div>

                {!showDeleteConfirm && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="border-destructive/40 text-destructive hover:bg-destructive hover:text-black shrink-0"
                  >
                    Delete
                  </Button>
                )}
              </div>

              {/* Inline Confirmation Prompt */}
              {showDeleteConfirm && (
                <div className="pt-2 border-t border-destructive/20 flex items-center justify-between gap-2">
                  <p className="text-xs text-destructive font-medium">
                    Are you sure?
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="h-7 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting}
                      onClick={handleDelete}
                      className="h-7 text-xs gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      {isDeleting ? 'Deleting...' : 'Confirm'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1 mr-2">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white"
            >
              {isSubmitting ? 'Saving...' : 'Save ingredient'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default IngredientDialog