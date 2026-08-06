import React from "react";
import { Utensils } from "lucide-react";

export function BestSellingDishesCard() {
  const dummyDishes = [
    { name: "Chicken Adobo Rice", qty: 342, rev: "₱61,560" },
    { name: "Beef Sinigang", qty: 289, rev: "₱72,250" },
    { name: "Pork Sisig Regular", qty: 254, rev: "₱45,720" },
    { name: "Halo-Halo Special", qty: 210, rev: "₱25,200" },
    { name: "Iced Tea Pitcher", qty: 198, rev: "₱19,800" },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs text-card-foreground flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              Best-Selling Dishes
            </h3>
            <p className="text-xs text-muted-foreground">
              Top items ranked by total quantity sold
            </p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 text-muted-foreground">
            <Utensils className="h-4 w-4" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground">
                <th className="py-2.5 font-semibold">Dish Name</th>
                <th className="py-2.5 font-semibold text-right">Sold</th>
                <th className="py-2.5 font-semibold text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {dummyDishes.map((dish, i) => (
                <tr key={i} className="hover:bg-muted/20">
                  <td className="py-2.5 font-medium text-foreground">
                    {dish.name}
                  </td>
                  <td className="py-2.5 text-right text-muted-foreground">
                    {dish.qty}
                  </td>
                  <td className="py-2.5 text-right font-semibold text-foreground">
                    {dish.rev}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border/40 text-right">
        <span className="text-xs text-primary font-medium cursor-pointer hover:underline">
          View all menu stats &rarr;
        </span>
      </div>
    </div>
  );
}
