"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDishEditorStore } from "@/stores/DishEditorStore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Soup, Edit3, UtensilsCrossed } from "lucide-react";
import { Dish } from "@/types/Dish";
import { cn } from "@/lib/utils";

type Props = {
  dishes: Dish[];
};

const DishTable = ({ dishes }: Props) => {
  const openForEdit = useDishEditorStore((s) => s.openForEdit);

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      {/* Table Sub-header summary */}
      <div className="px-4 py-3 border-b border-border/60 bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="size-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">
            Menu Dishes
          </span>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">
          {dishes.length} {dishes.length === 1 ? "item" : "items"} total
        </span>
      </div>

      <div className="relative w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16 pl-4 text-xs font-semibold">
                Item
              </TableHead>
              <TableHead className="text-xs font-semibold">Name</TableHead>
              <TableHead className="text-xs font-semibold">Price</TableHead>
              <TableHead className="text-xs font-semibold">Servings</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-right pr-4 text-xs font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {dishes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-xs text-muted-foreground"
                >
                  No dishes found on the menu.
                </TableCell>
              </TableRow>
            ) : (
              dishes.map((dish) => (
                <TableRow
                  key={dish.id}
                  className="group transition-colors hover:bg-muted/30"
                >
                  {/* Thumbnail Image */}
                  <TableCell className="pl-4 py-2.5">
                    <div className="relative size-10 rounded-lg overflow-hidden bg-muted border border-border/60 flex items-center justify-center shrink-0 shadow-2xs">
                      {dish.image ? (
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <Soup className="size-4 text-muted-foreground/70" />
                      )}
                    </div>
                  </TableCell>

                  {/* Name */}
                  <TableCell className="font-semibold text-sm text-foreground">
                    {dish.name}
                  </TableCell>

                  {/* Price */}
                  <TableCell className="text-sm font-medium tabular-nums text-foreground">
                    ₱{dish.price.toFixed(2)}
                  </TableCell>

                  {/* Servings */}
                  <TableCell className="text-sm text-muted-foreground tabular-nums">
                    {dish.servings_left}{" "}
                    <span className="text-[11px]">left</span>
                  </TableCell>

                  {/* Availability Badge */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 gap-1.5 border shadow-2xs",
                        dish.is_available
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-destructive/10 text-destructive border-destructive/20",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          dish.is_available
                            ? "bg-emerald-500"
                            : "bg-destructive",
                        )}
                      />
                      {dish.is_available ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>

                  {/* Action Button */}
                  <TableCell className="text-right pr-4 py-2.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openForEdit(dish)}
                      className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted gap-1.5"
                    >
                      <Edit3 className="size-3.5" />
                      Modify
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DishTable;
