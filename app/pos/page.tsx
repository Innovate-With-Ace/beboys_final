"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDishStore } from "@/stores/DishStore";
import { useDishes } from "@/hooks/useDishes";
import { useCategories } from "@/hooks/useCategories";

import DishGrid from "@/components/pos/DishGrid";
import CartPanel from "@/components/pos/CartPanel";
import MobileCartBar from "@/components/pos/MobileCartBar";
import OrderSummaryDialog from "@/components/pos/OrderSummaryDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Soup, ClipboardList, Search, Loader2 } from "lucide-react";
import { CartItem } from "@/types/CartItem";

const Page = () => {
  const router = useRouter();

  // Local UI State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<CartItem[]>([]);

  // POS Session State (Keep this if you track daily setup in Zustand)
  const servingsSetToday = useDishStore((s) => s.servingSetToday);

  // Real-time Data from TanStack Query
  const { data: dishes = [], isLoading: isDishesLoading } = useDishes();
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategories();

  // Filter Logic (Search + Category)
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // 1. Check Search
      const matchesSearch = dish.name
        .toLowerCase()
        .includes(search.toLowerCase());

      // 2. Check Category (or 'all')
      const matchesCategory =
        selectedCategory === "all" || dish.category_id === selectedCategory;

      // 3. Ensure it's available for POS
      const isAvailable = dish.is_available;

      return matchesSearch && matchesCategory && isAvailable;
    });
  }, [dishes, search, selectedCategory]);

  return (
    <main className="bg-bg min-h-screen p-4 flex flex-col">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between bg-bg-muted rounded-2xl px-4 py-3 mb-5 border border-border/40 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <Soup className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-sm text-foreground">
              Today's Menu
            </h1>
            <p className="text-[11px] font-medium text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Use Next.js Link instead of standard <a> tag for faster client-side routing */}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs h-8"
            asChild
          >
            <Link href="/pos/setup">
              <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />
              Set servings
            </Link>
          </Button>
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shadow-sm">
            A
          </div>
        </div>
      </div>

      {/* --- MAIN LAYOUT --- */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6 flex-1">
        {/* Left Side: Catalog */}
        <div className="w-full lg:w-[70%] flex flex-col gap-4">
          {/* Controls: Search + Categories */}
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                className="pl-9 h-10 bg-background shadow-xs border-border/60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Pills (Horizontal Scroll) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                className="h-8 rounded-full px-4 text-xs shrink-0"
                onClick={() => setSelectedCategory("all")}
              >
                All Menu
              </Button>

              {isCategoriesLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />
              ) : (
                categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={
                      selectedCategory === cat.id ? "default" : "outline"
                    }
                    size="sm"
                    className="h-8 rounded-full px-4 text-xs shrink-0"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.label}
                  </Button>
                ))
              )}
            </div>
          </div>

          {/* Dish Grid / Loading State */}
          <div className="pb-24 lg:pb-0">
            {isDishesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                ))}
              </div>
            ) : filteredDishes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-2xl bg-muted/10">
                <Soup className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
                <p className="text-sm font-medium">No dishes found</p>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your search or category filter.
                </p>
              </div>
            ) : (
              <DishGrid dishes={filteredDishes} />
            )}
          </div>
        </div>

        {/* Right Side: Desktop Cart */}
        <div className="hidden lg:block flex-1 sticky top-4 self-start w-full">
          <CartPanel
            onCheckoutComplete={(items) => {
              setLastOrder(items);
              setSummaryOpen(true);
            }}
          />
        </div>
      </div>

      {/* Mobile Cart Bottom Sheet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <MobileCartBar
          onCheckoutComplete={(items) => {
            setLastOrder(items);
            setSummaryOpen(true);
          }}
        />
      </div>

      {/* Checkout Summary Modal */}
      <OrderSummaryDialog
        open={summaryOpen}
        onOpenChange={setSummaryOpen}
        items={lastOrder}
        cashierName="Ace"
        onNewOrder={() => setSummaryOpen(false)}
      />
    </main>
  );
};

export default Page;
