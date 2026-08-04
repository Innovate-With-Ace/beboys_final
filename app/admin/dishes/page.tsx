"use client";

import CategoriesSelect from "@/components/admin/dishes/CategoriesSelect";
import DishGrid from "@/components/admin/dishes/DishGrid";
import DishTable from "@/components/admin/dishes/DishTable";
import { RecipeBuilder } from "@/components/admin/dishes/RecipeBuilder";
import TableCartTabs from "@/components/admin/dishes/TableCartTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useCategories } from "@/hooks/useCategories";
import { useDishes } from "@/hooks/useDishes";
import { useIngredients } from "@/hooks/useIngredients";
import fetchApi from "@/lib/api";
import { useDishEditorStore } from "@/stores/DishEditorStore";
import { Categories } from "@/types/Categories";
import { Dish } from "@/types/Dish";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ImageUp,
  Loader2,
  Plus,
  Search,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type DishFormValues = {
  name: string;
  price: number;
  servings: number;
  is_available: boolean;
  category_id: string;
};

type CategoryNewPayload = {
  label: string;
};

type RecipeRow = {
  ingredient_id: string;
  quantity: number;
};

const Page = () => {
  const { isOpen, close, selectedDish, openForCreate } = useDishEditorStore();
  const [layout, setLayout] = useState<"grid" | "table">("grid");
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<DishFormValues>({
    defaultValues: {
      name: "",
      price: 0,
      servings: 0,
      is_available: true,
    },
  });

  // Dishes Data
  const { data: dishes, isLoading } = useDishes();

  const createDish = useMutation({
    mutationFn: (newDish: Dish) =>
      fetchApi<Dish>("/api/dishes", {
        body: JSON.stringify(newDish),
        method: "POST",
      }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      close();
      toast.success("Dish added successfully");
    },
    onError: () => {
      toast.error("Failed to add dish. Please try again.");
    },
  });

  const updateDish = useMutation({
    mutationFn: (updatedDish: Dish) =>
      fetchApi<Dish>(`/api/dishes/${updatedDish.id}`, {
        body: JSON.stringify(updatedDish),
        method: "PATCH",
      }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      close();
    },
    onError: () => {
      toast.error("Failed to update dish. Please try again.");
    },
  });

  const deleteDish = useMutation({
    mutationFn: (deletedDish: Dish) =>
      fetchApi<{ success: boolean }>(`/api/dishes/${deletedDish.id}`, {
        method: "DELETE",
      }),
    onSuccess: (data, deletedDish) => {
      queryClient.setQueryData<Dish[]>(["dishes"], (old) =>
        old ? old.filter((d) => d.id !== deletedDish.id) : [],
      );
      toast.success("Dish deleted");
    },
    onError: () => {
      toast.error("Failed to delete dish. Please try again.");
    },
  });

  const { data: categories, isLoading: categoryIsLoading } = useCategories();

  const createCategory = useMutation({
    mutationFn: (newCategory: CategoryNewPayload) =>
      fetchApi<Categories>("/api/categories", {
        body: JSON.stringify(newCategory),
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category added");
    },
    onError: () => {
      toast.error("Failed to add category. Please try again.");
    },
  });

  const updateCategory = useMutation({
    mutationFn: (updatedCategory: Categories) =>
      fetchApi<Categories>(`/api/categories/${updatedCategory.id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedCategory),
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData<Categories[]>(["categories"], (old) =>
        old
          ? old.map((cat) => (cat.id === updated.id ? updated : cat))
          : [updated],
      );
      toast.success("Category updated");
    },
    onError: () => {
      toast.error("Failed to update category. Please try again.");
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (deletedCategory: Categories) =>
      fetchApi<{ success: boolean }>(`/api/categories/${deletedCategory.id}`, {
        method: "DELETE",
        body: JSON.stringify(deletedCategory),
      }),
    onSuccess: (data, deletedCategory) => {
      queryClient.setQueryData<Categories[]>(["categories"], (old) =>
        old ? old.filter((cat) => cat.id !== deletedCategory.id) : [],
      );
      toast.success("Category deleted");
    },
    onError: () => {
      toast.error("Failed to delete category. Please try again.");
    },
  });

  const { data: ingredients, isLoading: ingredientsLoading } = useIngredients();

  const [filterCategoryId, setFilterCategoryId] = useState<string>("");
  const [recipeRows, setRecipeRows] = useState<RecipeRow[]>([]);

  useEffect(() => {
    reset({
      name: selectedDish?.name ?? "",
      price: selectedDish?.price ?? 0,
      servings: selectedDish?.servings_left ?? 0,
      is_available: selectedDish?.is_available ?? true,
      category_id: selectedDish?.category_id ?? "", // ✅ add this
    });

    setRecipeRows(selectedDish?.ingredients ?? []);
  }, [selectedDish, isOpen, reset]);

  const addRecipeRow = () => {
    setRecipeRows((prev) => [...prev, { ingredient_id: "", quantity: 0 }]);
  };

  const updateRecipeRow = (index: number, updates: Partial<RecipeRow>) => {
    setRecipeRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...updates } : row)),
    );
  };

  const removeRecipeRow = (index: number) => {
    setRecipeRows((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: DishFormValues) => {
    // Ensure there is at least one ingredient row added
    if (recipeRows.length === 0) {
      toast.error("Please add at least one ingredient to the recipe.");
      return;
    }

    // Optional: Validate that rows aren't empty (e.g. missing ingredient_id or quantity <= 0)
    const hasInvalidRow = recipeRows.some(
      (row) => !row.ingredient_id || row.quantity <= 0,
    );
    if (hasInvalidRow) {
      toast.error(
        "Please fill out all recipe rows with a valid ingredient and quantity.",
      );
      return;
    }

    if (selectedDish) {
      const updatedDish: Dish = {
        id: selectedDish.id,
        name: data.name,
        price: data.price,
        servings: data.servings,
        servings_left: data.servings,
        category_id: data.category_id,
        ingredients: recipeRows,
        is_available: data.is_available,
        image: selectedDish.image,
      };
      await updateDish.mutateAsync(updatedDish);
    } else {
      const newDishPayload = {
        name: data.name,
        price: data.price,
        servings: data.servings,
        servings_left: data.servings,
        category_id: data.category_id,
        ingredients: recipeRows,
        is_available: data.is_available,
      };
      await createDish.mutateAsync(newDishPayload as Dish);
    }

    close();
  };

  const handleDeleteDish = async (dish: Dish) => {
    await deleteDish.mutateAsync(dish).catch(() => {}); // swallow here only to prevent unhandled rejection, toast already shown via onError
    close();
  };

  const isSaving = createDish.isPending || updateDish.isPending;

  return (
    <div className="max-w-7xl space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dishes
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage menu items, recipes, and real-time availability.
          </p>
        </div>

        <Button
          onClick={openForCreate}
          size="default"
          className="shadow-sm font-medium gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Add new dish
        </Button>
      </div>

      {/* Filter and Controls Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search dishes by name..."
            className="pl-9 h-10 bg-card border-border/80 focus-visible:ring-primary/20 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-48 sm:w-56">
            <CategoriesSelect
              showAllOption
              disable={categoryIsLoading}
              selectedCategoryId={filterCategoryId}
              onSelectCategory={setFilterCategoryId}
              categories={categories}
              onAddCategory={(label) => createCategory.mutateAsync({ label })}
              onRenameCategory={(id, label) =>
                updateCategory.mutateAsync({ id, label } as Categories)
              }
              onDeleteCategory={(id) =>
                deleteCategory.mutateAsync({ id } as Categories)
              }
            />
          </div>

          <div className="border border-border/80 rounded-lg p-0.5 bg-muted/40">
            <TableCartTabs
              value={layout}
              onValueChange={(val) => setLayout(val as "grid" | "table")}
            />
          </div>
        </div>
      </div>

      {/* Main Grid/Table Views */}
      <main className="min-h-100 mt-4">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-xl bg-muted/50 border border-border/50"
              />
            ))}
          </div>
        ) : !dishes || dishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-2xl py-16 px-4 bg-muted/10 text-center">
            <div className="p-3 bg-muted rounded-full mb-3 text-muted-foreground">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              No dishes found
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
              Your menu is currently empty. Add your first item to start
              accepting orders.
            </p>
            <Button onClick={openForCreate} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Create First Dish
            </Button>
          </div>
        ) : layout === "grid" ? (
          <DishGrid dishes={dishes} />
        ) : (
          <DishTable dishes={dishes} />
        )}

        {/* Drawer Sheet */}
        <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
          <SheetContent
            side="right"
            className="bg-card flex flex-col p-0 sm:max-w-md w-full border-l border-border"
          >
            <SheetHeader className="border-b border-border px-6 py-5">
              <SheetTitle className="text-lg font-bold">
                {selectedDish ? "Edit Dish" : "Add Dish"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {selectedDish
                  ? "Update dish properties and ingredient formula."
                  : "Fill in the details to add a new item to your menu."}
              </SheetDescription>
            </SheetHeader>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
              id="dish-form"
            >
              {/* Image upload container */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Dish Image
                </Label>
                <div className="border border-dashed border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors w-full aspect-video rounded-xl overflow-hidden relative">
                  {!selectedDish || !selectedDish.image ? (
                    <>
                      <Label
                        htmlFor="file"
                        className="w-full h-full cursor-pointer flex flex-col items-center justify-center p-4"
                      >
                        <div className="p-2.5 rounded-full bg-background shadow-2xs border border-border text-muted-foreground">
                          <ImageUp size={20} />
                        </div>
                        <p className="text-xs font-medium text-foreground mt-2">
                          Upload image
                        </p>
                        <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                          PNG or JPG up to 5MB
                        </p>
                      </Label>
                      <Input type="file" id="file" accept="image/*" hidden />
                    </>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={selectedDish.image}
                        alt={selectedDish.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold">
                  Dish Name
                </Label>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder="e.g. Chicken Adobo"
                      className="h-9"
                      {...field}
                    />
                  )}
                />
              </div>

              {/* Price + Servings Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price" className="text-xs font-semibold">
                    Price
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                      ₱
                    </span>
                    <Controller
                      control={control}
                      name="price"
                      rules={{ required: true, min: 1 }}
                      render={({ field: { onChange, value, ...rest } }) => (
                        <Input
                          id="price"
                          type="number"
                          placeholder="0.00"
                          className="pl-7 h-9"
                          min={1}
                          value={value}
                          onChange={(e) => onChange(Number(e.target.value))}
                          {...rest}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="servings" className="text-xs font-semibold">
                    Servings
                  </Label>
                  <Controller
                    control={control}
                    name="servings"
                    rules={{ required: true, min: 1 }}
                    render={({ field: { onChange, value, ...rest } }) => (
                      <Input
                        id="servings"
                        type="number"
                        placeholder="0"
                        className="h-9"
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
                <Label className="text-xs font-semibold">Category</Label>
                <Controller
                  control={control}
                  name="category_id"
                  rules={{ required: "Please select a category" }} // Add validation here
                  render={({ field, fieldState }) => (
                    <>
                      <CategoriesSelect
                        disable={categoryIsLoading}
                        selectedCategoryId={field.value}
                        onSelectCategory={field.onChange}
                        categories={categories}
                        onAddCategory={(label) =>
                          createCategory.mutateAsync({ label })
                        }
                      />
                      {/* Optional: Show a small red error message if they try to submit without it */}
                      {fieldState.error && (
                        <span className="text-[10px] text-destructive">
                          {fieldState.error.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Recipe builder section */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">
                    Recipe Breakdown
                  </Label>
                </div>
                <p className="text-[11px] text-muted-foreground -mt-1">
                  Amounts are per single serving, not total batch.
                </p>
                <RecipeBuilder
                  recipeRows={recipeRows}
                  ingredients={ingredients ?? []}
                  onUpdateRow={updateRecipeRow}
                  onRemoveRow={removeRecipeRow}
                  onAddRow={addRecipeRow}
                />
              </div>

              {/* Availability Switch */}
              <div className="flex items-center justify-between rounded-lg border border-border p-3.5 bg-muted/20">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold">Available for order</p>
                  <p className="text-[11px] text-muted-foreground">
                    Toggle visibility on POS menu
                  </p>
                </div>
                <Controller
                  control={control}
                  name="is_available"
                  render={({ field: { value, onChange } }) => (
                    <Switch checked={value} onCheckedChange={onChange} />
                  )}
                />
              </div>

              {/* Danger Zone */}
              {selectedDish && (
                <div className="pt-2">
                  <div className="p-3.5 rounded-lg border border-destructive/20 bg-destructive/5 flex flex-col gap-2.5">
                    <div>
                      <p className="text-xs font-semibold text-destructive">
                        Danger Zone
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Permanently remove this dish and its recipe
                        configuration.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteDish(selectedDish)}
                      className="w-full text-xs h-8"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Delete Dish
                    </Button>
                  </div>
                </div>
              )}
            </form>

            <SheetFooter className="border-t border-border px-6 py-4 flex-row gap-2 bg-muted/10">
              <SheetClose>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                form="dish-form"
                size="sm"
                className="flex-1 text-xs"
                disabled={isSaving}
              >
                {isSaving && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                )}
                Save Dish
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
};

export default Page;
