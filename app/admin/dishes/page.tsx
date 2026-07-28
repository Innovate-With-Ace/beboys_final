'use client'

import { Input } from "@/components/ui/input"
import CategoriesSelect from "@/components/admin/dishes/CategoriesSelect"
import TableCartTabs from "@/components/admin/dishes/TableCartTabs"
import DishGrid from "@/components/admin/dishes/DishGrid"
import { useEffect, useState } from "react"
import { useDishStore } from "@/stores/DishStore"
import { mockDishes } from "@/data/dishes"
import { useInventoryStore } from "@/stores/InventoryStore"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ImageUp, Plus, X } from "lucide-react"
import { useDishEditorStore } from "@/stores/DishEditorStore"
import DishTable from "@/components/admin/dishes/DishTable"
import Image from "next/image"
import { mockIngredients } from "@/data/ingredients"
import { useForm, Controller } from 'react-hook-form'

type DishFormValues = {
  name: string
  price: number
  servings: number
  isAvailable: boolean
}

type RecipeRow = {
  ingredientId: string
  quantity: number
}

const Page = () => {
  const { setDishes, dishes } = useDishStore()
  const { isOpen, close, selectedDish, openForCreate } = useDishEditorStore()
  const [layout, setLayout] = useState<'grid' | 'table'>('grid')
  const { ingredients, setIngredients } = useInventoryStore()

  const { control, handleSubmit, reset } = useForm<DishFormValues>({
  defaultValues: {
    name: '',
    price: 0,
    servings: 0,
    isAvailable: true,
  },
})

  // filter bar category
  const [filterCategoryId, setFilterCategoryId] = useState<string>()

  // form category — resets to match selectedDish whenever the sheet opens
  const [formCategoryId, setFormCategoryId] = useState<string>()

  // form recipe rows — resets to match selectedDish whenever the sheet opens
  const [recipeRows, setRecipeRows] = useState<RecipeRow[]>([])

  useEffect(() => {
  reset({
    name: selectedDish?.name ?? '',
    price: selectedDish?.price ?? 0,
    servings: selectedDish?.servings_left ?? 0,
    isAvailable: selectedDish?.isAvailable ?? true,
  })
}, [selectedDish, isOpen])

  useEffect(() => {
    setDishes(mockDishes)
    setIngredients(mockIngredients)
  }, [])

  useEffect(() => {
    setFormCategoryId(selectedDish?.category_id)
  }, [selectedDish, isOpen])

  useEffect(() => {
    setRecipeRows(selectedDish?.ingredients ?? [])
  }, [selectedDish, isOpen])

  const addRecipeRow = () => {
    setRecipeRows((prev) => [...prev, { ingredientId: '', quantity: 0 }])
  }

  const updateRecipeRow = (index: number, updates: Partial<RecipeRow>) => {
    setRecipeRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...updates } : row))
    )
  }

  const removeRecipeRow = (index: number) => {
    setRecipeRows((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = (data: DishFormValues) => {
  const newDish: Dish = {
    id: selectedDish?.id ?? crypto.randomUUID(),
    name: data.name,
    price: data.price,
    servings: data.servings,
    servings_left: data.servings,
    category_id: formCategoryId ?? '',
    ingredients: recipeRows,
    isAvailable: data.isAvailable,
    image: selectedDish?.image,
  }

  if (selectedDish) {
    setDishes(dishes.map((d) => (d.id === newDish.id ? newDish : d)))
  } else {
    setDishes([...dishes, newDish])
  }

  close()
}
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-semibold text-xl text-brand-secondary">Dishes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Dish Management</p>
        </div>

        <Button
          onClick={openForCreate}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add dish
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
        <div className="flex-1">
          <Input placeholder="Search dishes here" className="text-base bg-bg-muted/50" />
        </div>

        <div className="w-full md:w-[30%] flex items-center gap-2">
          <div className="flex-1">
            <CategoriesSelect
              selectedCategoryId={filterCategoryId}
              onSelectCategory={setFilterCategoryId}
            />
          </div>

          <TableCartTabs value={layout} onValueChange={(val) => setLayout(val as 'grid' | 'table')} />
        </div>
      </div>

      <main className="mt-4">
        {layout === 'grid' ? <DishGrid /> : <DishTable />}

        <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
          <SheetContent side="right" className="bg-white flex flex-col p-0 gap-0">
            <SheetHeader className="border-b border-border px-5 py-4">
              <SheetTitle className="font-heading text-lg text-brand-secondary">
                {selectedDish ? 'Edit Dish' : 'Add Dish'}
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                Fill in the details below to {selectedDish ? 'update this dish' : 'add a new dish to the menu'}.
              </SheetDescription>
            </SheetHeader>

           <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-5 py-5 space-y-5" id="dish-form">
              {/* Image upload */}
              <div className="border-2 border-border w-full aspect-video border-dashed rounded-md overflow-hidden hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-colors">
                {!selectedDish || !selectedDish.image ? (
                  <>
                    <Label htmlFor="file" className="w-full h-full cursor-pointer">
                      <div className="text-muted-foreground flex items-center justify-center flex-col w-full h-full">
                        <ImageUp size={32} strokeWidth={1.5} />
                        <p className="text-sm font-medium mt-2">Upload image</p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">PNG or JPG</p>
                      </div>
                    </Label>
                    <Input type="file" id="file" accept="image/*" hidden />
                  </>
                ) : (
                  <div className="relative w-full h-full">
                    <Image src={selectedDish.image} alt={selectedDish.name} fill className="object-cover" />
                  </div>
                )}
              </div>

              {/* Name */}
             <div className="space-y-1.5">
                <Label htmlFor="name">Dish name</Label>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input id="name" placeholder="e.g. Chicken Adobo" {...field} />
                  )}
                />
              </div>

              {/* Price + Servings */}
              <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₱</span>
                      <Controller
                        control={control}
                        name="price"
                        rules={{ required: true, min: 0 }}
                        render={({ field: { onChange, value, ...rest } }) => (
                          <Input
                            id="price"
                            type="number"
                            placeholder="0.00"
                            className="pl-7"
                            min={0}
                            value={value}
                            onChange={(e) => onChange(Number(e.target.value))}
                            {...rest}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="servings">Servings</Label>
                    <Controller
                      control={control}
                      name="servings"
                      rules={{ required: true, min: 0 }}
                      render={({ field: { onChange, value, ...rest } }) => (
                        <Input
                          id="servings"
                          type="number"
                          placeholder="0"
                          value={value}
                          onChange={(e) => onChange(Number(e.target.value))}
                          {...rest}
                        />
                      )}
                    />
                  </div>
                </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label>Category</Label>
                <CategoriesSelect
                  selectedCategoryId={formCategoryId}
                  onSelectCategory={setFormCategoryId}
                />
              </div>

              {/* Ingredients / recipe builder */}
              <div className="space-y-1.5">
                <Label>Ingredients</Label>

                <div className="flex flex-col gap-2">
                  {recipeRows.map((row, index) => {
                    const ingredient = ingredients.find((i) => i.id === row.ingredientId)

                    return (
                      <div key={index} className="flex items-center gap-2">
                        <select
                          value={row.ingredientId}
                          onChange={(e) => updateRecipeRow(index, { ingredientId: e.target.value })}
                          className="flex-1 h-9 rounded-md border border-border bg-bg px-2.5 text-sm"
                        >
                          <option value="" disabled>Select ingredient</option>
                          {ingredients.map((ing) => (
                            <option key={ing.id} value={ing.id}>{ing.name}</option>
                          ))}
                        </select>

                        <Input
                          type="number"
                          placeholder="0"
                          value={row.quantity || ''}
                          onChange={(e) => updateRecipeRow(index, { quantity: Number(e.target.value) })}
                          className="w-20 text-center"
                          min={0}
                          step="any"
                        />

                        <span className="text-xs text-muted-foreground w-6 shrink-0">
                          {ingredient?.unit ?? ''}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeRecipeRow(index)}
                          className="text-muted-foreground hover:text-error shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRecipeRow}
                  className="w-full mt-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add ingredient
                </Button>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium">Available</p>
                  <p className="text-xs text-muted-foreground">Customers can order this dish</p>
                </div>
                <Controller
                  control={control}
                  name="isAvailable"
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      onCheckedChange={onChange}
                      className="data-[state=checked]:bg-brand-primary!"
                    />
                  )}
                />
              </div>
            </form>

            <SheetFooter className="border-t border-border px-5 py-4 flex-row gap-2">
                <SheetClose>
                  <Button variant="outline" className="flex-1">Cancel</Button>
                </SheetClose>
                <Button
                  type="submit"
                  form="dish-form" // see note below
                  className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white"
                >
                  Save dish
                </Button>
              </SheetFooter>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  )
}

export default Page