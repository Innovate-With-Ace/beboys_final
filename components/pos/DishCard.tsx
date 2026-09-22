// components/pos/DishCard.tsx
"use client";

import { Dish } from "@/types/Dish";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import { Plus, Minus, Soup } from "lucide-react";

type Props = {
  dish: Dish;
  onAdd: () => void;
  onDecrement?: () => void;
  quantityInCart?: number;
};

const DishCard = ({
  dish,
  onAdd,
  onDecrement,
  quantityInCart = 0,
}: Props) => {
  const isSoldOut = dish.servings_left === 0;
  const isLow = dish.servings_left > 0 && dish.servings_left <= 3;
  const isAtCartLimit = quantityInCart >= dish.servings_left;

  return (
    <Card
      className={`group overflow-hidden pt-0 gap-0 pb-3 border border-border bg-bg-muted shadow-sm rounded-2xl transition-all duration-200 ${
        isSoldOut
          ? "opacity-60 grayscale-[0.5]"
          : "hover:shadow-md hover:border-brand-primary/30"
      }`}
    >
      <div className="relative aspect-[4/3] w-full bg-bg flex items-center justify-center overflow-hidden">
        {dish.image ? (
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <Soup className="size-8 text-muted-foreground/40" />
        )}

        {/* Floating Badge for Sold Out / Low Stock */}
        {isSoldOut && (
          <div className="absolute top-2 right-2 bg-error/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
            SOLD OUT
          </div>
        )}
        {!isSoldOut && isLow && (
          <div className="absolute top-2 right-2 bg-warning/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
            ONLY {dish.servings_left} LEFT
          </div>
        )}
        {quantityInCart > 0 && (
          <div className="absolute top-2 left-2 h-6 min-w-6 px-1.5 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center shadow-sm">
            {quantityInCart}
          </div>
        )}
      </div>

      <CardContent className="space-y-1.5 pt-3 px-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-foreground">
            {dish.name}
          </h3>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="whitespace-nowrap font-bold text-sm text-brand-secondary">
            ₱{dish.price.toFixed(0)}
          </span>
          <p
            className={`text-[11px] font-medium ${isSoldOut ? "text-error" : isLow ? "text-warning" : "text-muted-foreground"}`}
          >
            {isSoldOut ? "0 servings" : `${dish.servings_left} servings`}
          </p>
        </div>
      </CardContent>

      <CardFooter className="pt-2 px-3">
        {quantityInCart > 0 && !isSoldOut ? (
          <div className="w-full flex items-center justify-between bg-brand-primary/10 border border-brand-primary/30 rounded-xl p-1">
            <Button
              onClick={onDecrement}
              size="icon-sm"
              variant="ghost"
              className="text-brand-primary hover:bg-brand-primary/20 shrink-0"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="text-sm font-bold text-brand-primary">
              {quantityInCart} in order
            </span>
            <Button
              onClick={onAdd}
              disabled={isAtCartLimit}
              size="icon-sm"
              variant="ghost"
              className="text-brand-primary hover:bg-brand-primary/20 shrink-0 disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={onAdd}
            disabled={isSoldOut}
            size="sm"
            className={`w-full gap-1.5 font-semibold transition-all rounded-xl ${
              isSoldOut
                ? "bg-bg text-muted-foreground border border-border shadow-none"
                : "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-sm active:scale-[0.98]"
            }`}
          >
            <Plus className="h-4 w-4" />
            {isSoldOut ? "Unavailable" : "Add to Order"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DishCard;
