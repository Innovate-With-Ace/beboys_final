"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIngredientEditorStore } from "@/stores/IngredientEditorStore";
import { useForm } from "react-hook-form";
import { Ingredient, IngredientPayload } from "@/types/Ingredients";
import fetchApi from "@/lib/api";
import { AlertTriangle, Trash2, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DEFAULT_VALUES: IngredientPayload = {
  name: "",
  unit: "kg",
  stock: 0,
  low_stock_threshold: 0,
};

const IngredientDialog = () => {
  const { isOpen, close, selectedIngredient } = useIngredientEditorStore();
  const queryClient = useQueryClient();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IngredientPayload>({
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (isOpen) {
      setShowDeleteConfirm(false);
      if (selectedIngredient) {
        reset({
          name: selectedIngredient.name,
          unit: selectedIngredient.unit,
          stock: selectedIngredient.stock,
          low_stock_threshold: selectedIngredient.low_stock_threshold,
        });
      } else {
        reset(DEFAULT_VALUES);
      }
    }
  }, [isOpen, selectedIngredient, reset]);

  // --- React Query Mutations ---

  const createIngredient = useMutation({
    mutationFn: (newIngredient: IngredientPayload) =>
      fetchApi<Ingredient>("/api/ingredients", {
        body: JSON.stringify(newIngredient),
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });

  const updateIngredient = useMutation({
    mutationFn: (updatedIngredient: Ingredient) =>
      fetchApi<Ingredient>(`/api/ingredients/${updatedIngredient.id}`, {
        body: JSON.stringify(updatedIngredient),
        method: "PATCH",
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData<Ingredient[]>(["ingredients"], (old) =>
        old
          ? old.map((item) => (item.id === updated.id ? updated : item))
          : [updated],
      );
    },
  });

  const deleteIngredient = useMutation({
    mutationFn: (id: string) =>
      fetchApi<{ success: boolean }>(`/api/ingredients/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Ingredient[]>(["ingredients"], (old) =>
        old ? old.filter((item) => item.id !== deletedId) : [],
      );
    },
  });

  const isSaving = createIngredient.isPending || updateIngredient.isPending;
  const isDeleting = deleteIngredient.isPending;

  // --- Handlers ---

  const onSubmit = async (data: IngredientPayload) => {
    try {
      if (selectedIngredient) {
        await updateIngredient.mutateAsync({
          ...selectedIngredient,
          ...data,
        } as Ingredient);
      } else {
        await createIngredient.mutateAsync(data);
      }

      close();
      toast.success(
        selectedIngredient
          ? "Ingredient updated successfully"
          : "Ingredient created successfully",
      );
    } catch (err) {
      console.error("Failed to save ingredient:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to save ingredient. Please try again",
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedIngredient) return;

    try {
      await deleteIngredient.mutateAsync(selectedIngredient.id);
      toast.success("Ingredient deleted");
      close();
    } catch (err) {
      console.error("Failed to delete ingredient:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to delete ingredient. Please try again",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-md bg-card border-border p-0 gap-0 overflow-hidden shadow-lg">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Package className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              {selectedIngredient ? "Edit Ingredient" : "Add Ingredient"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Track {selectedIngredient ? "and update" : "a new"} raw ingredient
            and its stock level.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <form
          id="ingredient-form"
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4"
        >
          {/* Ingredient Name */}
          <div className="space-y-1.5">
            <Label htmlFor="ing-name" className="text-xs font-semibold">
              Ingredient Name
            </Label>
            <Input
              id="ing-name"
              placeholder="e.g. Pork"
              className="h-9 text-sm"
              {...register("name", {
                required: "Ingredient name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Unit & Current Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="unit" className="text-xs font-semibold">
                Unit
              </Label>
              <select
                id="unit"
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register("unit", { required: true })}
              >
                <option value="kg">kg</option>
                <option value="l">l</option>
                <option value="pcs">pcs</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stock" className="text-xs font-semibold">
                Current Stock
              </Label>
              <Input
                id="stock"
                type="number"
                placeholder="20"
                className="h-9 text-sm"
                min={0}
                {...register("stock", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Stock cannot be negative" },
                })}
              />
              {errors.stock && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          {/* Low-stock Threshold */}
          <div className="space-y-1.5">
            <Label htmlFor="threshold" className="text-xs font-semibold">
              Low-stock Threshold
            </Label>
            <Input
              id="threshold"
              type="number"
              placeholder="5"
              className="h-9 text-sm"
              min={0}
              {...register("low_stock_threshold", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Threshold cannot be negative",
                },
              })}
            />
            {errors.low_stock_threshold ? (
              <p className="text-[11px] font-medium text-destructive">
                {errors.low_stock_threshold.message}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Alerts appear when stock falls below this amount.
              </p>
            )}
          </div>

          {/* Danger Zone */}
          {selectedIngredient && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3.5 space-y-3 mt-4">
              <div className="flex items-center gap-1.5 text-destructive font-medium text-xs uppercase tracking-wider">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Danger Zone</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-foreground">
                    Delete this ingredient
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Permanently remove from inventory records.
                  </p>
                </div>

                {!showDeleteConfirm && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive hover:text-white shrink-0"
                  >
                    Delete
                  </Button>
                )}
              </div>

              {/* Inline Confirmation Prompt */}
              {showDeleteConfirm && (
                <div className="pt-2.5 border-t border-destructive/20 flex items-center justify-between gap-2">
                  <p className="text-xs text-destructive font-medium">
                    Are you sure?
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="h-7 px-2 text-xs"
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting}
                      onClick={handleDelete}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      {isDeleting ? "Deleting..." : "Confirm"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Actions Footer */}
        <DialogFooter className="px-6 py-4 border-t border-border/60 bg-muted/10 gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9 flex-1 mr-2"
              disabled={isSaving || isDeleting}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="ingredient-form"
            size="sm"
            disabled={isSaving || isDeleting}
            className="text-xs h-9 flex-1"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Saving...
              </>
            ) : (
              "Save Ingredient"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientDialog;
