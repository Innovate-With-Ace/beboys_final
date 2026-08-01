import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dish } from "@/types/Dish";
import Image from "next/image";
import { Soup, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDishEditorStore } from "@/stores/DishEditorStore";

type Props = {
  dish: Dish;
};

const DishCard = ({ dish }: Props) => {
  const openForEdit = useDishEditorStore((s) => s.openForEdit);

  const isOutOfStock = dish.servings_left <= 0;

  const isUnavailable = !dish.is_available;
  const isLowStock = !isOutOfStock && dish.servings_left <= 3;

  return (
    <Card
      onClick={() => openForEdit(dish)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card p-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md cursor-pointer gap-0",
        isOutOfStock && "opacity-80",
      )}
    >
      {/* Media Aspect Ratio Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted flex items-center justify-center">
        {dish.image ? (
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground/60">
            <Soup className="size-8 stroke-[1.5]" />
            <span className="text-[10px] font-medium mt-1">No preview</span>
          </div>
        )}

        {/* Status Overlays & Badges */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1">
            <Badge
              variant="destructive"
              className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 shadow-xs"
            >
              Out of stock
            </Badge>
          </div>
        ) : isLowStock ? (
          <div className="absolute top-2 right-2">
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 text-[10px] font-semibold px-2 py-0.5 shadow-sm">
              {dish.servings_left} left
            </Badge>
          </div>
        ) : isUnavailable ? (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1">
            <Badge
              variant="destructive"
              className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 shadow-xs"
            >
              Unavailable
            </Badge>
          </div>
        ) : null}
      </div>

      {/* Card Content Body */}
      <CardContent className="p-3.5 flex-1 flex flex-col justify-between">
        <div className="mb-3">
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-tight">
              {dish.name}
            </h3>
          </div>

          <div className="flex items-baseline justify-between mt-1.5">
            <span className="text-base font-bold text-primary tracking-tight">
              ₱{dish.price.toFixed(2)}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {dish.servings_left}{" "}
              {dish.servings_left === 1 ? "serving" : "servings"}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <CardFooter className="p-0 pt-2 border-t border-border/50">
          <Button
            size="sm"
            variant="outline"
            className="w-full h-8 text-xs font-medium gap-1.5 border-border/80 bg-background hover:text-white transition-colors hover:bg-brand-primary "
            onClick={(e) => {
              e.stopPropagation();
              openForEdit(dish);
            }}
          >
            <Edit3 className="size-3.5 text-muted-foreground" />
            Modify
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default DishCard;
