'use client'

import { Input } from "@/components/ui/input"
import CategoriesSelect from "@/components/admin/dishes/CategoriesSelect"
import TableCartTabs from "@/components/admin/dishes/TableCartTabs"
import DishGrid from "@/components/admin/dishes/DishGrid"
import { useEffect, useState } from "react"
import { useDishStore } from "@/stores/DishStore"
import { mockDishes } from "@/data/dishes"
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
import { ImageUp, Plus } from "lucide-react"
import { useDishEditorStore } from "@/stores/DishEditorStore"
import DishTable from "@/components/admin/dishes/DishTable"
import Image from "next/image"

const Page = () => {
  const { setDishes } = useDishStore()
  const { isOpen, close, selectedDish, openForCreate } = useDishEditorStore()
  const [layout, setLayout] = useState<'grid' | 'table'>('grid');
  // filter bar category
  const [filterCategoryId, setFilterCategoryId] = useState<string>();

  // form category — resets to match selectedDish whenever the sheet opens
  const [formCategoryId, setFormCategoryId] = useState<string>()

  useEffect(() => {
    setDishes(mockDishes)
  }, [])

  useEffect(() => {
    setFormCategoryId(selectedDish?.category_id)
  }, [selectedDish, isOpen])

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

          <TableCartTabs value={layout} onValueChange={(val) => setLayout(val as 'grid' | 'table')}/>
        </div>
      </div>

      <main className="mt-4">
        {
          layout === 'grid' ? (
            <DishGrid />
          ) : (
            <DishTable/>
          )
        }

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

            <form
              action="#"
              encType="multipart/form-data"
              className="flex-1 overflow-y-auto px-5 py-5 space-y-5"
            >
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
                <Input
                  id="name"
                  placeholder="e.g. Chicken Adobo"
                  defaultValue={selectedDish?.name ?? ''}
                  key={selectedDish?.id ?? 'new'}
                />
              </div>

              {/* Price + Servings */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      ₱
                    </span>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      className="pl-7"
                      defaultValue={selectedDish?.price ?? ''}
                      min={0}
                      key={`price-${selectedDish?.id ?? 'new'}`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    placeholder="0"
                    defaultValue={selectedDish?.servings_left ?? 0}
                    key={`servings-${selectedDish?.id ?? 'new'}`}
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

              {/* Availability */}
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium">Available</p>
                  <p className="text-xs text-muted-foreground">
                    Customers can order this dish
                  </p>
                </div>
                <Switch
                  defaultChecked={selectedDish?.isAvailable ?? true}
                  key={`switch-${selectedDish?.id ?? 'new'}`}
                  className="data-[state=checked]:bg-brand-primary!"
                />
              </div>
            </form>

            <SheetFooter className="border-t border-border px-5 py-4 flex-row gap-2">
              <SheetClose asChild>
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
              </SheetClose>
              <Button className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white">
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