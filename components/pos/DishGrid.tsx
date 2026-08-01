// components/pos/DishGrid.tsx
"use client";

import { Dish } from "@/types/Dish";
import DishCard from "./DishCard";
import { useCartStore } from "@/stores/CartStore";
import { Soup } from "lucide-react";

type Props = {
  dishes: Dish[];
};

const DishGrid = ({ dishes }: Props) => {
  const { addItem } = useCartStore();

  if (dishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-2xl bg-bg-muted/50">
        <div className="h-12 w-12 bg-bg rounded-full flex items-center justify-center mb-3 shadow-sm">
          <Soup className="size-6 text-muted-foreground opacity-60" />
        </div>
        <p className="text-sm font-semibold text-foreground">No items found</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          We couldn't find any dishes matching your search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {dishes.map((item) => (
        <DishCard key={item.id} dish={item} onAdd={() => addItem(item)} />
      ))}
    </div>
  );
};

export default DishGrid;
