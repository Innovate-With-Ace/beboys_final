"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Package, PackageX, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import IngredientCard from "@/components/admin/inventory/IngredientCard";
import { useIngredientEditorStore } from "@/stores/IngredientEditorStore";
import IngredientDialog from "@/components/admin/inventory/IngredientDialog";
import fetchApi from "@/lib/api";
import { Ingredient } from "@/types/Ingredients";
import { useQuery } from "@tanstack/react-query";
import { useIngredients } from "@/hooks/useIngredients";

type FilterStatus = "all" | "low" | "critical" | "in-stock";

const Page = () => {
  const openForCreate = useIngredientEditorStore((s) => s.openForCreate);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  const { data: ingredients = [], isLoading } = useIngredients();

  // Client-side search and stock filter logic
  const filteredIngredients = useMemo(() => {
    if (!ingredients) return [];

    return ingredients.filter((item) => {
      // 1. Search Query Match
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());

      if (!matchesSearch) return false;

      // 2. Stock Filter Match
      const threshold = item.low_stock_threshold || 1;
      const ratio = item.stock / threshold;
      const isCritical = ratio <= 0.5;
      const isLow = !isCritical && ratio <= 1.0;
      const isInStock = ratio > 1.0;

      if (activeFilter === "critical") return isCritical;
      if (activeFilter === "low") return isLow || isCritical;
      if (activeFilter === "in-stock") return isInStock;

      return true;
    });
  }, [ingredients, searchQuery, activeFilter]);

  // Stock summary counts for quick metrics
  const metrics = useMemo(() => {
    if (!ingredients) return { lowCount: 0, criticalCount: 0 };
    return ingredients.reduce(
      (acc, item) => {
        const threshold = item.low_stock_threshold || 1;
        const ratio = item.stock / threshold;
        if (ratio <= 0.5) acc.criticalCount += 1;
        else if (ratio <= 1.0) acc.lowCount += 1;
        return acc;
      },
      { lowCount: 0, criticalCount: 0 },
    );
  }, [ingredients]);

  return (
    <div className="space-y-6 p-4">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Inventory
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor stock levels, set thresholds, and restock raw ingredients.
          </p>
        </div>

        <Button
          onClick={openForCreate}
          size="default"
          className="shadow-sm font-medium gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Add Ingredient
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ingredients by name..."
            className="pl-9 h-10 bg-card border-border/80 focus-visible:ring-primary/20 shadow-xs text-sm"
          />
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-lg border border-border/60 overflow-x-auto">
          <Button
            type="button"
            variant={activeFilter === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveFilter("all")}
            className="h-7 text-xs font-medium px-3"
          >
            All Items ({ingredients?.length ?? 0})
          </Button>

          <Button
            type="button"
            variant={activeFilter === "critical" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveFilter("critical")}
            className="h-7 text-xs font-medium px-3 gap-1.5 text-destructive"
          >
            <AlertTriangle className="size-3" />
            Critical ({metrics.criticalCount})
          </Button>

          <Button
            type="button"
            variant={activeFilter === "low" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveFilter("low")}
            className="h-7 text-xs font-medium px-3 text-amber-600 dark:text-amber-400"
          >
            Low Stock ({metrics.lowCount})
          </Button>

          <Button
            type="button"
            variant={activeFilter === "in-stock" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveFilter("in-stock")}
            className="h-7 text-xs font-medium px-3"
          >
            In Stock
          </Button>
        </div>
      </div>

      {/* Main Grid View */}
      <main className="min-h-[400px]">
        {isLoading ? (
          /* Skeleton Grid Loader */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-xl bg-muted/40 border border-border/50"
              />
            ))}
          </div>
        ) : filteredIngredients.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-2xl py-16 px-4 bg-muted/10 text-center">
            <div className="p-3 bg-muted rounded-full mb-3 text-muted-foreground">
              {searchQuery ? (
                <PackageX className="h-6 w-6" />
              ) : (
                <Package className="h-6 w-6" />
              )}
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {searchQuery ? "No matching ingredients" : "No ingredients found"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
              {searchQuery
                ? `No results found matching "${searchQuery}". Try searching for something else.`
                : "Your inventory list is empty. Add your first ingredient to start tracking stock levels."}
            </p>
            {searchQuery ? (
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                size="sm"
              >
                Clear Search
              </Button>
            ) : (
              <Button onClick={openForCreate} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Add First Ingredient
              </Button>
            )}
          </div>
        ) : (
          /* Ingredients Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredIngredients.map((ing) => (
              <IngredientCard key={ing.id} ingredient={ing} />
            ))}
          </div>
        )}
      </main>

      {/* Ingredient Editor Dialog */}
      <IngredientDialog />
    </div>
  );
};

export default Page;
